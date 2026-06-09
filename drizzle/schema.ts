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
  scienceSubDomain: mysqlEnum("science_sub_domain", [
    "Earth Science",
    "Biology",
    "Chemistry",
    "Physics",
  ]),
  // Block assignment (1-14, matching TIMSS block structure)
  blockNumber: int("block_number"),
  // Session: math_session (Session 1) or science_session (Session 2)
  session: mysqlEnum("session", ["math_session", "science_session"]),
  cognitiveDomain: mysqlEnum("cognitive_domain", [
    "Knowing",
    "Applying",
    "Reasoning",
  ]).notNull(),
  difficulty: mysqlEnum("difficulty", ["Easy", "Medium", "Hard"]).notNull(),
  questionType: mysqlEnum("question_type", [
    "multiple_choice",
    "short_answer",
    "drag_drop",
    "matching",
    "ordering",
    "hotspot",
    "drawing_canvas",
    "pattern_interaction",
    "psi_lab",
    "partial_credit_short_answer",
  ]).notNull(),
  // Max points: 1 for standard, 2 for partial credit questions
  maxPoints: int("max_points").default(1).notNull(),
  // For drag_drop: JSON { items: [{id,text}], targets: [{id,label}], correctMapping: {itemId: targetId} }
  // For matching: JSON { leftItems: [{id,text}], rightItems: [{id,text}], correctPairs: {leftId: rightId} }
  // For ordering: JSON { items: [{id,text}], correctOrder: [id,...] }
  // For hotspot: JSON { imageUrl, regions: [{id,x,y,w,h,label}], correctRegion: id }
  // For drawing_canvas: JSON { canvasType: "geometry"|"graph"|"free", prompt, width, height, gridLines?, axes? }
  // For pattern_interaction: JSON { patternType: "sequence"|"grid", items: [{id,value,position,isBlank}], correctAnswers: {id: value} }
  // For psi_lab: JSON { scenario, variables: [{name,unit,values[]}], hypothesis, tasks: [{id,instruction,type,correctAnswer}] }
  // For partial_credit_short_answer: same as short_answer but maxPoints=2, scoring rubric in explanation
  interactiveData: json("interactive_data"),
  questionText: text("question_text").notNull(),
  // For multiple choice: JSON array of {id, text} objects
  options: json("options"),
  // For multiple choice: the option id (e.g. "A")
  // For short_answer / partial_credit_short_answer: the expected answer text
  correctAnswer: text("correct_answer").notNull(),
  // Optional image URL for graph/table/image-based questions
  imageUrl: text("image_url"),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

// ─── Exam Blocks ──────────────────────────────────────────────────────────────
// Each exam has up to 14 blocks (matching TIMSS structure).
// A block belongs to a session (math or science) and contains ~14-15 questions.

export const examBlocks = mysqlTable("exam_blocks", {
  id: int("id").autoincrement().primaryKey(),
  examId: int("exam_id").notNull(),
  blockNumber: int("block_number").notNull(), // 1-14
  session: mysqlEnum("session", ["math_session", "science_session"]).notNull(),
  label: varchar("label", { length: 32 }), // e.g. "M1", "S1"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ExamBlock = typeof examBlocks.$inferSelect;

// ─── Exams ────────────────────────────────────────────────────────────────────

export const exams = mysqlTable("exams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  // Total duration in minutes (default 90 = 45+45)
  durationMinutes: int("duration_minutes").default(90).notNull(),
  // Session 1 duration (Math) in minutes
  session1Minutes: int("session1_minutes").default(45).notNull(),
  // Break duration in minutes
  breakMinutes: int("break_minutes").default(5).notNull(),
  // Session 2 duration (Science) in minutes
  session2Minutes: int("session2_minutes").default(45).notNull(),
  // Whether to use block rotation (different students see different blocks)
  useBlockRotation: boolean("use_block_rotation").default(false).notNull(),
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
  // Which session this question belongs to
  session: mysqlEnum("session", ["math_session", "science_session"]),
  // Block number within the exam (for block rotation)
  blockNumber: int("block_number"),
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
  // JSON array of block numbers assigned to this class (for rotation)
  // e.g. [1, 2, 8, 9] means this class sees blocks 1,2 (math) and 8,9 (science)
  assignedBlocks: json("assigned_blocks"),
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
  status: mysqlEnum("status", ["in_progress", "on_break", "session2", "submitted", "graded"]).default(
    "in_progress"
  ).notNull(),
  // Current session state
  currentSession: mysqlEnum("current_session", ["math_session", "science_session"]).default("math_session").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  // When Session 1 (Math) was completed
  session1CompletedAt: timestamp("session1_completed_at"),
  // When the break ended and Session 2 started
  session2StartedAt: timestamp("session2_started_at"),
  submittedAt: timestamp("submitted_at"),
  // Time spent in seconds per session
  session1TimeSpentSeconds: int("session1_time_spent_seconds"),
  session2TimeSpentSeconds: int("session2_time_spent_seconds"),
  timeSpentSeconds: int("time_spent_seconds"),
  // Scores
  totalScore: int("total_score"),
  totalMaxPoints: int("total_max_points"),
  totalQuestions: int("total_questions"),
  mathScore: int("math_score"),
  mathMaxPoints: int("math_max_points"),
  mathTotal: int("math_total"),
  scienceScore: int("science_score"),
  scienceMaxPoints: int("science_max_points"),
  scienceTotal: int("science_total"),
  // JSON: { contentDomain: { domain: { earned, max, total } }, cognitiveDomain: { ... } }
  domainBreakdown: json("domain_breakdown"),
  // Whether background questionnaire was completed
  questionnaireCompleted: boolean("questionnaire_completed").default(false).notNull(),
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
  // Partial credit: 0, 1, or 2 points earned
  pointsEarned: int("points_earned").default(0).notNull(),
  isFlagged: boolean("is_flagged").default(false).notNull(),
  // Which session this answer belongs to
  session: mysqlEnum("session", ["math_session", "science_session"]),
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

// ─── Background Questionnaire Responses ──────────────────────────────────────
// TIMSS-style student background questionnaire completed after the exam

export const backgroundQuestionnaireResponses = mysqlTable("background_questionnaire_responses", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: int("attempt_id").notNull().unique(),
  studentId: int("student_id").notNull(),
  examId: int("exam_id").notNull(),
  // JSON: { homeResources, parentEducation, studyHabits, mathAttitude, scienceAttitude, ... }
  responses: json("responses").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export type BackgroundQuestionnaireResponse = typeof backgroundQuestionnaireResponses.$inferSelect;

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
