/**
 * test-exam-api.mjs
 * Directly calls getExamWithQuestions to see what interactiveData looks like
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get a few non-MCQ questions from exam 1
const [rows] = await conn.query(`
  SELECT q.id, q.question_type, q.interactive_data, q.options, q.question_text
  FROM questions q
  JOIN exam_questions eq ON eq.question_id = q.id
  WHERE eq.exam_id = 1 AND q.question_type != 'multiple_choice'
  LIMIT 5
`);

console.log("Non-MCQ questions in exam 1:");
for (const r of rows) {
  const idata = r.interactive_data;
  const idataType = typeof idata;
  console.log(`  Q${r.id} [${r.question_type}]`);
  console.log(`    interactive_data type: ${idataType}`);
  if (idata !== null && idata !== undefined) {
    const str = typeof idata === 'string' ? idata : JSON.stringify(idata);
    console.log(`    interactive_data value: ${str.slice(0, 120)}`);
  } else {
    console.log(`    interactive_data: NULL`);
  }
}

await conn.end();
