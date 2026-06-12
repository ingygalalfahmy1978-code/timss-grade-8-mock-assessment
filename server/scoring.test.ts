/**
 * Tests for the scoreAnswer function and drawing review logic.
 * These tests verify that all question types are scored correctly.
 */
import { describe, it, expect } from "vitest";

// ─── Inline scoreAnswer (mirrors server/routers.ts) ──────────────────────────
// We re-implement here to avoid importing the full Express app.
function scoreAnswer(
  questionType: string,
  answerGiven: string | null,
  correctAnswer: string,
  maxPoints: number
): { isCorrect: boolean; pointsEarned: number } {
  if (!answerGiven) return { isCorrect: false, pointsEarned: 0 };

  if (questionType === "multiple_choice") {
    const correct = answerGiven.trim().toUpperCase() === correctAnswer.trim().toUpperCase();
    return { isCorrect: correct, pointsEarned: correct ? maxPoints : 0 };
  }

  if (questionType === "drag_drop" || questionType === "matching") {
    try {
      const given = JSON.parse(answerGiven) as Record<string, string>;
      const expected = JSON.parse(correctAnswer) as Record<string, string>;
      const expectedKeys = Object.keys(expected);
      if (expectedKeys.length === 0) return { isCorrect: false, pointsEarned: 0 };
      let correctPairs = 0;
      for (const key of expectedKeys) {
        if (given[key]?.toString().trim().toLowerCase() === expected[key]?.toString().trim().toLowerCase()) {
          correctPairs++;
        }
      }
      const allCorrect = correctPairs === expectedKeys.length;
      if (maxPoints <= 1) return { isCorrect: allCorrect, pointsEarned: allCorrect ? maxPoints : 0 };
      if (allCorrect) return { isCorrect: true, pointsEarned: 2 };
      if (correctPairs >= Math.ceil(expectedKeys.length / 2)) return { isCorrect: false, pointsEarned: 1 };
      return { isCorrect: false, pointsEarned: 0 };
    } catch {
      return { isCorrect: false, pointsEarned: 0 };
    }
  }

  if (questionType === "ordering") {
    try {
      let givenArr: string[];
      let expectedArr: string[];
      try {
        givenArr = JSON.parse(answerGiven);
        expectedArr = JSON.parse(correctAnswer);
      } catch {
        const g = answerGiven.trim().toLowerCase();
        const e = correctAnswer.trim().toLowerCase();
        return { isCorrect: g === e, pointsEarned: g === e ? maxPoints : 0 };
      }
      if (!Array.isArray(givenArr) || !Array.isArray(expectedArr)) {
        return { isCorrect: false, pointsEarned: 0 };
      }
      const correct = givenArr.length === expectedArr.length &&
        givenArr.every((v, i) => v?.toString().trim().toLowerCase() === expectedArr[i]?.toString().trim().toLowerCase());
      return { isCorrect: correct, pointsEarned: correct ? maxPoints : 0 };
    } catch {
      return { isCorrect: false, pointsEarned: 0 };
    }
  }

  if (questionType === "pattern_interaction") {
    try {
      let given: Record<string, string>;
      let expected: Record<string, string>;
      try {
        given = JSON.parse(answerGiven);
        expected = JSON.parse(correctAnswer);
      } catch {
        const g = answerGiven.trim().toLowerCase();
        const e = correctAnswer.trim().toLowerCase();
        return { isCorrect: g === e, pointsEarned: g === e ? maxPoints : 0 };
      }
      const expectedKeys = Object.keys(expected);
      if (expectedKeys.length === 0) return { isCorrect: false, pointsEarned: 0 };
      let correctBlanks = 0;
      for (const key of expectedKeys) {
        if (given[key]?.toString().trim().toLowerCase() === expected[key]?.toString().trim().toLowerCase()) {
          correctBlanks++;
        }
      }
      const allCorrect = correctBlanks === expectedKeys.length;
      if (maxPoints <= 1) return { isCorrect: allCorrect, pointsEarned: allCorrect ? maxPoints : 0 };
      if (allCorrect) return { isCorrect: true, pointsEarned: 2 };
      if (correctBlanks >= Math.ceil(expectedKeys.length / 2)) return { isCorrect: false, pointsEarned: 1 };
      return { isCorrect: false, pointsEarned: 0 };
    } catch {
      return { isCorrect: false, pointsEarned: 0 };
    }
  }

  if (questionType === "psi_lab") {
    try {
      const given = JSON.parse(answerGiven);
      const expected = JSON.parse(correctAnswer);
      let correctCount = 0;
      let total = 0;
      for (const key of Object.keys(expected)) {
        total++;
        if (given[key]?.toString().trim().toLowerCase() === expected[key]?.toString().trim().toLowerCase()) {
          correctCount++;
        }
      }
      if (total === 0) return { isCorrect: false, pointsEarned: 0 };
      const allCorrect = correctCount === total;
      if (maxPoints === 1) return { isCorrect: allCorrect, pointsEarned: allCorrect ? 1 : 0 };
      if (correctCount === total) return { isCorrect: true, pointsEarned: 2 };
      if (correctCount >= Math.ceil(total / 2)) return { isCorrect: false, pointsEarned: 1 };
      return { isCorrect: false, pointsEarned: 0 };
    } catch {
      return { isCorrect: false, pointsEarned: 0 };
    }
  }

  if (questionType === "drawing_canvas") {
    return { isCorrect: false, pointsEarned: 0 };
  }

  if (questionType === "partial_credit_short_answer") {
    const given = answerGiven.trim().toLowerCase();
    const expected = correctAnswer.trim().toLowerCase();
    if (given === expected) return { isCorrect: true, pointsEarned: maxPoints };
    const keyTerms = expected.split(/[;,\s]+/).filter((t) => t.length > 3);
    const matchCount = keyTerms.filter((t) => given.includes(t)).length;
    if (matchCount >= Math.ceil(keyTerms.length / 2)) return { isCorrect: false, pointsEarned: 1 };
    return { isCorrect: false, pointsEarned: 0 };
  }

  // Default: short_answer
  const given = answerGiven.trim().toLowerCase();
  const expected = correctAnswer.trim().toLowerCase();
  const correct = given === expected || (expected.includes(given) && given.length > 3);
  return { isCorrect: correct, pointsEarned: correct ? maxPoints : 0 };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("scoreAnswer – multiple_choice", () => {
  it("scores correct answer", () => {
    expect(scoreAnswer("multiple_choice", "A", "A", 1)).toEqual({ isCorrect: true, pointsEarned: 1 });
  });
  it("scores wrong answer", () => {
    expect(scoreAnswer("multiple_choice", "B", "A", 1)).toEqual({ isCorrect: false, pointsEarned: 0 });
  });
  it("is case-insensitive", () => {
    expect(scoreAnswer("multiple_choice", "a", "A", 1)).toEqual({ isCorrect: true, pointsEarned: 1 });
  });
  it("returns 0 for null answer", () => {
    expect(scoreAnswer("multiple_choice", null, "A", 1)).toEqual({ isCorrect: false, pointsEarned: 0 });
  });
});

describe("scoreAnswer – drag_drop", () => {
  const correct = JSON.stringify({ item1: "target1", item2: "target2" });

  it("full credit when all pairs match", () => {
    const given = JSON.stringify({ item1: "target1", item2: "target2" });
    expect(scoreAnswer("drag_drop", given, correct, 2)).toEqual({ isCorrect: true, pointsEarned: 2 });
  });

  it("order-independent: different key insertion order still scores correctly", () => {
    const given = JSON.stringify({ item2: "target2", item1: "target1" });
    expect(scoreAnswer("drag_drop", given, correct, 2)).toEqual({ isCorrect: true, pointsEarned: 2 });
  });

  it("partial credit when half pairs correct", () => {
    const given = JSON.stringify({ item1: "target1", item2: "target_wrong" });
    const result = scoreAnswer("drag_drop", given, correct, 2);
    expect(result.pointsEarned).toBe(1);
    expect(result.isCorrect).toBe(false);
  });

  it("zero credit when no pairs correct", () => {
    const given = JSON.stringify({ item1: "target_wrong", item2: "target_wrong2" });
    expect(scoreAnswer("drag_drop", given, correct, 2)).toEqual({ isCorrect: false, pointsEarned: 0 });
  });
});

describe("scoreAnswer – matching", () => {
  const correct = JSON.stringify({ left1: "right1", left2: "right2", left3: "right3" });

  it("full credit for all correct pairs", () => {
    const given = JSON.stringify({ left1: "right1", left2: "right2", left3: "right3" });
    expect(scoreAnswer("matching", given, correct, 2)).toEqual({ isCorrect: true, pointsEarned: 2 });
  });

  it("partial credit for 2 of 3 correct", () => {
    const given = JSON.stringify({ left1: "right1", left2: "right2", left3: "wrong" });
    const result = scoreAnswer("matching", given, correct, 2);
    expect(result.pointsEarned).toBe(1);
  });

  it("zero credit for 1 of 3 correct", () => {
    const given = JSON.stringify({ left1: "right1", left2: "wrong", left3: "wrong" });
    const result = scoreAnswer("matching", given, correct, 2);
    expect(result.pointsEarned).toBe(0);
  });
});

describe("scoreAnswer – ordering", () => {
  const correct = JSON.stringify(["step1", "step2", "step3", "step4"]);

  it("correct order earns full credit", () => {
    const given = JSON.stringify(["step1", "step2", "step3", "step4"]);
    expect(scoreAnswer("ordering", given, correct, 1)).toEqual({ isCorrect: true, pointsEarned: 1 });
  });

  it("wrong order earns 0", () => {
    const given = JSON.stringify(["step2", "step1", "step3", "step4"]);
    expect(scoreAnswer("ordering", given, correct, 1)).toEqual({ isCorrect: false, pointsEarned: 0 });
  });

  it("handles case-insensitive IDs", () => {
    const given = JSON.stringify(["STEP1", "STEP2", "STEP3", "STEP4"]);
    expect(scoreAnswer("ordering", given, correct, 1)).toEqual({ isCorrect: true, pointsEarned: 1 });
  });
});

describe("scoreAnswer – pattern_interaction", () => {
  const correct = JSON.stringify({ blank1: "16", blank2: "25", blank3: "36" });

  it("all blanks correct earns full credit", () => {
    const given = JSON.stringify({ blank1: "16", blank2: "25", blank3: "36" });
    expect(scoreAnswer("pattern_interaction", given, correct, 2)).toEqual({ isCorrect: true, pointsEarned: 2 });
  });

  it("partial blanks correct earns 1 point", () => {
    const given = JSON.stringify({ blank1: "16", blank2: "25", blank3: "wrong" });
    const result = scoreAnswer("pattern_interaction", given, correct, 2);
    expect(result.pointsEarned).toBe(1);
  });

  it("no blanks correct earns 0", () => {
    const given = JSON.stringify({ blank1: "wrong", blank2: "wrong", blank3: "wrong" });
    expect(scoreAnswer("pattern_interaction", given, correct, 2)).toEqual({ isCorrect: false, pointsEarned: 0 });
  });
});

describe("scoreAnswer – psi_lab", () => {
  const correct = JSON.stringify({ task1: "increases", task2: "decreases" });

  it("all tasks correct earns 2 points", () => {
    const given = JSON.stringify({ task1: "increases", task2: "decreases" });
    expect(scoreAnswer("psi_lab", given, correct, 2)).toEqual({ isCorrect: true, pointsEarned: 2 });
  });

  it("half tasks correct earns 1 point", () => {
    const given = JSON.stringify({ task1: "increases", task2: "wrong" });
    const result = scoreAnswer("psi_lab", given, correct, 2);
    expect(result.pointsEarned).toBe(1);
  });

  it("no tasks correct earns 0", () => {
    const given = JSON.stringify({ task1: "wrong", task2: "wrong" });
    expect(scoreAnswer("psi_lab", given, correct, 2)).toEqual({ isCorrect: false, pointsEarned: 0 });
  });
});

describe("scoreAnswer – drawing_canvas", () => {
  it("always returns 0 pending teacher review", () => {
    expect(scoreAnswer("drawing_canvas", "data:image/png;base64,abc123", "", 2)).toEqual({
      isCorrect: false,
      pointsEarned: 0,
    });
  });
});

describe("scoreAnswer – partial_credit_short_answer", () => {
  it("exact match earns full credit", () => {
    expect(scoreAnswer("partial_credit_short_answer", "photosynthesis", "photosynthesis", 2)).toEqual({
      isCorrect: true,
      pointsEarned: 2,
    });
  });

  it("partial keyword match earns 1 point", () => {
    // "photosynthesis converts light" — student says "photosynthesis converts"
    const result = scoreAnswer(
      "partial_credit_short_answer",
      "photosynthesis converts",
      "photosynthesis converts light energy",
      2
    );
    expect(result.pointsEarned).toBe(1);
  });

  it("no match earns 0", () => {
    const result = scoreAnswer("partial_credit_short_answer", "wrong answer", "photosynthesis converts light energy", 2);
    expect(result.pointsEarned).toBe(0);
  });
});
