// Marks short answers whose expected answer is a plain number.
// Students often add units or working ("48 crayons", "x = 6", "3x = 18 so x = 6"),
// so we compare the LAST number they wrote with the expected value.

const NUMBER_ONLY = /^-?\d{1,3}(,\d{3})*(\.\d+)?$|^-?\d+(\.\d+)?$/;

export function isNumericAnswer(expected: string): boolean {
  return NUMBER_ONLY.test(expected.trim());
}

export function lastNumberIn(text: string): number | null {
  const cleaned = text
    .replace(/[−–—]/g, "-") // unicode minus / dashes
    .replace(/([a-z])[23]\b/gi, "$1") // "cm2", "m3" are units, not answers
    .replace(/(\d),(?=\d{3}\b)/g, "$1"); // thousands separators
  const matches = cleaned.match(/-?\d+(\.\d+)?/g);
  if (!matches) return null;
  const n = Number(matches[matches.length - 1]);
  return Number.isFinite(n) ? n : null;
}

/** Returns null when the expected answer is not numeric (use text matching instead). */
export function matchesNumericAnswer(given: string, expected: string): boolean | null {
  if (!isNumericAnswer(expected)) return null;
  const want = Number(expected.trim().replace(/,/g, ""));
  const got = lastNumberIn(given);
  if (got === null) return false;
  return Math.abs(got - want) < 1e-9;
}
