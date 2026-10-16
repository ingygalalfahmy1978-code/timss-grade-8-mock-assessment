import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { Edit2, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminTeachers() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.admin.listUsers.useQuery(undefined, { enabled: isAuth });
  const { data: classes } = trpc.admin.listClasses.useQuery(undefined, { enabled: isAuth });
  const createUser = trpc.admin.createUser.useMutation({ onSuccess: () => utils.admin.listUsers.invalidate() });
  const updateUser = trpc.admin.updateUser.useMutation({ onSuccess: () => utils.admin.listUsers.invalidate() });
  const deleteUser = trpc.admin.deleteUser.useMutation({ onSuccess: () => utils.admin.listUsers.invalidate() });

  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", username: "", password: "", email: "" });

  const teachers = users?.filter((u) => u.role === "teacher") ?? [];

  const handleAdd = async () => {
    if (!form.name || !form.username || !form.password) {
      toast.error("Name, username, and password are required");
      return;
    }
    try {
      await createUser.mutateAsync({ ...form, role: "teacher", email: form.email || undefined });
      toast.success("Teacher created");
      setShowAdd(false);
      setForm({ name: "", username: "", password: "", email: "" });
    } catch (e: unknown) {
      toast.error((e as Error).message || "Failed to create teacher");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete teacher "${name}"?`)) return;
    await deleteUser.mutateAsync({ id });
    toast.success("Teacher deleted");
  };

  const getTeacherClasses = (teacherId: number) =>
    classes?.filter((c) => c.teacherId === teacherId).map((c) => c.name).join(", ") || "—";

  return (
    <PlatformLayout title="Manage Teachers">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Teachers</h2>
            <p className="text-sm text-gray-500 mt-0.5">{teachers.length} teachers registered</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-navy-dark transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Teacher
          </button>
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Add New Teacher</h3>
              </div>
              <div className="px-6 py-5 space-y-4">
                {[
                  { label: "Full Name *", key: "name", placeholder: "Teacher full name" },
                  { label: "Username *", key: "username", placeholder: "e.g. teacher.smith" },
                  { label: "Password *", key: "password", placeholder: "Minimum 6 characters" },
                  { label: "Email", key: "email", placeholder: "teacher@school.edu (optional)" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={key === "password" ? "text" : "text"}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg">Cancel</button>
                <button onClick={handleAdd} className="px-4 py-2 text-sm bg-brand-navy text-white rounded-lg font-medium">Create Teacher</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Username</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Classes</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : teachers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No teachers yet.</td></tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                          {t.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-mono text-gray-600">{t.username}</td>
                    <td className="px-6 py-3 text-gray-500">{t.email || "—"}</td>
                    <td className="px-6 py-3 text-gray-500">{getTeacherClasses(t.id)}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setEditId(t.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(t.id, t.name ?? "")} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PlatformLayout>
  );
}
