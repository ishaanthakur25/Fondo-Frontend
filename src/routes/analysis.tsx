import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import {
  FileText,
  RefreshCw,
  Plus,
  UploadCloud,
  Loader2,
  AlertCircle,
  Files,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChatPanel } from "@/components/ChatPanel";
import { HealthScorePanel } from "@/components/HealthScorePanel";
import { ScenariosPanel } from "@/components/ScenariosPanel";
import { ActionPlanPanel } from "@/components/ActionPlanPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { isSupported } from "@/lib/extract";
import {
  loadSession,
  saveSession,
  clearSession,
  type FondoSession,
} from "@/lib/financial-store";
import { toast } from "sonner";

const API_BASE = "https://fondo-backend-kfic.onrender.com";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Your Financial Report — Fondo" },
      {
        name: "description",
        content:
          "AI-generated financial insights, action items, and red flags from your file.",
      },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<FondoSession | null>(null);
  const [ready, setReady] = useState(false);

  // Multi-document state
  const [docCount, setDocCount] = useState(1);
  const [fileNames, setFileNames] = useState<string[]>([]);

  // Tabs
  const [activeTab, setActiveTab] = useState("overview");
  const [healthReloadKey, setHealthReloadKey] = useState(0);

  useEffect(() => {
    const s = loadSession();
    setSession(s);
    setReady(true);
    if (!s) {
      navigate({ to: "/upload" });
    } else {
      setFileNames([s.fileName]);
      setDocCount(1);
    }
  }, [navigate]);

  const handleTabChange = (v: string) => {
    setActiveTab(v);
    if (v === "health") setHealthReloadKey((k) => k + 1);
  };

  if (!ready) return null;

  if (!session) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">No report yet</h1>
          <p className="mt-2 text-muted-foreground">
            Upload a file to see your insights.
          </p>
          <Link
            to="/upload"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground"
          >
            Upload a file
          </Link>
        </main>
      </div>
    );
  }

  const cleanAnalysis = session.analysis.split(/financial data:/i)[0].trim();
  const combinedName = fileNames.join(" + ");
  const context = `Financial analysis report for file "${combinedName}":\n${cleanAnalysis}`;

  const applyCombinedSession = (combinedSessionId: string, addedName: string, addedAnalysis?: string) => {
    const nextFileNames = [...fileNames, addedName];
    const nextAnalysis = addedAnalysis
      ? `${session.analysis}\n\n---\n\n**Added document: ${addedName}**\n\n${addedAnalysis}`
      : session.analysis;
    const next: FondoSession = {
      fileName: nextFileNames.join(" + "),
      analysis: nextAnalysis,
      sessionId: combinedSessionId,
    };
    saveSession(next);
    setSession(next);
    setFileNames(nextFileNames);
    setDocCount(nextFileNames.length);
    setHealthReloadKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">
              Your Financial Report
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                <Files className="h-3.5 w-3.5" />
                {docCount} {docCount === 1 ? "document" : "documents"} analyzed
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" /> {combinedName}
              </span>
            </div>
          </div>
          <Link
            to="/upload"
            onClick={() => clearSession()}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <RefreshCw className="h-4 w-4" /> New analysis
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
          <TabsList className="h-11 w-full justify-start gap-1 sm:w-auto">
            <TabsTrigger value="overview" className="px-4">
              Overview
            </TabsTrigger>
            <TabsTrigger value="health" className="px-4">
              Health Score
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="px-4">
              Scenarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
              <div className="prose prose-slate max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {cleanAnalysis}
                </ReactMarkdown>
              </div>
            </div>

            <AddAnotherDocument
              currentSessionId={session.sessionId}
              onCombined={applyCombinedSession}
            />
          </TabsContent>

          <TabsContent value="health" className="mt-6">
            <HealthScorePanel
              key={`${session.sessionId}-${healthReloadKey}`}
              sessionId={session.sessionId}
            />
          </TabsContent>

          <TabsContent value="scenarios" className="mt-6">
            <ScenariosPanel
              key={session.sessionId}
              sessionId={session.sessionId}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <ChatPanel
            key={session.sessionId}
            context={context}
            sessionId={session.sessionId}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function AddAnotherDocument({
  currentSessionId,
  onCombined,
}: {
  currentSessionId: string;
  onCombined: (combinedSessionId: string, addedName: string, addedAnalysis?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!isSupported(file)) {
        setError("Please upload a PDF, CSV, or Excel (.xlsx/.xls) file.");
        return;
      }
      setBusy(true);
      setActiveFile(file.name);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: fd });
        if (!res.ok) throw new Error(await res.text().catch(() => "Upload failed"));
        const data = await res.json();
        const newSessionId = String(data.session_id ?? data.sessionId ?? "");
        const newAnalysis = String(data.analysis ?? "");
        if (!newSessionId) throw new Error("Missing session id");

        // Combine sessions
        const combinedId = `${currentSessionId}+${newSessionId}`;
        const combineRes = await fetch(`${API_BASE}/combine-sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: combinedId, question: "" }),
        });
        if (!combineRes.ok) {
          throw new Error(await combineRes.text().catch(() => "Combine failed"));
        }
        const combineData = await combineRes.json().catch(() => ({}));
        const finalSessionId = String(
          combineData.session_id ?? combineData.combined_session_id ?? combinedId,
        );

        onCombined(finalSessionId, file.name, newAnalysis);
        toast.success(`Added ${file.name} to your analysis.`);
        setOpen(false);
        setActiveFile(null);
      } catch (e) {
        console.error(e);
        setError(
          "Something went wrong with your upload. Please try a PDF, CSV, or Excel file and try again.",
        );
      } finally {
        setBusy(false);
      }
    },
    [currentSessionId, onCombined],
  );

  if (!open) {
    return (
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-dashed border-accent/60 bg-accent/5 px-5 text-sm font-semibold text-primary transition-colors hover:bg-accent/10"
        >
          <Plus className="h-4 w-4" /> Add another document
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Add another document
        </h3>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={busy}
          className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          Cancel
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !busy) inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (busy) return;
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragging
            ? "border-accent bg-accent/5"
            : "border-border bg-background hover:border-accent/60"
        } ${busy ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        {!busy ? (
          <>
            <UploadCloud className="h-7 w-7 text-primary" />
            <p className="mt-3 text-sm font-semibold text-foreground">
              Drag &amp; drop or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF, CSV, or Excel — will be combined with your current analysis
            </p>
          </>
        ) : (
          <>
            <Loader2 className="h-7 w-7 animate-spin text-accent" />
            <p className="mt-3 text-sm font-semibold text-foreground">
              {activeFile}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Uploading and combining…
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
