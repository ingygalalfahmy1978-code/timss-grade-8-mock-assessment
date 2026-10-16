import { describe, expect, it } from "vitest";
import { isNumericAnswer, lastNumberIn, matchesNumericAnswer } from "./numericAnswer";

describe("numeric short answers", () => {
  it("recognises numeric expected answers", () => {
    expect(isNumericAnswer("48")).toBe(true);
    expect(isNumericAnswer("1,200")).toBe(true);
    expect(isNumericAnswer("-3.5")).toBe(true);
    expect(isNumericAnswer("photosynthesis")).toBe(false);
    expect(isNumericAnswer("x = 5")).toBe(false);
  });

  it("accepts units and working", () => {
    expect(matchesNumericAnswer("48", "48")).toBe(true);
    expect(matchesNumericAnswer("48 crayons", "48")).toBe(true);
    expect(matchesNumericAnswer("x = 6", "6")).toBe(true);
    expect(matchesNumericAnswer("3x = 18 so x = 6", "6")).toBe(true);
    expect(matchesNumericAnswer("30 cm2", "30")).toBe(true);
    expect(matchesNumericAnswer("2,000", "2000")).toBe(true);
    expect(matchesNumericAnswer("−7", "-7")).toBe(true);
  });

  it("rejects wrong or missing numbers", () => {
    expect(matchesNumericAnswer("47", "48")).toBe(false);
    expect(matchesNumericAnswer("I don't know", "48")).toBe(false);
    expect(matchesNumericAnswer("6", "60")).toBe(false);
  });

  it("returns null for text answers so text matching is used", () => {
    expect(matchesNumericAnswer("evaporation", "evaporation")).toBeNull();
  });

  it("finds the last number", () => {
    expect(lastNumberIn("6 × 8 = 48")).toBe(48);
    expect(lastNumberIn("none")).toBeNull();
  });
});
