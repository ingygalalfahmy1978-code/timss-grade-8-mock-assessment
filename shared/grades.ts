// ─── TIMSS grade levels ───────────────────────────────────────────────────────
// TIMSS assesses two grades. Everything that differs between them (content
// domains, session timing) lives here so the client and server agree.

export const GRADES = [4, 8] as const;
export type Grade = (typeof GRADES)[number];

export const GRADE_LABEL: Record<Grade, string> = {
  4: "Grade 4",
  8: "Grade 8",
};

/** TIMSS content domains per grade and subject. */
export const CONTENT_DOMAINS: Record<Grade, { Math: string[]; Science: string[] }> = {
  4: {
    Math: ["Number", "Measurement and Geometry", "Data"],
    Science: ["Life Science", "Physical Science", "Earth Science"],
  },
  8: {
    Math: ["Number", "Algebra", "Geometry", "Data and Probability"],
    Science: ["Biology", "Chemistry", "Physics", "Earth Science"],
  },
};

/** Every value allowed in questions.science_sub_domain. */
export const SCIENCE_SUB_DOMAINS = [
  "Earth Science",
  "Biology",
  "Chemistry",
  "Physics",
  "Life Science",
  "Physical Science",
] as const;
export type ScienceSubDomain = (typeof SCIENCE_SUB_DOMAINS)[number];

/**
 * Default session timing. TIMSS Grade 4 uses two 36-minute parts;
 * Grade 8 uses two 45-minute parts.
 */
export const GRADE_TIMING: Record<Grade, { session1Minutes: number; breakMinutes: number; session2Minutes: number }> = {
  4: { session1Minutes: 36, breakMinutes: 5, session2Minutes: 36 },
  8: { session1Minutes: 45, breakMinutes: 5, session2Minutes: 45 },
};

export function defaultDuration(grade: Grade): number {
  const t = GRADE_TIMING[grade];
  return t.session1Minutes + t.session2Minutes;
}

/**
 * Reads a grade from a number or a class label such as "Grade 4", "4A" or "G8".
 * Returns null when no supported grade is found.
 */
export function parseGrade(value: string | number | null | undefined): Grade | null {
  if (value == null) return null;
  const match = String(value).match(/\d+/);
  if (!match) return null;
  const n = Number(match[0]);
  return (GRADES as readonly number[]).includes(n) ? (n as Grade) : null;
}
