export type PlatformAccessUser = {
  id: number;
  role: "admin" | "teacher" | "student";
};

/** Administrators can access every class; teachers can access only their assigned classes. */
export function canAccessClass(user: PlatformAccessUser, classTeacherId: number | null): boolean {
  return user.role === "admin" || (user.role === "teacher" && classTeacherId === user.id);
}
