import { Router, Request, Response } from "express";
import { getReportByAttemptId, getReportsByClass } from "./db";
import PDFDocument from "pdfkit";

type ReportData = {
  studentName: string;
  studentCode?: string;
  className: string;
  examName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  mathScore: number;
  mathTotal: number;
  scienceScore: number;
  scienceTotal: number;
  contentDomainBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  cognitiveDomainBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  strengths: string[];
  weaknesses: string[];
  misconceptionNotes: string[];
  recommendedInterventionGroup: string;
  nextPracticeTargets: string[];
  timeSpentSeconds: number;
  submittedAt?: Date | string;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} min ${s} sec`;
}

// ─── PDFKit helpers ───────────────────────────────────────────────────────────

const NAVY = "#1e3a5f";
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#dc2626";
const AMBER = "#d97706";
const GRAY = "#6b7280";
const LIGHT = "#f9fafb";
const WHITE = "#ffffff";
const TEXT = "#111827";
const BORDER = "#e5e7eb";

function interventionColor(group: string): string {
  if (group?.includes("Advanced")) return GREEN;
  if (group?.includes("Consolidation")) return BLUE;
  if (group?.includes("Targeted")) return AMBER;
  return RED;
}

/** Stream a PDFDocument to a Buffer */
function pdfToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

/** Draw a filled rectangle */
function rect(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, color: string) {
  doc.save().rect(x, y, w, h).fill(color).restore();
}

/** Draw a horizontal rule */
function hr(doc: PDFKit.PDFDocument, y: number) {
  doc.save().moveTo(40, y).lineTo(555, y).strokeColor(BORDER).lineWidth(0.5).stroke().restore();
}

/** Draw a section heading */
function sectionHeading(doc: PDFKit.PDFDocument, text: string, y: number): number {
  rect(doc, 40, y, 515, 18, NAVY);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(WHITE).text(text.toUpperCase(), 46, y + 5, { width: 503 });
  return y + 22;
}

/** Wrap text and return the new Y position */
function wrappedText(doc: PDFKit.PDFDocument, text: string, x: number, y: number, width: number, opts?: object): number {
  const before = doc.y;
  doc.text(text, x, y, { width, ...opts });
  return doc.y;
}

async function generateStudentPDF(data: ReportData): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 40, bufferPages: true });

  const PAGE_W = 515; // 595 - 2*40
  const L = 40;       // left margin

  // ── Header ──────────────────────────────────────────────────────────────────
  rect(doc, 0, 0, 595, 70, NAVY);
  rect(doc, L, 14, 42, 42, BLUE);
  doc.font("Helvetica-Bold").fontSize(16).fillColor(WHITE).text("G8", L + 8, 22);
  doc.font("Helvetica-Bold").fontSize(13).fillColor(WHITE).text("Grade 8 Assessment — Student Performance Report", 92, 18);
  doc.font("Helvetica").fontSize(8).fillColor("rgba(255,255,255,0.7)").text(
    "TIMSS-Style Mock Assessment Platform  ·  Confidential  ·  For Teacher and Administrator Use Only",
    92, 36
  );

  let y = 82;

  // ── Student Info cards ───────────────────────────────────────────────────────
  const cardW = 122;
  const cards = [
    { label: "Student Name", value: data.studentName },
    { label: "Student ID", value: data.studentCode ?? "—" },
    { label: "Class", value: data.className },
    { label: "Exam", value: data.examName },
  ];
  cards.forEach((c, i) => {
    const cx = L + i * (cardW + 5);
    rect(doc, cx, y, cardW, 38, LIGHT);
    doc.save().rect(cx, y, cardW, 38).strokeColor(BORDER).lineWidth(0.5).stroke().restore();
    doc.font("Helvetica").fontSize(7).fillColor(GRAY).text(c.label.toUpperCase(), cx + 6, y + 5, { width: cardW - 12 });
    doc.font("Helvetica-Bold").fontSize(9).fillColor(TEXT).text(c.value, cx + 6, y + 16, { width: cardW - 12, lineBreak: false });
  });
  y += 48;

  // ── Score Summary ────────────────────────────────────────────────────────────
  y = sectionHeading(doc, "Score Summary", y);

  const mathPct = data.mathTotal > 0 ? Math.round((data.mathScore / data.mathTotal) * 100) : data.mathScore ?? 0;
  const sciPct = data.scienceTotal > 0 ? Math.round((data.scienceScore / data.scienceTotal) * 100) : data.scienceScore ?? 0;

  const scoreCards = [
    { label: "Overall %", value: `${data.percentage ?? 0}%`, color: BLUE },
    { label: "Total Score", value: `${data.totalScore ?? 0}/${data.maxScore ?? 0}`, color: NAVY },
    { label: "Math Score", value: `${mathPct}%`, color: "#4338ca" },
    { label: "Science Score", value: `${sciPct}%`, color: "#059669" },
  ];
  const scW = 124;
  scoreCards.forEach((sc, i) => {
    const cx = L + i * (scW + 5);
    rect(doc, cx, y, scW, 44, LIGHT);
    doc.save().rect(cx, y, scW, 44).strokeColor(BORDER).lineWidth(0.5).stroke().restore();
    doc.font("Helvetica-Bold").fontSize(20).fillColor(sc.color).text(sc.value, cx + 6, y + 6, { width: scW - 12, align: "center" });
    doc.font("Helvetica").fontSize(7.5).fillColor(GRAY).text(sc.label, cx + 6, y + 30, { width: scW - 12, align: "center" });
  });
  y += 54;

  // Time spent
  rect(doc, L, y, PAGE_W, 20, LIGHT);
  doc.save().rect(L, y, PAGE_W, 20).strokeColor(BORDER).lineWidth(0.5).stroke().restore();
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor(TEXT).text("Time Spent: ", L + 8, y + 6, { continued: true });
  doc.font("Helvetica").text(formatTime(data.timeSpentSeconds ?? 0));
  y += 28;

  // ── Content Domain Breakdown ─────────────────────────────────────────────────
  y = sectionHeading(doc, "Content Domain Breakdown", y);

  // Table header
  rect(doc, L, y, PAGE_W, 16, NAVY);
  doc.font("Helvetica-Bold").fontSize(7.5).fillColor(WHITE);
  doc.text("Domain", L + 6, y + 4, { width: 220 });
  doc.text("Score", L + 232, y + 4, { width: 60, align: "center" });
  doc.text("Performance", L + 298, y + 4, { width: 217 });
  y += 16;

  const domainEntries = Object.entries(data.contentDomainBreakdown ?? {});
  if (domainEntries.length === 0) {
    doc.font("Helvetica").fontSize(8).fillColor(GRAY).text("No domain data available", L + 6, y + 4);
    y += 20;
  } else {
    domainEntries.forEach(([domain, d], i) => {
      const rowBg = i % 2 === 0 ? WHITE : LIGHT;
      rect(doc, L, y, PAGE_W, 16, rowBg);
      doc.save().rect(L, y, PAGE_W, 16).strokeColor(BORDER).lineWidth(0.3).stroke().restore();
      doc.font("Helvetica").fontSize(8).fillColor(TEXT).text(domain, L + 6, y + 4, { width: 220 });
      doc.font("Helvetica-Bold").fontSize(8).fillColor(NAVY).text(`${d.correct}/${d.total}`, L + 232, y + 4, { width: 60, align: "center" });
      // Progress bar
      const barX = L + 298;
      const barW = 140;
      const barH = 7;
      const barY = y + 5;
      rect(doc, barX, barY, barW, barH, BORDER);
      rect(doc, barX, barY, Math.round(barW * (d.percentage / 100)), barH, BLUE);
      doc.font("Helvetica").fontSize(7.5).fillColor(GRAY).text(`${d.percentage}%`, barX + barW + 6, y + 4);
      y += 16;
    });
  }
  y += 6;

  // ── Cognitive Domain Breakdown ───────────────────────────────────────────────
  y = sectionHeading(doc, "Cognitive Domain Breakdown", y);

  rect(doc, L, y, PAGE_W, 16, NAVY);
  doc.font("Helvetica-Bold").fontSize(7.5).fillColor(WHITE);
  doc.text("Cognitive Level", L + 6, y + 4, { width: 220 });
  doc.text("Score", L + 232, y + 4, { width: 80, align: "center" });
  doc.text("Percentage", L + 318, y + 4, { width: 197, align: "center" });
  y += 16;

  const cogEntries = Object.entries(data.cognitiveDomainBreakdown ?? {});
  if (cogEntries.length === 0) {
    doc.font("Helvetica").fontSize(8).fillColor(GRAY).text("No cognitive data available", L + 6, y + 4);
    y += 20;
  } else {
    cogEntries.forEach(([domain, d], i) => {
      const rowBg = i % 2 === 0 ? WHITE : LIGHT;
      rect(doc, L, y, PAGE_W, 16, rowBg);
      doc.save().rect(L, y, PAGE_W, 16).strokeColor(BORDER).lineWidth(0.3).stroke().restore();
      doc.font("Helvetica").fontSize(8).fillColor(TEXT).text(domain, L + 6, y + 4, { width: 220 });
      doc.font("Helvetica-Bold").fontSize(8).fillColor(NAVY).text(`${d.correct}/${d.total}`, L + 232, y + 4, { width: 80, align: "center" });
      doc.font("Helvetica-Bold").fontSize(8).fillColor(BLUE).text(`${d.percentage}%`, L + 318, y + 4, { width: 197, align: "center" });
      y += 16;
    });
  }
  y += 6;

  // ── Strengths & Weaknesses ───────────────────────────────────────────────────
  // Check if we need a new page
  if (y > 680) { doc.addPage(); y = 40; }

  const colW = 250;
  const swStartY = y;
  y = sectionHeading(doc, "Strengths", y);
  const strengthStartY = y;
  (data.strengths ?? []).forEach((s) => {
    if (y > 750) { doc.addPage(); y = 40; }
    doc.font("Helvetica-Bold").fontSize(8).fillColor(GREEN).text("✓", L + 4, y, { continued: true, width: 12 });
    doc.font("Helvetica").fontSize(8).fillColor(TEXT).text(` ${s}`, { width: colW - 20 });
    y = doc.y + 2;
  });
  if ((data.strengths ?? []).length === 0) {
    doc.font("Helvetica").fontSize(8).fillColor(GRAY).text("No strengths identified yet", L + 4, y);
    y = doc.y + 2;
  }
  const leftColEndY = y;

  // Weaknesses column (right side)
  let wy = swStartY;
  wy = sectionHeading(doc, "Areas to Improve", wy);
  // We need to draw weaknesses at the same vertical position but right column
  // Use absolute positioning
  const rightX = L + colW + 15;
  // Draw heading for right column
  rect(doc, rightX, swStartY, colW, 18, NAVY);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(WHITE).text("AREAS TO IMPROVE", rightX + 6, swStartY + 5, { width: colW - 12 });
  wy = swStartY + 22;
  (data.weaknesses ?? []).forEach((w) => {
    doc.font("Helvetica-Bold").fontSize(8).fillColor(RED).text("✗", rightX + 4, wy, { continued: true, width: 12 });
    doc.font("Helvetica").fontSize(8).fillColor(TEXT).text(` ${w}`, { width: colW - 20 });
    wy = doc.y + 2;
  });
  if ((data.weaknesses ?? []).length === 0) {
    doc.font("Helvetica").fontSize(8).fillColor(GRAY).text("No weaknesses identified", rightX + 4, wy);
    wy = doc.y + 2;
  }

  y = Math.max(leftColEndY, wy) + 6;

  // ── Misconception Notes ──────────────────────────────────────────────────────
  if (y > 700) { doc.addPage(); y = 40; }
  y = sectionHeading(doc, "Misconception Notes", y);
  (data.misconceptionNotes ?? []).forEach((m) => {
    if (y > 750) { doc.addPage(); y = 40; }
    doc.font("Helvetica-Bold").fontSize(8).fillColor(AMBER).text("•", L + 4, y, { continued: true, width: 12 });
    doc.font("Helvetica").fontSize(8).fillColor(TEXT).text(` ${m}`, { width: PAGE_W - 20 });
    y = doc.y + 2;
  });
  if ((data.misconceptionNotes ?? []).length === 0) {
    doc.font("Helvetica").fontSize(8).fillColor(GRAY).text("No misconceptions identified", L + 4, y);
    y = doc.y + 2;
  }
  y += 6;

  // ── Intervention Group ───────────────────────────────────────────────────────
  if (y > 720) { doc.addPage(); y = 40; }
  y = sectionHeading(doc, "Recommended Intervention Group", y);
  const iColor = interventionColor(data.recommendedInterventionGroup ?? "");
  rect(doc, L, y, PAGE_W, 24, `${iColor}18`);
  doc.save().rect(L, y, PAGE_W, 24).strokeColor(iColor).lineWidth(1).stroke().restore();
  doc.font("Helvetica-Bold").fontSize(10).fillColor(iColor).text(data.recommendedInterventionGroup ?? "N/A", L + 10, y + 7, { width: PAGE_W - 20 });
  y += 32;

  // ── Next Practice Targets ────────────────────────────────────────────────────
  if (y > 700) { doc.addPage(); y = 40; }
  y = sectionHeading(doc, "Next Practice Targets", y);
  (data.nextPracticeTargets ?? []).forEach((t) => {
    if (y > 750) { doc.addPage(); y = 40; }
    doc.font("Helvetica-Bold").fontSize(8).fillColor(BLUE).text("→", L + 4, y, { continued: true, width: 14 });
    doc.font("Helvetica").fontSize(8).fillColor(TEXT).text(` ${t}`, { width: PAGE_W - 20 });
    y = doc.y + 2;
  });
  if ((data.nextPracticeTargets ?? []).length === 0) {
    doc.font("Helvetica").fontSize(8).fillColor(GRAY).text("No targets specified", L + 4, y);
    y = doc.y + 2;
  }
  y += 10;

  // ── Footer ───────────────────────────────────────────────────────────────────
  hr(doc, y);
  doc.font("Helvetica").fontSize(7.5).fillColor(GRAY).text(
    `Generated by Grade 8 Mock Assessment Platform  ·  ${new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}  ·  Confidential — For Educational Use Only`,
    L, y + 6, { width: PAGE_W, align: "center" }
  );

  return pdfToBuffer(doc);
}

async function generateClassPDF(reports: { reportData: unknown }[]): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 30, bufferPages: true });

  const PAGE_W = 782; // 842 - 2*30
  const L = 30;

  const firstData = reports[0]?.reportData as unknown as ReportData;
  const className = firstData?.className ?? "Class";
  const examName = firstData?.examName ?? "";
  const avgPct = reports.length > 0
    ? Math.round(reports.reduce((sum, r) => sum + ((r.reportData as unknown as ReportData).percentage ?? 0), 0) / reports.length)
    : 0;

  // ── Header ──────────────────────────────────────────────────────────────────
  rect(doc, 0, 0, 842, 60, NAVY);
  doc.font("Helvetica-Bold").fontSize(14).fillColor(WHITE).text(`Class Report: ${className} — ${examName}`, L, 14);
  doc.font("Helvetica").fontSize(8).fillColor("rgba(255,255,255,0.7)").text(
    `Grade 8 Mock Assessment Platform  ·  Generated ${new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}`,
    L, 34
  );

  let y = 72;

  // ── Summary cards ────────────────────────────────────────────────────────────
  const sCards = [
    { label: "Total Students", value: String(reports.length) },
    { label: "Class Average", value: `${avgPct}%` },
  ];
  sCards.forEach((c, i) => {
    const cx = L + i * 130;
    rect(doc, cx, y, 120, 32, LIGHT);
    doc.save().rect(cx, y, 120, 32).strokeColor(BORDER).lineWidth(0.5).stroke().restore();
    doc.font("Helvetica").fontSize(7).fillColor(GRAY).text(c.label.toUpperCase(), cx + 6, y + 4, { width: 108 });
    doc.font("Helvetica-Bold").fontSize(14).fillColor(TEXT).text(c.value, cx + 6, y + 14, { width: 108 });
  });
  y += 42;

  // ── Table ────────────────────────────────────────────────────────────────────
  const cols = [
    { label: "Student ID", w: 70 },
    { label: "Student Name", w: 130 },
    { label: "Exam", w: 110 },
    { label: "Percentage", w: 70 },
    { label: "Total Score", w: 70 },
    { label: "Math %", w: 60 },
    { label: "Science %", w: 70 },
    { label: "Intervention Group", w: 162 },
  ];

  // Header row
  rect(doc, L, y, PAGE_W, 18, NAVY);
  let cx = L;
  cols.forEach((col) => {
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(WHITE).text(col.label.toUpperCase(), cx + 4, y + 5, { width: col.w - 8 });
    cx += col.w;
  });
  y += 18;

  reports.forEach((r, idx) => {
    const d = r.reportData as unknown as ReportData;
    const mathPct = d.mathTotal > 0 ? Math.round((d.mathScore / d.mathTotal) * 100) : d.mathScore ?? 0;
    const sciPct = d.scienceTotal > 0 ? Math.round((d.scienceScore / d.scienceTotal) * 100) : d.scienceScore ?? 0;
    const iColor = interventionColor(d.recommendedInterventionGroup ?? "");
    const rowBg = idx % 2 === 0 ? WHITE : LIGHT;

    if (y > 530) { doc.addPage(); y = 30; }

    rect(doc, L, y, PAGE_W, 18, rowBg);
    doc.save().rect(L, y, PAGE_W, 18).strokeColor(BORDER).lineWidth(0.3).stroke().restore();

    let colX = L;
    const rowData = [
      { text: (d as ReportData & { studentCode?: string }).studentCode ?? "—", color: GRAY, bold: false },
      { text: d.studentName, color: TEXT, bold: true },
      { text: d.examName, color: TEXT, bold: false },
      { text: `${d.percentage ?? 0}%`, color: d.percentage >= 70 ? GREEN : d.percentage >= 50 ? AMBER : RED, bold: true },
      { text: `${d.totalScore ?? 0}/${d.maxScore ?? 0}`, color: TEXT, bold: false },
      { text: `${mathPct}%`, color: TEXT, bold: false },
      { text: `${sciPct}%`, color: TEXT, bold: false },
      { text: d.recommendedInterventionGroup?.split(" – ")[0] ?? "", color: iColor, bold: true },
    ];

    rowData.forEach((cell, i) => {
      doc.font(cell.bold ? "Helvetica-Bold" : "Helvetica").fontSize(8).fillColor(cell.color)
        .text(cell.text, colX + 4, y + 5, { width: cols[i].w - 8, lineBreak: false });
      colX += cols[i].w;
    });
    y += 18;
  });

  y += 12;
  doc.save().moveTo(L, y).lineTo(L + PAGE_W, y).strokeColor(BORDER).lineWidth(0.5).stroke().restore();
  doc.font("Helvetica").fontSize(7.5).fillColor(GRAY).text(
    "Grade 8 Mock Assessment Platform  ·  Confidential  ·  For Teacher and Administrator Use Only",
    L, y + 6, { width: PAGE_W, align: "center" }
  );

  return pdfToBuffer(doc);
}

export function registerReportRoutes(app: import("express").Application): void {
  const router = Router();

  // Download individual student report by attemptId as PDF
  router.get("/attempt/:attemptId/pdf", async (req: Request, res: Response) => {
    try {
      const attemptId = Number(req.params.attemptId);
      const report = await getReportByAttemptId(attemptId);
      if (!report) { res.status(404).send("Report not found"); return; }
      const data = report.reportData as unknown as ReportData;
      const pdf = await generateStudentPDF(data);
      const filename = `report-${(data.studentName ?? "student").replace(/\s+/g, "-")}-${(data.examName ?? "exam").replace(/\s+/g, "-")}.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(pdf);
    } catch (e) {
      console.error("PDF generation error:", e);
      res.status(500).send("Error generating PDF report");
    }
  });

  // Download individual student report by attemptId as HTML (preview fallback)
  router.get("/attempt/:attemptId", async (req: Request, res: Response) => {
    try {
      const attemptId = Number(req.params.attemptId);
      const report = await getReportByAttemptId(attemptId);
      if (!report) { res.status(404).send("Report not found"); return; }
      const data = report.reportData as unknown as ReportData;
      // Redirect to PDF download
      res.redirect(`/api/reports/attempt/${attemptId}/pdf`);
    } catch (e) {
      res.status(500).send("Error generating report");
    }
  });

  // Download student report by studentId + classId as PDF
  router.get("/student/:studentId/:classId/pdf", async (req: Request, res: Response) => {
    try {
      const { studentId, classId } = req.params;
      const { getReportsByStudent } = await import("./db");
      const reports = await getReportsByStudent(Number(studentId));
      const classReport = reports.find((r) => r.classId === Number(classId));
      if (!classReport) { res.status(404).send("Report not found"); return; }
      const data = classReport.reportData as unknown as ReportData;
      const pdf = await generateStudentPDF(data);
      const filename = `report-${(data.studentName ?? "student").replace(/\s+/g, "-")}.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(pdf);
    } catch (e) {
      console.error("PDF generation error:", e);
      res.status(500).send("Error generating PDF report");
    }
  });

  // Download class report as PDF
  router.get("/class/:classId/pdf", async (req: Request, res: Response) => {
    try {
      const classId = Number(req.params.classId);
      const reports = await getReportsByClass(classId);
      if (!reports.length) { res.status(404).send("No reports found for this class"); return; }
      const pdf = await generateClassPDF(reports);
      const className = (reports[0]?.reportData as unknown as ReportData)?.className ?? "Class";
      const filename = `class-report-${className.replace(/\s+/g, "-")}.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(pdf);
    } catch (e) {
      console.error("PDF generation error:", e);
      res.status(500).send("Error generating class PDF report");
    }
  });

  app.use("/api/reports", router);
}
