import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [all] = await conn.execute(
  `SELECT eq.exam_id, q.subject, q.question_type, LEFT(q.question_text,80) as qt
   FROM exam_questions eq
   JOIN questions q ON q.id=eq.question_id
   ORDER BY eq.exam_id, eq.order_index`
);

const byExam = {};
for (const r of all) {
  if (!byExam[r.exam_id]) byExam[r.exam_id] = [];
  byExam[r.exam_id].push({ s: r.subject, t: r.question_type, q: r.qt });
}

for (const [eid, qs] of Object.entries(byExam)) {
  console.log(`\n=== Exam ${eid} (${qs.length} questions) ===`);
  qs.forEach((q, i) => console.log(`  ${i + 1}. [${q.s}] [${q.t}] ${q.q}`));
}

// Also get max question ID
const [maxId] = await conn.execute("SELECT MAX(id) as mx FROM questions");
console.log("\nMax question ID:", maxId[0].mx);

await conn.end();
