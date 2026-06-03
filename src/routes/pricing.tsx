import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageSquare } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Fondo is Free Forever" },
      {
        name: "description",
        content:
          "Fondo is completely free, always. Built for young founders who shouldn't have to pay for financial clarity.",
      },
      { property: "og:title", content: "Fondo Pricing — Free Forever" },
      {
        property: "og:description",
        content: "No tiers. No credit card. Financial clarity, free for the next generation of founders.",
      },
    ],
  }),
  component: PricingPage,
});

const INCLUDED = [
  "Unlimited AI agent chat",
  "Document analysis (PDF, CSV, Excel)",
  "Fondo Health Score",
  "Red flag detection",
  "Scenario modeling",
  "Institutional memory",
];

function PricingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Completely free. Always.
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/75">
              Fondo is free forever — because young founders shouldn't have to pay for
              financial clarity.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-5 py-16">
          <div className="rounded-3xl border border-accent/30 bg-card p-10 text-center shadow-[var(--shadow-elegant)]">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              The only plan you need
            </span>
            <div className="mt-4 flex items-end justify-center gap-1">
              <span className="text-6xl font-extrabold text-foreground">$0</span>
              <span className="mb-2 text-lg text-muted-foreground">/ forever</span>
            </div>
            <p className="mt-3 text-muted-foreground">
              No tiers. No upsells. No credit card required.
            </p>

            <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left">
              {INCLUDED.map((i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-foreground">{i}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/"
              className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-7 text-base font-semibold text-accent-foreground"
            >
              <MessageSquare className="h-5 w-5" /> Start using Fondo
            </Link>
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-secondary p-8">
            <h2 className="text-xl font-bold text-foreground">Why is it free?</h2>
            <p className="mt-3 text-muted-foreground">
              Fondo was built by a young founder who lived the problem of managing money
              without any training or support. The people who need financial clarity most —
              nonprofit founders, student org leaders, and early-stage teams — are often the
              ones who can least afford a CFO. Charging them would defeat the entire point.
              Fondo exists to level the playing field, so it stays free for the next
              generation of founders.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
