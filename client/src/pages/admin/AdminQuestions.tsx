import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MATH_DOMAINS = ["Number", "Algebra", "Geometry", "Data and Probability"];
const SCIENCE_DOMAINS = ["Biology", "Chemistry", "Physics", "Earth Science"];
const COGNITIVE_DOMAINS = ["Knowing", "Applying", "Reasoning"] as const;
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const QUESTION_TYPES = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "short_answer", label: "Short Answer" },
  { value: "partial_credit_short_answer", label: "Partial Credit Short Answer (0-2 pts)" },
  { value: "drag_drop", label: "Drag & Drop" },
  { value: "matching", label: "Matching" },
  { value: "ordering", label: "Ordering" },
  { value: "drawing_canvas", label: "Drawing Canvas" },
  { value: "pattern_interaction", label: "Pattern Interaction" },
  { value: "psi_lab", label: "PSI Lab (Problem Solving & Inquiry)" },
] as const;

const SCIENCE_SUBDOMAINS: Record<string, string[]> = {
  Biology: ["Life Processes", "Ecosystems", "Genetics", "Evolution"],
  Chemistry: ["Matter", "Chemical Reactions", "Acids & Bases", "Periodic Table"],
  Physics: ["Forces & Motion", "Energy", "Electricity & Magnetism", "Waves & Light"],
  "Earth Science": ["Earth Structure", "Atmosphere", "Oceans", "Space"],
};

type QuestionTypeValue = typeof QUESTION_TYPES[number]["value"];

interface QuestionForm {
  subject: "Math" | "Science";
  contentDomain: string;
  scienceSubDomain: string;
  cognitiveDomain: "Knowing" | "Applying" | "Reasoning";
  difficulty: "Easy" | "Medium" | "Hard";
  questionType: QuestionTypeValue;
  questionText: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  maxPoints: number;
  examSession: "math_session" | "science_session" | "";
  blockNumber: number;
}

const defaultForm: QuestionForm = {
  subject: "Math",
  contentDomain: "Number",
  scienceSubDomain: "",
  cognitiveDomain: "Knowing",
  difficulty: "Easy",
  questionType: "multiple_choice",
  questionText: "",
  options: [
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" },
  ],
  correctAnswer: "A",
  explanation: "",
  maxPoints: 1,
  examSession: "",
  blockNumber: 1,
};

export default function AdminQuestions() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const utils = trpc.useUtils();
  const { data: questions, isLoading } = trpc.admin.listQuestions.useQuery(undefined, { enabled: isAuth });
  const createQ = trpc.admin.createQuestion.useMutation({ onSuccess: () => utils.admin.listQuestions.invalidate() });
  const updateQ = trpc.admin.updateQuestion.useMutation({ onSuccess: () => utils.admin.listQuestions.invalidate() });
  const deleteQ = trpc.admin.deleteQuestion.useMutation({ onSuccess: () => utils.admin.listQuestions.invalidate() });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<QuestionForm>(defaultForm);
  const [filterSubject, setFilterSubject] = useState<string>("All");
  const [filterDomain, setFilterDomain] = useState<string>("All");

  const contentDomains = form.subject === "Math" ? MATH_DOMAINS : SCIENCE_DOMAINS;

  const filtered = questions?.filter((q) => {
    if (filterSubject !== "All" && q.subject !== filterSubject) return false;
    if (filterDomain !== "All" && q.contentDomain !== filterDomain) return false;
    return true;
  }) ?? [];

  const handleSubmit = async () => {
    if (!form.questionText) { toast.error("Question text is required"); return; }
    if (!form.correctAnswer) { toast.error("Correct answer is required"); return; }
    try {
      const scienceSubDomainValue = form.scienceSubDomain as "Earth Science" | "Biology" | "Chemistry" | "Physics" | undefined || undefined;
      const examSessionValue = form.examSession || undefined;
      if (editId) {
        await updateQ.mutateAsync({
          id: editId,
          subject: form.subject,
          contentDomain: form.contentDomain,
          scienceSubDomain: scienceSubDomainValue ?? null,
          cognitiveDomain: form.cognitiveDomain,
          difficulty: form.difficulty,
          questionType: form.questionType,
          maxPoints: form.maxPoints,
          questionText: form.questionText,
          options: form.questionType === "multiple_choice" ? form.options : null,
          correctAnswer: form.correctAnswer,
          explanation: form.explanation || null,
          session: examSessionValue,
          blockNumber: form.blockNumber,
        });
        toast.success("Question updated");
      } else {
        await createQ.mutateAsync({
          subject: form.subject,
          contentDomain: form.contentDomain,
          scienceSubDomain: scienceSubDomainValue,
          cognitiveDomain: form.cognitiveDomain,
          difficulty: form.difficulty,
          questionType: form.questionType,
          maxPoints: form.maxPoints,
          questionText: form.questionText,
          options: form.questionType === "multiple_choice" ? form.options : undefined,
          correctAnswer: form.correctAnswer,
          explanation: form.explanation || undefined,
          session: examSessionValue,
          blockNumber: form.blockNumber,
        });
        toast.success("Question added to bank");
      }
      setShowForm(false);
      setEditId(null);
      setForm(defaultForm);
    } catch (e: unknown) {
      toast.error((e as Error).message || "Failed to save question");
    }
  };

  const openEdit = (q: typeof questions extends (infer T)[] | undefined ? T : never) => {
    if (!q) return;
    setEditId(q.id);
    setForm({
      subject: q.subject as "Math" | "Science",
      contentDomain: q.contentDomain,
      scienceSubDomain: (q as { scienceSubDomain?: string }).scienceSubDomain ?? "",
      cognitiveDomain: q.cognitiveDomain as "Knowing" | "Applying" | "Reasoning",
      difficulty: q.difficulty as "Easy" | "Medium" | "Hard",
      questionType: q.questionType as QuestionTypeValue,
      questionText: q.questionText,
      options: (q.options as { id: string; text: string }[]) ?? [
        { id: "A", text: "" }, { id: "B", text: "" }, { id: "C", text: "" }, { id: "D", text: "" },
      ],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation ?? "",
      maxPoints: (q as { maxPoints?: number }).maxPoints ?? 1,
      examSession: ((q as { examSession?: string }).examSession ?? "") as "math_session" | "science_session" | "",
      blockNumber: (q as { blockNumber?: number }).blockNumber ?? 1,
    });
    setShowForm(true);
  };

  const diffColor = (d: string) => {
    if (d === "Easy") return "bg-green-100 text-green-700";
    if (d === "Medium") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <PlatformLayout title="Question Bank">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Question Bank</h2>
            <p className="text-sm text-gray-500 mt-0.5">{questions?.length ?? 0} questions total</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(defaultForm); }}
            className="flex items-center gap-2 bg-[oklch(0.42_0.14_240)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[oklch(0.38_0.14_240)]"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
            <option value="All">All Subjects</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
          </select>
          <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
            <option value="All">All Domains</option>
            {[...MATH_DOMAINS, ...SCIENCE_DOMAINS].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Question Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{editId ? "Edit Question" : "Add Question to Bank"}</h3>
              </div>
              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value as "Math" | "Science", contentDomain: e.target.value === "Math" ? "Number" : "Biology", scienceSubDomain: "", examSession: e.target.value === "Math" ? "math_session" : "science_session" })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      <option value="Math">Mathematics</option>
                      <option value="Science">Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Domain *</label>
                    <select value={form.contentDomain} onChange={(e) => setForm({ ...form, contentDomain: e.target.value, scienceSubDomain: "" })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      {contentDomains.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  {form.subject === "Science" && SCIENCE_SUBDOMAINS[form.contentDomain] && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Science Sub-Domain</label>
                      <select value={form.scienceSubDomain} onChange={(e) => setForm({ ...form, scienceSubDomain: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option value="">-- Select Sub-Domain --</option>
                        {SCIENCE_SUBDOMAINS[form.contentDomain].map((sd) => <option key={sd} value={sd}>{sd}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cognitive Domain *</label>
                    <select value={form.cognitiveDomain} onChange={(e) => setForm({ ...form, cognitiveDomain: e.target.value as typeof form.cognitiveDomain })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      {COGNITIVE_DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                    <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as typeof form.difficulty })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Points</label>
                    <select value={form.maxPoints} onChange={(e) => setForm({ ...form, maxPoints: Number(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      <option value={1}>1 point</option>
                      <option value={2}>2 points (partial credit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Session</label>
                    <select value={form.examSession} onChange={(e) => setForm({ ...form, examSession: e.target.value as typeof form.examSession })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      <option value="">-- Auto (by subject) --</option>
                      <option value="math_session">Session 1 – Mathematics</option>
                      <option value="science_session">Session 2 – Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Block Number</label>
                    <select value={form.blockNumber} onChange={(e) => setForm({ ...form, blockNumber: Number(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>Block {n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Type *</label>
                  <select value={form.questionType} onChange={(e) => setForm({ ...form, questionType: e.target.value as QuestionTypeValue })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    {QUESTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  {["drawing_canvas", "pattern_interaction", "psi_lab"].includes(form.questionType) && (
                    <p className="text-xs text-amber-600 mt-1">⚠ This question type requires interactive data (JSON). Students will see a canvas/simulation interface.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Text *</label>
                  <textarea value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="Enter the question..." />
                </div>
                {form.questionType === "multiple_choice" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options *</label>
                    <div className="space-y-2">
                      {form.options.map((opt, i) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">{opt.id}</span>
                          <input type="text" value={opt.text} onChange={(e) => { const opts = [...form.options]; opts[i] = { ...opts[i], text: e.target.value }; setForm({ ...form, options: opts }); }} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500" placeholder={`Option ${opt.id}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer * {form.questionType === "multiple_choice" ? "(Enter A, B, C, or D)" : "(Expected answer text)"}
                  </label>
                  <input type="text" value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder={form.questionType === "multiple_choice" ? "A" : "Expected answer..."} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (optional)</label>
                  <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="Explain the correct answer..." />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
                <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-[oklch(0.42_0.14_240)] text-white rounded-lg font-medium">
                  {editId ? "Save Changes" : "Add to Bank"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Question</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Subject</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Domain</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Cognitive</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Difficulty</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400">No questions found.</td></tr>
                ) : (
                  filtered.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 max-w-xs">
                        <div className="text-gray-900 truncate">{q.questionText}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${q.subject === "Math" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                          {q.subject}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{q.contentDomain}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{q.cognitiveDomain}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${diffColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {q.questionType === "multiple_choice" ? "MC" :
                         q.questionType === "short_answer" ? "SA" :
                         q.questionType === "partial_credit_short_answer" ? "SA★" :
                         q.questionType === "drag_drop" ? "D&D" :
                         q.questionType === "matching" ? "Match" :
                         q.questionType === "ordering" ? "Order" :
                         q.questionType === "drawing_canvas" ? "Draw" :
                         q.questionType === "pattern_interaction" ? "Pattern" :
                         q.questionType === "psi_lab" ? "PSI" : q.questionType}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEdit(q)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={async () => { if (confirm("Delete this question?")) { await deleteQ.mutateAsync({ id: q.id }); toast.success("Question deleted"); } }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
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
