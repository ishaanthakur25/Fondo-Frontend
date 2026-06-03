import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Lightbulb, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Fondo" },
      {
        name: "description",
        content:
          "The story behind Fondo: an AI financial agent built by a young founder who lived the problem of managing money without CFO training.",
      },
      { property: "og:title", content: "About Fondo" },
      {
        property: "og:description",
        content: "Why Fondo was built and the problem it solves for young founders.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              The story behind Fondo
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/75">
              Your AI CFO. Built for founders like you — because we've been exactly where
              you are.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16">
          <div className="prose-lg space-y-6 text-lg leading-relaxed text-foreground">
            <p>
              Fondo started with a problem I lived personally. As a young founder, I
              suddenly had real financial responsibility — budgets, grants, payroll,
              runway — with zero CFO training and no one to ask the "dumb" questions.
            </p>
            <p>
              Spreadsheets didn't explain anything. Accountants were expensive and spoke a
              different language. I needed a financial expert in my corner who could
              translate the numbers into plain English and tell me what to actually do.
            </p>
            <p>
              So I built it. Fondo is the AI financial agent I wish I'd had — one that
              learns your organization, remembers your history, and gives advice specific
              to your situation. Not a calculator. An agent.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Lightbulb, t: "The problem", d: "Young leaders manage real money with no financial training or support." },
              { icon: Heart, t: "The mission", d: "Make financial clarity free and accessible to the next generation of founders." },
              { icon: Users, t: "Built for you", d: "Designed for nonprofit founders, student org leaders, and early-stage teams." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{c.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-7 text-base font-semibold text-accent-foreground"
            >
              Meet Fondo
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
