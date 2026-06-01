import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { extractFileText, isSupported } from "@/lib/extract";
import { analyzeFinances } from "@/lib/analysis.functions";
import { saveSession } from "@/lib/financial-store";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload your financials — Fondo" },
      {
        name: "description",
        content: "Drag and drop a PDF, CSV, or Excel file to get instant AI financial insights.",
      },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const runAnalysis = useServerFn(analyzeFinances);
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "reading" | "analyzing">("idle");
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const busy = status !== "idle";

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!isSupported(file)) {
        setError("Please upload a PDF, CSV, or Excel (.xlsx/.xls) file.");
        return;
      }
      setActiveFile(file.name);
      try {
        setStatus("reading");
        const content = await extractFileText(file);
        if (!content.trim()) {
          throw new Error("We couldn't read any text from that file.");
        }
        setStatus("analyzing");
        const analysis = await runAnalysis({ data: { fileName: file.name, content } });
        saveSession({ fileName: file.name, content, analysis });
        navigate({ to: "/analysis" });
      } catch (e) {
        console.error(e);
        setError(
          e instanceof Error ? e.message : "Something went wrong analyzing your file.",
        );
        setStatus("idle");
        setActiveFile(null);
      }
    },
    [navigate, runAnalysis],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold text-foreground">
          Upload your financial file
        </h1>
        <p className="mt-2 text-muted-foreground">
          Drag and drop a budget, statement, or ledger. Fondo will analyze it and explain
          what it means.
        </p>

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
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className={`mt-8 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
            dragging
              ? "border-accent bg-accent/5"
              : "border-border bg-card hover:border-accent/60"
          } ${busy ? "pointer-events-none opacity-80" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />

          {status === "idle" && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary">
                <UploadCloud className="h-8 w-8" />
              </div>
              <p className="mt-5 text-lg font-semibold text-foreground">
                Drag &amp; drop your file here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse · PDF, CSV, or Excel
              </p>
            </>
          )}

          {busy && (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-accent" />
              <p className="mt-5 flex items-center gap-2 text-lg font-semibold text-foreground">
                <FileText className="h-5 w-5" /> {activeFile}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {status === "reading"
                  ? "Reading your file…"
                  : "Fondo is analyzing your finances…"}
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Your file is processed securely to generate your report and isn't stored
          permanently.
        </p>
      </main>
    </div>
  );
}
