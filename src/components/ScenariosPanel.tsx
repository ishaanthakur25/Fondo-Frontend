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

const API_BASE = "https://fondo-production.up.railway.app";

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
       0}
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
