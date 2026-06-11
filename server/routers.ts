import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { createHash } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import {
  assignExamToClass,
  createClass,
  createExam,
  createPlatformUser,
  createQuestion,
  deactivateExamForClass,
  deleteClass,
  deletePlatformUser,
  deleteQuestion,
  enrollStudentInClass,
  getAllClasses,
  getAllExams,
  getAllPlatformUsers,
  getAllQuestions,
  getAnswersForAttempt,
  getAttemptById,
  getAttemptsByClass,
  getAttemptsByExamAndClass,
  getAttemptsByStudent,
  getClassById,
  getClassExamAssignments,
  getClassesForStudent,
  getExamById,
  getExamWithQuestions,
  getOrCreateAttempt,
  getPlatformUserById,
  getPlatformUserByUsername,
  getQuestionnaireResponse,
  getReportByAttemptId,
  getReportsByClass,
  getReportsByStudent,
  getStudentsInClass,
  removeStudentFromClass,
  saveQuestionnaireResponse,
  saveStudentAnswer,
  saveStudentReport,
  setExamQuestions,
  submitAttempt,
  updateAttemptSession,
  updateClass,
  updateExam,
  updatePlatformUser,
  updateQuestion,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hashPassword(password: string): string {
  return createHash("sha256").update(password + "timss_salt_2024").digest("hex");
}

const JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret || "timss_jwt_secret_2024");

async function signPlatformToken(userId: number, role: string): Promise<string> {
  return new SignJWT({ sub: String(userId), role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);
}

async function verifyPlatformToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

const PLATFORM_COOKIE = "timss_session";

// ─── Middleware ───────────────────────────────────────────────────────────────
const platformProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const token = ctx.req.cookies?.[PLATFORM_COOKIE];
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  const payload = await verifyPlatformToken(token);
  if (!payload || !payload.sub) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid session" });
  const user = await getPlatformUserById(Number(payload.sub));
  if (!user || !user.isActive) throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
  return next({ ctx: { ...ctx, platformUser: user } });
});

const adminProcedure = platformProcedure.use(({ ctx, next }) => {
  if (ctx.platformUser.role !== "admin")
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  return next({ ctx });
});

const teacherOrAdminProcedure = platformProcedure.use(({ ctx, next }) => {
  if (ctx.platformUser.role !== "admin" && ctx.platformUser.role !== "teacher")
    throw new TRPCError({ code: "FORBIDDEN", message: "Teacher or Admin access required" });
  return next({ ctx });
});

// ─── Scoring Helper ───────────────────────────────────────────────────────────
function scoreAnswer(
  questionType: string,
  answerGiven: string | null,
  correctAnswer: string,
  maxPoints: number
): { isCorrect: boolean; pointsEarned: number } {
  if (!answerGiven) return { isCorrect: false, pointsEarned: 0 };

  if (questionType === "multiple_choice") {
    const correct = answerGiven.trim().toUpperCase() === correctAnswer.trim().toUpperCase();
    return { isCorrect: correct, pointsEarned: correct ? maxPoints : 0 };
  }

  if (questionType === "drag_drop" || questionType === "matching") {
    try {
      const given = JSON.parse(answerGiven);
      const expected = JSON.parse(correctAnswer);
      const correct = JSON.stringify(given) === JSON.stringify(expected);
      return { isCorrect: correct, pointsEarned: correct ? maxPoints : 0 };
    } catch {
      return { isCorrect: false, pointsEarned: 0 };
    }
  }

  if (questionType === "ordering") {
    const given = answerGiven.trim().toLowerCase();
    const expected = correctAnswer.trim().toLowerCase();
    const correct = given === expected;
    return { isCorrect: correct, pointsEarned: correct ? maxPoints : 0 };
  }

  if (questionType === "pattern_interaction") {
    const given = answerGiven.trim().toLowerCase();
    const expected = correctAnswer.trim().toLowerCase();
    const correct = given === expected;
    return { isCorrect: correct, pointsEarned: correct ? maxPoints : 0 };
  }

  if (questionType === "psi_lab") {
    try {
      const given = JSON.parse(answerGiven);
      const expected = JSON.parse(correctAnswer);
      let correctCount = 0;
      let total = 0;
      for (const key of Object.keys(expected)) {
        total++;
        if (given[key]?.toString().trim().toLowerCase() === expected[key]?.toString().trim().toLowerCase()) {
          correctCount++;
        }
      }
      if (total === 0) return { isCorrect: false, pointsEarned: 0 };
      const allCorrect = correctCount === total;
      if (maxPoints === 1) return { isCorrect: allCorrect, pointsEarned: allCorrect ? 1 : 0 };
      // Partial credit for PSI lab
      if (correctCount === total) return { isCorrect: true, pointsEarned: 2 };
      if (correctCount >= Math.ceil(total / 2)) return { isCorrect: false, pointsEarned: 1 };
      return { isCorrect: false, pointsEarned: 0 };
    } catch {
      return { isCorrect: false, pointsEarned: 0 };
    }
  }

  if (questionType === "drawing_canvas") {
    // Drawing canvas is teacher-graded; auto-score as 0 pending review
    return { isCorrect: false, pointsEarned: 0 };
  }

  if (questionType === "partial_credit_short_answer") {
    // Auto-score: exact match = full credit, partial keyword match = 1 point
    const given = answerGiven.trim().toLowerCase();
    const expected = correctAnswer.trim().toLowerCase();
    if (given === expected) return { isCorrect: true, pointsEarned: maxPoints };
    // Check if key terms are present
    const keyTerms = expected.split(/[;,\s]+/).filter((t) => t.length > 3);
    const matchCount = keyTerms.filter((t) => given.includes(t)).length;
    if (matchCount >= Math.ceil(keyTerms.length / 2)) return { isCorrect: false, pointsEarned: 1 };
    return { isCorrect: false, pointsEarned: 0 };
  }

  // Default: short_answer
  const given = answerGiven.trim().toLowerCase();
  const expected = correctAnswer.trim().toLowerCase();
  const correct = given === expected || (expected.includes(given) && given.length > 3);
  return { isCorrect: correct, pointsEarned: correct ? maxPoints : 0 };
}

// ─── Report Generation Helper ─────────────────────────────────────────────────
function generateReportData(
  student: { id: number; name: string },
  exam: { id: number; name: string },
  className: string,
  attempt: {
    totalScore: number | null;
    totalMaxPoints: number | null;
    totalQuestions: number | null;
    mathScore: number | null;
    mathMaxPoints: number | null;
    mathTotal: number | null;
    scienceScore: number | null;
    scienceMaxPoints: number | null;
    scienceTotal: number | null;
    domainBreakdown: unknown;
    timeSpentSeconds: number | null;
    session1TimeSpentSeconds: number | null;
    session2TimeSpentSeconds: number | null;
    submittedAt: Date | null;
  },
  answers: Array<{ questionId: number; answerGiven: string | null; isCorrect: boolean | null; pointsEarned: number }>,
  questionsList: Array<{
    id: number;
    subject: string;
    contentDomain: string;
    scienceSubDomain: string | null;
    cognitiveDomain: string;
    difficulty: string;
    questionType: string;
    correctAnswer: string;
    maxPoints: number;
    session: string | null;
  }>
) {
  const totalScore = attempt.totalScore ?? 0;
  const totalMaxPoints = attempt.totalMaxPoints ?? questionsList.length;
  const totalQuestions = attempt.totalQuestions ?? 0;
  const percentage = totalMaxPoints > 0 ? Math.round((totalScore / totalMaxPoints) * 100) : 0;

  const contentDomainScores: Record<string, { earned: number; max: number; total: number }> = {};
  const cognitiveDomainScores: Record<string, { earned: number; max: number; total: number }> = {};
  const scienceSubDomainScores: Record<string, { earned: number; max: number; total: number }> = {};

  for (const ans of answers) {
    const q = questionsList.find((q) => q.id === ans.questionId);
    if (!q) continue;

    if (!contentDomainScores[q.contentDomain]) contentDomainScores[q.contentDomain] = { earned: 0, max: 0, total: 0 };
    if (!cognitiveDomainScores[q.cognitiveDomain]) cognitiveDomainScores[q.cognitiveDomain] = { earned: 0, max: 0, total: 0 };

    contentDomainScores[q.contentDomain].total++;
    contentDomainScores[q.contentDomain].max += q.maxPoints;
    contentDomainScores[q.contentDomain].earned += ans.pointsEarned;

    cognitiveDomainScores[q.cognitiveDomain].total++;
    cognitiveDomainScores[q.cognitiveDomain].max += q.maxPoints;
    cognitiveDomainScores[q.cognitiveDomain].earned += ans.pointsEarned;

    if (q.scienceSubDomain) {
      if (!scienceSubDomainScores[q.scienceSubDomain]) scienceSubDomainScores[q.scienceSubDomain] = { earned: 0, max: 0, total: 0 };
      scienceSubDomainScores[q.scienceSubDomain].total++;
      scienceSubDomainScores[q.scienceSubDomain].max += q.maxPoints;
      scienceSubDomainScores[q.scienceSubDomain].earned += ans.pointsEarned;
    }
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  for (const [domain, scores] of Object.entries(contentDomainScores)) {
    const pct = scores.max > 0 ? (scores.earned / scores.max) * 100 : 0;
    if (pct >= 70) strengths.push(domain);
    else if (pct < 50) weaknesses.push(domain);
  }

  const misconceptions: string[] = [];
  for (const ans of answers) {
    if (ans.pointsEarned === 0 && ans.answerGiven) {
      const q = questionsList.find((q) => q.id === ans.questionId);
      if (q) misconceptions.push(`${q.subject} – ${q.contentDomain} (${q.cognitiveDomain})`);
    }
  }

  let interventionGroup = "Group A – Advanced";
  if (percentage < 40) interventionGroup = "Group D – Intensive Support";
  else if (percentage < 60) interventionGroup = "Group C – Targeted Intervention";
  else if (percentage < 75) interventionGroup = "Group B – Consolidation";

  const nextTargets: string[] = weaknesses.map((w) => `Review and practice: ${w}`);
  if (nextTargets.length === 0) nextTargets.push("Challenge extension tasks across all domains");

  return {
    studentName: student.name,
    className,
    examName: exam.name,
    totalScore,
    totalMaxPoints,
    totalQuestions,
    percentage,
    mathScore: attempt.mathScore ?? 0,
    mathMaxPoints: attempt.mathMaxPoints ?? 0,
    mathTotal: attempt.mathTotal ?? 0,
    scienceScore: attempt.scienceScore ?? 0,
    scienceMaxPoints: attempt.scienceMaxPoints ?? 0,
    scienceTotal: attempt.scienceTotal ?? 0,
    session1TimeSpentSeconds: attempt.session1TimeSpentSeconds ?? 0,
    session2TimeSpentSeconds: attempt.session2TimeSpentSeconds ?? 0,
    contentDomainBreakdown: contentDomainScores,
    cognitiveDomainBreakdown: cognitiveDomainScores,
    scienceSubDomainBreakdown: scienceSubDomainScores,
    strengths: strengths.length > 0 ? strengths : ["No areas of strength identified yet"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["No significant weaknesses identified"],
    misconceptionNotes:
      misconceptions.length > 0
        ? Array.from(new Set(misconceptions)).slice(0, 5)
        : ["No misconceptions identified"],
    recommendedInterventionGroup: interventionGroup,
    nextPracticeTargets: nextTargets,
    timeSpentSeconds: attempt.timeSpentSeconds ?? 0,
    submittedAt: attempt.submittedAt,
    generatedAt: new Date(),
  };
}

// ─── App Router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,

  // ─── OAuth auth (legacy, required by core) ────────────────────────────────
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Platform Auth ────────────────────────────────────────────────────────
  platform: router({
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const user = await getPlatformUserByUsername(input.username.trim());
        if (!user || !user.isActive)
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid username or password" });
        const hash = hashPassword(input.password);
        if (hash !== user.passwordHash)
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid username or password" });
        const token = await signPlatformToken(user.id, user.role);
        const isSecure = ctx.req.protocol === "https" || ctx.req.headers["x-forwarded-proto"] === "https";
        ctx.res.cookie(PLATFORM_COOKIE, token, {
          httpOnly: true,
          secure: isSecure,
          sameSite: isSecure ? "none" : "lax",
          maxAge: 8 * 60 * 60 * 1000,
          path: "/",
        });
        return {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email,
        };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(PLATFORM_COOKIE, { path: "/" });
      return { success: true };
    }),

    me: publicProcedure.query(async ({ ctx }) => {
      const token = ctx.req.cookies?.[PLATFORM_COOKIE];
      if (!token) return null;
      const payload = await verifyPlatformToken(token);
      if (!payload?.sub) return null;
      const user = await getPlatformUserById(Number(payload.sub));
      if (!user || !user.isActive) return null;
      return {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
      };
    }),
  }),

  // ─── Admin: User Management ───────────────────────────────────────────────
  admin: router({
    listUsers: adminProcedure.query(async () => {
      const all = await getAllPlatformUsers();
      return all.map((u) => ({
        id: u.id,
        username: u.username,
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
      }));
    }),

    createUser: adminProcedure
      .input(
        z.object({
          username: z.string().min(3),
          password: z.string().min(6),
          name: z.string().min(1),
          email: z.string().email().optional(),
          role: z.enum(["admin", "teacher", "student"]),
        })
      )
      .mutation(async ({ input }) => {
        const existing = await getPlatformUserByUsername(input.username);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "Username already exists" });
        await createPlatformUser({
          username: input.username,
          passwordHash: hashPassword(input.password),
          name: input.name,
          email: input.email,
          role: input.role,
        });
        return { success: true };
      }),

    updateUser: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          email: z.string().email().optional().nullable(),
          password: z.string().min(6).optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, password, ...rest } = input;
        const data: { name?: string; email?: string | null; isActive?: boolean; passwordHash?: string } = rest;
        if (password) data.passwordHash = hashPassword(password);
        await updatePlatformUser(id, data);
        return { success: true };
      }),

    deleteUser: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletePlatformUser(input.id);
        return { success: true };
      }),

    // Classes
    listClasses: adminProcedure.query(async () => {
      const cls = await getAllClasses();
      const result = [];
      for (const c of cls) {
        const students = await getStudentsInClass(c.id);
        let teacher = null;
        if (c.teacherId) teacher = await getPlatformUserById(c.teacherId);
        result.push({ ...c, studentCount: students.length, teacherName: teacher?.name ?? null });
      }
      return result;
    }),

    createClass: adminProcedure
      .input(z.object({ name: z.string().min(1), grade: z.string().optional(), teacherId: z.number().optional() }))
      .mutation(async ({ input }) => {
        await createClass(input);
        return { success: true };
      }),

    updateClass: adminProcedure
      .input(z.object({ id: z.number(), name: z.string().optional(), teacherId: z.number().nullable().optional() }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateClass(id, data);
        return { success: true };
      }),

    deleteClass: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteClass(input.id);
        return { success: true };
      }),

    enrollStudent: adminProcedure
      .input(z.object({ studentId: z.number(), classId: z.number() }))
      .mutation(async ({ input }) => {
        await enrollStudentInClass(input.studentId, input.classId);
        return { success: true };
      }),

    removeStudentFromClass: adminProcedure
      .input(z.object({ studentId: z.number(), classId: z.number() }))
      .mutation(async ({ input }) => {
        await removeStudentFromClass(input.studentId, input.classId);
        return { success: true };
      }),

    getClassStudents: adminProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ input }) => {
        return getStudentsInClass(input.classId);
      }),

    // Question Bank
    listQuestions: adminProcedure.query(async () => getAllQuestions()),

    createQuestion: adminProcedure
      .input(
        z.object({
          subject: z.enum(["Math", "Science"]),
          contentDomain: z.string().min(1),
          scienceSubDomain: z.enum(["Earth Science", "Biology", "Chemistry", "Physics"]).optional(),
          session: z.enum(["math_session", "science_session"]).optional(),
          blockNumber: z.number().optional(),
          cognitiveDomain: z.enum(["Knowing", "Applying", "Reasoning"]),
          difficulty: z.enum(["Easy", "Medium", "Hard"]),
          questionType: z.enum([
            "multiple_choice", "short_answer", "drag_drop", "matching", "ordering",
            "hotspot", "drawing_canvas", "pattern_interaction", "psi_lab", "partial_credit_short_answer"
          ]),
          maxPoints: z.number().min(1).max(2).optional(),
          questionText: z.string().min(1),
          options: z.unknown().optional(),
          correctAnswer: z.string().min(1),
          imageUrl: z.string().optional(),
          explanation: z.string().optional(),
          interactiveData: z.unknown().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createQuestion(input);
        return { success: true };
      }),

    updateQuestion: adminProcedure
      .input(
        z.object({
          id: z.number(),
          subject: z.enum(["Math", "Science"]).optional(),
          contentDomain: z.string().optional(),
          scienceSubDomain: z.enum(["Earth Science", "Biology", "Chemistry", "Physics"]).optional().nullable(),
          session: z.enum(["math_session", "science_session"]).optional().nullable(),
          blockNumber: z.number().optional().nullable(),
          cognitiveDomain: z.enum(["Knowing", "Applying", "Reasoning"]).optional(),
          difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
          questionType: z.enum([
            "multiple_choice", "short_answer", "drag_drop", "matching", "ordering",
            "hotspot", "drawing_canvas", "pattern_interaction", "psi_lab", "partial_credit_short_answer"
          ]).optional(),
          maxPoints: z.number().min(1).max(2).optional(),
          questionText: z.string().optional(),
          options: z.unknown().optional(),
          correctAnswer: z.string().optional(),
          imageUrl: z.string().optional().nullable(),
          explanation: z.string().optional().nullable(),
          interactiveData: z.unknown().optional().nullable(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateQuestion(id, data as Parameters<typeof updateQuestion>[1]);
        return { success: true };
      }),

    deleteQuestion: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteQuestion(input.id);
        return { success: true };
      }),

    // Exams
    listExams: adminProcedure.query(async () => getAllExams()),

    createExam: adminProcedure
      .input(z.object({ name: z.string().min(1), description: z.string().optional(), durationMinutes: z.number().optional() }))
      .mutation(async ({ input }) => {
        await createExam(input);
        return { success: true };
      }),

    updateExam: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          durationMinutes: z.number().optional(),
          session1Minutes: z.number().optional(),
          breakMinutes: z.number().optional(),
          session2Minutes: z.number().optional(),
          useBlockRotation: z.boolean().optional(),
          isPublished: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateExam(id, data);
        return { success: true };
      }),

    getExamWithQuestions: adminProcedure
      .input(z.object({ examId: z.number() }))
      .query(async ({ input }) => {
        return getExamWithQuestions(input.examId);
      }),

    setExamQuestions: adminProcedure
      .input(z.object({ examId: z.number(), questionIds: z.array(z.number()) }))
      .mutation(async ({ input }) => {
        await setExamQuestions(input.examId, input.questionIds);
        return { success: true };
      }),

    assignExamToClass: adminProcedure
      .input(z.object({ classId: z.number(), examId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await assignExamToClass(input.classId, input.examId, ctx.platformUser.id);
        return { success: true };
      }),

    getClassReports: adminProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ input }) => {
        return getReportsByClass(input.classId);
      }),

    getAttemptsByClass: adminProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ input }) => {
        return getAttemptsByClass(input.classId);
      }),
  }),

  // ─── Teacher ──────────────────────────────────────────────────────────────
  teacher: router({
    myClasses: teacherOrAdminProcedure.query(async ({ ctx }) => {
      if (ctx.platformUser.role === "admin") return getAllClasses();
      const all = await getAllClasses();
      return all.filter((c) => c.teacherId === ctx.platformUser.id);
    }),

    classStudents: teacherOrAdminProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ input, ctx }) => {
        const cls = await getClassById(input.classId);
        if (!cls) throw new TRPCError({ code: "NOT_FOUND" });
        if (ctx.platformUser.role !== "admin" && cls.teacherId !== ctx.platformUser.id)
          throw new TRPCError({ code: "FORBIDDEN" });
        return getStudentsInClass(input.classId);
      }),

    classExams: teacherOrAdminProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ input }) => {
        const assignments = await getClassExamAssignments(input.classId);
        const result = [];
        for (const a of assignments) {
          const exam = await getExamById(a.examId);
          if (exam) result.push({ ...a, examName: exam.name, examDuration: exam.durationMinutes });
        }
        return result;
      }),

    activateExam: teacherOrAdminProcedure
      .input(z.object({ classId: z.number(), examId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const cls = await getClassById(input.classId);
        if (!cls) throw new TRPCError({ code: "NOT_FOUND" });
        if (ctx.platformUser.role !== "admin" && cls.teacherId !== ctx.platformUser.id)
          throw new TRPCError({ code: "FORBIDDEN" });
        await assignExamToClass(input.classId, input.examId, ctx.platformUser.id);
        return { success: true };
      }),

    deactivateExam: teacherOrAdminProcedure
      .input(z.object({ classId: z.number(), examId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const cls = await getClassById(input.classId);
        if (!cls) throw new TRPCError({ code: "NOT_FOUND" });
        if (ctx.platformUser.role !== "admin" && cls.teacherId !== ctx.platformUser.id)
          throw new TRPCError({ code: "FORBIDDEN" });
        await deactivateExamForClass(input.classId, input.examId);
        return { success: true };
      }),

    listAllExams: teacherOrAdminProcedure.query(async () => getAllExams()),

    classProgress: teacherOrAdminProcedure
      .input(z.object({ classId: z.number(), examId: z.number() }))
      .query(async ({ input, ctx }) => {
        const cls = await getClassById(input.classId);
        if (!cls) throw new TRPCError({ code: "NOT_FOUND" });
        if (ctx.platformUser.role !== "admin" && cls.teacherId !== ctx.platformUser.id)
          throw new TRPCError({ code: "FORBIDDEN" });
        const attempts = await getAttemptsByExamAndClass(input.examId, input.classId);
        const result = [];
        for (const a of attempts) {
          const student = await getPlatformUserById(a.studentId);
          result.push({
            ...a,
            studentName: student?.name ?? "Unknown",
            percentage:
              a.totalMaxPoints && a.totalMaxPoints > 0
                ? Math.round(((a.totalScore ?? 0) / a.totalMaxPoints) * 100)
                : a.totalQuestions && a.totalQuestions > 0
                ? Math.round(((a.totalScore ?? 0) / a.totalQuestions) * 100)
                : null,
          });
        }
        return result;
      }),

    getStudentReport: teacherOrAdminProcedure
      .input(z.object({ attemptId: z.number() }))
      .query(async ({ input }) => {
        return getReportByAttemptId(input.attemptId);
      }),

    getClassReports: teacherOrAdminProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ input }) => {
        return getReportsByClass(input.classId);
      }),
  }),

  // ─── Student ──────────────────────────────────────────────────────────────
  student: router({
    availableExams: platformProcedure.query(async ({ ctx }) => {
      const studentClasses = await getClassesForStudent(ctx.platformUser.id);
      const result = [];
      for (const cls of studentClasses) {
        const assignments = await getClassExamAssignments(cls.id);
        for (const a of assignments) {
          if (!a.isActive) continue;
          const exam = await getExamById(a.examId);
          if (!exam) continue;
          const attempts = await getAttemptsByStudent(ctx.platformUser.id);
          const attempt = attempts.find((at) => at.examId === exam.id && at.classId === cls.id);
          result.push({
            exam,
            className: cls.name,
            classId: cls.id,
            attemptStatus: attempt?.status ?? null,
            attemptId: attempt?.id ?? null,
            currentSession: attempt?.currentSession ?? null,
            questionnaireCompleted: attempt?.questionnaireCompleted ?? false,
          });
        }
      }
      return result;
    }),

    startExam: platformProcedure
      .input(z.object({ examId: z.number(), classId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const assignments = await getClassExamAssignments(input.classId);
        const active = assignments.find((a) => a.examId === input.examId && a.isActive);
        if (!active) throw new TRPCError({ code: "FORBIDDEN", message: "Exam is not active" });

        const attempt = await getOrCreateAttempt(ctx.platformUser.id, input.examId, input.classId);
        if (attempt.status === "submitted") {
          const examData = await getExamWithQuestions(input.examId);
          return {
            attemptId: attempt.id,
            examName: examData?.name ?? "Assessment",
            durationMinutes: examData?.durationMinutes ?? 90,
            session1Minutes: examData?.session1Minutes ?? 45,
            breakMinutes: examData?.breakMinutes ?? 5,
            session2Minutes: examData?.session2Minutes ?? 45,
            questions: [],
            session1Questions: [],
            session2Questions: [],
            savedAnswers: [],
            startedAt: attempt.startedAt,
            currentSession: attempt.currentSession,
            alreadySubmitted: true,
            questionnaireCompleted: attempt.questionnaireCompleted,
          };
        }

        const examData = await getExamWithQuestions(input.examId);
        if (!examData) throw new TRPCError({ code: "NOT_FOUND" });

        type RawQ = {
          id: number;
          subject: string;
          contentDomain: string;
          scienceSubDomain: string | null;
          cognitiveDomain: string;
          difficulty: string;
          questionType: string;
          maxPoints: number;
          questionText: string;
          options: unknown;
          imageUrl: string | null;
          interactiveData: unknown;
          examSession: string | null;
          examBlockNumber: number | null;
        };

        const safeQuestions = (examData.questions as RawQ[]).map((q) => ({
          id: q.id,
          subject: q.subject,
          contentDomain: q.contentDomain,
          scienceSubDomain: q.scienceSubDomain,
          cognitiveDomain: q.cognitiveDomain,
          difficulty: q.difficulty,
          questionType: q.questionType,
          maxPoints: q.maxPoints,
          questionText: q.questionText,
          options: q.options,
          imageUrl: q.imageUrl,
          interactiveData: q.interactiveData ?? null,
          session: q.examSession ?? (q.subject === "Math" ? "math_session" : "science_session"),
        }));

        const session1Questions = safeQuestions.filter((q) => q.session === "math_session");
        const session2Questions = safeQuestions.filter((q) => q.session === "science_session");

        const existingAnswers = await getAnswersForAttempt(attempt.id);
        return {
          attemptId: attempt.id,
          examName: examData.name,
          durationMinutes: examData.durationMinutes,
          session1Minutes: examData.session1Minutes,
          breakMinutes: examData.breakMinutes,
          session2Minutes: examData.session2Minutes,
          questions: safeQuestions,
          session1Questions,
          session2Questions,
          savedAnswers: existingAnswers.map((a) => ({
            questionId: a.questionId,
            answerGiven: a.answerGiven,
            isFlagged: a.isFlagged,
            pointsEarned: a.pointsEarned,
          })),
          startedAt: attempt.startedAt,
          currentSession: attempt.currentSession,
          session1CompletedAt: attempt.session1CompletedAt,
          session2StartedAt: attempt.session2StartedAt,
          alreadySubmitted: false,
          questionnaireCompleted: attempt.questionnaireCompleted,
        };
      }),

    // Complete Session 1 (Math) and enter break
    completeSession1: platformProcedure
      .input(z.object({ attemptId: z.number(), session1TimeSpentSeconds: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const attempt = await getAttemptById(input.attemptId);
        if (!attempt) throw new TRPCError({ code: "NOT_FOUND" });
        if (attempt.studentId !== ctx.platformUser.id) throw new TRPCError({ code: "FORBIDDEN" });
        if (attempt.status === "submitted") return { success: true };

        await updateAttemptSession(input.attemptId, {
          status: "on_break",
          currentSession: "science_session",
          session1CompletedAt: new Date(),
          session1TimeSpentSeconds: input.session1TimeSpentSeconds,
        });
        return { success: true };
      }),

    // Start Session 2 (Science) after break
    startSession2: platformProcedure
      .input(z.object({ attemptId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const attempt = await getAttemptById(input.attemptId);
        if (!attempt) throw new TRPCError({ code: "NOT_FOUND" });
        if (attempt.studentId !== ctx.platformUser.id) throw new TRPCError({ code: "FORBIDDEN" });
        if (attempt.status === "submitted") return { success: true };

        await updateAttemptSession(input.attemptId, {
          status: "session2",
          currentSession: "science_session",
          session2StartedAt: new Date(),
        });
        return { success: true };
      }),

    saveAnswer: platformProcedure
      .input(
        z.object({
          attemptId: z.number(),
          questionId: z.number(),
          answerGiven: z.string().nullable(),
          isFlagged: z.boolean().optional(),
          session: z.enum(["math_session", "science_session"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const attempt = await getAttemptById(input.attemptId);
        if (!attempt) throw new TRPCError({ code: "NOT_FOUND" });
        if (attempt.studentId !== ctx.platformUser.id)
          throw new TRPCError({ code: "FORBIDDEN" });
        if (attempt.status === "submitted")
          throw new TRPCError({ code: "FORBIDDEN", message: "Exam already submitted" });
        await saveStudentAnswer({
          attemptId: input.attemptId,
          questionId: input.questionId,
          answerGiven: input.answerGiven,
          isFlagged: input.isFlagged ?? false,
          session: input.session,
        });
        return { success: true };
      }),

    submitExam: platformProcedure
      .input(z.object({
        attemptId: z.number(),
        timeSpentSeconds: z.number(),
        session2TimeSpentSeconds: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const attempt = await getAttemptById(input.attemptId);
        if (!attempt) throw new TRPCError({ code: "NOT_FOUND" });
        if (attempt.studentId !== ctx.platformUser.id)
          throw new TRPCError({ code: "FORBIDDEN" });
        if (attempt.status === "submitted")
          return { success: true, message: "Already submitted" };

        const examData = await getExamWithQuestions(attempt.examId);
        if (!examData) throw new TRPCError({ code: "NOT_FOUND" });

        const answers = await getAnswersForAttempt(input.attemptId);
        type RawQ = {
          id: number;
          subject: string;
          contentDomain: string;
          scienceSubDomain: string | null;
          cognitiveDomain: string;
          difficulty: string;
          questionType: string;
          maxPoints: number;
          correctAnswer: string;
          examSession: string | null;
        };
        const questionsList = examData.questions as RawQ[];

        // Score answers with partial credit
        let totalScore = 0;
        let totalMaxPoints = 0;
        let mathScore = 0;
        let mathMaxPoints = 0;
        let mathTotal = 0;
        let scienceScore = 0;
        let scienceMaxPoints = 0;
        let scienceTotal = 0;
        const contentDomainBreakdown: Record<string, { earned: number; max: number; total: number }> = {};
        const cognitiveDomainBreakdown: Record<string, { earned: number; max: number; total: number }> = {};

        const scoredAnswers: Array<{
          questionId: number;
          answerGiven: string | null;
          isCorrect: boolean | null;
          pointsEarned: number;
        }> = [];

        for (const q of questionsList) {
          const ans = answers.find((a) => a.questionId === q.id);
          const answerGiven = ans?.answerGiven ?? null;
          const maxPoints = q.maxPoints ?? 1;

          const { isCorrect, pointsEarned } = scoreAnswer(q.questionType, answerGiven, q.correctAnswer, maxPoints);

          totalScore += pointsEarned;
          totalMaxPoints += maxPoints;

          const session = q.examSession ?? (q.subject === "Math" ? "math_session" : "science_session");
          if (session === "math_session") {
            mathTotal++;
            mathMaxPoints += maxPoints;
            mathScore += pointsEarned;
          } else {
            scienceTotal++;
            scienceMaxPoints += maxPoints;
            scienceScore += pointsEarned;
          }

          if (!contentDomainBreakdown[q.contentDomain])
            contentDomainBreakdown[q.contentDomain] = { earned: 0, max: 0, total: 0 };
          contentDomainBreakdown[q.contentDomain].total++;
          contentDomainBreakdown[q.contentDomain].max += maxPoints;
          contentDomainBreakdown[q.contentDomain].earned += pointsEarned;

          if (!cognitiveDomainBreakdown[q.cognitiveDomain])
            cognitiveDomainBreakdown[q.cognitiveDomain] = { earned: 0, max: 0, total: 0 };
          cognitiveDomainBreakdown[q.cognitiveDomain].total++;
          cognitiveDomainBreakdown[q.cognitiveDomain].max += maxPoints;
          cognitiveDomainBreakdown[q.cognitiveDomain].earned += pointsEarned;

          // Update answer with scoring
          if (ans) {
            await saveStudentAnswer({
              attemptId: input.attemptId,
              questionId: q.id,
              answerGiven,
              isFlagged: ans.isFlagged,
              pointsEarned,
              session: session as "math_session" | "science_session",
            });
          }
          scoredAnswers.push({ questionId: q.id, answerGiven, isCorrect, pointsEarned });
        }

        await submitAttempt(input.attemptId, {
          totalScore,
          totalMaxPoints,
          totalQuestions: questionsList.length,
          mathScore,
          mathMaxPoints,
          mathTotal,
          scienceScore,
          scienceMaxPoints,
          scienceTotal,
          domainBreakdown: { contentDomain: contentDomainBreakdown, cognitiveDomain: cognitiveDomainBreakdown },
          timeSpentSeconds: input.timeSpentSeconds,
          session1TimeSpentSeconds: attempt.session1TimeSpentSeconds ?? undefined,
          session2TimeSpentSeconds: input.session2TimeSpentSeconds,
        });

        // Generate report
        const student = await getPlatformUserById(ctx.platformUser.id);
        const exam = await getExamById(attempt.examId);
        const cls = await getClassById(attempt.classId);
        if (student && exam && cls) {
          const reportData = generateReportData(
            { id: student.id, name: student.name },
            { id: exam.id, name: exam.name },
            cls.name,
            {
              totalScore,
              totalMaxPoints,
              totalQuestions: questionsList.length,
              mathScore,
              mathMaxPoints,
              mathTotal,
              scienceScore,
              scienceMaxPoints,
              scienceTotal,
              domainBreakdown: { contentDomain: contentDomainBreakdown, cognitiveDomain: cognitiveDomainBreakdown },
              timeSpentSeconds: input.timeSpentSeconds,
              session1TimeSpentSeconds: attempt.session1TimeSpentSeconds ?? null,
              session2TimeSpentSeconds: input.session2TimeSpentSeconds ?? null,
              submittedAt: new Date(),
            },
            scoredAnswers,
            questionsList.map((q) => ({
              ...q,
              scienceSubDomain: q.scienceSubDomain,
              maxPoints: q.maxPoints ?? 1,
              session: q.examSession,
            }))
          );
          await saveStudentReport({
            attemptId: input.attemptId,
            studentId: ctx.platformUser.id,
            examId: attempt.examId,
            classId: attempt.classId,
            reportData,
          });
        }

        return { success: true };
      }),

    // Submit background questionnaire
    submitQuestionnaire: platformProcedure
      .input(z.object({
        attemptId: z.number(),
        responses: z.record(z.string(), z.unknown()),
      }))
      .mutation(async ({ input, ctx }) => {
        const attempt = await getAttemptById(input.attemptId);
        if (!attempt) throw new TRPCError({ code: "NOT_FOUND" });
        if (attempt.studentId !== ctx.platformUser.id) throw new TRPCError({ code: "FORBIDDEN" });

        await saveQuestionnaireResponse({
          attemptId: input.attemptId,
          studentId: ctx.platformUser.id,
          examId: attempt.examId,
          responses: input.responses,
        });
        return { success: true };
      }),

    getQuestionnaire: platformProcedure
      .input(z.object({ attemptId: z.number() }))
      .query(async ({ input, ctx }) => {
        const attempt = await getAttemptById(input.attemptId);
        if (!attempt) throw new TRPCError({ code: "NOT_FOUND" });
        if (attempt.studentId !== ctx.platformUser.id) throw new TRPCError({ code: "FORBIDDEN" });
        return getQuestionnaireResponse(input.attemptId);
      }),

    myAttempts: platformProcedure.query(async ({ ctx }) => {
      return getAttemptsByStudent(ctx.platformUser.id);
    }),

    myReports: platformProcedure.query(async ({ ctx }) => {
      return getReportsByStudent(ctx.platformUser.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
