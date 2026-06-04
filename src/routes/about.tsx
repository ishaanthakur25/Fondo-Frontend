import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Lightbulb, Users, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import ishaanPhoto from "@/assets/ishaan-thakur.png.asset.json";

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

        {/* Founder section */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid items-center gap-10 md:grid-cols-[auto,1fr] md:gap-14">
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full bg-accent/15 blur-xl" />
                  <img
                    src={ishaanPhoto.url}
                    alt="Ishaan Thakur, founder of Fondo"
                    className="relative h-56 w-56 rounded-full border-4 border-accent object-cover shadow-[var(--shadow-elegant)] md:h-64 md:w-64"
                  />
                </div>
              </div>
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                  Meet the founder
                </span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                  Ishaan Thakur
                </h2>
                <p className="mt-1 text-base font-medium text-muted-foreground">
                  Founder of Fondo • Frisco, Texas
                </p>
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-foreground">
                  <p>
                    Fondo was built by Ishaan Thakur, a teenage founder based in Frisco,
                    Texas. Ishaan co-founded Groundwork, a nonprofit that delivers
                    hands-on business and AI education kits to kids in underserved
                    communities and pediatric wards. The moment Groundwork started managing
                    real money — grants, donations, program budgets — Ishaan ran into a
                    wall. Every existing financial tool assumed you already understood
                    accounting. None of them were built for young students and founders
                    trying to run a nonprofit and change their community at the same time.
                  </p>
                  <p>
                    So he built one. Fondo is the tool Ishaan wished existed when he started
                    Groundwork — an AI financial agent that meets young founders exactly
                    where they are, speaks their language, and gives them the clarity to
                    make confident financial decisions without a finance degree.
                  </p>
                  <p className="font-semibold text-foreground">
                    If you're building something that matters and figuring out the money
                    part as you go, Fondo was built for you.
                  </p>
                </div>
                <Link
                  to="/"
                  className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-7 text-base font-semibold text-accent-foreground shadow-[var(--shadow-elegant)] transition-transform hover:-translate-y-0.5"
                >
                  Start using Fondo
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
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
