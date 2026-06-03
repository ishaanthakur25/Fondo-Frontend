import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageSquare,
  FileSearch,
  Gauge,
  ShieldAlert,
  GitBranch,
  Brain,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Fondo" },
      {
        name: "description",
        content:
          "Explore everything Fondo does: AI agent chat, document analysis, the Fondo Health Score, scenario modeling, red flag detection, and institutional memory.",
      },
      { property: "og:title", content: "Fondo Features" },
      {
        property: "og:description",
        content: "A deep dive into your AI financial agent's capabilities.",
      },
    ],
  }),
  component: FeaturesPage,
});

const FEATURES = [
  {
    icon: MessageSquare,
    title: "AI Agent Chat",
    desc: "Talk to Fondo like you'd talk to a trusted CFO. Ask anything about budgeting, runway, fundraising, or spending — no upload required. Fondo answers in plain English with specific, actionable guidance.",
  },
  {
    icon: FileSearch,
    title: "Document Analysis",
    desc: "Upload a PDF, CSV, or Excel file and Fondo reads it instantly, producing a complete plain-English health report covering your summary, key insights, action items, and risks.",
  },
  {
    icon: Gauge,
    title: "Fondo Health Score",
    desc: "A proprietary 0–100 score that measures your organization's overall financial health at a glance — so you always know where you stand and what to improve.",
  },
  {
    icon: ShieldAlert,
    title: "Red Flag Detection",
    desc: "Fondo proactively scans for risks like cash shortfalls, overspending, and unsustainable burn — flagging them before they turn into crises.",
  },
  {
    icon: GitBranch,
    title: "Scenario Modeling",
    desc: "Ask what-if questions — 'What if we hire two people?' or 'What if our grant is delayed?' — and see exactly how your finances would change.",
  },
  {
    icon: Brain,
    title: "Institutional Memory",
    desc: "Fondo remembers your financial history, decisions, and context so knowledge never walks out the door when leadership changes. Your org's financial brain, preserved.",
  },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Everything your AI agent can do
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/75">
              Fondo is a full financial agent — not just a chatbot. Here's the complete
              picture.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <f.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-card-foreground">{f.title}</h2>
                <p className="mt-2 text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-7 text-base font-semibold text-accent-foreground"
            >
              <MessageSquare className="h-5 w-5" /> Chat with Fondo
            </Link>
            <Link
              to="/upload"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary/20 px-7 text-base font-semibold text-primary hover:bg-secondary"
            >
              Upload a Document
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
