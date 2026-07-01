import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Upload,
  MessageSquare,
  FileSearch,
  Gauge,
  ShieldAlert,
  GitBranch,
  Brain,
  Check,
  History,
  Target,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChatPanel } from "@/components/ChatPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fondo — Your AI Financial Agent" },
      {
        name: "description",
        content:
          "Meet Fondo, your AI CFO. Chat instantly about your finances or upload a document for deep analysis. Built for young founders and org leaders. Free forever.",
      },
      { property: "og:title", content: "Fondo — Your AI Financial Agent" },
      {
        property: "og:description",
        content:
          "Your AI CFO. Built for founders like you. Get clarity on your finances in plain English, instantly.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: MessageSquare,
    title: "AI Agent Chat",
    desc: "Ask Fondo anything about your finances. No upload required.",
  },
  {
    icon: FileSearch,
    title: "Document Analysis",
    desc: "Upload any financial file and get a complete plain English health report.",
  },
  {
    icon: Gauge,
    title: "Fondo Health Score",
    desc: "A proprietary 0–100 score measuring your org's financial health.",
  },
  {
    icon: ShieldAlert,
    title: "Red Flag Detection",
    desc: "Fondo proactively spots risks before they become crises.",
  },
  {
    icon: GitBranch,
    title: "Scenario Modeling",
    desc: "Ask what-if questions and see exactly how your finances would change.",
  },
  {
    icon: Brain,
    title: "Institutional Memory",
    desc: "Fondo remembers everything so your org never loses financial knowledge again.",
  },
];

const STEPS = [
  {
    n: "1",
    t: "Start a conversation or upload a file",
    d: "Meet Fondo your way. Chat directly or upload a financial document for deeper analysis.",
  },
  {
    n: "2",
    t: "Get instant AI-powered insights",
    d: "Fondo analyzes your situation and gives specific, plain English guidance based on your actual numbers and goals.",
  },
  {
    n: "3",
    t: "Make confident financial decisions",
    d: "No more guessing. Fondo gives you the clarity to act decisively on your organization's finances.",
  },
];

const AGENT_CAPS = [
  { icon: History, t: "Remembers your financial history" },
  { icon: Target, t: "Understands your org type and goals" },
  { icon: Sparkles, t: "Gives advice specific to your situation" },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent">
              <MessageSquare className="h-3.5 w-3.5" />
              Your AI CFO. Built for founders like you.
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Meet Fondo.
              <br />
              <span className="text-accent">Your AI Financial Agent.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/75">
              Built for young founders and org leaders who have real financial
              responsibility — and no CFO training. Get clarity on your finances in plain
              English, instantly.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#chat"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-7 text-base font-semibold text-accent-foreground shadow-[var(--shadow-elegant)] transition-transform hover:-translate-y-0.5"
              >
                <MessageSquare className="h-5 w-5" />
                Chat with Fondo
              </a>
              <Link
                to="/upload"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-primary-foreground/30 px-7 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                <Upload className="h-5 w-5" />
                Upload a Document
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Direct chat */}
      <section id="chat" className="bg-secondary py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Talk to your AI financial agent
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              No sign-up. No upload. Just start the conversation — ask about budgeting,
              runway, fundraising, or anything on your mind.
            </p>
          </div>
          <div className="mt-8">
            <ChatPanel />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Want a deeper dive?{" "}
            <Link to="/upload" className="font-semibold text-accent hover:underline">
              Upload a financial document
            </Link>{" "}
            for a full analysis.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Everything your AI agent can do
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Fondo does the heavy lifting and explains it like a CFO who actually wants you
            to understand.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-card-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent personalization */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Not a tool. An agent.
              </span>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Fondo learns your organization.
              </h2>
              <p className="mt-5 text-lg text-primary-foreground/75">
                The more you use it, the more context it builds about your specific
                situation, goals, and financial patterns. It's not generic advice — it's
                your CFO.
              </p>
            </div>
            <div className="space-y-4">
              {AGENT_CAPS.map((c) => (
                <div
                  key={c.t}
                  className="flex items-center gap-4 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <p className="text-base font-semibold">{c.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-bold text-foreground">How it works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-lg font-extrabold text-accent-foreground">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a
              href="#chat"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-7 text-base font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              <MessageSquare className="h-5 w-5" />
              Start chatting with Fondo
            </a>
          </div>
        </div>
      </section>

      {/* Free banner */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-accent/30 bg-accent/5 p-10 text-center">
          <Check className="h-8 w-8 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Fondo is free forever.</h2>
          <p className="max-w-xl text-muted-foreground">
            Built for young founders who shouldn't have to pay for financial clarity. No
            credit card required.
          </p>
          <Link
            to="/pricing"
            className="font-semibold text-accent hover:underline"
          >
            See why it's free →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
