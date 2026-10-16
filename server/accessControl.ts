export type PlatformAccessUser = {
  id: number;
  role: "admin" | "teacher" | "student";
};

/** Administrators can access every class; teachers can access lead or subject-assigned classes. */
export function canAccessClass(
  user: PlatformAccessUser,
  classTeacherId: number | null,
  subjectTeacherIds: number[] = []
): boolean {
  return user.role === "admin" || (user.role === "teacher" && (classTeacherId === user.id || subjectTeacherIds.includes(user.id)));
}
