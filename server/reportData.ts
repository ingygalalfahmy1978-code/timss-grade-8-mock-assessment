export type ReportBreakdown = {
  correct?: unknown;
  earned?: unknown;
  total?: unknown;
  max?: unknown;
  percentage?: unknown;
};

export type NormalizedBreakdown = {
  correct: number;
  total: number;
  percentage: number;
};

export function finiteNumber(value: unknown, fallback = 0): number {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function clampPercentage(value: unknown): number {
  return Math.max(0, Math.min(100, Math.round(finiteNumber(value))));
}

/** Supports both current {correct,total,percentage} and legacy {earned,max,total} domain records. */
export function normalizeBreakdown(value: unknown): NormalizedBreakdown {
  const entry = (value ?? {}) as ReportBreakdown;
  const correct = finiteNumber(entry.correct ?? entry.earned);
  const total = finiteNumber(entry.max ?? entry.total);
  const derivedPercentage = total > 0 ? (correct / total) * 100 : 0;
  return {
    correct,
    total,
    percentage: clampPercentage(entry.percentage ?? derivedPercentage),
  };
}

export function normalizeBreakdownMap(value: unknown): Record<string, NormalizedBreakdown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([domain, breakdown]) => [domain, normalizeBreakdown(breakdown)])
  );
}

/**
 * Old reports stored Mathematics/Science as a percentage with question totals; newer
 * reports store score and maximum points. This returns a display-ready score model.
 */
export function normalizeSubjectScore(scoreValue: unknown, totalValue: unknown, maxPointsValue: unknown) {
  const score = finiteNumber(scoreValue);
  const maxPoints = finiteNumber(maxPointsValue);
  const total = finiteNumber(totalValue);

  if (maxPoints > 0 && score <= maxPoints) {
    return { score, maxPoints, percentage: clampPercentage((score / maxPoints) * 100) };
  }
  if (total > 0 && score <= total) {
    return { score, maxPoints: total, percentage: clampPercentage((score / total) * 100) };
  }
  // The historical report format stored an already-calculated percentage in score.
  return { score, maxPoints: 100, percentage: clampPercentage(score) };
}

export function getReportMaxScore(report: { maxScore?: unknown; totalMaxPoints?: unknown }): number {
  return finiteNumber(report.maxScore ?? report.totalMaxPoints);
}
