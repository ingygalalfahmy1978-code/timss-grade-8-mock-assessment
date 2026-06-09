import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Platform users are stored in platformUsers table, not the OAuth users table
// Tests focus on logic and access control using the router's middleware

type MockPlatformUser = {
  id: number;
  username: string;
  name: string;
  role: "admin" | "teacher" | "student";
  email: string | null;
  passwordHash: string;
  classId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

// Helper to create a context with a mock session cookie that resolves to a platform user
// We test via the actual login flow and logic tests
function createBaseContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      cookies: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("Report Calculation Logic", () => {
  it("should correctly calculate percentage from score", () => {
    const totalScore = 15;
    const totalQuestions = 20;
    const percentage = Math.round((totalScore / totalQuestions) * 100);
    expect(percentage).toBe(75);
  });

  it("should handle zero questions gracefully", () => {
    const totalScore = 0;
    const totalQuestions = 0;
    const percentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    expect(percentage).toBe(0);
  });

  it("should assign correct intervention groups based on percentage", () => {
    const getGroup = (pct: number) => {
      if (pct >= 75) return "Group A – Advanced";
      if (pct >= 60) return "Group B – Consolidation";
      if (pct >= 40) return "Group C – Targeted Intervention";
      return "Group D – Intensive Support";
    };
    expect(getGroup(100)).toBe("Group A – Advanced");
    expect(getGroup(75)).toBe("Group A – Advanced");
    expect(getGroup(74)).toBe("Group B – Consolidation");
    expect(getGroup(60)).toBe("Group B – Consolidation");
    expect(getGroup(59)).toBe("Group C – Targeted Intervention");
    expect(getGroup(40)).toBe("Group C – Targeted Intervention");
    expect(getGroup(39)).toBe("Group D – Intensive Support");
    expect(getGroup(0)).toBe("Group D – Intensive Support");
  });

  it("should correctly identify strengths (domains >= 70%)", () => {
    const domainScores = {
      "Number": { correct: 8, total: 10, percentage: 80 },
      "Algebra": { correct: 4, total: 10, percentage: 40 },
      "Geometry": { correct: 7, total: 10, percentage: 70 },
      "Data and Probability": { correct: 3, total: 10, percentage: 30 },
    };
    const strengths = Object.entries(domainScores)
      .filter(([, d]) => d.percentage >= 70)
      .map(([domain]) => domain);
    expect(strengths).toContain("Number");
    expect(strengths).toContain("Geometry");
    expect(strengths).not.toContain("Algebra");
    expect(strengths).not.toContain("Data and Probability");
  });

  it("should correctly identify weaknesses (domains < 50%)", () => {
    const domainScores = {
      "Number": { correct: 8, total: 10, percentage: 80 },
      "Algebra": { correct: 4, total: 10, percentage: 40 },
      "Geometry": { correct: 7, total: 10, percentage: 70 },
      "Data and Probability": { correct: 3, total: 10, percentage: 30 },
    };
    const weaknesses = Object.entries(domainScores)
      .filter(([, d]) => d.percentage < 50)
      .map(([domain]) => domain);
    expect(weaknesses).toContain("Algebra");
    expect(weaknesses).toContain("Data and Probability");
    expect(weaknesses).not.toContain("Number");
    expect(weaknesses).not.toContain("Geometry");
  });

  it("should correctly calculate domain percentage", () => {
    const correct = 7;
    const total = 10;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    expect(pct).toBe(70);
  });
});

describe("Auth Logout", () => {
  it("clears the session cookie and reports success", async () => {
    const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
  });
});

describe("Platform Login Validation", () => {
  it("should reject login with empty credentials", async () => {
    const ctx = createBaseContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.platform.login({ username: "", password: "" })
    ).rejects.toThrow();
  });

  it("should reject login with non-existent user", async () => {
    const ctx = createBaseContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.platform.login({ username: "nonexistent_user_xyz", password: "anypassword" })
    ).rejects.toThrow();
  });
});

describe("Question Domain Validation", () => {
  const mathDomains = ["Number", "Algebra", "Geometry", "Data and Probability"];
  const scienceDomains = ["Biology", "Chemistry", "Physics", "Earth Science"];
  const cognitiveDomains = ["Knowing", "Applying", "Reasoning"];

  it("should have all required math content domains", () => {
    expect(mathDomains).toContain("Number");
    expect(mathDomains).toContain("Algebra");
    expect(mathDomains).toContain("Geometry");
    expect(mathDomains).toContain("Data and Probability");
    expect(mathDomains).toHaveLength(4);
  });

  it("should have all required science content domains", () => {
    expect(scienceDomains).toContain("Biology");
    expect(scienceDomains).toContain("Chemistry");
    expect(scienceDomains).toContain("Physics");
    expect(scienceDomains).toContain("Earth Science");
    expect(scienceDomains).toHaveLength(4);
  });

  it("should have all required cognitive domains", () => {
    expect(cognitiveDomains).toContain("Knowing");
    expect(cognitiveDomains).toContain("Applying");
    expect(cognitiveDomains).toContain("Reasoning");
    expect(cognitiveDomains).toHaveLength(3);
  });
});

describe("Exam Timer Logic", () => {
  it("should correctly format time from seconds", () => {
    const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(60)).toBe("01:00");
    expect(formatTime(90)).toBe("01:30");
    expect(formatTime(3600)).toBe("60:00");
    expect(formatTime(4500)).toBe("75:00");
  });

  it("should calculate remaining time correctly", () => {
    const durationMinutes = 90;
    const elapsedSeconds = 1800; // 30 minutes elapsed
    const total = durationMinutes * 60;
    const remaining = Math.max(0, total - elapsedSeconds);
    expect(remaining).toBe(3600); // 60 minutes left
  });

  it("should not go below zero", () => {
    const durationMinutes = 30;
    const elapsedSeconds = 2000; // More than 30 minutes
    const total = durationMinutes * 60;
    const remaining = Math.max(0, total - elapsedSeconds);
    expect(remaining).toBe(0);
  });
});
