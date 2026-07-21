import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Apple, Smartphone, Monitor, Download, Check, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/mobile")({
  head: () => ({
    meta: [
      { title: "Get Fondo on Any Device — Fondo" },
      {
        name: "description",
        content:
          "Install Fondo on iPhone, Android, or desktop as a Progressive Web App. Native App Store versions coming soon.",
      },
      { property: "og:title", content: "Get Fondo on Any Device" },
      {
        property: "og:description",
        content: "Install Fondo directly from your browser — no App Store required.",
      },
    ],
  }),
  component: MobilePage,
});

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function useInstall() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  if (typeof window !== "undefined" && !deferred) {
    // one-time attach
    (window as unknown as { __fondoInstallBound?: boolean }).__fondoInstallBound ||
      (() => {
        (window as unknown as { __fondoInstallBound?: boolean }).__fondoInstallBound = true;
        window.addEventListener("beforeinstallprompt", (e) => {
          e.preventDefault();
          setDeferred(e as BeforeInstallPromptEvent);
        });
      })();
  }
  return {
    canInstall: !!deferred,
    install: async () => {
      if (!deferred) {
        toast.info(
          "Use your browser menu to install Fondo (see the steps for your device below).",
        );
        return;
      }
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    },
  };
}

function MobilePage() {
  const { canInstall, install } = useInstall();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const platforms = [
    {
      icon: Apple,
      name: "iPhone / iPad",
      steps: [
        "Open Fondo in Safari",
        "Tap the Share button",
        "Tap Add to Home Screen",
        "Tap Add",
      ],
    },
    {
      icon: Smartphone,
      name: "Android",
      steps: [
        "Open Fondo in Chrome",
        "Tap the three dots menu",
        "Tap Add to Home Screen",
        "Tap Install",
      ],
    },
    {
      icon: Monitor,
      name: "Desktop (Chrome)",
      steps: [
        "Look for the install icon in the address bar",
        "Click Install Fondo",
        "Fondo opens as a standalone app",
      ],
    },
  ];

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase() });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        setJoined(true);
        toast.success("You're already on the waitlist.");
      } else {
        toast.error("Couldn't join the waitlist. Please try again.");
      }
      return;
    }
    setJoined(true);
    toast.success("You're on the waitlist!");
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl px-5 py-20 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent">
              <Download className="h-3.5 w-3.5" /> Install anywhere
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
              Get Fondo on Any Device
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/75">
              Fondo works right from your browser — install it to your home screen or
              desktop like a native app, no App Store needed.
            </p>
            <button
              onClick={install}
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-7 text-base font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              <Download className="h-5 w-5" />
              {canInstall ? "Install Now" : "Install Fondo"}
            </button>
          </div>
        </section>

        {/* PWA Instructions */}
        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                Install on your phone or desktop
              </h2>
              <p className="mt-3 text-muted-foreground">
                Pick your device and follow the steps.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {platforms.map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div
                    className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "#00C89620", color: "#00C896" }}
                  >
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                  <ol className="mt-4 space-y-2.5">
                    {p.steps.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                          style={{ backgroundColor: "#0F1F3D", color: "#00C896" }}
                        >
                          {i + 1}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Store Coming Soon */}
        <section className="bg-secondary/40">
          <div className="mx-auto max-w-4xl px-5 py-16 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
              Coming soon
            </span>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              Native apps are on the way
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Fondo is coming to the App Store and Google Play Store soon. Enter your
              email to be notified when we launch.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {[
                { name: "App Store", sub: "Download on the", icon: Apple },
                { name: "Google Play", sub: "Get it on", icon: Smartphone },
              ].map((b) => (
                <div
                  key={b.name}
                  className="flex h-16 w-full max-w-[220px] items-center gap-3 rounded-xl border border-border bg-muted/60 px-4 text-left opacity-70"
                >
                  <b.icon className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {b.sub}
                    </div>
                    <div className="text-sm font-bold text-foreground">{b.name}</div>
                    <div className="text-[10px] font-semibold text-accent">
                      Coming Soon
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {joined ? (
              <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-6 py-4 text-accent">
                <Check className="h-5 w-5" />
                <span className="font-semibold">You're on the list!</span>
              </div>
            ) : (
              <form
                onSubmit={handleWaitlist}
                className="mx-auto mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourorg.com"
                  className="h-12 flex-1 rounded-xl border border-border bg-background px-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-base font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Notify Me"
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
