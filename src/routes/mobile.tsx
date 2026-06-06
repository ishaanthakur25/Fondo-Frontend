import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Smartphone, Bell, Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/mobile")({
  head: () => ({
    meta: [
      { title: "Mobile App — Coming Soon — Fondo" },
      {
        name: "description",
        content:
          "The Fondo mobile app is in development. Join the waitlist for early access to your AI financial agent on the go.",
      },
      { property: "og:title", content: "Fondo Mobile — Coming Soon" },
      {
        property: "og:description",
        content: "Your AI CFO, in your pocket. Join the early access waitlist.",
      },
    ],
  }),
  component: MobilePage,
});

function MobilePage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="bg-primary text-primary-foreground">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent">
            <Smartphone className="h-3.5 w-3.5" /> Coming soon
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
            Fondo, in your pocket.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/75">
            We're building the Fondo mobile app so your AI financial agent is with you
            wherever decisions happen. Be the first to know when it launches.
          </p>

          {joined ? (
            <div className="mt-9 flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-6 py-4 text-accent">
              <Check className="h-5 w-5" />
              <span className="font-semibold">You're on the list! We'll be in touch.</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setJoined(true);
              }}
              className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourorg.com"
                className="h-12 flex-1 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 text-base text-primary-foreground outline-none placeholder:text-primary-foreground/50 focus:border-accent"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-base font-semibold leading-tight text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                <Bell className="h-5 w-5" /> Get early access
              </button>
            </form>
          )}
          <p className="mt-4 text-sm text-primary-foreground/60">
            Free forever. No credit card required.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
