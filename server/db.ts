import { and, eq, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  backgroundQuestionnaireResponses,
  classExamAssignments,
  classes,
  examBlocks,
  examQuestions,
  exams,
  platformUsers,
  questions,
  studentAnswers,
  studentClasses,
  studentExamAssignments,
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

export async function createQuestion(data: Partial<typeof questions.$inferInsert> & {
  subject: "Math" | "Science";
  contentDomain: string;
  cognitiveDomain: "Knowing" | "Applying" | "Reasoning";
  difficulty: "Easy" | "Medium" | "Hard";
  questionType: string;
  questionText: string;
  correctAnswer: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(questions).values(data as typeof questions.$inferInsert);
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
  // Attach session/blockNumber from exam_questions join
  const orderedQuestions = eqs.map((eq_) => {
    const q = qMap.get(eq_.questionId);
    if (!q) return null;
    return { ...q, examSession: eq_.session, examBlockNumber: eq_.blockNumber };
  }).filter(Boolean);
  return { ...exam, questions: orderedQuestions };
}

export async function getExamBlocks(examId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(examBlocks).where(eq(examBlocks.examId, examId)).orderBy(examBlocks.blockNumber);
}

export async function createExam(data: {
  name: string;
  description?: string;
  durationMinutes?: number;
  grade?: number;
  session1Minutes?: number;
  breakMinutes?: number;
  session2Minutes?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(exams).values(data);
}

export async function updateExam(id: number, data: Partial<typeof exams.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(exams).set(data).where(eq(exams.id, id));
}

export async function deleteExam(examId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  // Cascade delete in dependency order
  // 1. Delete student answers for all attempts of this exam
  const attempts = await db.select({ id: studentExamAttempts.id }).from(studentExamAttempts).where(eq(studentExamAttempts.examId, examId));
  if (attempts.length > 0) {
    const attemptIds = attempts.map((a) => a.id);
    await db.delete(studentAnswers).where(inArray(studentAnswers.attemptId, attemptIds));
    await db.delete(studentReports).where(inArray(studentReports.attemptId, attemptIds));
    await db.delete(studentExamAttempts).where(eq(studentExamAttempts.examId, examId));
  }
  // 2. Delete class assignments
  await db.delete(classExamAssignments).where(eq(classExamAssignments.examId, examId));
  // 3. Delete exam questions
  await db.delete(examQuestions).where(eq(examQuestions.examId, examId));
  // 4. Delete the exam itself
  await db.delete(exams).where(eq(exams.id, examId));
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
export async function getExamClassAssignments(examId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(classExamAssignments)
    .where(eq(classExamAssignments.examId, examId));
}

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

export async function updateAttemptSession(
  attemptId: number,
  data: {
    status?: "in_progress" | "on_break" | "session2" | "submitted" | "graded";
    currentSession?: "math_session" | "science_session";
    session1CompletedAt?: Date;
    session2StartedAt?: Date;
    session1TimeSpentSeconds?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(studentExamAttempts).set(data).where(eq(studentExamAttempts.id, attemptId));
}

export async function saveStudentAnswer(data: {
  attemptId: number;
  questionId: number;
  answerGiven: string | null;
  isFlagged?: boolean;
  pointsEarned?: number;
  session?: "math_session" | "science_session";
  drawingPartBAnswer?: string | null;
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
      .set({
        answerGiven: data.answerGiven,
        isFlagged: data.isFlagged ?? false,
        ...(data.pointsEarned !== undefined ? { pointsEarned: data.pointsEarned } : {}),
        ...(data.session ? { session: data.session } : {}),
        ...(data.drawingPartBAnswer !== undefined ? { drawingPartBAnswer: data.drawingPartBAnswer } : {}),
      })
      .where(eq(studentAnswers.id, existing[0].id));
  } else {
    await db.insert(studentAnswers).values({
      attemptId: data.attemptId,
      questionId: data.questionId,
      answerGiven: data.answerGiven,
      isFlagged: data.isFlagged ?? false,
      pointsEarned: data.pointsEarned ?? 0,
      session: data.session,
      drawingPartBAnswer: data.drawingPartBAnswer ?? null,
    });
  }
}

export async function getAnswersForAttempt(attemptId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      // student_answers fields
      id: studentAnswers.id,
      attemptId: studentAnswers.attemptId,
      questionId: studentAnswers.questionId,
      answerGiven: studentAnswers.answerGiven,
      isCorrect: studentAnswers.isCorrect,
      pointsEarned: studentAnswers.pointsEarned,
      isFlagged: studentAnswers.isFlagged,
      session: studentAnswers.session,
      drawingPartBAnswer: studentAnswers.drawingPartBAnswer,
      createdAt: studentAnswers.createdAt,
      updatedAt: studentAnswers.updatedAt,
      // joined question fields
      questionText: questions.questionText,
      questionType: questions.questionType,
      options: questions.options,
      correctAnswer: questions.correctAnswer,
      explanation: questions.explanation,
      imageUrl: questions.imageUrl,
      maxPoints: questions.maxPoints,
      subject: questions.subject,
      contentDomain: questions.contentDomain,
      scienceSubDomain: questions.scienceSubDomain,
    })
    .from(studentAnswers)
    .leftJoin(questions, eq(studentAnswers.questionId, questions.id))
    .where(eq(studentAnswers.attemptId, attemptId));
}

export async function submitAttempt(
  attemptId: number,
  scores: {
    totalScore: number;
    totalMaxPoints: number;
    totalQuestions: number;
    mathScore: number;
    mathMaxPoints: number;
    mathTotal: number;
    scienceScore: number;
    scienceMaxPoints: number;
    scienceTotal: number;
    domainBreakdown: unknown;
    timeSpentSeconds: number;
    session1TimeSpentSeconds?: number;
    session2TimeSpentSeconds?: number;
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

// ─── Background Questionnaire ─────────────────────────────────────────────────
export async function saveQuestionnaireResponse(data: {
  attemptId: number;
  studentId: number;
  examId: number;
  responses: unknown;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db
    .select()
    .from(backgroundQuestionnaireResponses)
    .where(eq(backgroundQuestionnaireResponses.attemptId, data.attemptId))
    .limit(1);
  if (existing.length > 0) {
    await db
      .update(backgroundQuestionnaireResponses)
      .set({ responses: data.responses, completedAt: new Date() })
      .where(eq(backgroundQuestionnaireResponses.id, existing[0].id));
  } else {
    await db.insert(backgroundQuestionnaireResponses).values(data);
  }
  // Mark attempt as questionnaire completed
  await db
    .update(studentExamAttempts)
    .set({ questionnaireCompleted: true })
    .where(eq(studentExamAttempts.id, data.attemptId));
}

export async function getQuestionnaireResponse(attemptId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(backgroundQuestionnaireResponses)
    .where(eq(backgroundQuestionnaireResponses.attemptId, attemptId))
    .limit(1);
  return result[0];
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

// ─── Drawing Canvas Review ────────────────────────────────────────────────────
export async function getDrawingAnswersForReview(classId: number, examId: number) {
  const db = await getDb();
  if (!db) return [];
  // Get all submitted attempts for this class+exam
  const attempts = await db
    .select()
    .from(studentExamAttempts)
    .where(and(eq(studentExamAttempts.classId, classId), eq(studentExamAttempts.examId, examId), eq(studentExamAttempts.status, "submitted")));
  if (attempts.length === 0) return [];
  const attemptIds = attempts.map((a) => a.id);
  // Get all drawing_canvas answers
  // Filter drawing_canvas answers by joining with questions table
  const allAnswers = await db
    .select()
    .from(studentAnswers)
    .where(inArray(studentAnswers.attemptId, attemptIds));
  // Get question types for these answers
  const questionIds = Array.from(new Set(allAnswers.map((a) => a.questionId)));
  const questionTypes = questionIds.length > 0
    ? await db.select({ id: questions.id, questionType: questions.questionType }).from(questions).where(inArray(questions.id, questionIds))
    : [];
  const drawingQuestionIds = new Set(questionTypes.filter((q) => q.questionType === "drawing_canvas").map((q) => q.id));
  const drawingAnswers = allAnswers.filter((a) => drawingQuestionIds.has(a.questionId));
  // Enrich with question text and student name
  const result = [];
  for (const ans of drawingAnswers) {
    const q = await db.select().from(questions).where(eq(questions.id, ans.questionId)).limit(1);
    const attempt = attempts.find((a) => a.id === ans.attemptId);
    const student = attempt
      ? await db.select().from(platformUsers).where(eq(platformUsers.id, attempt.studentId)).limit(1)
      : [];
    result.push({
      answerId: ans.id,
      attemptId: ans.attemptId,
      questionId: ans.questionId,
      questionText: q[0]?.questionText ?? "Unknown question",
      maxPoints: q[0]?.maxPoints ?? 1,
      answerGiven: ans.answerGiven,
      pointsEarned: ans.pointsEarned ?? 0,
      reviewedAt: ans.updatedAt ?? null,
      studentName: student[0]?.name ?? "Unknown student",
      studentId: attempt?.studentId ?? 0,
    });
  }
  return result;
}

export async function updateDrawingAnswerScore(answerId: number, pointsEarned: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(studentAnswers)
    .set({ pointsEarned, isCorrect: pointsEarned > 0, updatedAt: new Date() })
    .where(eq(studentAnswers.id, answerId));
}

export async function recalculateAttemptScore(attemptId: number) {
  const db = await getDb();
  if (!db) return;
  const answers = await db
    .select()
    .from(studentAnswers)
    .where(eq(studentAnswers.attemptId, attemptId));
  const attempt = await db
    .select()
    .from(studentExamAttempts)
    .where(eq(studentExamAttempts.id, attemptId))
    .limit(1);
  if (!attempt[0]) return;

  let totalScore = 0;
  let totalMaxPoints = 0;
  let mathScore = 0;
  let mathMaxPoints = 0;
  let scienceScore = 0;
  let scienceMaxPoints = 0;

  for (const ans of answers) {
    const q = await db.select().from(questions).where(eq(questions.id, ans.questionId)).limit(1);
    if (!q[0]) continue;
    const pts = ans.pointsEarned ?? 0;
    const maxPts = q[0].maxPoints ?? 1;
    totalScore += pts;
    totalMaxPoints += maxPts;
    if (q[0].subject === "Math") {
      mathScore += pts;
      mathMaxPoints += maxPts;
    } else {
      scienceScore += pts;
      scienceMaxPoints += maxPts;
    }
  }

  await db
    .update(studentExamAttempts)
    .set({ totalScore, totalMaxPoints, mathScore, mathMaxPoints, scienceScore, scienceMaxPoints })
    .where(eq(studentExamAttempts.id, attemptId));

  return { totalScore, totalMaxPoints, mathScore, mathMaxPoints, scienceScore, scienceMaxPoints };
}

export async function getStudentAttemptDetail(attemptId: number) {
  const db = await getDb();
  if (!db) return null;

  const attempt = await db
    .select()
    .from(studentExamAttempts)
    .where(eq(studentExamAttempts.id, attemptId))
    .limit(1);
  if (!attempt[0]) return null;

  const answers = await db
    .select()
    .from(studentAnswers)
    .where(eq(studentAnswers.attemptId, attemptId));

  // Get all questions for this exam
  const examQs = await db
    .select()
    .from(examQuestions)
    .where(eq(examQuestions.examId, attempt[0].examId))
    .orderBy(examQuestions.orderIndex);

  const questionDetails = [];
  for (const eqRow of examQs) {
    const q = await db.select().from(questions).where(eq(questions.id, eqRow.questionId)).limit(1);
    if (!q[0]) continue;
    const ans = answers.find((a) => a.questionId === q[0].id);
    questionDetails.push({
      questionId: q[0].id,
      questionText: q[0].questionText,
      questionType: q[0].questionType,
      subject: q[0].subject,
      contentDomain: q[0].contentDomain,
      correctAnswer: q[0].correctAnswer,
      options: q[0].options,
      interactiveData: q[0].interactiveData,
      maxPoints: q[0].maxPoints ?? 1,
      session: q[0].session,
      answerId: ans?.id ?? null,
      answerGiven: ans?.answerGiven ?? null,
      isCorrect: ans?.isCorrect ?? null,
      pointsEarned: ans?.pointsEarned ?? 0,
      isFlagged: ans?.isFlagged ?? false,
    });
  }

  return {
    attempt: attempt[0],
    questions: questionDetails,
  };
}

export async function overrideAnswerScore(answerId: number, pointsEarned: number, isCorrect: boolean) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(studentAnswers)
    .set({ pointsEarned, isCorrect, updatedAt: new Date() })
    .where(eq(studentAnswers.id, answerId));
}


// ─── Per-Student Exam Assignments ────────────────────────────────────────────

/** Get all exam assignments for a specific student */
export async function getStudentExamAssignments(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(studentExamAssignments)
    .where(eq(studentExamAssignments.studentId, studentId));
}

/** Get all student assignments for a class (for teacher UI) */
export async function getExamAssignmentsForClass(classId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(studentExamAssignments)
    .where(eq(studentExamAssignments.classId, classId));
}

/** Assign a specific exam to a specific student in a class */
export async function assignExamToStudent(
  studentId: number,
  examId: number,
  classId: number,
  assignedBy?: number | null
) {
  const db = await getDb();
  if (!db) return;
  // Upsert — ignore duplicate
  await db
    .insert(studentExamAssignments)
    .values({ studentId, examId, classId, assignedBy: assignedBy ?? null })
    .onDuplicateKeyUpdate({ set: { assignedBy: assignedBy ?? null } });
}

/** Remove a specific exam assignment from a student */
export async function removeExamFromStudent(
  studentId: number,
  examId: number,
  classId: number
) {
  const db = await getDb();
  if (!db) return;
  await db
    .delete(studentExamAssignments)
    .where(
      and(
        eq(studentExamAssignments.studentId, studentId),
        eq(studentExamAssignments.examId, examId),
        eq(studentExamAssignments.classId, classId)
      )
    );
}
