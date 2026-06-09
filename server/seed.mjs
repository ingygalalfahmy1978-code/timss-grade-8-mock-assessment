// Seed script for TIMSS platform
// Run with: node server/seed.mjs
import { createHash } from "crypto";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error("DATABASE_URL not set");

function hashPassword(password) {
  return createHash("sha256").update(password + "timss_salt_2024").digest("hex");
}

const conn = await mysql.createConnection(DB_URL);

// ─── Platform Users ───────────────────────────────────────────────────────────
const adminPass = hashPassword("Admin@2024");
const teacher1Pass = hashPassword("Teacher@2024");
const teacher2Pass = hashPassword("Teacher2@2024");
const student1Pass = hashPassword("Std001@2024");
const student2Pass = hashPassword("Std002@2024");
const student3Pass = hashPassword("Std003@2024");
const student4Pass = hashPassword("Std004@2024");
const student5Pass = hashPassword("Std005@2024");
const student6Pass = hashPassword("Std006@2024");

await conn.execute(`DELETE FROM student_reports`);
await conn.execute(`DELETE FROM student_answers`);
await conn.execute(`DELETE FROM student_exam_attempts`);
await conn.execute(`DELETE FROM class_exam_assignments`);
await conn.execute(`DELETE FROM student_classes`);
await conn.execute(`DELETE FROM exam_questions`);
await conn.execute(`DELETE FROM exams`);
await conn.execute(`DELETE FROM questions`);
await conn.execute(`DELETE FROM classes`);
await conn.execute(`DELETE FROM platform_users`);

// Insert admin
await conn.execute(
  `INSERT INTO platform_users (username, password_hash, name, email, role) VALUES (?, ?, ?, ?, ?)`,
  ["admin", adminPass, "System Administrator", "admin@timss.edu", "admin"]
);

// Insert teachers
await conn.execute(
  `INSERT INTO platform_users (username, password_hash, name, email, role) VALUES (?, ?, ?, ?, ?)`,
  ["teacher.ali", teacher1Pass, "Mr. Ali Hassan", "ali.hassan@timss.edu", "teacher"]
);
await conn.execute(
  `INSERT INTO platform_users (username, password_hash, name, email, role) VALUES (?, ?, ?, ?, ?)`,
  ["teacher.sara", teacher2Pass, "Ms. Sara Ahmed", "sara.ahmed@timss.edu", "teacher"]
);

// Insert students
const students = [
  ["STD001", student1Pass, "Ahmed Al-Rashidi", "8A"],
  ["STD002", student2Pass, "Fatima Al-Zahra", "8A"],
  ["STD003", student3Pass, "Omar Khalid", "8A"],
  ["STD004", student4Pass, "Noor Al-Sayed", "8B"],
  ["STD005", student5Pass, "Yusuf Ibrahim", "8B"],
  ["STD006", student6Pass, "Layla Mahmoud", "8B"],
];
for (const [username, pass, name] of students) {
  await conn.execute(
    `INSERT INTO platform_users (username, password_hash, name, role) VALUES (?, ?, ?, ?)`,
    [username, pass, name, "student"]
  );
}

// ─── Classes ──────────────────────────────────────────────────────────────────
const [teacherRows] = await conn.execute(`SELECT id, username FROM platform_users WHERE role='teacher'`);
const teacher1Id = teacherRows.find(t => t.username === "teacher.ali").id;
const teacher2Id = teacherRows.find(t => t.username === "teacher.sara").id;

await conn.execute(`INSERT INTO classes (name, grade, teacher_id) VALUES (?, ?, ?)`, ["Class 8A", "Grade 8", teacher1Id]);
await conn.execute(`INSERT INTO classes (name, grade, teacher_id) VALUES (?, ?, ?)`, ["Class 8B", "Grade 8", teacher2Id]);

const [classRows] = await conn.execute(`SELECT id, name FROM classes`);
const class8A = classRows.find(c => c.name === "Class 8A").id;
const class8B = classRows.find(c => c.name === "Class 8B").id;

// Enroll students
const [studentRows] = await conn.execute(`SELECT id, username FROM platform_users WHERE role='student'`);
for (const s of studentRows) {
  const classId = ["STD001","STD002","STD003"].includes(s.username) ? class8A : class8B;
  await conn.execute(`INSERT INTO student_classes (student_id, class_id) VALUES (?, ?)`, [s.id, classId]);
}

// ─── Questions (Mock 1 sample set) ───────────────────────────────────────────
const questions = [
  // MATH - Number
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice",
    questionText: "Which of the following is the prime factorization of 84?",
    options: JSON.stringify([
      { id: "A", text: "2² × 3 × 7" },
      { id: "B", text: "2 × 3² × 7" },
      { id: "C", text: "2³ × 3 × 7" },
      { id: "D", text: "2² × 3² × 5" }
    ]),
    correctAnswer: "A",
    explanation: "84 = 4 × 21 = 2² × 3 × 7"
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice",
    questionText: "A store offers a 15% discount on an item originally priced at $80. What is the sale price?",
    options: JSON.stringify([
      { id: "A", text: "$12" },
      { id: "B", text: "$65" },
      { id: "C", text: "$68" },
      { id: "D", text: "$72" }
    ]),
    correctAnswer: "C",
    explanation: "Discount = 15% × 80 = 12. Sale price = 80 − 12 = $68"
  },
  {
    subject: "Math", contentDomain: "Number", cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "short_answer",
    questionText: "A recipe requires 2¾ cups of flour. If you want to make 1½ times the recipe, how many cups of flour do you need? Express your answer as a mixed number.",
    options: null,
    correctAnswer: "4 1/8",
    explanation: "2¾ × 1½ = 11/4 × 3/2 = 33/8 = 4 1/8 cups"
  },
  // MATH - Algebra
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice",
    questionText: "What is the value of x in the equation 3x − 7 = 14?",
    options: JSON.stringify([
      { id: "A", text: "x = 3" },
      { id: "B", text: "x = 7" },
      { id: "C", text: "x = 9" },
      { id: "D", text: "x = 21" }
    ]),
    correctAnswer: "B",
    explanation: "3x = 14 + 7 = 21, so x = 7"
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice",
    questionText: "A linear function passes through the points (0, 3) and (2, 7). What is the equation of this function?",
    options: JSON.stringify([
      { id: "A", text: "y = 2x + 3" },
      { id: "B", text: "y = 3x + 2" },
      { id: "C", text: "y = 4x − 1" },
      { id: "D", text: "y = x + 5" }
    ]),
    correctAnswer: "A",
    explanation: "Slope = (7−3)/(2−0) = 2. y-intercept = 3. So y = 2x + 3"
  },
  {
    subject: "Math", contentDomain: "Algebra", cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "short_answer",
    questionText: "Two consecutive even integers have a sum of 94. What are the two integers?",
    options: null,
    correctAnswer: "46 and 48",
    explanation: "Let n and n+2 be consecutive even integers. n + n + 2 = 94 → 2n = 92 → n = 46. The integers are 46 and 48."
  },
  // MATH - Geometry
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice",
    questionText: "What is the sum of interior angles of a hexagon?",
    options: JSON.stringify([
      { id: "A", text: "540°" },
      { id: "B", text: "720°" },
      { id: "C", text: "900°" },
      { id: "D", text: "1080°" }
    ]),
    correctAnswer: "B",
    explanation: "Sum of interior angles = (n − 2) × 180° = (6 − 2) × 180° = 720°"
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice",
    questionText: "A right triangle has legs of length 6 cm and 8 cm. What is the length of the hypotenuse?",
    options: JSON.stringify([
      { id: "A", text: "10 cm" },
      { id: "B", text: "12 cm" },
      { id: "C", text: "14 cm" },
      { id: "D", text: "√28 cm" }
    ]),
    correctAnswer: "A",
    explanation: "c² = 6² + 8² = 36 + 64 = 100, so c = 10 cm"
  },
  {
    subject: "Math", contentDomain: "Geometry", cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "short_answer",
    questionText: "A cylinder has a radius of 5 cm and a height of 12 cm. What is the total surface area of the cylinder? Use π ≈ 3.14 and round to the nearest whole number.",
    options: null,
    correctAnswer: "534",
    explanation: "Total SA = 2πr² + 2πrh = 2(3.14)(25) + 2(3.14)(5)(12) = 157 + 376.8 ≈ 534 cm²"
  },
  // MATH - Data and Probability
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice",
    questionText: "The ages of 5 students are: 13, 14, 13, 15, 14. What is the mode of this data set?",
    options: JSON.stringify([
      { id: "A", text: "13 only" },
      { id: "B", text: "14 only" },
      { id: "C", text: "13 and 14" },
      { id: "D", text: "15" }
    ]),
    correctAnswer: "C",
    explanation: "Both 13 and 14 appear twice, making this a bimodal data set."
  },
  {
    subject: "Math", contentDomain: "Data and Probability", cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice",
    questionText: "A bag contains 4 red, 3 blue, and 5 green marbles. If one marble is drawn at random, what is the probability of drawing a blue marble?",
    options: JSON.stringify([
      { id: "A", text: "1/4" },
      { id: "B", text: "1/3" },
      { id: "C", text: "3/12" },
      { id: "D", text: "5/12" }
    ]),
    correctAnswer: "A",
    explanation: "P(blue) = 3/12 = 1/4"
  },
  // SCIENCE - Biology
  {
    subject: "Science", contentDomain: "Biology", cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice",
    questionText: "Which organelle is responsible for producing energy (ATP) in a cell?",
    options: JSON.stringify([
      { id: "A", text: "Nucleus" },
      { id: "B", text: "Ribosome" },
      { id: "C", text: "Mitochondria" },
      { id: "D", text: "Vacuole" }
    ]),
    correctAnswer: "C",
    explanation: "Mitochondria are the powerhouses of the cell, producing ATP through cellular respiration."
  },
  {
    subject: "Science", contentDomain: "Biology", cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice",
    questionText: "During photosynthesis, plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. Which of the following correctly represents this process?",
    options: JSON.stringify([
      { id: "A", text: "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂" },
      { id: "B", text: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy" },
      { id: "C", text: "6O₂ + 6H₂O → C₆H₁₂O₆ + 6CO₂" },
      { id: "D", text: "6CO₂ + 6O₂ + light → C₆H₁₂O₆ + 6H₂O" }
    ]),
    correctAnswer: "A",
    explanation: "The photosynthesis equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂"
  },
  {
    subject: "Science", contentDomain: "Biology", cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "short_answer",
    questionText: "A student observes that plants placed in a dark room for two weeks turn yellow and eventually die. Explain why this happens, referring to the role of chlorophyll and photosynthesis.",
    options: null,
    correctAnswer: "Without light, plants cannot perform photosynthesis to produce glucose for energy. Chlorophyll, which requires light to function, breaks down and is not replaced, causing the yellow color. Without glucose, the plant cannot carry out cellular respiration and dies.",
    explanation: "This tests understanding of the relationship between light, chlorophyll, photosynthesis, and plant survival."
  },
  // SCIENCE - Chemistry
  {
    subject: "Science", contentDomain: "Chemistry", cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice",
    questionText: "What is the chemical symbol for gold?",
    options: JSON.stringify([
      { id: "A", text: "Go" },
      { id: "B", text: "Gd" },
      { id: "C", text: "Au" },
      { id: "D", text: "Ag" }
    ]),
    correctAnswer: "C",
    explanation: "Gold's chemical symbol is Au, from the Latin word 'Aurum'."
  },
  {
    subject: "Science", contentDomain: "Chemistry", cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice",
    questionText: "When iron rusts, it reacts with oxygen and water. This is an example of which type of chemical reaction?",
    options: JSON.stringify([
      { id: "A", text: "Decomposition" },
      { id: "B", text: "Synthesis" },
      { id: "C", text: "Single displacement" },
      { id: "D", text: "Oxidation" }
    ]),
    correctAnswer: "D",
    explanation: "Rusting is an oxidation reaction where iron combines with oxygen to form iron oxide."
  },
  {
    subject: "Science", contentDomain: "Chemistry", cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "short_answer",
    questionText: "A student mixes vinegar (an acid) with baking soda (a base). Describe what happens and identify the type of reaction. What are the products of this reaction?",
    options: null,
    correctAnswer: "A neutralization reaction occurs. Bubbles of carbon dioxide gas are produced, along with water and sodium acetate. The reaction is: CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂",
    explanation: "This is a classic acid-base neutralization reaction producing a salt, water, and carbon dioxide gas."
  },
  // SCIENCE - Physics
  {
    subject: "Science", contentDomain: "Physics", cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice",
    questionText: "What is the SI unit of force?",
    options: JSON.stringify([
      { id: "A", text: "Joule" },
      { id: "B", text: "Newton" },
      { id: "C", text: "Watt" },
      { id: "D", text: "Pascal" }
    ]),
    correctAnswer: "B",
    explanation: "The SI unit of force is the Newton (N), named after Sir Isaac Newton."
  },
  {
    subject: "Science", contentDomain: "Physics", cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice",
    questionText: "A car accelerates from rest to 20 m/s in 4 seconds. What is its acceleration?",
    options: JSON.stringify([
      { id: "A", text: "5 m/s²" },
      { id: "B", text: "80 m/s²" },
      { id: "C", text: "0.2 m/s²" },
      { id: "D", text: "16 m/s²" }
    ]),
    correctAnswer: "A",
    explanation: "a = Δv/t = (20 − 0)/4 = 5 m/s²"
  },
  {
    subject: "Science", contentDomain: "Physics", cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "short_answer",
    questionText: "A 5 kg object is pushed with a net force of 20 N. Using Newton's Second Law, calculate the acceleration of the object. Then explain what would happen to the acceleration if the mass were doubled while the force remained the same.",
    options: null,
    correctAnswer: "a = F/m = 20/5 = 4 m/s². If mass doubles to 10 kg, acceleration halves to 2 m/s², because acceleration is inversely proportional to mass.",
    explanation: "Newton's Second Law: F = ma, so a = F/m. Doubling mass with constant force halves acceleration."
  },
  // SCIENCE - Earth Science
  {
    subject: "Science", contentDomain: "Earth Science", cognitiveDomain: "Knowing", difficulty: "Easy",
    questionType: "multiple_choice",
    questionText: "Which layer of Earth's atmosphere contains the ozone layer?",
    options: JSON.stringify([
      { id: "A", text: "Troposphere" },
      { id: "B", text: "Stratosphere" },
      { id: "C", text: "Mesosphere" },
      { id: "D", text: "Thermosphere" }
    ]),
    correctAnswer: "B",
    explanation: "The ozone layer is located in the stratosphere, approximately 15–35 km above Earth's surface."
  },
  {
    subject: "Science", contentDomain: "Earth Science", cognitiveDomain: "Applying", difficulty: "Medium",
    questionType: "multiple_choice",
    questionText: "The theory of plate tectonics explains which of the following phenomena?",
    options: JSON.stringify([
      { id: "A", text: "Formation of ocean tides" },
      { id: "B", text: "Changes in day length" },
      { id: "C", text: "Earthquakes and volcanic activity" },
      { id: "D", text: "Formation of clouds" }
    ]),
    correctAnswer: "C",
    explanation: "Plate tectonics explains earthquakes, volcanic activity, and the formation of mountain ranges."
  },
  {
    subject: "Science", contentDomain: "Earth Science", cognitiveDomain: "Reasoning", difficulty: "Hard",
    questionType: "short_answer",
    questionText: "Scientists have found identical fossils of the same ancient plant species on continents that are now separated by thousands of kilometers of ocean. How does this evidence support the theory of continental drift?",
    options: null,
    correctAnswer: "The identical fossils on now-separated continents suggest that these landmasses were once connected as a single supercontinent (Pangaea). The plant species could not have crossed vast oceans, so the continents must have drifted apart after the species existed. This supports Wegener's theory of continental drift.",
    explanation: "Fossil evidence is one of the key supports for the theory of continental drift and plate tectonics."
  },
];

for (const q of questions) {
  await conn.execute(
    `INSERT INTO questions (subject, content_domain, cognitive_domain, difficulty, question_type, question_text, options, correct_answer, explanation)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [q.subject, q.contentDomain, q.cognitiveDomain, q.difficulty, q.questionType, q.questionText, q.options, q.correctAnswer, q.explanation]
  );
}

// ─── Exams ────────────────────────────────────────────────────────────────────
const examNames = [
  ["Mock Exam 1", "Grade 8 Mathematics and Science – Mock Assessment 1 (Sample Questions)", true],
  ["Mock Exam 2", "Grade 8 Mathematics and Science – Mock Assessment 2", false],
  ["Mock Exam 3", "Grade 8 Mathematics and Science – Mock Assessment 3", false],
  ["Mock Exam 4", "Grade 8 Mathematics and Science – Mock Assessment 4", false],
  ["Mock Exam 5", "Grade 8 Mathematics and Science – Mock Assessment 5", false],
  ["Mock Exam 6", "Grade 8 Mathematics and Science – Mock Assessment 6", false],
];

for (const [name, desc, published] of examNames) {
  await conn.execute(
    `INSERT INTO exams (name, description, duration_minutes, is_published) VALUES (?, ?, ?, ?)`,
    [name, desc, 90, published ? 1 : 0]
  );
}

// ─── Assign all questions to Mock 1 ──────────────────────────────────────────
const [examRows] = await conn.execute(`SELECT id, name FROM exams ORDER BY id`);
const mock1Id = examRows[0].id;
const [qRows] = await conn.execute(`SELECT id FROM questions ORDER BY id`);
for (let i = 0; i < qRows.length; i++) {
  await conn.execute(
    `INSERT INTO exam_questions (exam_id, question_id, order_index) VALUES (?, ?, ?)`,
    [mock1Id, qRows[i].id, i + 1]
  );
}

// ─── Assign Mock 1 to both classes ───────────────────────────────────────────
const [adminRow] = await conn.execute(`SELECT id FROM platform_users WHERE role='admin' LIMIT 1`);
const adminId = adminRow[0].id;
for (const classId of [class8A, class8B]) {
  await conn.execute(
    `INSERT INTO class_exam_assignments (class_id, exam_id, is_active, activated_by) VALUES (?, ?, ?, ?)`,
    [classId, mock1Id, 1, adminId]
  );
}

await conn.end();
console.log("✅ Seed complete!");
console.log("\nLogin credentials:");
console.log("  Admin:     admin / Admin@2024");
console.log("  Teacher 1: teacher.ali / Teacher@2024");
console.log("  Teacher 2: teacher.sara / Teacher2@2024");
console.log("  Students:  STD001–STD006 / Std001@2024–Std006@2024");
