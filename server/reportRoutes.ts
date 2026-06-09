import { Router, Request, Response } from "express";
import { getReportByAttemptId, getReportsByClass } from "./db";
import puppeteer from "puppeteer-core";

type ReportData = {
  studentName: string;
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

function generateReportHTML(data: ReportData, title: string): string {
  const mathPct = data.mathTotal > 0 ? Math.round((data.mathScore / data.mathTotal) * 100) : data.mathScore;
  const sciPct = data.scienceTotal > 0 ? Math.round((data.scienceScore / data.scienceTotal) * 100) : data.scienceScore;

  const domainRows = Object.entries(data.contentDomainBreakdown ?? {})
    .map(([domain, d]) => `
      <tr>
        <td style="padding:8px 14px;border-bottom:1px solid #e5e7eb;">${domain}</td>
        <td style="padding:8px 14px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:600;">${d.correct}/${d.total}</td>
        <td style="padding:8px 14px;border-bottom:1px solid #e5e7eb;text-align:center;">
          <div style="background:#e5e7eb;border-radius:4px;height:8px;width:120px;display:inline-block;vertical-align:middle;">
            <div style="background:#2563eb;height:8px;border-radius:4px;width:${d.percentage}%;"></div>
          </div>
          <span style="font-size:12px;color:#374151;margin-left:8px;">${d.percentage}%</span>
        </td>
      </tr>
    `).join("");

  const cogRows = Object.entries(data.cognitiveDomainBreakdown ?? {})
    .map(([domain, d]) => `
      <tr>
        <td style="padding:8px 14px;border-bottom:1px solid #e5e7eb;">${domain}</td>
        <td style="padding:8px 14px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:600;">${d.correct}/${d.total}</td>
        <td style="padding:8px 14px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:600;">${d.percentage}%</td>
      </tr>
    `).join("");

  const interventionColor =
    data.recommendedInterventionGroup?.includes("Advanced") ? "#16a34a" :
    data.recommendedInterventionGroup?.includes("Consolidation") ? "#2563eb" :
    data.recommendedInterventionGroup?.includes("Targeted") ? "#d97706" : "#dc2626";

  const submittedDate = data.submittedAt
    ? new Date(data.submittedAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
    : "N/A";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    @page { margin: 20mm 15mm; size: A4; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; background: #fff; font-size: 13px; line-height: 1.6; }
    .header { background: #1e3a5f; color: white; padding: 20px 28px; display: flex; align-items: center; gap: 16px; }
    .header-logo { width: 48px; height: 48px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; color: white; flex-shrink: 0; }
    .header-text h1 { font-size: 18px; font-weight: 700; }
    .header-text p { color: rgba(255,255,255,0.65); font-size: 11px; margin-top: 2px; }
    .content { padding: 20px 28px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .meta-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
    .meta-card .label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
    .meta-card .value { font-size: 14px; font-weight: 700; color: #111827; margin-top: 3px; }
    .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
    .score-card { border-radius: 8px; padding: 14px; text-align: center; border: 1px solid; }
    .score-card .score { font-size: 26px; font-weight: 800; }
    .score-card .label { font-size: 11px; font-weight: 600; margin-top: 2px; }
    .section { margin-bottom: 18px; }
    .section h2 { font-size: 13px; font-weight: 700; color: #1e3a5f; border-bottom: 2px solid #1e3a5f; padding-bottom: 5px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #1e3a5f; color: white; padding: 8px 14px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
    .list-item { padding: 3px 0; display: flex; align-items: flex-start; gap: 8px; font-size: 12px; }
    .badge { display: inline-block; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; text-align: center; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-logo">G8</div>
    <div class="header-text">
      <h1>Grade 8 Assessment — Student Performance Report</h1>
      <p>TIMSS-Style Mock Assessment Platform · Confidential · For Teacher and Administrator Use Only</p>
    </div>
  </div>

  <div class="content">
    <!-- Student Info -->
    <div class="meta-grid">
      <div class="meta-card">
        <div class="label">Student Name</div>
        <div class="value">${data.studentName}</div>
      </div>
      <div class="meta-card">
        <div class="label">Class</div>
        <div class="value">${data.className}</div>
      </div>
      <div class="meta-card">
        <div class="label">Exam Name</div>
        <div class="value">${data.examName}</div>
      </div>
      <div class="meta-card">
        <div class="label">Submitted</div>
        <div class="value" style="font-size:12px;">${submittedDate}</div>
      </div>
    </div>

    <!-- Score Summary -->
    <div class="section">
      <h2>Score Summary</h2>
      <div class="score-grid">
        <div class="score-card" style="background:#eff6ff;border-color:#bfdbfe;">
          <div class="score" style="color:#1d4ed8;">${data.percentage}%</div>
          <div class="label" style="color:#3b82f6;">Percentage</div>
        </div>
        <div class="score-card" style="background:#f9fafb;border-color:#e5e7eb;">
          <div class="score" style="color:#111827;">${data.totalScore}/${data.maxScore}</div>
          <div class="label" style="color:#6b7280;">Total Score</div>
        </div>
        <div class="score-card" style="background:#eef2ff;border-color:#c7d2fe;">
          <div class="score" style="color:#4338ca;">${mathPct}%</div>
          <div class="label" style="color:#6366f1;">Math Score</div>
        </div>
        <div class="score-card" style="background:#ecfdf5;border-color:#a7f3d0;">
          <div class="score" style="color:#059669;">${sciPct}%</div>
          <div class="label" style="color:#10b981;">Science Score</div>
        </div>
      </div>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:10px 14px;font-size:12px;color:#374151;">
        <strong>Time Spent:</strong> ${formatTime(data.timeSpentSeconds ?? 0)}
      </div>
    </div>

    <!-- Content Domain Breakdown -->
    <div class="section">
      <h2>Content Domain Breakdown</h2>
      <table>
        <thead><tr><th>Domain</th><th style="text-align:center;">Score</th><th>Performance Bar</th></tr></thead>
        <tbody>${domainRows || '<tr><td colspan="3" style="padding:8px 14px;color:#9ca3af;">No domain data available</td></tr>'}</tbody>
      </table>
    </div>

    <!-- Cognitive Domain Breakdown -->
    <div class="section">
      <h2>Cognitive Domain Breakdown</h2>
      <table>
        <thead><tr><th>Cognitive Level</th><th style="text-align:center;">Score</th><th style="text-align:center;">Percentage</th></tr></thead>
        <tbody>${cogRows || '<tr><td colspan="3" style="padding:8px 14px;color:#9ca3af;">No cognitive data available</td></tr>'}</tbody>
      </table>
    </div>

    <!-- Strengths & Weaknesses -->
    <div class="two-col">
      <div class="section" style="margin-bottom:0;">
        <h2>Strengths</h2>
        ${(data.strengths ?? []).map((s) => `<div class="list-item"><span style="color:#16a34a;font-weight:700;flex-shrink:0;">✓</span><span>${s}</span></div>`).join("") || '<div class="list-item" style="color:#9ca3af;">No strengths identified yet</div>'}
      </div>
      <div class="section" style="margin-bottom:0;">
        <h2>Weaknesses</h2>
        ${(data.weaknesses ?? []).map((w) => `<div class="list-item"><span style="color:#dc2626;font-weight:700;flex-shrink:0;">✗</span><span>${w}</span></div>`).join("") || '<div class="list-item" style="color:#9ca3af;">No weaknesses identified</div>'}
      </div>
    </div>

    <!-- Misconception Notes -->
    <div class="section">
      <h2>Misconception Notes</h2>
      ${(data.misconceptionNotes ?? []).map((m) => `<div class="list-item"><span style="color:#d97706;font-weight:700;flex-shrink:0;">•</span><span>${m}</span></div>`).join("") || '<div class="list-item" style="color:#9ca3af;">No misconceptions identified</div>'}
    </div>

    <!-- Intervention Group -->
    <div class="section">
      <h2>Recommended Intervention Group</h2>
      <span class="badge" style="background:${interventionColor}18;color:${interventionColor};border:1.5px solid ${interventionColor}50;">
        ${data.recommendedInterventionGroup}
      </span>
    </div>

    <!-- Next Practice Targets -->
    <div class="section">
      <h2>Next Practice Targets</h2>
      ${(data.nextPracticeTargets ?? []).map((t) => `<div class="list-item"><span style="color:#2563eb;font-weight:700;flex-shrink:0;">→</span><span>${t}</span></div>`).join("") || '<div class="list-item" style="color:#9ca3af;">No targets specified</div>'}
    </div>

    <div class="footer">
      Generated by Grade 8 Mock Assessment Platform &nbsp;·&nbsp; ${new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })} &nbsp;·&nbsp; This report is confidential and intended for educational use only.
    </div>
  </div>
</body>
</html>`;
}

async function generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    headless: true,
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
      printBackground: true,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
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
      const html = generateReportHTML(data, `Report - ${data.studentName}`);
      const pdf = await generatePDF(html);
      const filename = `report-${data.studentName.replace(/\s+/g, "-")}-${data.examName.replace(/\s+/g, "-")}.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(pdf);
    } catch (e) {
      console.error("PDF generation error:", e);
      res.status(500).send("Error generating PDF report");
    }
  });

  // Download individual student report by attemptId as HTML (fallback)
  router.get("/attempt/:attemptId", async (req: Request, res: Response) => {
    try {
      const attemptId = Number(req.params.attemptId);
      const report = await getReportByAttemptId(attemptId);
      if (!report) { res.status(404).send("Report not found"); return; }
      const data = report.reportData as unknown as ReportData;
      const html = generateReportHTML(data, `Report - ${data.studentName}`);
      res.setHeader("Content-Type", "text/html");
      res.send(html);
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
      const html = generateReportHTML(data, `Report - ${data.studentName}`);
      const pdf = await generatePDF(html);
      const filename = `report-${data.studentName.replace(/\s+/g, "-")}.pdf`;
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

      const rows = reports.map((r) => {
        const d = r.reportData as unknown as ReportData;
        const mathPct = d.mathTotal > 0 ? Math.round((d.mathScore / d.mathTotal) * 100) : d.mathScore;
        const sciPct = d.scienceTotal > 0 ? Math.round((d.scienceScore / d.scienceTotal) * 100) : d.scienceScore;
        const groupColor =
          d.recommendedInterventionGroup?.includes("Advanced") ? "#16a34a" :
          d.recommendedInterventionGroup?.includes("Consolidation") ? "#2563eb" :
          d.recommendedInterventionGroup?.includes("Targeted") ? "#d97706" : "#dc2626";
        return `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;">${d.studentName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${d.examName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:700;color:#1d4ed8;">${d.percentage}%</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.totalScore}/${d.maxScore}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${mathPct}%</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${sciPct}%</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;"><span style="background:${groupColor}18;color:${groupColor};border:1px solid ${groupColor}40;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">${d.recommendedInterventionGroup?.split(" – ")[0] ?? ""}</span></td>
        </tr>`;
      }).join("");

      const className = (reports[0]?.reportData as unknown as ReportData)?.className ?? "Class";
      const examName = (reports[0]?.reportData as unknown as ReportData)?.examName ?? "";

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Class Report - ${className}</title>
  <style>
    @page { margin: 15mm; size: A4 landscape; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; font-size: 12px; }
    .header { background: #1e3a5f; color: white; padding: 16px 20px; margin-bottom: 20px; border-radius: 8px; }
    .header h1 { font-size: 16px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.65); font-size: 11px; margin-top: 3px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1e3a5f; color: white; padding: 9px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 20px; font-size: 10px; color: #9ca3af; text-align: center; }
    .summary { display: flex; gap: 16px; margin-bottom: 16px; }
    .summary-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 14px; }
    .summary-card .label { font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600; }
    .summary-card .value { font-size: 18px; font-weight: 700; color: #111827; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Class Report: ${className} — ${examName}</h1>
    <p>Grade 8 Mock Assessment Platform · Generated ${new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>
  <div class="summary">
    <div class="summary-card"><div class="label">Total Students</div><div class="value">${reports.length}</div></div>
    <div class="summary-card"><div class="label">Class Average</div><div class="value">${Math.round(reports.reduce((sum, r) => sum + ((r.reportData as unknown as ReportData).percentage ?? 0), 0) / reports.length)}%</div></div>
  </div>
  <table>
    <thead><tr><th>Student Name</th><th>Exam</th><th style="text-align:center;">Percentage</th><th style="text-align:center;">Total Score</th><th style="text-align:center;">Math Score</th><th style="text-align:center;">Science Score</th><th>Intervention Group</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Grade 8 Mock Assessment Platform · Confidential · For Teacher and Administrator Use Only</div>
</body>
</html>`;

      const pdf = await generatePDF(html);
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
