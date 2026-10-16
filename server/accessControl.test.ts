import { describe, expect, it } from "vitest";
import { canAccessClass } from "./accessControl";

describe("canAccessClass", () => {
  const ownerTeacher = { id: 42, role: "teacher" as const };
  const otherTeacher = { id: 99, role: "teacher" as const };
  const administrator = { id: 7, role: "admin" as const };
  const student = { id: 11, role: "student" as const };

  it("allows a teacher to access their own class", () => {
    expect(canAccessClass(ownerTeacher, 42)).toBe(true);
  });

  it("allows a teacher assigned to a class subject", () => {
    expect(canAccessClass(otherTeacher, 42, [7, 99])).toBe(true);
  });

  it("blocks a teacher from another teacher's class", () => {
    expect(canAccessClass(otherTeacher, 42)).toBe(false);
  });

  it("allows an administrator to access every class", () => {
    expect(canAccessClass(administrator, 42)).toBe(true);
    expect(canAccessClass(administrator, null)).toBe(true);
  });

  it("blocks student access to teacher class reports", () => {
    expect(canAccessClass(student, 42)).toBe(false);
  });
});
