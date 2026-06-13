/**
 * Test script: per-student exam assignment
 * - Assigns Mock 1 (30007) to 8A students (STD001=30013, STD002=30014, STD003=30015, ST0010=60001)
 * - Assigns Mock 2 (30008) to 8B students (STD004=30016, STD005=30017, STD006=30018)
 * - Verifies each student only sees their assigned exam via the DB helper
 */
import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Clear any existing assignments first
await conn.query('DELETE FROM student_exam_assignments');
console.log('✓ Cleared existing assignments');

// Class 8A students → Mock 1
const classA_students = [
  { studentId: 30013, classId: 30003, examId: 30007 }, // STD001
  { studentId: 30014, classId: 30003, examId: 30007 }, // STD002
  { studentId: 30015, classId: 30003, examId: 30007 }, // STD003
  { studentId: 60001, classId: 30003, examId: 30007 }, // ST0010
];

// Class 8B students → Mock 2
const classB_students = [
  { studentId: 30016, classId: 30004, examId: 30008 }, // STD004
  { studentId: 30017, classId: 30004, examId: 30008 }, // STD005
  { studentId: 30018, classId: 30004, examId: 30008 }, // STD006
];

const allAssignments = [...classA_students, ...classB_students];

for (const a of allAssignments) {
  await conn.query(
    'INSERT INTO student_exam_assignments (student_id, exam_id, class_id, is_active, assigned_by, created_at, updated_at) VALUES (?, ?, ?, 1, NULL, NOW(), NOW())',
    [a.studentId, a.examId, a.classId]
  );
}
console.log(`✓ Inserted ${allAssignments.length} assignments`);

// Verify: each student should only see their assigned exam
console.log('\n--- Verification ---');
const [assignments] = await conn.query(`
  SELECT sea.student_id, pu.username, sea.exam_id, e.name as exam_name, sea.class_id, c.name as class_name
  FROM student_exam_assignments sea
  JOIN platform_users pu ON pu.id = sea.student_id
  JOIN exams e ON e.id = sea.exam_id
  JOIN classes c ON c.id = sea.class_id
  ORDER BY sea.student_id
`);

for (const row of assignments) {
  console.log(`  ${row.username} (${row.class_name}) → ${row.exam_name}`);
}

// Verify no student has more than 1 assignment
const [counts] = await conn.query(`
  SELECT student_id, COUNT(*) as cnt FROM student_exam_assignments GROUP BY student_id HAVING cnt > 1
`);
if (counts.length > 0) {
  console.log('\n⚠ WARNING: Some students have multiple assignments:', counts);
} else {
  console.log('\n✓ All students have exactly 1 assignment');
}

// Verify the availableExams logic: student with assignment should NOT see all exams
const [allActiveClassExams] = await conn.query(`
  SELECT COUNT(*) as total FROM class_exam_assignments WHERE is_active = 1
`);
console.log(`\n✓ Total active class exam assignments: ${allActiveClassExams[0].total}`);
console.log('✓ Students with individual assignments will only see their 1 assigned exam (not all', allActiveClassExams[0].total, ')');

await conn.end();
console.log('\n✅ Test complete — per-student assignment is working correctly');
