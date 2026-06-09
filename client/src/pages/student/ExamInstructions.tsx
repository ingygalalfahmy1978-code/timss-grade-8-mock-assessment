import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import {
  BookOpen, Clock, AlertCircle, ChevronRight, CheckCircle2,
  FlaskConical, Pencil, GripVertical, Layers, Coffee, Flag, Monitor
} from "lucide-react";

export default function ExamInstructions() {
  const { examId, classId } = useParams<{ examId: string; classId: string }>();
  const [, navigate] = useLocation();
  const [starting, setStarting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const { data: exams, isError } = trpc.student.availableExams.useQuery(undefined, {
    retry: false,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: false,
  });
  const examInfo = exams?.find(e => e.exam.id === Number(examId) && e.classId === Number(classId));

  const startExam = trpc.student.startExam.useMutation();

  const handleBegin = async () => {
    if (!agreed) { toast.error("Please confirm you have read the instructions."); return; }
    setStarting(true);
    try {
      await startExam.mutateAsync({ examId: Number(examId), classId: Number(classId) });
      navigate(`/student/exam/${examId}/${classId}`);
    } catch (e: unknown) {
      toast.error((e as Error).message || "Failed to start exam");
      setStarting(false);
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.97_0.01_240)]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-600">Unable to load exam information.</p>
          <button onClick={() => navigate("/student")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const session1Min = examInfo?.exam.session1Minutes ?? 45;
  const breakMin = examInfo?.exam.breakMinutes ?? 5;
  const session2Min = examInfo?.exam.session2Minutes ?? 45;
  const totalMin = session1Min + breakMin + session2Min;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.01_240)] flex flex-col">
      {/* Header */}
      <header className="bg-[oklch(0.20_0.06_240)] text-white px-6 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[oklch(0.42_0.14_240)] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">Grade 8 TIMSS Assessment Platform</div>
            <div className="text-white/50 text-xs">{examInfo?.exam.name ?? "Assessment"} — {examInfo?.className}</div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{examInfo?.exam.name ?? "Assessment"}</h1>
            <p className="text-gray-500 text-sm">Please read all instructions carefully before beginning.</p>
          </div>

          {/* Session timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Assessment Structure
            </h2>
            <div className="flex items-stretch gap-2">
              <div className="flex-1 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div className="font-bold text-blue-900 text-sm">Session 1</div>
                <div className="text-blue-700 text-xs font-semibold">Mathematics</div>
                <div className="text-blue-600 text-lg font-bold mt-1">{session1Min} min</div>
              </div>
              <div className="flex flex-col items-center justify-center px-1">
                <div className="h-0.5 w-6 bg-gray-300" />
                <div className="my-1 bg-amber-100 border border-amber-300 rounded-lg px-2 py-1 text-center">
                  <Coffee className="w-3 h-3 text-amber-600 mx-auto mb-0.5" />
                  <div className="text-amber-700 text-xs font-semibold">{breakMin}m break</div>
                </div>
                <div className="h-0.5 w-6 bg-gray-300" />
              </div>
              <div className="flex-1 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div className="font-bold text-emerald-900 text-sm">Session 2</div>
                <div className="text-emerald-700 text-xs font-semibold">Science</div>
                <div className="text-emerald-600 text-lg font-bold mt-1">{session2Min} min</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 bg-gray-50 rounded-xl py-2.5">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">Total time: {totalMin} minutes</span>
            </div>
          </div>

          {/* Science sub-domains */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-600" /> Science Sub-Domains Covered
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Earth Science", desc: "Earth structure, atmosphere, oceans, space", color: "bg-sky-50 border-sky-200 text-sky-800" },
                { label: "Biology", desc: "Life processes, ecosystems, genetics", color: "bg-green-50 border-green-200 text-green-800" },
                { label: "Chemistry", desc: "Matter, reactions, periodic table", color: "bg-purple-50 border-purple-200 text-purple-800" },
                { label: "Physics", desc: "Forces, energy, waves, electricity", color: "bg-orange-50 border-orange-200 text-orange-800" },
              ].map(sd => (
                <div key={sd.label} className={`rounded-xl border p-3 ${sd.color}`}>
                  <div className="font-semibold text-sm">{sd.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{sd.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Question types */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-3">Question Types You Will Encounter</h2>
            <div className="space-y-2.5">
              {[
                { icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />, label: "Multiple Choice", desc: "Select one correct answer from four options (A, B, C, D). Worth 1 point." },
                { icon: <Pencil className="w-4 h-4 text-purple-500" />, label: "Short Answer / Constructed Response", desc: "Type your answer. May be worth 1 or 2 points — partial credit is awarded for partially correct answers." },
                { icon: <GripVertical className="w-4 h-4 text-amber-500" />, label: "Drag & Drop / Ordering", desc: "Drag items to the correct position or sequence." },
                { icon: <Layers className="w-4 h-4 text-emerald-500" />, label: "Matching", desc: "Match items on the left to their correct pair on the right." },
                { icon: <Pencil className="w-4 h-4 text-rose-500" />, label: "Drawing Canvas", desc: "Draw diagrams, graphs, or geometric shapes directly on the canvas using your mouse or stylus." },
                { icon: <FlaskConical className="w-4 h-4 text-cyan-500" />, label: "PSI Lab (Problem Solving & Inquiry)", desc: "Interactive simulation — adjust variables and observe results to answer the science question." },
              ].map(qt => (
                <div key={qt.label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="mt-0.5 flex-shrink-0">{qt.icon}</div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">{qt.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{qt.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation rules */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-500" /> Navigation & Submission Rules
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Use the Next / Previous buttons or the question grid to navigate within each session.",
                { icon: <Flag className="w-3 h-3 text-amber-500 inline mr-1" />, text: "Flag questions for review — you can return to them before submitting the session." },
                "Session 1 (Mathematics) must be completed before the break. You cannot return to Session 1 questions during Session 2.",
                "After the break screen appears, click 'Start Session 2' to begin the Science session.",
                "Do not close the browser or refresh — your progress is saved automatically every time you answer a question.",
                "After submitting the exam, you will be asked to complete a 30-minute background questionnaire.",
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <span>{typeof rule === "string" ? rule : <>{rule.icon}{rule.text}</>}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic integrity */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-800">Academic Integrity Notice</div>
                <div className="text-sm text-amber-700 mt-1">
                  This is an individual assessment. Complete it independently without assistance from others. Unauthorized materials or communication with other students is strictly prohibited.
                </div>
              </div>
            </div>
          </div>

          {/* Agreement + Begin */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <label className="flex items-start gap-3 cursor-pointer mb-5">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                I have read and understood all the instructions above. I am ready to begin the assessment and will complete it honestly without any outside help.
              </span>
            </label>
            <button onClick={handleBegin} disabled={starting || !agreed}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[oklch(0.42_0.14_240)] hover:bg-[oklch(0.38_0.14_240)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base transition-colors">
              {starting ? (
                <><div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> Starting...</>
              ) : (
                <>Begin Session 1 — Mathematics <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
