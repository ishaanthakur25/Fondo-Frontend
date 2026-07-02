import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Loader2, Upload } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChatPanel } from "@/components/ChatPanel";
import { useAuth } from "@/lib/auth-context";
import { loadAnalyses, type StoredAnalysis } from "@/lib/chat-history";

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
            <h2 className="text-lg font-bold text-card-foreground">Saved analyses</h2>
            {loadingAnalyses ? (
              <div className="mt-6 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
              </div>
            ) : analyses.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No analyses yet. Upload a financial document to get started.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {analyses.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-accent" />
                      <span className="truncate text-sm font-semibold text-foreground">
                        {a.file_name}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-2 line-clamp-4 text-xs text-muted-foreground">
                      {a.analysis}
                    </p>
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
