import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Target } from "lucide-react";

const API_BASE = "https://fondo-production.up.railway.app";

interface Dimension {
  name: string;
  score: number;
  insight: string;
}

interface HealthScoreData {
  overallScore: number;
  summary: string;
  dimensions: Dimension[];
  topAction: string;
}

function titleCase(s: string): string {
  return s
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function asNumber(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function parseHealthScore(raw: any): HealthScoreData {
  const hs =
    raw.health_score && typeof raw.health_score === "object"
      ? raw.health_score
      : raw;

  const overallScore = asNumber(
    hs.overall_score ?? hs.overallScore ?? hs.score ?? 0,
  );
  const summary = String(
    hs.summary ?? hs.overview ?? hs.health_summary ?? hs.analysis ?? "",
  );
  const topAction = String(
    hs.top_priority ??
      hs.top_priority_action ??
      hs.top_action ??
      hs.priority_action ??
      hs.topAction ??
      hs.recommendation ??
      "",
  );

  const rawDims = hs.dimensions ?? hs.scores ?? hs.categories ?? [];
  let dimensions: Dimension[] = [];
  if (Array.isArray(rawDims)) {
    dimensions = rawDims.map((d: any) => ({
      name: titleCase(String(d.name ?? d.dimension ?? d.label ?? d.title ?? "")),
      score: asNumber(d.score ?? d.value ?? 0),
      insight: String(d.insight ?? d.description ?? d.detail ?? d.comment ?? ""),
    }));
  } else if (rawDims && typeof rawDims === "object") {
    dimensions = Object.entries(rawDims).map(([name, d]: [string, any]) => ({
      name: titleCase(name),
      score: asNumber(typeof d === "object" ? d.score ?? d.value : d),
      insight:
        typeof d === "object" ? String(d.insight ?? d.description ?? "") : "",
    }));
  }

  return { overallScore, summary, dimensions, topAction };
}

function buildScoreDescription(data: HealthScoreData): string {
  if (!data.dimensions.length) return data.summary;

  const sorted = [...data.dimensions].sort((a, b) => b.score - a.score);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  const sentences: string[] = [
    `Your Fondo Health Score of **${data.overallScore}** reflects ${highest.name} as your strongest area and ${lowest.name} as your biggest opportunity for improvement.`,
  ];

  if (data.summary) sentences.push(data.summary);
  sentences.push("Focus on your top priority below to raise your score.");

  return sentences.join(" ");
}

function scoreColor(score: number) {
  if (score >= 66) return "var(--success)";
  if (score >= 41) return "var(--warning)";
  return "var(--destructive)";
}

function scoreTextClass(score: number) {
  if (score >= 66) return "text-success";
  if (score >= 41) return "text-warning";
  return "text-destructive";
}

export function HealthScorePanel({ sessionId }: { sessionId: string }) {
  const [data, setData] = useState<HealthScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/health-score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        if (!res.ok) throw new Error(await res.text().catch(() => "Request failed"));
        const json = await res.json();
        if (!cancelled) setData(parseHealthScore(json));
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Could not load health score.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (sessionId) run();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground">Calculating your health score…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{error ?? "No health score available."}</span>
      </div>
    );
  }

  const { overallScore, summary, dimensions, topAction } = data;
  const ringColor = scoreColor(overallScore);

  return (
    <div className="space-y-6">
      {/* Gauge */}
      <section className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <div
          className="relative flex h-44 w-44 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${ringColor} ${overallScore * 3.6}deg, var(--secondary) 0)`,
          }}
        >
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-card">
            <span className={`text-4xl font-extrabold ${scoreTextClass(overallScore)}`}>
              {overallScore}
            </span>
            <span className="text-xs text-muted-foreground">out of 100</span>
          </div>
        </div>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Overall Health Score
        </p>
        <p className="mt-4 max-w-2xl text-center leading-relaxed text-foreground/90">
          {buildScoreDescription(data)
            .split(/(\*\*[^*]+\*\*)/g)
            .map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i} className="font-bold text-foreground">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
        </p>
      </section>

      {/* Dimension cards */}
      {dimensions.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dimensions.map((d, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-foreground">{d.name}</span>
                <span className={`text-lg font-extrabold ${scoreTextClass(d.score)}`}>
                  {d.score}
                  <span className="text-xs font-medium text-muted-foreground">/100</span>
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${d.score}%`, background: scoreColor(d.score) }}
                />
              </div>
              {d.insight && (
                <p className="mt-3 text-sm text-muted-foreground">{d.insight}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Summary
          </h3>
          <p className="mt-3 leading-relaxed text-foreground">{summary}</p>
        </section>
      )}

      {/* Top priority action */}
      {topAction && (
        <section className="rounded-2xl border border-accent/40 bg-accent/10 p-6 shadow-[var(--shadow-card)] md:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
            <Target className="h-4 w-4 text-accent" />
            Top Priority Action
          </div>
          <p className="mt-3 font-medium leading-relaxed text-foreground">{topAction}</p>
        </section>
      )}
    </div>
  );
}
