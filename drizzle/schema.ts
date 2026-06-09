import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Platform Users (Admin, Teacher, Student) ───────────────────────────────

export const platformUsers = mysqlTable("platform_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["admin", "teacher", "student"]).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PlatformUser = typeof platformUsers.$inferSelect;
export type InsertPlatformUser = typeof platformUsers.$inferInsert;

// ─── Classes ─────────────────────────────────────────────────────────────────

export const classes = mysqlTable("classes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  grade: varchar("grade", { length: 32 }).default("Grade 8").notNull(),
  teacherId: int("teacher_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Class = typeof classes.$inferSelect;
export type InsertClass = typeof classes.$inferInsert;

// ─── Student-Class Enrollment ─────────────────────────────────────────────────

export const studentClasses = mysqlTable("student_classes", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  classId: int("class_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type StudentClass = typeof studentClasses.$inferSelect;

// ─── Question Bank ────────────────────────────────────────────────────────────

export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  subject: mysqlEnum("subject", ["Math", "Science"]).notNull(),
  contentDomain: varchar("content_domain", { length: 64 }).notNull(),
  // Math: Number, Algebra, Geometry, Data and Probability
  // Science: Biology, Chemistry, Physics, Earth Science
  cognitiveDomain: mysqlEnum("cognitive_domain", [
    "Knowing",
    "Applying",
    "Reasoning",
  ]).notNull(),
  difficulty: mysqlEnum("difficulty", ["Easy", "Medium", "Hard"]).notNull(),
  questionType: mysqlEnum("question_type", [
    "multiple_choice",
    "short_answer",
  ]).notNull(),
  questionText: text("question_text").notNull(),
  // For multiple choice: JSON array of {id, text} objects
  options: json("options"),
  // For multiple choice: the option id (e.g. "A")
  // For short_answer: the expected answer text
  correctAnswer: text("correct_answer").notNull(),
  // Optional image URL or base64 for graph/table/image-based questions
  imageUrl: text("image_url"),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

// ─── Exams ────────────────────────────────────────────────────────────────────

export const exams = mysqlTable("exams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  // Duration in minutes
  durationMinutes: int("duration_minutes").default(90).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Exam = typeof exams.$inferSelect;
export type InsertExam = typeof exams.$inferInsert;

// ─── Exam Questions (join) ────────────────────────────────────────────────────

export const examQuestions = mysqlTable("exam_questions", {
  id: int("id").autoincrement().primaryKey(),
  examId: int("exam_id").notNull(),
  questionId: int("question_id").notNull(),
  orderIndex: int("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ExamQuestion = typeof examQuestions.$inferSelect;

// ─── Class Exam Assignments ───────────────────────────────────────────────────

export const classExamAssignments = mysqlTable("class_exam_assignments", {
  id: int("id").autoincrement().primaryKey(),
  classId: int("class_id").notNull(),
  examId: int("exam_id").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  activatedAt: timestamp("activated_at"),
  activatedBy: int("activated_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ClassExamAssignment = typeof classExamAssignments.$inferSelect;

// ─── Student Exam Attempts ────────────────────────────────────────────────────

export const studentExamAttempts = mysqlTable("student_exam_attempts", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  examId: int("exam_id").notNull(),
  classId: int("class_id").notNull(),
  status: mysqlEnum("status", ["in_progress", "submitted", "graded"]).default(
    "in_progress"
  ).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  submittedAt: timestamp("submitted_at"),
  // Time spent in seconds
  timeSpentSeconds: int("time_spent_seconds"),
  totalScore: int("total_score"),
  totalQuestions: int("total_questions"),
  mathScore: int("math_score"),
  mathTotal: int("math_total"),
  scienceScore: int("science_score"),
  scienceTotal: int("science_total"),
  // JSON: { contentDomain: { domain: { correct, total } }, cognitiveDomain: { ... } }
  domainBreakdown: json("domain_breakdown"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentExamAttempt = typeof studentExamAttempts.$inferSelect;
export type InsertStudentExamAttempt = typeof studentExamAttempts.$inferInsert;

// ─── Student Answers ──────────────────────────────────────────────────────────

export const studentAnswers = mysqlTable("student_answers", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: int("attempt_id").notNull(),
  questionId: int("question_id").notNull(),
  answerGiven: text("answer_given"),
  isCorrect: boolean("is_correct"),
  isFlagged: boolean("is_flagged").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentAnswer = typeof studentAnswers.$inferSelect;
export type InsertStudentAnswer = typeof studentAnswers.$inferInsert;

// ─── Student Reports ──────────────────────────────────────────────────────────

export const studentReports = mysqlTable("student_reports", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: int("attempt_id").notNull().unique(),
  studentId: int("student_id").notNull(),
  examId: int("exam_id").notNull(),
  classId: int("class_id").notNull(),
  // Detailed report data as JSON
  reportData: json("report_data").notNull(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export type StudentReport = typeof studentReports.$inferSelect;

// ─── Legacy OAuth users table (required by auth core) ────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
