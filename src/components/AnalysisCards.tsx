import type { FinancialAnalysis } from "@/lib/analysis.functions";
import {
  Activity,
  Lightbulb,
  CheckSquare,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

function scoreColor(score: number) {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

function scoreRing(score: number) {
  if (score >= 70) return "var(--success)";
  if (score >= 40) return "var(--warning)";
  return "var(--destructive)";
}

export function AnalysisCards({ analysis }: { analysis: FinancialAnalysis }) {
  const { healthScore, healthLabel, healthSummary, keyInsights, actionItems, redFlags } =
    analysis;

  return (
    <div className="space-y-6">
      {/* Health summary */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Activity className="h-4 w-4 text-accent" />
          Financial Health Summary
        </div>
        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div
            className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(${scoreRing(healthScore)} ${healthScore}%, var(--secondary) 0)`,
            }}
          >
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-card">
              <span className={`text-2xl font-extrabold ${scoreColor(healthScore)}`}>
                {healthScore}
              </span>
              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div>
            <p className={`text-lg font-bold ${scoreColor(healthScore)}`}>{healthLabel}</p>
            <p className="mt-1.5 text-muted-foreground">{healthSummary}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Key insights */}
        <ListCard
          title="Key Insights"
          icon={Lightbulb}
          iconClass="text-accent"
          items={keyInsights}
          bullet={(i) => (
            <span
              key={i}
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"
              aria-hidden
            />
          )}
        />

        {/* Action items */}
        <ListCard
          title="Action Items"
          icon={CheckSquare}
          iconClass="text-success"
          items={actionItems}
          bullet={() => <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />}
        />
      </div>

      {/* Red flags */}
      <section
        className={`rounded-2xl border p-6 shadow-[var(--shadow-card)] md:p-8 ${
          redFlags.length
            ? "border-destructive/30 bg-destructive/5"
            : "border-success/30 bg-success/5"
        }`}
      >
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <AlertTriangle
            className={`h-4 w-4 ${redFlags.length ? "text-destructive" : "text-success"}`}
          />
          Red Flags
        </div>
        {redFlags.length ? (
          <ul className="mt-4 space-y-3">
            {redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 flex items-center gap-2 text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" />
            No major red flags found — nice work keeping things on track.
          </p>
        )}
      </section>
    </div>
  );
}

function ListCard({
  title,
  icon: Icon,
  iconClass,
  items,
  bullet,
}: {
  title: string;
  icon: typeof Lightbulb;
  iconClass: string;
  items: string[];
  bullet: (i: number) => React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className={`h-4 w-4 ${iconClass}`} />
        {title}
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-foreground">
            {bullet(i)}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
