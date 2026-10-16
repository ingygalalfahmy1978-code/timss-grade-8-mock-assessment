import { describe, expect, it } from "vitest";
import { getReportMaxScore, normalizeBreakdown, normalizeBreakdownMap, normalizeSubjectScore } from "./reportData";

describe("legacy report data normalization", () => {
  it("uses current correct, total and percentage values", () => {
    expect(normalizeBreakdown({ correct: 7, total: 10, percentage: 70 })).toEqual({ correct: 7, total: 10, percentage: 70 });
  });

  it("converts legacy earned and max values without producing NaN", () => {
    expect(normalizeBreakdown({ earned: 6, max: 13, total: 10 })).toEqual({ correct: 6, total: 13, percentage: 46 });
    expect(normalizeBreakdown({ earned: 0, max: 0 })).toEqual({ correct: 0, total: 0, percentage: 0 });
  });

  it("normalizes legacy domain maps", () => {
    expect(normalizeBreakdownMap({ Algebra: { earned: 6, max: 13 } })).toEqual({
      Algebra: { correct: 6, total: 13, percentage: 46 },
    });
  });

  it("handles percentage-style and points-style subject scores", () => {
    expect(normalizeSubjectScore(62, 39, undefined)).toEqual({ score: 62, maxPoints: 100, percentage: 62 });
    expect(normalizeSubjectScore(20, 32, 39)).toEqual({ score: 20, maxPoints: 39, percentage: 51 });
  });

  it("uses totalMaxPoints when legacy reports do not have maxScore", () => {
    expect(getReportMaxScore({ totalMaxPoints: 77 })).toBe(77);
    expect(getReportMaxScore({ maxScore: 40, totalMaxPoints: 77 })).toBe(40);
  });
});
