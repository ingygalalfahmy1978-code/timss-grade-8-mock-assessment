import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const url = process.env.DATABASE_URL;
const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
const [, user, password, host, port, database] = match;
const conn = await mysql.createConnection({ host, port: Number(port), user, password, database, ssl: { rejectUnauthorized: false } });

// Check question order, type, subject, session for exam 30007
const [rows] = await conn.execute(`
  SELECT eq.order_index, q.id, q.question_type, q.subject, q.session, 
         LEFT(q.question_text, 60) as text_preview
  FROM exam_questions eq
  JOIN questions q ON eq.question_id = q.id
  WHERE eq.exam_id = 30007
  ORDER BY eq.order_index
`);

console.log('Questions in Exam 30007 (Mock 1):');
console.log('Order | ID    | Type                      | Subject | Session | Text');
console.log('------|-------|---------------------------|---------|---------|-----');
for (const r of rows) {
  console.log(`${String(r.order_index).padEnd(5)} | ${String(r.id).padEnd(5)} | ${String(r.question_type).padEnd(25)} | ${String(r.subject).padEnd(7)} | ${String(r.session || 'null').padEnd(14)} | ${r.text_preview}`);
}

// Check Q13 specifically
const q13 = rows.find(r => r.order_index === 13);
if (q13) {
  console.log('\nQ13 details:');
  console.log('Type:', q13.question_type);
  const [q13detail] = await conn.execute('SELECT interactive_data FROM questions WHERE id = ?', [q13.id]);
  console.log('Interactive data:', JSON.stringify(q13detail[0]?.interactive_data)?.substring(0, 300));
}

// Check drawing canvas questions
const drawingQs = rows.filter(r => r.question_type === 'drawing_canvas');
console.log('\nDrawing canvas questions:', drawingQs.length);
for (const q of drawingQs) {
  const [detail] = await conn.execute('SELECT interactive_data FROM questions WHERE id = ?', [q.id]);
  console.log(`Q${q.order_index} (id ${q.id}):`, JSON.stringify(detail[0]?.interactive_data)?.substring(0, 300));
}

await conn.end();
