// Builds Excel-ready CSV files in the browser and downloads them.
// Excel opens .csv directly; the byte-order mark keeps Arabic names and symbols intact.

import { SCHOOL_CAMPUS, SCHOOL_NAME } from "@shared/brand";

type Cell = string | number | null | undefined;

function cell(v: Cell): string {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Builds the exact UTF-8 CSV payload downloaded by the browser. */
export function buildCsvContent(title: string[], header: string[], rows: Cell[][]): string {
  const lines = [
    ...title.map((t) => cell(t)),
    "",
    header.map(cell).join(","),
    ...rows.map((r) => r.map(cell).join(",")),
  ];
  return "﻿" + lines.join("\r\n");
}

export function downloadCsv(filename: string, title: string[], header: string[], rows: Cell[][]) {
  const blob = new Blob([buildCsvContent(title, header, rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const safeFilePart = (s: string) => s.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Breakdown = Record<string, { correct: number; total: number; percentage: number }>;

export type ClassExport = {
  className: string;
  classGrade: string;
  teacherName: string;
  rows: Array<{
    studentName: string; studentCode: string; examName: string; grade: number;
    submittedAt: string | Date | null; timeSpentSeconds: number;
    totalScore: number; totalMaxPoints: number; percentage: number;
    mathScore: number; mathMaxPoints: number; scienceScore: number; scienceMaxPoints: number;
    contentDomains: Breakdown; cognitiveDomains: Breakdown;
    interventionGroup: string; strengths: string[]; weaknesses: string[]; resultsPublished: boolean;
  }>;
  questions: Array<{ id: number; questionText: string; subject: string; contentDomain: string; cognitiveDomain: string; difficulty: string; answered: number; correct: number; points: number; maxPoints: number }>;
  notSubmitted: Array<{ name: string; username: string }>;
};

const pctOf = (a: number, b: number) => (b ? Math.round((100 * a) / b) : "");
const today = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function titleLines(data: ClassExport, examLabel: string, what: string) {
  return [
    `${SCHOOL_NAME}, ${SCHOOL_CAMPUS} - TIMSS Mock Assessment`,
    `${what}: ${data.className} (${data.classGrade})${data.teacherName ? ` - Teacher: ${data.teacherName}` : ""} - ${examLabel} - Exported ${today()}`,
  ];
}

export function exportClassResults(data: ClassExport, examLabel: string) {
  const domains = Array.from(new Set(data.rows.flatMap((r) => Object.keys(r.contentDomains ?? {}))));
  const levels = ["Knowing", "Applying", "Reasoning"].filter((l) => data.rows.some((r) => r.cognitiveDomains?.[l]));
  const header = [
    "Student", "Student ID", "Exam", "Grade", "Submitted", "Time (min)",
    "Score", "Max points", "Percent", "Maths score", "Maths %", "Science score", "Science %",
    ...domains.map((d) => `${d} %`), ...levels.map((l) => `${l} %`),
    "Support group", "Strengths", "Areas to improve", "Results shown to student",
  ];
  const rows = [...data.rows]
    .sort((a, b) => a.studentName.localeCompare(b.studentName) || a.examName.localeCompare(b.examName))
    .map((r) => [
      r.studentName, r.studentCode, r.examName, r.grade,
      r.submittedAt ? new Date(r.submittedAt).toLocaleString("en-GB") : "",
      Math.round((r.timeSpentSeconds ?? 0) / 60),
      r.totalScore, r.totalMaxPoints, r.percentage,
      r.mathScore, pctOf(r.mathScore, r.mathMaxPoints), r.scienceScore, pctOf(r.scienceScore, r.scienceMaxPoints),
      ...domains.map((d) => r.contentDomains?.[d]?.percentage ?? ""),
      ...levels.map((l) => r.cognitiveDomains?.[l]?.percentage ?? ""),
      r.interventionGroup, r.strengths.join("; "), r.weaknesses.join("; "), r.resultsPublished ? "Yes" : "No",
    ]);
  // Class average row
  if (rows.length) {
    const avg = (f: (r: ClassExport["rows"][number]) => number | undefined) => {
      const vals = data.rows.map(f).filter((v): v is number => typeof v === "number");
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : "";
    };
    rows.push([]);
    rows.push([
      "Class average", "", "", "", "", avg((r) => (r.timeSpentSeconds ?? 0) / 60),
      "", "", avg((r) => r.percentage), "", avg((r) => (r.mathMaxPoints ? (100 * r.mathScore) / r.mathMaxPoints : undefined)),
      "", avg((r) => (r.scienceMaxPoints ? (100 * r.scienceScore) / r.scienceMaxPoints : undefined)),
      ...domains.map((d) => avg((r) => r.contentDomains?.[d]?.percentage)),
      ...levels.map((l) => avg((r) => r.cognitiveDomains?.[l]?.percentage)),
    ]);
  }
  if (data.notSubmitted.length) {
    rows.push([]);
    rows.push(["Not submitted yet"]);
    data.notSubmitted.forEach((s) => rows.push([s.name, s.username]));
  }
  downloadCsv(`TIMSS-results-${safeFilePart(data.className)}-${safeFilePart(examLabel)}.csv`, titleLines(data, examLabel, "Class results"), header, rows);
}

export function exportQuestionAnalysis(data: ClassExport, examLabel: string) {
  const header = ["Question", "Subject", "Content domain", "Thinking level", "Difficulty", "Students who answered", "Correct", "Percent correct", "Points earned", "Points possible"];
  const rows = [...data.questions]
    .sort((a, b) => (a.answered ? a.correct / a.answered : 1) - (b.answered ? b.correct / b.answered : 1))
    .map((q) => [q.questionText, q.subject, q.contentDomain, q.cognitiveDomain, q.difficulty, q.answered, q.correct, pctOf(q.correct, q.answered), q.points, q.maxPoints]);
  downloadCsv(`TIMSS-question-analysis-${safeFilePart(data.className)}-${safeFilePart(examLabel)}.csv`, titleLines(data, examLabel, "Question analysis (hardest first)"), header, rows);
}
