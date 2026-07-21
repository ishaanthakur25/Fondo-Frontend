import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Calendar } from "lucide-react";

const API_BASE = "https://fondo-backend-kfic.onrender.com";

interface Action {
  action: string;
  impact: string;
  how: string;
  priority: string;
}

interface Week {
  week: number;
  theme: string;
  actions: Action[];
}

interface ActionPlan {
  summary: string;
  weeks: Week[];
}

function asList(v: unknown): any[] {
  if (Array.isArray(v)) return v;
  return [];
}

function parseAction(raw: any): Action {
  return {
    action: String(raw?.action ?? raw?.title ?? raw?.name ?? ""),
    impact: String(raw?.impact ?? raw?.why ?? ""),
    how: String(raw?.how ?? raw?.steps ?? raw?.method ?? ""),
    priority: String(raw?.priority ?? "planning").toLowerCase(),
  };
}

function parsePlan(raw: any): ActionPlan {
  const root = raw?.action_plan ?? raw?.actionPlan ?? raw ?? {};
  const weeksRaw = asList(root.weeks ?? root.plan ?? []);
  const weeks: Week[] = weeksRaw.map((w: any, i: number) => ({
    week: Number(w?.week ?? i + 1),
    theme: String(w?.theme ?? w?.title ?? ""),
    actions: asList(w?.actions ?? w?.items ?? []).map(parseAction),
  }));
  return {
    summary: String(root.summary ?? root.overview ?? ""),
    weeks,
  };
}

function priorityStyles(p: string) {
  switch (p) {
    case "critical":
      return {
        bg: "bg-destructive/10 border-destructive/30",
        badge: "bg-destructive/15 text-destructive",
        emoji: "🔴",
        label: "Critical",
      };
    case "important":
      return {
        bg: "bg-warning/10 border-warning/30",
        badge: "bg-warning/15 text-warning",
        emoji: "🟡",
        label: "Important",
      };
    case "growth":
      return {
        bg: "bg-success/10 border-success/30",
        badge: "bg-success/15 text-success",
        emoji: "🟢",
        label: "Growth",
      };
    case "planning":
    default:
      return {
        bg: "bg-primary/5 border-primary/20",
        badge: "bg-primary/10 text-primary",
        emoji: "🔵",
        label: "Planning",
      };
  }
}

export function ActionPlanPanel({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<ActionPlan | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      setPlan(null);
      try {
        const res = await fetch(`${API_BASE}/action-plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        if (!res.ok) throw new Error(await res.text().catch(() => "Request failed"));
        const json = await res.json();
        if (cancelled) return;
        setPlan(parsePlan(json));
      } catch {
        if (!cancelled) setError("Action plan unavailable right now. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-16 shadow-[var(--shadow-card)]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm font-medium">Generating your action plan…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="space-y-6">
      {plan.summary && (
        <div className="rounded-2xl border border-border border-l-4 border-l-success bg-success/5 p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-success">
            Summary
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">{plan.summary}</p>
        </div>
      )}

      {plan.weeks.map((w) => (
        <section
          key={w.week}
          className="rounded-2xl border border-border bg-secondary/30 p-6 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Calendar className="h-4 w-4 text-accent" />
            <h3 className="text-base font-bold text-primary">
              Week {w.week}
              {w.theme && (
                <span className="font-semibold text-foreground"> — {w.theme}</span>
              )}
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            {w.actions.map((a, i) => {
              const s = priorityStyles(a.priority);
              return (
                <div
                  key={i}
                  className={`flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-start sm:gap-4 ${s.bg}`}
                >
                  <span
                    className={`inline-flex h-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.badge}`}
                  >
                    <span>{s.emoji}</span> {s.label}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{a.action}</p>
                    {a.impact && (
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/70">Impact:</span>{" "}
                        {a.impact}
                      </p>
                    )}
                    {a.how && (
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        <span className="font-semibold text-foreground/70">How:</span>{" "}
                        {a.how}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
