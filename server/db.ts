import { and, eq, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  classExamAssignments,
  classes,
  examQuestions,
  exams,
  platformUsers,
  questions,
  studentAnswers,
  studentClasses,
  studentExamAttempts,
  studentReports,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── OAuth users (legacy, required by auth core) ──────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    const value = user[field];
    if (value !== undefined) {
      values[field] = value ?? null;
      updateSet[field] = value ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

// ─── Platform Users ───────────────────────────────────────────────────────────
export async function getPlatformUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(platformUsers)
    .where(sql`LOWER(${platformUsers.username}) = LOWER(${username})`)
    .limit(1);
  return result[0];
}

export async function getPlatformUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(platformUsers)
    .where(eq(platformUsers.id, id))
    .limit(1);
  return result[0];
}

export async function getAllPlatformUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(platformUsers).orderBy(platformUsers.createdAt);
}

export async function createPlatformUser(data: {
  username: string;
  passwordHash: string;
  name: string;
  email?: string;
  role: "admin" | "teacher" | "student";
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(platformUsers).values(data);
  return result;
}

export async function updatePlatformUser(
  id: number,
  data: Partial<{
    username: string;
    passwordHash: string;
    name: string;
    email: string | null;
    isActive: boolean;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(platformUsers).set(data).where(eq(platformUsers.id, id));
}

export async function deletePlatformUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(platformUsers).where(eq(platformUsers.id, id));
}

// ─── Classes ──────────────────────────────────────────────────────────────────
export async function getAllClasses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(classes).orderBy(classes.name);
}

export async function getClassById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(classes).where(eq(classes.id, id)).limit(1);
  return result[0];
}

export async function createClass(data: { name: string; grade?: string; teacherId?: number }) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(classes).values(data);
}

export async function updateClass(id: number, data: Partial<{ name: string; grade: string; teacherId: number | null }>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(classes).set(data).where(eq(classes.id, id));
}

export async function deleteClass(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(classes).where(eq(classes.id, id));
}

export async function getStudentsInClass(classId: number) {
  const db = await getDb();
  if (!db) return [];
  const enrollments = await db
    .select()
    .from(studentClasses)
    .where(eq(studentClasses.classId, classId));
  if (enrollments.length === 0) return [];
  const studentIds = enrollments.map((e) => e.studentId);
  return db
    .select()
    .from(platformUsers)
    .where(inArray(platformUsers.id, studentIds));
}

export async function getClassesForStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  const enrollments = await db
    .select()
    .from(studentClasses)
    .where(eq(studentClasses.studentId, studentId));
  if (enrollments.length === 0) return [];
  const classIds = enrollments.map((e) => e.classId);
  return db.select().from(classes).where(inArray(classes.id, classIds));
}

export async function enrollStudentInClass(studentId: number, classId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  // Check if already enrolled
  const existing = await db
    .select()
    .from(studentClasses)
    .where(and(eq(studentClasses.studentId, studentId), eq(studentClasses.classId, classId)))
    .limit(1);
  if (existing.length > 0) return;
  await db.insert(studentClasses).values({ studentId, classId });
}

export async function removeStudentFromClass(studentId: number, classId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .delete(studentClasses)
    .where(and(eq(studentClasses.studentId, studentId), eq(studentClasses.classId, classId)));
}

// ─── Questions ────────────────────────────────────────────────────────────────
export async function getAllQuestions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(questions).orderBy(questions.subject, questions.contentDomain);
}

export async function getQuestionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
  return result[0];
}

export async function createQuestion(data: {
  subject: "Math" | "Science";
  contentDomain: string;
  cognitiveDomain: "Knowing" | "Applying" | "Reasoning";
  difficulty: "Easy" | "Medium" | "Hard";
  questionType: "multiple_choice" | "short_answer";
  questionText: string;
  options?: unknown;
  correctAnswer: string;
  imageUrl?: string;
  explanation?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(questions).values(data);
}

export async function updateQuestion(id: number, data: Partial<typeof questions.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(questions).set(data).where(eq(questions.id, id));
}

export async function deleteQuestion(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(questions).where(eq(questions.id, id));
}

// ─── Exams ────────────────────────────────────────────────────────────────────
export async function getAllExams() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(exams).orderBy(exams.id);
}

export async function getExamById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(exams).where(eq(exams.id, id)).limit(1);
  return result[0];
}

export async function getExamWithQuestions(examId: number) {
  const db = await getDb();
  if (!db) return null;
  const exam = await getExamById(examId);
  if (!exam) return null;
  const eqs = await db
    .select()
    .from(examQuestions)
    .where(eq(examQuestions.examId, examId))
    .orderBy(examQuestions.orderIndex);
  if (eqs.length === 0) return { ...exam, questions: [] };
  const qIds = eqs.map((eq_) => eq_.questionId);
  const qs = await db.select().from(questions).where(inArray(questions.id, qIds));
  const qMap = new Map(qs.map((q) => [q.id, q]));
  const orderedQuestions = eqs.map((eq_) => qMap.get(eq_.questionId)).filter(Boolean);
  return { ...exam, questions: orderedQuestions };
}

export async function createExam(data: { name: string; description?: string; durationMinutes?: number }) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(exams).values(data);
}

export async function updateExam(id: number, data: Partial<typeof exams.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(exams).set(data).where(eq(exams.id, id));
}

export async function addQuestionToExam(examId: number, questionId: number, orderIndex: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(examQuestions).values({ examId, questionId, orderIndex });
}

export async function removeQuestionFromExam(examId: number, questionId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .delete(examQuestions)
    .where(and(eq(examQuestions.examId, examId), eq(examQuestions.questionId, questionId)));
}

export async function setExamQuestions(examId: number, questionIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(examQuestions).where(eq(examQuestions.examId, examId));
  for (let i = 0; i < questionIds.length; i++) {
    await db.insert(examQuestions).values({ examId, questionId: questionIds[i], orderIndex: i + 1 });
  }
}

// ─── Class Exam Assignments ───────────────────────────────────────────────────
export async function getClassExamAssignments(classId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(classExamAssignments)
    .where(eq(classExamAssignments.classId, classId));
}

export async function getActiveExamsForClass(classId: number) {
  const db = await getDb();
  if (!db) return [];
  const assignments = await db
    .select()
    .from(classExamAssignments)
    .where(and(eq(classExamAssignments.classId, classId), eq(classExamAssignments.isActive, true)));
  if (assignments.length === 0) return [];
  const examIds = assignments.map((a) => a.examId);
  return db.select().from(exams).where(inArray(exams.id, examIds));
}

export async function assignExamToClass(classId: number, examId: number, activatedBy: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db
    .select()
    .from(classExamAssignments)
    .where(and(eq(classExamAssignments.classId, classId), eq(classExamAssignments.examId, examId)))
    .limit(1);
  if (existing.length > 0) {
    await db
      .update(classExamAssignments)
      .set({ isActive: true, activatedAt: new Date(), activatedBy })
      .where(eq(classExamAssignments.id, existing[0].id));
  } else {
    await db.insert(classExamAssignments).values({
      classId,
      examId,
      isActive: true,
      activatedAt: new Date(),
      activatedBy,
    });
  }
}

export async function deactivateExamForClass(classId: number, examId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .update(classExamAssignments)
    .set({ isActive: false })
    .where(and(eq(classExamAssignments.classId, classId), eq(classExamAssignments.examId, examId)));
}

// ─── Student Exam Attempts ────────────────────────────────────────────────────
export async function getOrCreateAttempt(studentId: number, examId: number, classId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db
    .select()
    .from(studentExamAttempts)
    .where(
      and(
        eq(studentExamAttempts.studentId, studentId),
        eq(studentExamAttempts.examId, examId),
        eq(studentExamAttempts.classId, classId)
      )
    )
    .limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(studentExamAttempts).values({ studentId, examId, classId });
  const created = await db
    .select()
    .from(studentExamAttempts)
    .where(
      and(
        eq(studentExamAttempts.studentId, studentId),
        eq(studentExamAttempts.examId, examId),
        eq(studentExamAttempts.classId, classId)
      )
    )
    .limit(1);
  return created[0];
}

export async function getAttemptById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(studentExamAttempts)
    .where(eq(studentExamAttempts.id, id))
    .limit(1);
  return result[0];
}

export async function getAttemptsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(studentExamAttempts)
    .where(eq(studentExamAttempts.studentId, studentId))
    .orderBy(studentExamAttempts.createdAt);
}

export async function getAttemptsByClass(classId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(studentExamAttempts)
    .where(eq(studentExamAttempts.classId, classId))
    .orderBy(studentExamAttempts.submittedAt);
}

export async function getAttemptsByExamAndClass(examId: number, classId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(studentExamAttempts)
    .where(
      and(
        eq(studentExamAttempts.examId, examId),
        eq(studentExamAttempts.classId, classId)
      )
    )
    .orderBy(studentExamAttempts.submittedAt);
}

export async function saveStudentAnswer(data: {
  attemptId: number;
  questionId: number;
  answerGiven: string | null;
  isFlagged?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db
    .select()
    .from(studentAnswers)
    .where(
      and(
        eq(studentAnswers.attemptId, data.attemptId),
        eq(studentAnswers.questionId, data.questionId)
      )
    )
    .limit(1);
  if (existing.length > 0) {
    await db
      .update(studentAnswers)
      .set({ answerGiven: data.answerGiven, isFlagged: data.isFlagged ?? false })
      .where(eq(studentAnswers.id, existing[0].id));
  } else {
    await db.insert(studentAnswers).values(data);
  }
}

export async function getAnswersForAttempt(attemptId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(studentAnswers)
    .where(eq(studentAnswers.attemptId, attemptId));
}

export async function submitAttempt(
  attemptId: number,
  scores: {
    totalScore: number;
    totalQuestions: number;
    mathScore: number;
    mathTotal: number;
    scienceScore: number;
    scienceTotal: number;
    domainBreakdown: unknown;
    timeSpentSeconds: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .update(studentExamAttempts)
    .set({
      status: "submitted",
      submittedAt: new Date(),
      ...scores,
    })
    .where(eq(studentExamAttempts.id, attemptId));
}

// ─── Student Reports ──────────────────────────────────────────────────────────
export async function saveStudentReport(data: {
  attemptId: number;
  studentId: number;
  examId: number;
  classId: number;
  reportData: unknown;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db
    .select()
    .from(studentReports)
    .where(eq(studentReports.attemptId, data.attemptId))
    .limit(1);
  if (existing.length > 0) {
    await db
      .update(studentReports)
      .set({ reportData: data.reportData, generatedAt: new Date() })
      .where(eq(studentReports.id, existing[0].id));
  } else {
    await db.insert(studentReports).values(data);
  }
}

export async function getReportByAttemptId(attemptId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(studentReports)
    .where(eq(studentReports.attemptId, attemptId))
    .limit(1);
  return result[0];
}

export async function getReportsByClass(classId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(studentReports)
    .where(eq(studentReports.classId, classId));
}

export async function getReportsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(studentReports)
    .where(eq(studentReports.studentId, studentId));
}
