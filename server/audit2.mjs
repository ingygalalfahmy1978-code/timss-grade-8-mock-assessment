import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [cnt] = await conn.execute(
  `SELECT eq.exam_id, COUNT(*) as cnt FROM exam_questions eq GROUP BY eq.exam_id ORDER BY eq.exam_id`
);
console.log("Counts:", JSON.stringify(cnt));

const [maxId] = await conn.execute("SELECT MAX(id) as mx FROM questions");
console.log("Max question ID:", maxId[0].mx);

await conn.end();
process.exit(0);
