import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const url = process.env.DATABASE_URL;
if (!url) { console.error('No DATABASE_URL'); process.exit(1); }

// Parse the DATABASE_URL (format: mysql://user:pass@host:port/dbname?params)
const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
if (!match) { console.error('Invalid DATABASE_URL format:', url.replace(/:([^@]+)@/, ':***@')); process.exit(1); }
const [, user, password, host, port, database] = match;

const conn = await mysql.createConnection({ host, port: Number(port), user, password, database, ssl: { rejectUnauthorized: false } });

// Insert test attempt
const [attemptResult] = await conn.execute(
  `INSERT INTO student_exam_attempts (student_id, exam_id, class_id, status, started_at, submitted_at, time_spent_seconds, math_score, math_total, science_score, science_total, total_score, total_questions)
   VALUES (30001, 30007, 30003, 'submitted', DATE_SUB(NOW(), INTERVAL 90 MINUTE), NOW(), 4800, 8, 15, 7, 15, 15, 30)`
);
const attemptId = attemptResult.insertId;
console.log('Inserted attempt id:', attemptId);

const reportData = JSON.stringify({
  studentName: 'Ahmed Al-Rashidi',
  className: 'Class 8A',
  examName: 'Mock Exam 1',
  totalScore: 15,
  maxScore: 30,
  percentage: 50,
  mathScore: 8,
  mathTotal: 15,
  scienceScore: 7,
  scienceTotal: 15,
  contentDomainBreakdown: {
    Number: { correct: 4, total: 5, percentage: 80 },
    Algebra: { correct: 2, total: 5, percentage: 40 },
    Geometry: { correct: 1, total: 3, percentage: 33 },
    'Data & Probability': { correct: 1, total: 2, percentage: 50 }
  },
  cognitiveDomainBreakdown: {
    Knowing: { correct: 5, total: 8, percentage: 63 },
    Applying: { correct: 6, total: 12, percentage: 50 },
    Reasoning: { correct: 4, total: 10, percentage: 40 }
  },
  scienceSubDomainBreakdown: {
    Biology: { correct: 2, total: 4, percentage: 50 },
    Chemistry: { correct: 2, total: 4, percentage: 50 },
    Physics: { correct: 2, total: 4, percentage: 50 },
    'Earth Science': { correct: 1, total: 3, percentage: 33 }
  },
  strengths: ['Strong in Number domain', 'Good recall of formulas'],
  weaknesses: ['Algebra needs improvement', 'Science reasoning skills'],
  misconceptionNotes: ['Confuses area and perimeter formulas', 'Struggles with unit conversion'],
  recommendedInterventionGroup: 'Group 2 - Consolidation',
  nextPracticeTargets: ['Algebra: linear equations', 'Science: data interpretation'],
  timeSpentSeconds: 4800,
  submittedAt: new Date().toISOString(),
});

await conn.execute(
  `INSERT INTO student_reports (attempt_id, student_id, exam_id, class_id, report_data)
   VALUES (?, 30001, 30007, 30003, ?)`,
  [attemptId, reportData]
);
console.log('Inserted report for attempt', attemptId);
console.log('Test PDF URL: http://localhost:3000/api/reports/attempt/' + attemptId + '/pdf');
console.log('Test HTML URL: http://localhost:3000/api/reports/attempt/' + attemptId);

await conn.end();
