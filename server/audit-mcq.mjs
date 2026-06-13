import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get all exams
const [exams] = await conn.query("SELECT id, name FROM exams ORDER BY id");

console.log("\n=== MCQ AUDIT PER EXAM ===\n");

for (const exam of exams) {
  const [rows] = await conn.query(`
    SELECT q.id, q.question_type, q.options, q.correct_answer, q.question_text
    FROM exam_questions eq
    JOIN questions q ON q.id = eq.question_id
    WHERE eq.exam_id = ?
    ORDER BY eq.order_index
  `, [exam.id]);

  const total = rows.length;
  const mcq = rows.filter(r => r.question_type === 'multiple_choice');
  const badMcq = mcq.filter(r => {
    try {
      const opts = typeof r.options === 'string' ? JSON.parse(r.options) : r.options;
      if (!Array.isArray(opts) || opts.length < 2) return true;
      // Check correctAnswer is one of the option ids
      const ids = opts.map(o => o.id);
      return !ids.includes(r.correct_answer);
    } catch { return true; }
  });

  console.log(`Exam ${exam.id}: ${exam.name}`);
  console.log(`  Total questions: ${total}`);
  console.log(`  MCQ: ${mcq.length} (${Math.round(mcq.length/total*100)}%)`);
  console.log(`  MCQ with bad options/answer: ${badMcq.length}`);
  if (badMcq.length > 0) {
    for (const q of badMcq) {
      console.log(`    Q${q.id}: "${q.question_text?.slice(0,60)}..." | options=${JSON.stringify(q.options)?.slice(0,80)} | correct=${q.correct_answer}`);
    }
  }

  // Count other types
  const types = {};
  for (const r of rows) {
    types[r.question_type] = (types[r.question_type] || 0) + 1;
  }
  console.log(`  Types:`, types);
  console.log();
}

await conn.end();
