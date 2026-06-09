import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { Edit2, Plus, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UserRow {
  id: number;
  username: string;
  name: string;
  email: string | null | undefined;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

function generateUsername(name: string, existingUsernames: string[]): string {
  const base = "STD" + String(Math.floor(Math.random() * 900) + 100);
  return existingUsernames.includes(base) ? base + "X" : base;
}

function generatePassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let pwd = "";
  for (let i = 0; i < 8; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd + "!";
}

export default function AdminStudents() {
  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.admin.listUsers.useQuery();
  const { data: classes } = trpc.admin.listClasses.useQuery();
  const createUser = trpc.admin.createUser.useMutation({ onSuccess: () => utils.admin.listUsers.invalidate() });
  const updateUser = trpc.admin.updateUser.useMutation({ onSuccess: () => utils.admin.listUsers.invalidate() });
  const deleteUser = trpc.admin.deleteUser.useMutation({ onSuccess: () => utils.admin.listUsers.invalidate() });
  const enrollStudent = trpc.admin.enrollStudent.useMutation({ onSuccess: () => utils.admin.listClasses.invalidate() });

  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [form, setForm] = useState({ name: "", username: "", password: "", email: "", classId: "" });
  const [generatedCreds, setGeneratedCreds] = useState<{ username: string; password: string } | null>(null);

  const students = users?.filter((u) => u.role === "student") ?? [];

  const handleGenerate = () => {
    const existing = users?.map((u) => u.username) ?? [];
    const username = generateUsername(form.name, existing);
    const password = generatePassword();
    setForm((f) => ({ ...f, username, password }));
    setGeneratedCreds({ username, password });
  };

  const handleAdd = async () => {
    if (!form.name || !form.username || !form.password) {
      toast.error("Name, username, and password are required");
      return;
    }
    try {
      await createUser.mutateAsync({ name: form.name, username: form.username, password: form.password, email: form.email || undefined, role: "student" });
      if (form.classId) {
        const allUsers = await utils.admin.listUsers.fetch();
        const newUser = allUsers.find((u) => u.username === form.username);
        if (newUser) await enrollStudent.mutateAsync({ studentId: newUser.id, classId: Number(form.classId) });
      }
      toast.success(`Student ${form.name} created successfully`);
      setShowAdd(false);
      setForm({ name: "", username: "", password: "", email: "", classId: "" });
      setGeneratedCreds(null);
    } catch (e: unknown) {
      toast.error((e as Error).message || "Failed to create student");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    await deleteUser.mutateAsync({ id });
    toast.success("Student deleted");
  };

  return (
    <PlatformLayout title="Manage Students">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Students</h2>
            <p className="text-sm text-gray-500 mt-0.5">{students.length} students registered</p>
          </div>
          <button
            onClick={() => { setShowAdd(true); setGeneratedCreds(null); setForm({ name: "", username: "", password: "", email: "", classId: "" }); }}
            className="flex items-center gap-2 bg-[oklch(0.42_0.14_240)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[oklch(0.38_0.14_240)] transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Student
          </button>
        </div>

        {/* Add/Edit Modal */}
        {(showAdd || editUser) && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{editUser ? "Edit Student" : "Add New Student"}</h3>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editUser ? editUser.name : form.name}
                    onChange={(e) => editUser ? setEditUser({ ...editUser, name: e.target.value }) : setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Student full name"
                  />
                </div>
                {!editUser && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={form.username}
                          onChange={(e) => setForm({ ...form, username: e.target.value })}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                          placeholder="e.g. STD001"
                        />
                        <button
                          onClick={handleGenerate}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                      <input
                        type="text"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Class</label>
                      <select
                        value={form.classId}
                        onChange={(e) => setForm({ ...form, classId: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="">— No class —</option>
                        {classes?.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                {editUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep)</label>
                    <input
                      type="text"
                      placeholder="Enter new password"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
                      id="edit-password"
                    />
                  </div>
                )}
                {generatedCreds && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                    <div className="font-semibold text-green-800 mb-1">Generated Credentials</div>
                    <div className="font-mono text-green-700">Username: {generatedCreds.username}</div>
                    <div className="font-mono text-green-700">Password: {generatedCreds.password}</div>
                    <div className="text-green-600 text-xs mt-1">Please save these credentials before closing.</div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
                <button
                  onClick={() => { setShowAdd(false); setEditUser(null); setGeneratedCreds(null); }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (editUser) {
                      const newPwd = (document.getElementById("edit-password") as HTMLInputElement)?.value;
                      await updateUser.mutateAsync({ id: editUser.id, name: editUser.name, ...(newPwd ? { password: newPwd } : {}) });
                      toast.success("Student updated");
                      setEditUser(null);
                    } else {
                      await handleAdd();
                    }
                  }}
                  className="px-4 py-2 text-sm bg-[oklch(0.42_0.14_240)] text-white rounded-lg font-medium hover:bg-[oklch(0.38_0.14_240)]"
                >
                  {editUser ? "Save Changes" : "Create Student"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Username</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Created</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">No students yet. Add your first student above.</td></tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                            {s.name?.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-mono text-gray-600">{s.username}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setEditUser(s as UserRow)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id, s.name ?? "")}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
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
      </div>
    </PlatformLayout>
  );
}
