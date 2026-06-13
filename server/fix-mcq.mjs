/**
 * fix-mcq.mjs
 * Converts all malformed multiple_choice questions to the correct format:
 *   options: [{id:"A",text:"..."}, {id:"B",text:"..."}, ...]
 *   correct_answer: "A" | "B" | "C" | "D"
 *
 * Handles two malformed formats:
 *   1. options is a plain string array ["A. text","B. text",...] and correct_answer is a letter "A"
 *      → strip the "A. " prefix, keep the letter
 *   2. options is a plain string array ["text1","text2",...] and correct_answer is a numeric index "0","1","2","3"
 *      → convert index to letter, wrap texts in {id,text}
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await conn.query(
  "SELECT id, options, correct_answer FROM questions WHERE question_type = 'multiple_choice'"
);

const letters = ["A", "B", "C", "D", "E"];
let fixed = 0;
let skipped = 0;

for (const row of rows) {
  let opts;
  try {
    opts = typeof row.options === "string" ? JSON.parse(row.options) : row.options;
  } catch {
    console.log(`Q${row.id}: cannot parse options, skipping`);
    skipped++;
    continue;
  }

  if (!Array.isArray(opts) || opts.length === 0) {
    skipped++;
    continue;
  }

  // Already correct format: [{id:"A",text:"..."}]
  if (typeof opts[0] === "object" && opts[0] !== null && "id" in opts[0] && "text" in opts[0]) {
    // Verify correctAnswer is a valid letter id
    const ids = opts.map((o) => o.id);
    if (ids.includes(row.correct_answer)) {
      skipped++;
      continue; // already good
    }
    // correctAnswer might be a numeric index into the ids array
    const idx = parseInt(row.correct_answer, 10);
    if (!isNaN(idx) && idx >= 0 && idx < ids.length) {
      const newCorrect = ids[idx];
      await conn.query("UPDATE questions SET correct_answer = ? WHERE id = ?", [newCorrect, row.id]);
      console.log(`Q${row.id}: fixed correct_answer index ${idx} → ${newCorrect}`);
      fixed++;
    } else {
      console.log(`Q${row.id}: unknown correct_answer "${row.correct_answer}", ids=${JSON.stringify(ids)}`);
      skipped++;
    }
    continue;
  }

  // Plain string array
  if (typeof opts[0] === "string") {
    // Detect format: "A. text" or "A) text" prefix
    const prefixMatch = opts[0].match(/^([A-D])[.)]\s*/);

    let newOpts;
    let newCorrect;

    if (prefixMatch) {
      // Format: ["A. text", "B. text", ...]  correct_answer is already a letter
      newOpts = opts.map((o, i) => {
        const stripped = o.replace(/^[A-D][.)]\s*/, "");
        return { id: letters[i], text: stripped };
      });
      // correct_answer should already be a letter; if it's a full "A. text" extract the letter
      newCorrect = (row.correct_answer || "").trim().toUpperCase().charAt(0);
      if (!letters.includes(newCorrect)) {
        // Try matching by text
        const matchIdx = opts.findIndex((o) =>
          o.replace(/^[A-D][.)]\s*/, "").toLowerCase() === row.correct_answer.toLowerCase()
        );
        newCorrect = matchIdx >= 0 ? letters[matchIdx] : "A";
      }
    } else {
      // Format: ["text1","text2",...] correct_answer is a numeric index
      newOpts = opts.map((o, i) => ({ id: letters[i], text: o }));
      const idx = parseInt(row.correct_answer, 10);
      if (!isNaN(idx) && idx >= 0 && idx < opts.length) {
        newCorrect = letters[idx];
      } else {
        // Try matching by text
        const matchIdx = opts.findIndex(
          (o) => o.toLowerCase() === (row.correct_answer || "").toLowerCase()
        );
        newCorrect = matchIdx >= 0 ? letters[matchIdx] : "A";
      }
    }

    await conn.query(
      "UPDATE questions SET options = ?, correct_answer = ? WHERE id = ?",
      [JSON.stringify(newOpts), newCorrect, row.id]
    );
    console.log(`Q${row.id}: fixed → correct=${newCorrect}, opts=${JSON.stringify(newOpts).slice(0, 80)}`);
    fixed++;
    continue;
  }

  console.log(`Q${row.id}: unrecognised options format, skipping`);
  skipped++;
}

console.log(`\nDone. Fixed: ${fixed}, Skipped (already OK or unrecognised): ${skipped}`);
await conn.end();
