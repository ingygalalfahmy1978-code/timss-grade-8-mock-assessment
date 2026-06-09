import { trpc } from "@/lib/trpc";
import {
  AlertCircle, BookOpen, ChevronLeft, ChevronRight, Flag, Grid,
  Calculator, X, GripVertical, ArrowUp, ArrowDown, CheckCircle2
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "wouter";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type MCOption = { label: string; text: string };
type DragItem = { id: string; text: string };
type DragTarget = { id: string; label: string };
type MatchItem = { id: string; text: string };
type OrderItem = { id: string; text: string };

interface InteractiveData {
  items?: DragItem[];
  targets?: DragTarget[];
  correctMapping?: Record<string, string>;
  leftItems?: MatchItem[];
  rightItems?: MatchItem[];
  correctPairs?: Record<string, string>;
  correctOrder?: string[];
}

type Question = {
  id: number;
  subject: string;
  contentDomain: string;
  cognitiveDomain: string;
  difficulty: string;
  questionType: string;
  questionText: string;
  options: unknown;
  interactiveData: unknown;
  imageUrl: string | null;
};

type SavedAnswer = {
  questionId: number;
  answerGiven: string | null;
  isFlagged: boolean;
};

type ExamData = {
  attemptId: number;
  examName: string;
  durationMinutes: number;
  questions: Question[];
  savedAnswers: SavedAnswer[];
  startedAt: Date | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function parseJson<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

// ─── Calculator ───────────────────────────────────────────────────────────────

function CalculatorWidget({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [waitNext, setWaitNext] = useState(false);

  const num = (n: string) => {
    if (waitNext) { setDisplay(n); setWaitNext(false); return; }
    setDisplay(display === "0" ? n : display + n);
  };
  const dot = () => {
    if (waitNext) { setDisplay("0."); setWaitNext(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  };
  const operation = (o: string) => { setPrev(display); setOp(o); setWaitNext(true); };
  const equals = () => {
    if (!prev || !op) return;
    const a = parseFloat(prev), b = parseFloat(display);
    let r = 0;
    if (op === "+") r = a + b;
    else if (op === "−") r = a - b;
    else if (op === "×") r = a * b;
    else if (op === "÷") r = b !== 0 ? a / b : 0;
    setDisplay(parseFloat(r.toFixed(10)).toString());
    setPrev(null); setOp(null); setWaitNext(true);
  };
  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setWaitNext(false); };
  const backspace = () => { if (display.length > 1) setDisplay(display.slice(0, -1)); else setDisplay("0"); };
  const sqrt = () => setDisplay(Math.sqrt(parseFloat(display)).toFixed(8).replace(/\.?0+$/, ""));
  const negate = () => setDisplay((parseFloat(display) * -1).toString());
  const percent = () => setDisplay((parseFloat(display) / 100).toString());

  const Btn = ({ label, action, cls = "" }: { label: string; action: () => void; cls?: string }) => (
    <button onClick={action}
      className={`h-10 rounded-lg text-sm font-semibold transition-all active:scale-95 select-none ${cls}`}>
      {label}
    </button>
  );

  return (
    <div className="fixed bottom-24 right-6 z-50 bg-white border-2 border-blue-200 rounded-2xl shadow-2xl w-60 p-3 select-none">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Calculator</span>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors"><X size={14} /></button>
      </div>
      <div className="bg-slate-900 text-white rounded-xl px-3 py-2 mb-2 min-h-[52px] text-right">
        {prev && op && <div className="text-xs text-slate-400">{prev} {op}</div>}
        <div className="text-xl font-mono truncate">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        <Btn label="AC" action={clear} cls="bg-red-100 text-red-700 hover:bg-red-200" />
        <Btn label="+/−" action={negate} cls="bg-slate-100 text-slate-700 hover:bg-slate-200" />
        <Btn label="%" action={percent} cls="bg-slate-100 text-slate-700 hover:bg-slate-200" />
        <Btn label="÷" action={() => operation("÷")} cls={op === "÷" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"} />
        <Btn label="7" action={() => num("7")} cls="bg-slate-50 hover:bg-slate-100" />
        <Btn label="8" action={() => num("8")} cls="bg-slate-50 hover:bg-slate-100" />
        <Btn label="9" action={() => num("9")} cls="bg-slate-50 hover:bg-slate-100" />
        <Btn label="×" action={() => operation("×")} cls={op === "×" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"} />
        <Btn label="4" action={() => num("4")} cls="bg-slate-50 hover:bg-slate-100" />
        <Btn label="5" action={() => num("5")} cls="bg-slate-50 hover:bg-slate-100" />
        <Btn label="6" action={() => num("6")} cls="bg-slate-50 hover:bg-slate-100" />
        <Btn label="−" action={() => operation("−")} cls={op === "−" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"} />
        <Btn label="1" action={() => num("1")} cls="bg-slate-50 hover:bg-slate-100" />
        <Btn label="2" action={() => num("2")} cls="bg-slate-50 hover:bg-slate-100" />
        <Btn label="3" action={() => num("3")} cls="bg-slate-50 hover:bg-slate-100" />
        <Btn label="+" action={() => operation("+")} cls={op === "+" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"} />
        <Btn label="√" action={sqrt} cls="bg-slate-100 text-slate-700 hover:bg-slate-200" />
        <Btn label="0" action={() => num("0")} cls="bg-slate-50 hover:bg-slate-100" />
        <Btn label="." action={dot} cls="bg-slate-50 hover:bg-slate-100" />
        <Btn label="=" action={equals} cls="bg-blue-600 text-white hover:bg-blue-700" />
        <Btn label="⌫" action={backspace} cls="col-span-4 bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs" />
      </div>
    </div>
  );
}

// ─── Drag & Drop Question ─────────────────────────────────────────────────────

function DragDropQuestion({ data, answer, onChange }: {
  data: InteractiveData; answer: string; onChange: (v: string) => void;
}) {
  const items = data.items || [];
  const targets = data.targets || [];
  const mapping = parseJson<Record<string, string>>(answer, {});
  const setMapping = (m: Record<string, string>) => onChange(JSON.stringify(m));
  const [dragging, setDragging] = useState<string | null>(null);

  const placedIds = new Set(Object.keys(mapping));
  const unplaced = items.filter(i => !placedIds.has(i.id));

  const handleDrop = (targetId: string) => {
    if (!dragging) return;
    const m = { ...mapping };
    Object.keys(m).forEach(k => { if (m[k] === targetId) delete m[k]; });
    m[dragging] = targetId;
    setMapping(m);
    setDragging(null);
  };
  const removeItem = (itemId: string) => {
    const m = { ...mapping }; delete m[itemId]; setMapping(m);
  };
  const returnAll = () => { setMapping({}); };

  return (
    <div className="mt-5 space-y-4">
      {/* Items bank */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Items</p>
          {Object.keys(mapping).length > 0 && (
            <button onClick={returnAll} className="text-xs text-blue-600 hover:underline">Reset all</button>
          )}
        </div>
        <div
          className={`flex flex-wrap gap-2 min-h-[56px] rounded-xl border-2 border-dashed p-3 transition-colors
            ${dragging ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50"}`}
          onDragOver={e => e.preventDefault()}
          onDrop={() => {
            if (!dragging) return;
            const m = { ...mapping }; delete m[dragging]; setMapping(m); setDragging(null);
          }}
        >
          {unplaced.length === 0
            ? <span className="text-slate-400 text-sm self-center mx-auto">All items placed — drag back here to remove</span>
            : unplaced.map(item => (
              <div key={item.id} draggable
                onDragStart={() => setDragging(item.id)}
                onDragEnd={() => setDragging(null)}
                className="flex items-center gap-2 bg-white border-2 border-blue-200 rounded-lg px-3 py-2 cursor-grab active:cursor-grabbing shadow-sm hover:border-blue-400 transition-colors select-none"
              >
                <GripVertical size={13} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">{item.text}</span>
              </div>
            ))
          }
        </div>
      </div>
      {/* Targets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {targets.map(target => {
          const placedId = Object.keys(mapping).find(k => mapping[k] === target.id);
          const placedItem = items.find(i => i.id === placedId);
          return (
            <div key={target.id}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(target.id)}
              className={`rounded-xl border-2 p-3 min-h-[80px] transition-colors
                ${dragging ? "border-blue-400 bg-blue-50/60" : "border-slate-200 bg-white"}`}
            >
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">{target.label}</p>
              {placedItem
                ? <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <span className="text-sm font-medium text-slate-700">{placedItem.text}</span>
                    <button onClick={() => removeItem(placedItem.id)} className="text-slate-400 hover:text-red-500 ml-2 flex-shrink-0"><X size={13} /></button>
                  </div>
                : <div className="flex items-center justify-center h-9 text-slate-400 text-xs border border-dashed border-slate-300 rounded-lg">
                    Drop here
                  </div>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Matching Question ────────────────────────────────────────────────────────

function MatchingQuestion({ data, answer, onChange }: {
  data: InteractiveData; answer: string; onChange: (v: string) => void;
}) {
  const left = data.leftItems || [];
  const right = data.rightItems || [];
  const pairs = parseJson<Record<string, string>>(answer, {});
  const setPairs = (p: Record<string, string>) => onChange(JSON.stringify(p));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const clickLeft = (id: string) => setSelectedLeft(selectedLeft === id ? null : id);
  const clickRight = (rightId: string) => {
    if (!selectedLeft) return;
    const p = { ...pairs };
    Object.keys(p).forEach(k => { if (p[k] === rightId) delete p[k]; });
    if (p[selectedLeft] === rightId) delete p[selectedLeft];
    else p[selectedLeft] = rightId;
    setPairs(p);
    setSelectedLeft(null);
  };
  const clearPair = (leftId: string) => { const p = { ...pairs }; delete p[leftId]; setPairs(p); };

  return (
    <div className="mt-5">
      <p className="text-sm text-slate-500 mb-4 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
        <strong>How to match:</strong> Click an item in Column A, then click its match in Column B. Click a paired item to change its match.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Column A</p>
          <div className="space-y-2">
            {left.map(item => {
              const matchedRight = right.find(r => r.id === pairs[item.id]);
              const isSelected = selectedLeft === item.id;
              return (
                <div key={item.id}
                  onClick={() => clickLeft(item.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-sm
                    ${isSelected ? "border-blue-600 bg-blue-50 shadow-md" :
                      matchedRight ? "border-green-400 bg-green-50" :
                      "border-slate-200 bg-white hover:border-blue-300"}`}
                >
                  <div className="font-medium text-slate-800">{item.text}</div>
                  {matchedRight && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-green-600">→ {matchedRight.text}</span>
                      <button onClick={e => { e.stopPropagation(); clearPair(item.id); }}
                        className="text-slate-400 hover:text-red-500"><X size={11} /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Column B</p>
          <div className="space-y-2">
            {right.map(item => {
              const isMatched = Object.values(pairs).includes(item.id);
              return (
                <div key={item.id}
                  onClick={() => clickRight(item.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium
                    ${isMatched ? "border-green-400 bg-green-50 text-green-800" :
                      selectedLeft ? "border-blue-300 bg-blue-50 hover:border-blue-500 hover:bg-blue-100" :
                      "border-slate-200 bg-white text-slate-800"}`}
                >
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Ordering Question ────────────────────────────────────────────────────────

function OrderingQuestion({ data, answer, onChange }: {
  data: InteractiveData; answer: string; onChange: (v: string) => void;
}) {
  const originalItems = data.items || [];
  const initialIds = originalItems.map(i => i.id);
  const orderedIds = parseJson<string[]>(answer, initialIds);
  const ids = orderedIds.length === originalItems.length ? orderedIds : initialIds;
  const orderedItems = ids.map(id => originalItems.find(i => i.id === id)!).filter(Boolean);
  const setOrder = (newIds: string[]) => onChange(JSON.stringify(newIds));
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const n = [...ids]; [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]]; setOrder(n);
  };
  const moveDown = (idx: number) => {
    if (idx === ids.length - 1) return;
    const n = [...ids]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; setOrder(n);
  };
  const handleDrop = (toIdx: number) => {
    if (draggingIdx === null || draggingIdx === toIdx) return;
    const n = [...ids];
    const [removed] = n.splice(draggingIdx, 1);
    n.splice(toIdx, 0, removed);
    setOrder(n);
    setDraggingIdx(null); setOverIdx(null);
  };

  return (
    <div className="mt-5">
      <p className="text-sm text-slate-500 mb-4 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
        <strong>How to order:</strong> Drag items or use the arrow buttons to arrange them in the correct sequence.
      </p>
      <div className="space-y-2">
        {orderedItems.map((item, idx) => (
          <div key={item.id} draggable
            onDragStart={() => { setDraggingIdx(idx); }}
            onDragOver={e => { e.preventDefault(); setOverIdx(idx); }}
            onDrop={() => handleDrop(idx)}
            onDragEnd={() => { setDraggingIdx(null); setOverIdx(null); }}
            className={`flex items-center gap-3 bg-white border-2 rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing transition-all
              ${draggingIdx === idx ? "opacity-50 border-blue-400" :
                overIdx === idx ? "border-blue-400 bg-blue-50 scale-[1.01]" :
                "border-slate-200 hover:border-blue-300"}`}
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">
              {idx + 1}
            </span>
            <GripVertical size={15} className="text-slate-400 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium text-slate-800">{item.text}</span>
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button onClick={() => moveUp(idx)} disabled={idx === 0}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ArrowUp size={12} className="text-slate-500" />
              </button>
              <button onClick={() => moveDown(idx)} disabled={idx === orderedItems.length - 1}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ArrowDown size={12} className="text-slate-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Exam Interface ──────────────────────────────────────────────────────

export default function ExamInterface() {
  const { examId, classId } = useParams<{ examId: string; classId: string }>();
  const [, navigate] = useLocation();

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [showOverview, setShowOverview] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startExam = trpc.student.startExam.useMutation();
  const saveAnswer = trpc.student.saveAnswer.useMutation();
  const submitExam = trpc.student.submitExam.useMutation();
  // Guard ref prevents double-fire in React StrictMode
  const loadedRef = useRef(false);
  // Load exam on mount
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    startExam.mutateAsync({ examId: Number(examId), classId: Number(classId) })
      .then((data) => {
        // If already submitted, redirect to completion page
        if ((data as { alreadySubmitted?: boolean }).alreadySubmitted) {
          navigate(`/student/exam/${examId}/${classId}/complete`);
          return;
        }
        setExamData(data as ExamData);
        const savedMap: Record<number, string> = {};
        const savedFlags = new Set<number>();
        for (const a of data.savedAnswers) {
          if (a.answerGiven) savedMap[a.questionId] = a.answerGiven;
          if (a.isFlagged) savedFlags.add(a.questionId);
        }
        setAnswers(savedMap);
        setFlagged(savedFlags);
        const elapsed = data.startedAt
          ? Math.floor((Date.now() - new Date(data.startedAt).getTime()) / 1000) : 0;
        const total = data.durationMinutes * 60;
        setTimeLeft(Math.max(0, total - elapsed));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load exam");
        setLoading(false);
      });
  }, [examId, classId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) { handleAutoSubmit(); return; }
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleAutoSubmit = useCallback(async () => {
    if (!examData || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      await submitExam.mutateAsync({ attemptId: examData.attemptId, timeSpentSeconds });
      navigate(`/student/exam/${examId}/${classId}/complete`);
    } catch {
      toast.error("Auto-submit failed. Please submit manually.");
      setIsSubmitting(false);
    }
  }, [examData, isSubmitting, examId, classId]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (!examData) return;
      saveAnswer.mutate({
        attemptId: examData.attemptId,
        questionId,
        answerGiven: value,
        isFlagged: flagged.has(questionId),
      });
    }, 600);
  };

  const handleToggleFlag = (questionId: number) => {
    const newFlagged = new Set(flagged);
    const wasFlagged = newFlagged.has(questionId);
    if (wasFlagged) newFlagged.delete(questionId); else newFlagged.add(questionId);
    setFlagged(newFlagged);
    if (!examData) return;
    saveAnswer.mutate({
      attemptId: examData.attemptId,
      questionId,
      answerGiven: answers[questionId] ?? null,
      isFlagged: !wasFlagged,
    });
  };

  const handleSubmit = async () => {
    if (!examData) return;
    setIsSubmitting(true);
    try {
      const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      await submitExam.mutateAsync({ attemptId: examData.attemptId, timeSpentSeconds });
      navigate(`/student/exam/${examId}/${classId}/complete`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Submission failed");
      setIsSubmitting(false);
    }
  };

  // ─── Loading / Error states ───────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-slate-700 font-semibold">Loading your assessment...</div>
          <div className="text-slate-400 text-sm mt-1">Please wait</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Cannot Load Assessment</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => navigate("/student")}
            className="px-5 py-2.5 bg-blue-700 text-white rounded-xl font-medium text-sm hover:bg-blue-800 transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!examData) return null;

  const questions = examData.questions;
  const currentQ = questions[currentIndex];
  // Parse options and interactiveData — they may arrive as JSON strings from the DB
  const options: MCOption[] | null = currentQ?.options
    ? (typeof currentQ.options === "string" ? parseJson<MCOption[]>(currentQ.options, []) : currentQ.options as MCOption[])
    : null;
  const interactiveData: InteractiveData | null = currentQ?.interactiveData
    ? (typeof currentQ.interactiveData === "string" ? parseJson<InteractiveData>(currentQ.interactiveData, null as unknown as InteractiveData) : currentQ.interactiveData as InteractiveData)
    : null;
  const answeredCount = Object.keys(answers).filter(k => {
    const v = answers[Number(k)];
    return v !== undefined && v !== "" && v !== "{}" && v !== "[]";
  }).length;
  const isTimeLow = timeLeft !== null && timeLeft < 300;
  const isTimeMedium = timeLeft !== null && timeLeft >= 300 && timeLeft < 600;

  // ─── Overview Panel ───────────────────────────────────────────────────────

  if (showOverview) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div>
            <div className="font-bold text-sm">{examData.examName}</div>
            <div className="text-slate-400 text-xs">Question Overview</div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold
            ${isTimeLow ? "bg-red-600 text-white animate-pulse" : isTimeMedium ? "bg-yellow-500 text-white" : "bg-white/10 text-white"}`}>
            {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
          </div>
        </header>

        <div className="max-w-3xl mx-auto w-full px-4 py-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
            <h2 className="font-bold text-slate-800 mb-1">Assessment Progress</h2>
            <p className="text-slate-500 text-sm mb-4">{answeredCount} of {questions.length} questions answered</p>
            <div className="flex gap-4 text-xs mb-4">
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-green-400 inline-block" />Answered</span>
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-slate-200 inline-block" />Not answered</span>
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-amber-400 inline-block" />Flagged</span>
            </div>
            <div className="grid grid-cols-10 gap-1.5">
              {questions.map((q, idx) => {
                const isAns = !!(answers[q.id] && answers[q.id] !== "{}" && answers[q.id] !== "[]");
                const isFl = flagged.has(q.id);
                return (
                  <button key={q.id}
                    onClick={() => { setCurrentIndex(idx); setShowOverview(false); }}
                    className={`h-9 w-9 rounded-lg text-xs font-bold border-2 transition-all hover:scale-105
                      ${isFl ? "border-amber-400 bg-amber-50 text-amber-700" :
                        isAns ? "border-green-400 bg-green-50 text-green-700" :
                        "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-300"}`}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isAns = !!(answers[q.id] && answers[q.id] !== "{}" && answers[q.id] !== "[]");
              const isFl = flagged.has(q.id);
              return (
                <button key={q.id}
                  onClick={() => { setCurrentIndex(idx); setShowOverview(false); }}
                  className="w-full flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-blue-300 transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{q.questionText.substring(0, 70)}...</p>
                    <div className="flex gap-1.5 mt-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${q.subject === "Math" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {q.subject}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{q.contentDomain}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isFl && <Flag size={13} className="text-amber-500 fill-amber-400" />}
                    {isAns
                      ? <CheckCircle2 size={16} className="text-green-500" />
                      : <span className="text-xs text-slate-400">—</span>
                    }
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowOverview(false)}
              className="flex-1 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-blue-300 transition-colors">
              Continue Exam
            </button>
            <button onClick={() => { setShowOverview(false); setShowSubmitConfirm(true); }}
              className="flex-1 py-3 bg-blue-700 text-white rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors">
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Submit Confirmation ──────────────────────────────────────────────────

  if (showSubmitConfirm) {
    const unanswered = questions.length - answeredCount;
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={30} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Submit Assessment?</h2>
          <p className="text-slate-600 mb-4">
            You have answered <strong className="text-blue-700">{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
          </p>
          {unanswered > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
              <strong>{unanswered} question{unanswered > 1 ? "s" : ""}</strong> left unanswered. You cannot change your answers after submission.
            </div>
          )}
          <div className="flex gap-3 mt-2">
            <button onClick={() => setShowSubmitConfirm(false)}
              className="flex-1 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-blue-300 transition-colors">
              Go Back
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting}
              className="flex-1 py-3 bg-blue-700 text-white rounded-xl font-semibold text-sm hover:bg-blue-800 disabled:opacity-60 transition-colors">
              {isSubmitting ? "Submitting..." : "Confirm Submit"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Exam Screen ─────────────────────────────────────────────────────

  const isCurrentFlagged = flagged.has(currentQ?.id);
  const currentAnswer = answers[currentQ?.id] ?? "";
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.01_240)] flex flex-col">
      {/* ── Top Bar ── */}
      <header className="bg-[oklch(0.20_0.06_240)] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">{examData.examName}</div>
              <div className="text-white/50 text-xs">Question {currentIndex + 1} of {questions.length}</div>
            </div>
          </div>

          {/* Center: timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold flex-shrink-0
            ${isTimeLow ? "bg-red-600 text-white animate-pulse" :
              isTimeMedium ? "bg-yellow-500 text-white" : "bg-white/10 text-white"}`}>
            <span className="text-xs font-normal opacity-70 hidden sm:inline">TIME</span>
            {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
          </div>

          {/* Right: tools */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setShowCalc(!showCalc)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors
                ${showCalc ? "bg-white text-blue-900" : "bg-white/10 text-white hover:bg-white/20"}`}>
              <Calculator size={14} />
              <span className="hidden sm:inline">Calc</span>
            </button>
            <button onClick={() => setShowOverview(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors">
              <Grid size={14} />
              <span className="hidden sm:inline">Overview</span>
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* ── Question Area ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Question meta */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                ${currentQ?.subject === "Math" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                {currentQ?.subject}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {currentQ?.contentDomain}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                {currentQ?.cognitiveDomain}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                ${currentQ?.difficulty === "Hard" ? "bg-red-100 text-red-600" :
                  currentQ?.difficulty === "Medium" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>
                {currentQ?.difficulty}
              </span>
            </div>
            <button onClick={() => handleToggleFlag(currentQ.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${isCurrentFlagged
                  ? "bg-amber-100 text-amber-700 border border-amber-300"
                  : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-600"}`}>
              <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? "fill-amber-500" : ""}`} />
              {isCurrentFlagged ? "Flagged" : "Flag for Review"}
            </button>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            {/* Question text */}
            <div className="p-7 border-b border-slate-100">
              {currentQ?.imageUrl && (
                <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={currentQ.imageUrl} alt="Question diagram"
                    className="max-w-full max-h-72 mx-auto object-contain p-3" />
                </div>
              )}
              <div className="text-base leading-relaxed text-slate-900 font-medium whitespace-pre-wrap">
                {currentQ?.questionText}
              </div>
            </div>

            {/* Answer area */}
            <div className="p-7">
              {/* Type label */}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {currentQ?.questionType === "multiple_choice" && "Select one answer"}
                {currentQ?.questionType === "short_answer" && "Write your answer below"}
                {currentQ?.questionType === "drag_drop" && "Drag and drop — place each item in the correct category"}
                {currentQ?.questionType === "matching" && "Matching — connect each item in Column A to Column B"}
                {currentQ?.questionType === "ordering" && "Ordering — arrange items in the correct sequence"}
              </p>

              {/* Multiple choice */}
              {currentQ?.questionType === "multiple_choice" && options && (
                <div className="space-y-3 mt-3">
                  {options.map((opt) => {
                    const isSelected = currentAnswer === opt.label;
                    return (
                      <label key={opt.label}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                          ${isSelected ? "border-blue-600 bg-blue-50 shadow-sm" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"}`}>
                        <input type="radio" name={`q-${currentQ.id}`} value={opt.label}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(currentQ.id, opt.label)}
                          className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0" />
                        <div className="flex items-start gap-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                            ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                            {opt.label}
                          </span>
                          <span className="text-slate-800 leading-relaxed pt-0.5">{opt.text}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Short answer */}
              {currentQ?.questionType === "short_answer" && (
                <div className="mt-3">
                  <textarea value={currentAnswer}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Type your answer here. Show your working where applicable."
                    rows={5}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 resize-none text-sm leading-relaxed transition-colors" />
                  <p className="text-xs text-slate-400 mt-1.5">Write clearly. Partial credit may be awarded for correct working.</p>
                </div>
              )}

              {/* Drag & Drop */}
              {currentQ?.questionType === "drag_drop" && interactiveData && (
                <DragDropQuestion data={interactiveData} answer={currentAnswer}
                  onChange={(v) => handleAnswerChange(currentQ.id, v)} />
              )}

              {/* Matching */}
              {currentQ?.questionType === "matching" && interactiveData && (
                <MatchingQuestion data={interactiveData} answer={currentAnswer}
                  onChange={(v) => handleAnswerChange(currentQ.id, v)} />
              )}

              {/* Ordering */}
              {currentQ?.questionType === "ordering" && interactiveData && (
                <OrderingQuestion data={interactiveData} answer={currentAnswer}
                  onChange={(v) => handleAnswerChange(currentQ.id, v)} />
              )}
            </div>
          </div>

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Dot navigator (desktop) */}
            <div className="hidden md:flex items-center gap-1 flex-wrap justify-center max-w-sm">
              {questions.map((q, idx) => {
                const isAns = !!(answers[q.id] && answers[q.id] !== "{}" && answers[q.id] !== "[]");
                const isFl = flagged.has(q.id);
                return (
                  <button key={q.id} onClick={() => setCurrentIndex(idx)}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all
                      ${idx === currentIndex ? "bg-blue-700 text-white scale-110 shadow-md" :
                        isFl ? "bg-amber-400 text-white" :
                        isAns ? "bg-green-400 text-white" :
                        "bg-slate-200 text-slate-500 hover:bg-slate-300"}`}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors">
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setShowSubmitConfirm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors">
                Submit Exam
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status bar */}
          <div className="mt-4 text-center text-sm text-slate-500">
            <span className="font-semibold text-blue-700">{answeredCount}</span> of <span className="font-semibold">{questions.length}</span> answered
            {flagged.size > 0 && <span className="ml-3 text-amber-600">· {flagged.size} flagged for review</span>}
          </div>
        </div>
      </main>

      {/* Calculator widget */}
      {showCalc && <CalculatorWidget onClose={() => setShowCalc(false)} />}
    </div>
  );
}
