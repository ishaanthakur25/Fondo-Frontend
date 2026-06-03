import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Mail } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Fondo" },
      {
        name: "description",
        content:
          "Get in touch with the Fondo team. Questions, feedback, or just want to talk finances? We'd love to hear from you.",
      },
      { property: "og:title", content: "Contact Fondo" },
      {
        property: "og:description",
        content: "Reach out to the team building your AI financial agent.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Let's talk.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Questions, feedback, or want to share your story? We read every message.
            </p>
            <div className="mt-8 rounded-2xl border border-border bg-secondary p-7">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
                Our mission
              </h2>
              <p className="mt-3 text-foreground">
                Every young founder and org leader deserves a financial expert in their
                corner. Fondo exists to give the next generation of founders the clarity
                and confidence to make great financial decisions — for free, for good.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-foreground">Message sent!</h2>
                <p className="mt-2 text-muted-foreground">
                  Thanks for reaching out — we'll get back to you soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-5"
              >
                <div>
                  <label className="text-sm font-semibold text-foreground" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-base font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
                >
                  <Mail className="h-5 w-5" /> Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
