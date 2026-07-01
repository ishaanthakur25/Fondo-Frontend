import { useState } from "react";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Wand2,
} from "lucide-react";

const API_BASE = "https://fondo-backend-kfic.onrender.com";

interface ScenarioResult {
  scenario: string;
  currentState: string;
  projectedImpact: string;
  newPosition: string;
  opportunities: string[];
  risks: string[];
  recommendation: string;
}

function asList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean);
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

function parseScenario(raw: any, scenarioText: string): ScenarioResult {
  return {
    scenario: String(raw.scenario ?? scenarioText),
    currentState: String(
      raw.current_state ?? raw.currentState ?? raw.current ?? raw.before ?? "",
    ),
    projectedImpact: String(
      raw.projected_impact ??
        raw.projectedImpact ??
        raw.impact ??
        raw.after ??
        raw.projection ??
        "",
    ),
    newPosition: String(
      raw.new_position ?? raw.newPosition ?? raw.position ?? "",
    ),
    opportunities: asList(raw.opportunities ?? raw.upsides ?? raw.benefits),
    risks: asList(raw.risks ?? raw.downsides ?? raw.warnings),
    recommendation: String(
      raw.recommendation ?? raw.advice ?? raw.summary ?? raw.suggestion ?? "",
    ),
  };
}

export function ScenariosPanel({ sessionId }: { sessionId: string }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ScenarioResult[]>([]);

  async function runScenario() {
    const text = question.trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/scenario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, question: text }),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Request failed"));
      const json = await res.json();
      const raw = json.scenario_result ?? json;
      setResults((prev) => [parseScenario(raw, text), ...prev]);
      setQuestion("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not run scenario.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Wand2 className="h-4 w-4 text-accent" />
          What if…
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Describe a scenario and Fondo will project its impact — e.g. “we get a $5,000
          grant” or “we lose our biggest donor”.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runScenario();
            }}
            placeholder="we get a $5,000 grant…"
            className="h-12 flex-1 rounded-xl border border-border bg-background px-4 text-foreground outline-none transition-colors focus:border-accent"
          />
          <button
            onClick={runScenario}
            disabled={loading || !question.trim()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Run Scenario
          </button>
        </div>
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </section>

      {/* Results stacked */}
      {results.map((r, i) => (
        <section
          key={i}
          className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8"
        >
          <p className="text-sm font-semibold text-primary">
            <span className="text-muted-foreground">What if </span>
            {r.scenario}
          </p>

          {/* Before / after */}
          {(r.currentState || r.projectedImpact) && (
            <div className="mt-5 grid items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Current state
                </p>
                <p className="mt-2 text-sm text-foreground">{r.currentState || "—"}</p>
              </div>
              <div className="hidden items-center justify-center sm:flex">
                <ArrowRight className="h-5 w-5 text-accent" />
              </div>
              <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Projected impact
                </p>
                <p className="mt-2 text-sm text-foreground">{r.projectedImpact || "—"}</p>
              </div>
            </div>
          )}

          {/* New position */}
          {r.newPosition && (
            <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                New position
              </p>
              <p className="mt-2 text-sm text-foreground">{r.newPosition}</p>
            </div>
          )}

          {/* Opportunities + risks */}
          {(r.opportunities.length > 0 || r.risks.length > 0) && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {r.opportunities.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Opportunities
                  </p>
                  <ul className="mt-3 space-y-2">
                    {r.opportunities.map((o, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {r.risks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Risks
                  </p>
                  <ul className="mt-3 space-y-2">
                    {r.risks.map((rk, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                        <span>{rk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Recommendation */}
          {r.recommendation && (
            <div className="mt-5 rounded-xl border border-accent/40 bg-accent/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Recommendation
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">{r.recommendation}</p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
