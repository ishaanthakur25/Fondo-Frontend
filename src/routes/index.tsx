import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Upload,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fondo — AI Financial Agent for Nonprofit & Student Leaders" },
      {
        name: "description",
        content:
          "Fondo turns your budgets and statements into clear, jargon-free financial insights. Built for young nonprofit founders and student org leaders.",
      },
      { property: "og:title", content: "Fondo — Your AI Financial Agent" },
      {
        property: "og:description",
        content:
          "Upload a PDF, CSV, or Excel file and get instant financial health insights, action items, and red flags — explained simply.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: TrendingUp,
    title: "Financial health, decoded",
    desc: "Get a clear health score and plain-language summary of where your organization stands.",
  },
  {
    icon: Sparkles,
    title: "AI-generated insights",
    desc: "Key trends and observations pulled straight from your numbers — no spreadsheets required.",
  },
  {
    icon: ShieldCheck,
    title: "Catch the red flags",
    desc: "Spot risks like overspending or cash shortfalls before they become real problems.",
  },
  {
    icon: MessageCircle,
    title: "Ask anything",
    desc: "Chat with Fondo about your finances and get friendly, confident answers.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground">
              <HeartHandshake className="h-3.5 w-3.5" />
              Built for mission-driven leaders
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-foreground md:text-5xl lg:text-6xl">
              Your finances,
              <br />
              <span className="text-accent">finally clear.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Fondo is the AI financial agent for young nonprofit founders and student org
              leaders. Upload a file and get insights you can actually understand.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/upload"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:-translate-y-0.5"
              >
                <Upload className="h-5 w-5" />
                Analyze your finances
              </Link>
              <span className="text-sm text-muted-foreground">
                Free · No account needed
              </span>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImg}
              alt="Financial dashboard illustration showing rising growth"
              width={1280}
              height={1024}
              className="w-full rounded-3xl shadow-[var(--shadow-elegant)]"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="text-center text-3xl font-bold text-foreground">
          Everything you need to feel in control
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          No finance degree required. Fondo does the heavy lifting and explains it like a
          friend who happens to be great with money.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-card-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-bold text-foreground">
            Three simple steps
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { n: "1", t: "Upload your file", d: "Drag and drop a PDF, CSV, or Excel budget or statement." },
              { n: "2", t: "Get instant insights", d: "Fondo reads it and builds a clear financial report in seconds." },
              { n: "3", t: "Ask follow-ups", d: "Chat with Fondo to dig deeper and plan your next move." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/upload"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <Upload className="h-5 w-5" />
              Get started
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-5 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Fondo · Friendly finance for mission-driven leaders.
        </div>
      </footer>
    </div>
  );
}
