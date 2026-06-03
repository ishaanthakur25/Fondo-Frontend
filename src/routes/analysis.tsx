import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, RefreshCw } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AnalysisCards } from "@/components/AnalysisCards";
import { ChatPanel } from "@/components/ChatPanel";
import { loadSession, clearSession, type FondoSession } from "@/lib/financial-store";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Your financial report — Fondo" },
      {
        name: "description",
        content: "AI-generated financial insights, action items, and red flags from your file.",
      },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<FondoSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = loadSession();
    setSession(s);
    setReady(true);
    if (!s) navigate({ to: "/upload" });
  }, [navigate]);

  if (!ready) return null;

  if (!session) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">No report yet</h1>
          <p className="mt-2 text-muted-foreground">Upload a file to see your insights.</p>
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

  const context =
    `Financial analysis report:\n${JSON.stringify(session.analysis, null, 2)}\n\n` +
    `Raw data from file "${session.fileName}":\n${session.content}`;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Your financial report</h1>
            <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" /> {session.fileName}
            </p>
          </div>
          <Link
            to="/upload"
            onClick={() => clearSession()}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <RefreshCw className="h-4 w-4" /> New analysis
          </Link>
        </div>

        <div className="mt-8">
          <AnalysisCards analysis={session.analysis} />
        </div>

        <div className="mt-8">
          <ChatPanel context={context} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
