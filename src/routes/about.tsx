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
            <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-[280px_repeat(3,minmax(0,1fr))]">
              <div className="flex justify-center md:justify-start lg:items-center">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full bg-accent/15 blur-xl" />
                  <img
                    src={ishaanPhoto.url}
                    alt="Ishaan Thakur, founder of Fondo"
                    className="relative h-56 w-56 rounded-full border-4 border-accent object-cover shadow-[var(--shadow-elegant)] md:h-64 md:w-64"
                  />
                </div>
              </div>
              {[
                { icon: Lightbulb, t: "The problem", d: "Young leaders manage real money with no financial training or support." },
                { icon: Heart, t: "The mission", d: "Make financial clarity free and accessible to the next generation of founders." },
                { icon: Users, t: "Built for you", d: "Designed for nonprofit founders, student org leaders, and early-stage teams." },
              ].map((c) => (
                <div key={c.t} className="flex h-full flex-col justify-center rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-foreground">{c.t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{c.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
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
            </div>

            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-7 text-base font-semibold text-accent-foreground shadow-[var(--shadow-elegant)] transition-transform hover:-translate-y-0.5"
              >
                Start using Fondo
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
