import { describe, expect, it } from "vitest";
import { buildCsvContent, safeFilePart } from "../client/src/lib/excelExport";

describe("Excel CSV export", () => {
  it("adds a UTF-8 marker and safely escapes spreadsheet cells", () => {
    const csv = buildCsvContent(
      ["American School, Nad Al Sheba"],
      ["Student", "Notes"],
      [["Maha \"M\"", "Line one\nLine two"]]
    );

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain('"American School, Nad Al Sheba"');
    expect(csv).toContain('"Maha ""M"""');
    expect(csv).toContain('"Line one\nLine two"');
  });

  it("uses CRLF-separated rows for Excel-compatible downloads", () => {
    const csv = buildCsvContent(["Title"], ["Student", "Percent"], [["Aisha", 85]]);
    expect(csv).toBe("\uFEFFTitle\r\n\r\nStudent,Percent\r\nAisha,85");
  });

  it("creates safe filenames from class and exam labels", () => {
    expect(safeFilePart("Class 4A / Term 1")).toBe("Class-4A-Term-1");
    expect(safeFilePart("  Mock Exam  ")).toBe("Mock-Exam");
  });
});
