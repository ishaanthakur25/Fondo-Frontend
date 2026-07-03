import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Loader2, Upload, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChatPanel } from "@/components/ChatPanel";
import { useAuth } from "@/lib/auth-context";
import { loadAnalyses, clearAnalyses, type StoredAnalysis } from "@/lib/chat-history";
import { saveSession } from "@/lib/financial-store";


export const Route = createFileRoute("/app")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Your workspace — Fondo" }],
  }),
  component: AppPage,
});

function AppPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  function openReport(a: StoredAnalysis) {
    saveSession({
      fileName: a.filename,
      analysis: a.analysis,
      sessionId: a.session_id,
    });
    navigate({ to: "/analysis" });
  }

  async function handleClear() {
    if (!user) return;
    if (!window.confirm("Clear all saved analyses? This cannot be undone.")) return;
    setClearing(true);
    await clearAnalyses(user.id);
    setAnalyses([]);
    setClearing(false);
  }


  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    loadAnalyses().then((a) => {
      setAnalyses(a);
      setLoadingAnalyses(false);
    });
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">
              Welcome back{user.email ? `, ${user.email.split("@")[0]}` : ""}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Your conversations and document analyses are saved here.
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:brightness-105"
          >
            <Upload className="h-4 w-4" /> Upload a document
          </Link>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <ChatPanel
            key={activeSession ?? "general"}
            persistUserId={user.id}
            sessionId={activeSession ?? undefined}
            emptyText={
              activeSession
                ? "Ask Fondo anything about this document — trends, risks, or what the numbers mean."
                : undefined
            }
          />

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-card-foreground">Saved analyses</h2>
              {analyses.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={clearing}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive disabled:opacity-60"
                >
                  {clearing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Clear
                </button>
              )}
            </div>
            {loadingAnalyses ? (
              <div className="mt-6 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
              </div>
            ) : analyses.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No analyses yet. Upload a financial document to get started.
              </p>
            ) : (
              <ul className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1">
                {analyses.map((a) => (
                  <li key={a.id}>
                    <div
                      className={`w-full rounded-xl border bg-background p-4 transition-colors ${
                        activeSession && activeSession === a.session_id
                          ? "border-accent"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openReport(a)}
                          aria-label="Open financial report"
                          className="shrink-0 text-accent transition-colors hover:text-accent/70"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSession(a.session_id || null)}
                          className="truncate text-left text-sm font-semibold text-foreground hover:underline"
                        >
                          {a.filename}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString()}
                      </p>
                      <p className="mt-2 line-clamp-4 text-xs text-muted-foreground">
                        {a.analysis}
                      </p>
                      <button
                        type="button"
                        onClick={() => openReport(a)}
                        className="mt-3 text-xs font-semibold text-accent hover:underline"
                      >
                        View financial report →
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
