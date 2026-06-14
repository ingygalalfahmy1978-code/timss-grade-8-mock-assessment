import { trpc } from "@/lib/trpc";
import {
  AlertCircle, BookOpen, ChevronLeft, ChevronRight, Flag, Grid,
  Calculator, X, GripVertical, ArrowUp, ArrowDown, CheckCircle2,
  Coffee, FlaskConical, Pencil, Eraser, RotateCcw, Zap
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "wouter";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type MCOption = { label?: string; id?: string; text: string };
type DragItem = { id: string; text: string };
type DragTarget = { id: string; label: string };
type MatchItem = { id: string; text: string };
type OrderItem = { id: string; text: string };
type PatternCell = { id: string; value: string; isBlank?: boolean };
type PSIVariable = { id: string; label: string; unit?: string; type: "number" | "text" | "select"; options?: string[] };
type PSIStep = { id: string; instruction: string; variables?: PSIVariable[] };

interface InteractiveData {
  // drag_drop
  items?: DragItem[];
  targets?: DragTarget[];
  correctMapping?: Record<string, string>;
  // matching
  leftItems?: MatchItem[];
  rightItems?: MatchItem[];
  correctPairs?: Record<string, string>;
  // ordering
  correctOrder?: string[];
  // pattern_interaction (2D grid format)
  pattern?: PatternCell[][];
  patternRule?: string;
  blankPositions?: Array<[number, number]>;
  patternOptions?: string[];
  // pattern_interaction (flat displayItems format from seed)
  displayItems?: Array<{ id: string; value: string; isBlank?: boolean; blanks?: string[] }>;
  choices?: string[];
  // pattern_interaction (table format from seed)
  patternType?: string;
  headers?: string[];
  rows?: Array<{ id: string; values: string[]; blanks?: number[] }>;
  // psi_lab
  labTitle?: string;
  hypothesis?: string;
  scenario?: string;
  steps?: PSIStep[];
  dataTable?: { headers: string[]; rows: Array<Array<string | null>> };
  analysisQuestions?: Array<{ id: string; question: string; type: "text" | "select"; options?: string[] }>;
  // psi_lab (seed format)
  tasks?: Array<{ id: string; instruction: string; type: "multiple_choice" | "short_answer"; choices?: string[]; correctAnswer?: string }>;
  variables?: Array<{ name: string; unit?: string; values: (string | number)[] }>;
  // drawing_canvas
  canvasPrompt?: string;
  prompt?: string;
  backgroundImage?: string;
  drawingTools?: string[];
  canvasType?: string;
  gridLines?: boolean;
  axes?: boolean;
  preDrawnElements?: unknown[];
  scoringHints?: unknown;
  width?: number;
  height?: number;
}

type Question = {
  id: number;
  subject: string;
  contentDomain: string;
  scienceSubDomain?: string | null;
  cognitiveDomain: string;
  difficulty: string;
  questionType: string;
  maxPoints: number;
  questionText: string;
  options: unknown;
  interactiveData: unknown;
  imageUrl: string | null;
  session?: string;
};

type SavedAnswer = {
  questionId: number;
  answerGiven: string | null;
  isFlagged: boolean;
  pointsEarned?: number;
  drawingPartBAnswer?: string | null;
};

type ExamData = {
  attemptId: number;
  examName: string;
  durationMinutes: number;
  session1Minutes: number;
  breakMinutes: number;
  session2Minutes: number;
  questions: Question[];
  session1Questions: Question[];
  session2Questions: Question[];
  savedAnswers: SavedAnswer[];
  startedAt: Date | null;
  currentSession: string | null;
  session1CompletedAt: Date | null;
  session2StartedAt: Date | null;
  questionnaireCompleted: boolean;
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

  const num = (n: string) => { if (waitNext) { setDisplay(n); setWaitNext(false); return; } setDisplay(display === "0" ? n : display + n); };
  const dot = () => { if (waitNext) { setDisplay("0."); setWaitNext(false); return; } if (!display.includes(".")) setDisplay(display + "."); };
  const operation = (o: string) => { setPrev(display); setOp(o); setWaitNext(true); };
  const equals = () => {
    if (!prev || !op) return;
    const a = parseFloat(prev), b = parseFloat(display);
    let r = 0;
    if (op === "+") r = a + b; else if (op === "−") r = a - b; else if (op === "×") r = a * b; else if (op === "÷") r = b !== 0 ? a / b : 0;
    setDisplay(parseFloat(r.toFixed(10)).toString());
    setPrev(null); setOp(null); setWaitNext(true);
  };
  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setWaitNext(false); };
  const backspace = () => { if (display.length > 1) setDisplay(display.slice(0, -1)); else setDisplay("0"); };
  const sqrt = () => setDisplay(Math.sqrt(parseFloat(display)).toFixed(8).replace(/\.?0+$/, ""));
  const negate = () => setDisplay((parseFloat(display) * -1).toString());
  const percent = () => setDisplay((parseFloat(display) / 100).toString());

  const Btn = ({ label, action, cls = "" }: { label: string; action: () => void; cls?: string }) => (
    <button onClick={action} className={`h-10 rounded-lg text-sm font-semibold transition-all active:scale-95 select-none ${cls}`}>{label}</button>
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

function DragDropQuestion({ data, answer, onChange }: { data: InteractiveData; answer: string; onChange: (v: string) => void }) {
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
    setMapping(m); setDragging(null);
  };
  const removeItem = (itemId: string) => { const m = { ...mapping }; delete m[itemId]; setMapping(m); };
  return (
    <div className="mt-5 space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Items</p>
          {Object.keys(mapping).length > 0 && <button onClick={() => setMapping({})} className="text-xs text-blue-600 hover:underline">Reset all</button>}
        </div>
        <div className={`flex flex-wrap gap-2 min-h-[56px] rounded-xl border-2 border-dashed p-3 transition-colors ${dragging ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50"}`}
          onDragOver={e => e.preventDefault()}
          onDrop={() => { if (!dragging) return; const m = { ...mapping }; delete m[dragging]; setMapping(m); setDragging(null); }}>
          {unplaced.length === 0
            ? <span className="text-slate-400 text-sm self-center mx-auto">All items placed</span>
            : unplaced.map(item => (
              <div key={item.id} draggable onDragStart={() => setDragging(item.id)} onDragEnd={() => setDragging(null)}
                className="flex items-center gap-2 bg-white border-2 border-blue-200 rounded-lg px-3 py-2 cursor-grab active:cursor-grabbing shadow-sm hover:border-blue-400 transition-colors select-none">
                <GripVertical size={13} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">{item.text}</span>
              </div>
            ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {targets.map(target => {
          const placedId = Object.keys(mapping).find(k => mapping[k] === target.id);
          const placedItem = items.find(i => i.id === placedId);
          return (
            <div key={target.id} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(target.id)}
              className={`rounded-xl border-2 p-3 min-h-[80px] transition-colors ${dragging ? "border-blue-400 bg-blue-50/60" : "border-slate-200 bg-white"}`}>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">{target.label}</p>
              {placedItem
                ? <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <span className="text-sm font-medium text-slate-700">{placedItem.text}</span>
                    <button onClick={() => removeItem(placedItem.id)} className="text-slate-400 hover:text-red-500 ml-2 flex-shrink-0"><X size={13} /></button>
                  </div>
                : <div className="flex items-center justify-center h-9 text-slate-400 text-xs border border-dashed border-slate-300 rounded-lg">Drop here</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Matching Question ────────────────────────────────────────────────────────

function MatchingQuestion({ data, answer, onChange }: { data: InteractiveData; answer: string; onChange: (v: string) => void }) {
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
    if (p[selectedLeft] === rightId) delete p[selectedLeft]; else p[selectedLeft] = rightId;
    setPairs(p); setSelectedLeft(null);
  };
  return (
    <div className="mt-5">
      <p className="text-sm text-slate-500 mb-4 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
        <strong>How to match:</strong> Click an item in Column A, then click its match in Column B.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Column A</p>
          <div className="space-y-2">
            {left.map(item => {
              const matchedRight = right.find(r => r.id === pairs[item.id]);
              const isSelected = selectedLeft === item.id;
              return (
                <div key={item.id} onClick={() => clickLeft(item.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${isSelected ? "border-blue-600 bg-blue-50 shadow-md" : matchedRight ? "border-green-400 bg-green-50" : "border-slate-200 bg-white hover:border-blue-300"}`}>
                  <div className="font-medium text-slate-800">{item.text}</div>
                  {matchedRight && <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-green-600">→ {matchedRight.text}</span>
                    <button onClick={e => { e.stopPropagation(); const p = { ...pairs }; delete p[item.id]; setPairs(p); }} className="text-slate-400 hover:text-red-500"><X size={11} /></button>
                  </div>}
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
                <div key={item.id} onClick={() => clickRight(item.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${isMatched ? "border-green-400 bg-green-50 text-green-800" : selectedLeft ? "border-blue-300 bg-blue-50 hover:border-blue-500" : "border-slate-200 bg-white text-slate-800"}`}>
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

function OrderingQuestion({ data, answer, onChange }: { data: InteractiveData; answer: string; onChange: (v: string) => void }) {
  const originalItems = data.items || [];
  const initialIds = originalItems.map(i => i.id);
  const orderedIds = parseJson<string[]>(answer, initialIds);
  const ids = orderedIds.length === originalItems.length ? orderedIds : initialIds;
  const orderedItems = ids.map(id => originalItems.find(i => i.id === id)!).filter(Boolean);
  const setOrder = (newIds: string[]) => onChange(JSON.stringify(newIds));
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const moveUp = (idx: number) => { if (idx === 0) return; const n = [...ids]; [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]]; setOrder(n); };
  const moveDown = (idx: number) => { if (idx === ids.length - 1) return; const n = [...ids]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; setOrder(n); };
  const handleDrop = (toIdx: number) => {
    if (draggingIdx === null || draggingIdx === toIdx) return;
    const n = [...ids]; const [removed] = n.splice(draggingIdx, 1); n.splice(toIdx, 0, removed);
    setOrder(n); setDraggingIdx(null); setOverIdx(null);
  };
  return (
    <div className="mt-5">
      <p className="text-sm text-slate-500 mb-4 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
        <strong>How to order:</strong> Drag items or use the arrow buttons to arrange them in the correct sequence.
      </p>
      <div className="space-y-2">
        {orderedItems.map((item, idx) => (
          <div key={item.id} draggable
            onDragStart={() => setDraggingIdx(idx)} onDragOver={e => { e.preventDefault(); setOverIdx(idx); }}
            onDrop={() => handleDrop(idx)} onDragEnd={() => { setDraggingIdx(null); setOverIdx(null); }}
            className={`flex items-center gap-3 bg-white border-2 rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing transition-all ${draggingIdx === idx ? "opacity-50 border-blue-400" : overIdx === idx ? "border-blue-400 bg-blue-50 scale-[1.01]" : "border-slate-200 hover:border-blue-300"}`}>
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">{idx + 1}</span>
            <GripVertical size={15} className="text-slate-400 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium text-slate-800">{item.text}</span>
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"><ArrowUp size={12} className="text-slate-500" /></button>
              <button onClick={() => moveDown(idx)} disabled={idx === orderedItems.length - 1} className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors"><ArrowDown size={12} className="text-slate-500" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pattern Interaction Question ─────────────────────────────────────────────

function PatternQuestion({ data, answer, onChange }: { data: InteractiveData; answer: string; onChange: (v: string) => void }) {
  const savedAnswers = parseJson<Record<string, string>>(answer, {});
  const setAnswer = (key: string, val: string) => {
    const updated = { ...savedAnswers, [key]: val };
    onChange(JSON.stringify(updated));
  };

  // Determine which format the data is in
  const isTableFormat = data.patternType === "table" && data.rows && data.headers;
  const isFlatFormat = !isTableFormat && data.displayItems && data.displayItems.length > 0;
  const is2DFormat = !isTableFormat && !isFlatFormat && data.pattern && data.pattern.length > 0;

  const choices = data.choices || data.patternOptions || [];

  const renderChoice = (key: string) => {
    const selected = savedAnswers[key];
    if (choices.length > 0) {
      return (
        <select value={selected || ""} onChange={e => setAnswer(key, e.target.value)}
          className="w-20 h-12 border-2 border-dashed border-purple-400 rounded-xl text-center text-sm font-bold bg-purple-50 focus:outline-none focus:border-purple-600 cursor-pointer">
          <option value="">?</option>
          {choices.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }
    return (
      <input type="text" value={selected || ""} onChange={e => setAnswer(key, e.target.value)}
        placeholder="?" className="w-20 h-12 border-2 border-dashed border-purple-400 rounded-xl text-center text-sm font-bold bg-purple-50 focus:outline-none focus:border-purple-600" />
    );
  };

  return (
    <div className="mt-5">
      {(data.patternRule) && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-4">
          <p className="text-sm font-semibold text-purple-800">Pattern Rule: <span className="font-normal">{data.patternRule}</span></p>
        </div>
      )}

      {/* Table format (x/y table with blanks) */}
      {isTableFormat && data.rows && data.headers && (
        <div className="overflow-x-auto">
          <table className="border-collapse rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr>
                {data.headers.map((h, i) => (
                  <th key={i} className="px-6 py-3 bg-purple-700 text-white text-sm font-bold text-center min-w-[80px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-200">
                  {row.values.map((val, colIdx) => {
                    // blanks can be numeric indexes OR header name strings
                    const headerName = data.headers?.[colIdx] ?? String(colIdx);
                    const isBlank = row.blanks?.includes(colIdx as never) || row.blanks?.includes(headerName as never);
                    const cellKey = `${row.id}_${headerName}`;
                    return (
                      <td key={colIdx} className="px-4 py-3 text-center bg-white">
                        {isBlank ? renderChoice(cellKey) : (
                          <span className="text-sm font-semibold text-slate-800">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Flat displayItems format (sequence with blanks) */}
      {isFlatFormat && data.displayItems && (
        <div className="flex flex-wrap gap-3 items-center">
          {data.displayItems.map((item, idx) => {
            if (item.isBlank) {
              return (
                <div key={item.id} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-purple-500 font-bold">#{idx + 1}</span>
                  {renderChoice(item.id)}
                </div>
              );
            }
            return (
              <div key={item.id} className="w-16 h-12 border-2 border-slate-300 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-slate-700 shadow-sm">
                {item.value}
              </div>
            );
          })}
        </div>
      )}

      {/* 2D grid format */}
      {is2DFormat && data.pattern && (
        <div className="overflow-x-auto">
          <div className="inline-block">
            {data.pattern.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-2 mb-2">
                {row.map((cell) => {
                  if (cell.isBlank) {
                    return (
                      <div key={cell.id}>{renderChoice(cell.id)}</div>
                    );
                  }
                  return (
                    <div key={cell.id} className="w-20 h-12 border-2 border-slate-300 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-slate-700">
                      {cell.value}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {choices.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Available Options</p>
          <div className="flex flex-wrap gap-2">
            {choices.map(opt => (
              <span key={opt} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">{opt}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PSI Lab Question ─────────────────────────────────────────────────────────

function PSILabQuestion({ data, answer, onChange }: { data: InteractiveData; answer: string; onChange: (v: string) => void }) {
  const savedData = parseJson<Record<string, string>>(answer, {});
  const setField = (key: string, val: string) => onChange(JSON.stringify({ ...savedData, [key]: val }));

  // Detect seed format (has tasks/variables) vs original format (has steps/dataTable)
  const isSeedFormat = (data.tasks && data.tasks.length > 0) || (data.variables && data.variables.length > 0);

  return (
    <div className="mt-5 space-y-5">
      {/* Lab header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical size={18} className="text-emerald-600" />
          <h3 className="font-bold text-emerald-800 text-sm">{data.labTitle || "Laboratory Investigation"}</h3>
        </div>
        {data.hypothesis && (
          <div className="bg-white/60 rounded-lg p-3 mt-2">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Hypothesis</p>
            <p className="text-sm text-slate-700">{data.hypothesis}</p>
          </div>
        )}
        {data.scenario && (
          <div className="bg-white/60 rounded-lg p-3 mt-2">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Scenario</p>
            <p className="text-sm text-slate-700">{data.scenario}</p>
          </div>
        )}
      </div>

      {/* Variables / Data Table (seed format) */}
      {isSeedFormat && data.variables && data.variables.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Experimental Data</p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-emerald-50">
                  {data.variables.map((v, i) => (
                    <th key={i} className="px-4 py-2.5 text-left font-bold text-emerald-800 border-b border-emerald-200">
                      {v.name}{v.unit ? ` (${v.unit})` : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.variables[0].values.map((_, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    {data.variables!.map((v, colIdx) => (
                      <td key={colIdx} className="px-4 py-2 border-b border-slate-100 text-slate-700">
                        {String(v.values[rowIdx])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tasks (seed format) */}
      {isSeedFormat && data.tasks && data.tasks.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tasks</p>
          <div className="space-y-4">
            {data.tasks.map((task, idx) => (
              <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-800 mb-3">{idx + 1}. {task.instruction}</p>
                {task.type === "multiple_choice" && task.choices ? (
                  <div className="space-y-2">
                    {task.choices.map(choice => (
                      <label key={choice} className={`flex items-center gap-3 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                        savedData[`task_${task.id}`] === choice
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-emerald-300"
                      }`}>
                        <input type="radio" name={`psi_${task.id}`} value={choice}
                          checked={savedData[`task_${task.id}`] === choice}
                          onChange={() => setField(`task_${task.id}`, choice)}
                          className="w-4 h-4 accent-emerald-600" />
                        <span className="text-sm text-slate-700">{choice.replace(/_/g, " ")}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea value={savedData[`task_${task.id}`] || ""}
                    onChange={e => setField(`task_${task.id}`, e.target.value)}
                    rows={2} placeholder="Write your answer here..."
                    className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 resize-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      {data.steps && data.steps.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Procedure & Observations</p>
          <div className="space-y-4">
            {data.steps.map((step, idx) => (
              <div key={step.id} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 mb-3">{step.instruction}</p>
                    {step.variables && step.variables.map(v => (
                      <div key={v.id} className="mb-3">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          {v.label}{v.unit ? ` (${v.unit})` : ""}
                        </label>
                        {v.type === "select" && v.options ? (
                          <select value={savedData[`${step.id}_${v.id}`] || ""} onChange={e => setField(`${step.id}_${v.id}`, e.target.value)}
                            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                            <option value="">Select...</option>
                            {v.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input type={v.type === "number" ? "number" : "text"}
                            value={savedData[`${step.id}_${v.id}`] || ""}
                            onChange={e => setField(`${step.id}_${v.id}`, e.target.value)}
                            placeholder={v.type === "number" ? "Enter value" : "Enter observation"}
                            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 w-full" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data table */}
      {data.dataTable && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Data Table</p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-emerald-50">
                  {data.dataTable.headers.map((h, i) => (
                    <th key={i} className="px-4 py-2.5 text-left font-bold text-emerald-800 border-b border-emerald-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.dataTable.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    {row.map((cell, colIdx) => (
                      <td key={colIdx} className="px-4 py-2 border-b border-slate-100">
                        {cell === null ? (
                          <input type="text" value={savedData[`table_${rowIdx}_${colIdx}`] || ""}
                            onChange={e => setField(`table_${rowIdx}_${colIdx}`, e.target.value)}
                            className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:border-emerald-500" />
                        ) : (
                          <span className="text-slate-700">{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analysis questions */}
      {data.analysisQuestions && data.analysisQuestions.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Analysis Questions</p>
          <div className="space-y-4">
            {data.analysisQuestions.map((q, idx) => (
              <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-800 mb-2">{idx + 1}. {q.question}</p>
                {q.type === "select" && q.options ? (
                  <select value={savedData[`analysis_${q.id}`] || ""} onChange={e => setField(`analysis_${q.id}`, e.target.value)}
                    className="border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 w-full">
                    <option value="">Select your answer...</option>
                    {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <textarea value={savedData[`analysis_${q.id}`] || ""} onChange={e => setField(`analysis_${q.id}`, e.target.value)}
                    rows={3} placeholder="Write your analysis here..."
                    className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 resize-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Drawing Canvas Question ──────────────────────────────────────────────────

function DrawingCanvasQuestion({ data, answer, onChange }: { data: InteractiveData; answer: string; onChange: (v: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser" | "point">("pen");
  const [color, setColor] = useState("#1e40af");
  const [lineWidth, setLineWidth] = useState(3);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const baseLayerRef = useRef<ImageData | null>(null);
  const userLayerRef = useRef<ImageData | null>(null);
  const isGraphMode = !!(data.canvasType === "graph" || data.axes || data.gridLines);
  // Grid geometry constants (must match drawBaseLayer)
  const PADDING = 60;
  const X_STEPS = 10;
  const Y_STEPS = 10;
  const CANVAS_W = 800;
  const CANVAS_H = 500;

  // Draw the base layer (grid, axes, pre-drawn elements)
  const drawBaseLayer = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    if (data.canvasType === "graph" || data.axes || data.gridLines) {
      const padding = PADDING;
      const gridW = W - padding * 2;
      const gridH = H - padding * 2;
      const xSteps = X_STEPS;
      const ySteps = Y_STEPS;
      const cellW = gridW / xSteps;
      const cellH = gridH / ySteps;
      const originX = padding + (xSteps / 2) * cellW;
      const originY = padding + (ySteps / 2) * cellH;

      // Minor grid lines
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= xSteps; i++) {
        const x = padding + i * cellW;
        ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, H - padding); ctx.stroke();
      }
      for (let j = 0; j <= ySteps; j++) {
        const y = padding + j * cellH;
        ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(W - padding, y); ctx.stroke();
      }

      // Axes (bold)
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2.5;
      // X axis
      ctx.beginPath(); ctx.moveTo(padding - 12, originY); ctx.lineTo(W - padding + 12, originY); ctx.stroke();
      // Y axis
      ctx.beginPath(); ctx.moveTo(originX, padding - 12); ctx.lineTo(originX, H - padding + 12); ctx.stroke();

      // Arrow heads
      ctx.fillStyle = "#1e293b";
      ctx.beginPath(); ctx.moveTo(W - padding + 12, originY); ctx.lineTo(W - padding + 2, originY - 6); ctx.lineTo(W - padding + 2, originY + 6); ctx.fill();
      ctx.beginPath(); ctx.moveTo(originX, padding - 12); ctx.lineTo(originX - 6, padding - 2); ctx.lineTo(originX + 6, padding - 2); ctx.fill();

      // Axis labels
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("x", W - padding + 18, originY + 5);
      ctx.fillText("y", originX + 10, padding - 14);

      // Tick marks and number labels
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "#334155";
      ctx.textAlign = "center";
      for (let i = -xSteps / 2; i <= xSteps / 2; i++) {
        if (i === 0) continue;
        const px = originX + i * cellW;
        // Tick
        ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px, originY - 5); ctx.lineTo(px, originY + 5); ctx.stroke();
        // Label
        ctx.fillText(String(i), px, originY + 18);
      }
      ctx.textAlign = "right";
      for (let j = -ySteps / 2; j <= ySteps / 2; j++) {
        if (j === 0) continue;
        const py = originY - j * cellH;
        ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(originX - 5, py); ctx.lineTo(originX + 5, py); ctx.stroke();
        ctx.fillText(String(j), originX - 8, py + 4);
      }
      // Origin label
      ctx.textAlign = "right";
      ctx.fillText("0", originX - 8, originY + 18);
      ctx.textAlign = "left"; // reset
    }

    // Pre-drawn elements (geometry)
    if (data.preDrawnElements && Array.isArray(data.preDrawnElements)) {
      for (const el of data.preDrawnElements as Array<{ type: string; vertices?: Array<{x:number;y:number}>; labels?: string[] }>) {
        if (el.type === "triangle" && el.vertices && el.vertices.length >= 3) {
          ctx.strokeStyle = "#1e40af";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(el.vertices[0].x, el.vertices[0].y);
          for (let i = 1; i < el.vertices.length; i++) ctx.lineTo(el.vertices[i].x, el.vertices[i].y);
          ctx.closePath();
          ctx.stroke();
          // Right angle marker
          const [A, B, C] = el.vertices;
          ctx.strokeStyle = "#1e40af";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(A.x, A.y - 15, 15, 15);
          // Labels
          if (el.labels) {
            ctx.fillStyle = "#1e40af";
            ctx.font = "bold 12px sans-serif";
            if (el.labels[0]) ctx.fillText(el.labels[0], A.x + 18, (A.y + C.y) / 2);
            if (el.labels[1]) ctx.fillText(el.labels[1], (A.x + B.x) / 2 - 20, B.y + 18);
            if (el.labels[2]) ctx.fillText(el.labels[2], (B.x + C.x) / 2 + 8, (B.y + C.y) / 2);
          }
        }
      }
    }

    // Earth cross-section background for diagram type
    if (data.backgroundImage === "earth_cross_section" || data.canvasType === "diagram") {
      const cx = W / 2, cy = H / 2;
      const radii = [40, 90, 150, 200];
      const colors = ["#f97316", "#ef4444", "#84cc16", "#60a5fa"];
      const labels = (data as { labels?: string[] }).labels || ["Inner Core", "Outer Core", "Mantle", "Crust"];
      for (let i = radii.length - 1; i >= 0; i--) {
        ctx.beginPath();
        ctx.arc(cx, cy, radii[i], 0, Math.PI * 2);
        ctx.fillStyle = colors[i] + "40";
        ctx.fill();
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(labels[0] || "Inner Core", cx - 28, cy + 4);
      ctx.fillText(labels[1] || "Outer Core", cx + 48, cy - 20);
      ctx.fillText(labels[2] || "Mantle", cx + 95, cy - 40);
      ctx.fillText(labels[3] || "Crust", cx + 155, cy - 60);
    }

    // Save base layer so we can restore it under the user's drawing
    baseLayerRef.current = ctx.getImageData(0, 0, W, H);
  };

  // Initialize canvas with base layer on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawBaseLayer(canvas);
    // Restore saved drawing on top of base layer
    if (answer && answer.startsWith("data:image")) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0);
      };
      img.src = answer;
    }
  }, []);

  // Snap a canvas coordinate to the nearest grid intersection
  const snapToGrid = (cx: number, cy: number) => {
    if (!isGraphMode) return { x: cx, y: cy };
    const gridW = CANVAS_W - PADDING * 2;
    const gridH = CANVAS_H - PADDING * 2;
    const cellW = gridW / X_STEPS;
    const cellH = gridH / Y_STEPS;
    const snappedX = Math.round((cx - PADDING) / cellW) * cellW + PADDING;
    const snappedY = Math.round((cy - PADDING) / cellH) * cellH + PADDING;
    return { x: snappedX, y: snappedY };
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const plotPoint = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const raw = getPos(e);
    if (!raw) return;
    const pos = isGraphMode ? snapToGrid(raw.x, raw.y) : raw;
    const POINT_RADIUS = 6;
    const HIT_RADIUS = 10; // slightly larger than drawn radius for easier clicking
    // Check if there is already a point drawn at this location by sampling pixels
    // We detect by checking if the pixel at the snapped position is non-white (i.e., a point exists)
    const imageData = ctx.getImageData(pos.x - HIT_RADIUS, pos.y - HIT_RADIUS, HIT_RADIUS * 2, HIT_RADIUS * 2);
    let hasPoint = false;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i], g = imageData.data[i + 1], b = imageData.data[i + 2], a = imageData.data[i + 3];
      // A non-white, non-transparent pixel that is not a grid line (grid lines are light gray #cbd5e1)
      if (a > 200 && !(r > 240 && g > 240 && b > 240) && !(r > 190 && g > 200 && b > 220 && r < 220)) {
        hasPoint = true;
        break;
      }
    }
    if (hasPoint && baseLayerRef.current) {
      // Erase the point by restoring base layer in a circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, POINT_RADIUS + 4, 0, Math.PI * 2);
      ctx.clip();
      ctx.putImageData(baseLayerRef.current, 0, 0);
      ctx.restore();
    } else {
      // Draw a filled circle at the point
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, POINT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    // Save
    onChange(canvas.toDataURL("image/png"));
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (tool === "point") { plotPoint(e); return; }
    const pos = getPos(e);
    if (!pos) return;
    setIsDrawing(true);
    lastPos.current = pos;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (tool === "point") return; // points are placed on click, not drag
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    if (!pos || !lastPos.current) return;
    if (tool === "eraser") {
      // Eraser: restore base layer pixels in a circle around the cursor
      const r = lineWidth * 5;
      if (baseLayerRef.current) {
        // Composite: draw white circle then re-stamp base layer through a clip
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.putImageData(baseLayerRef.current, 0, 0);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    lastPos.current = pos;
  };

  const stopDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPos.current = null;
    // Save canvas as data URL
    if (canvasRef.current) {
      userLayerRef.current = canvasRef.current.getContext("2d")?.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height) ?? null;
      onChange(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      // Restore base layer (grid/axes/pre-drawn elements)
      if (baseLayerRef.current) {
        ctx.putImageData(baseLayerRef.current, 0, 0);
      } else {
        drawBaseLayer(canvasRef.current);
      }
    }
    onChange("");
  };

  const colors = ["#1e40af", "#dc2626", "#16a34a", "#7c3aed", "#d97706", "#0f172a"];

  return (
    <div className="mt-5">
      {data.canvasPrompt && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
          <p className="text-sm text-amber-800"><strong>Drawing task:</strong> {data.canvasPrompt}</p>
        </div>
      )}
      {isGraphMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3 text-xs text-blue-800">
          <strong>Tip:</strong> Use <strong>Plot Point</strong> mode to click exactly on grid intersections. Switch to <strong>Pen</strong> to draw lines connecting the points.
        </div>
      )}
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button onClick={() => setTool("pen")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${tool === "pen" ? "bg-white shadow text-blue-700" : "text-slate-600 hover:text-slate-800"}`}>
            <Pencil size={12} /> Pen
          </button>
          {isGraphMode && (
            <button onClick={() => setTool("point")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${tool === "point" ? "bg-white shadow text-green-700" : "text-slate-600 hover:text-slate-800"}`}>
              <Zap size={12} /> Plot Point
            </button>
          )}
          <button onClick={() => setTool("eraser")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${tool === "eraser" ? "bg-white shadow text-slate-700" : "text-slate-600 hover:text-slate-800"}`}>
            <Eraser size={12} /> Eraser
          </button>
        </div>
        <div className="flex items-center gap-1">
          {colors.map(c => (
            <button key={c} onClick={() => { setColor(c); setTool("pen"); }}
              className={`w-6 h-6 rounded-full border-2 transition-all ${color === c && tool === "pen" ? "border-slate-800 scale-125" : "border-transparent"}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Size:</span>
          <input type="range" min={1} max={12} value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} className="w-20 accent-blue-600" />
        </div>
        <button onClick={clearCanvas} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
          <RotateCcw size={12} /> Clear
        </button>
      </div>
      {/* Canvas */}
      <div className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white" style={{ touchAction: "none" }}>
        <canvas ref={canvasRef} width={CANVAS_W} height={isGraphMode ? CANVAS_H : (data.height || 400)}
          className="w-full cursor-crosshair block"
          style={{ cursor: tool === "eraser" ? "cell" : tool === "point" ? "crosshair" : "crosshair" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} />
      </div>
      <p className="text-xs text-slate-400 mt-2">Your drawing is automatically saved as you draw.</p>
    </div>
  );
}

// ─── Break Screen ─────────────────────────────────────────────────────────────

function BreakScreen({
  examName, breakMinutes, session2Minutes, attemptId, onStartSession2
}: {
  examName: string; breakMinutes: number; session2Minutes: number; attemptId: number; onStartSession2: () => void;
}) {
  const [breakTimeLeft, setBreakTimeLeft] = useState(breakMinutes * 60);
  const [canStart, setCanStart] = useState(false);
  const startSession2 = trpc.student.startSession2.useMutation();
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (breakTimeLeft <= 0) { setCanStart(true); return; }
    const interval = setInterval(() => {
      setBreakTimeLeft(t => {
        if (t <= 1) { setCanStart(true); clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    setStarting(true);
    try {
      await startSession2.mutateAsync({ attemptId });
      onStartSession2();
    } catch {
      toast.error("Failed to start Session 2. Please try again.");
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Coffee size={36} className="text-blue-300" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Session 1 Complete!</h1>
        <p className="text-blue-200 mb-6">Mathematics session finished. Take a short break before Science.</p>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-sm">Exam</span>
            <span className="text-white font-semibold text-sm">{examName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-sm">Session 1</span>
            <span className="text-green-400 font-semibold text-sm flex items-center gap-1"><CheckCircle2 size={14} /> Mathematics — Completed</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-sm">Session 2</span>
            <span className="text-blue-300 font-semibold text-sm">Science — {session2Minutes} minutes</span>
          </div>
        </div>

        {!canStart ? (
          <div className="bg-white/10 rounded-2xl p-6 mb-6">
            <p className="text-slate-300 text-sm mb-3">Break time remaining</p>
            <div className="text-5xl font-mono font-bold text-white mb-2">{formatTime(breakTimeLeft)}</div>
            <p className="text-slate-400 text-xs">Session 2 will be available when the break ends</p>
          </div>
        ) : (
          <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 mb-6">
            <p className="text-green-300 font-semibold">Break time is over — you may begin Session 2</p>
          </div>
        )}

        <button onClick={handleStart} disabled={!canStart || starting}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-colors">
          {starting ? "Starting Session 2..." : canStart ? "Begin Session 2 — Science" : "Waiting for break to end..."}
        </button>
        <p className="text-slate-500 text-xs mt-3">You cannot go back to Session 1 after starting Session 2</p>
      </div>
    </div>
  );
}

// ─── Main Exam Interface ───────────────────────────────────────────────────────

export default function ExamInterface() {
  const { examId, classId } = useParams<{ examId: string; classId: string }>();
  const [, navigate] = useLocation();

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [phase, setPhase] = useState<"loading" | "session1" | "break" | "session2" | "submitting" | "error">("loading");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [partBAnswers, setPartBAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [session1TimeSpent, setSession1TimeSpent] = useState(0);
  const sessionStartRef = useRef<number>(Date.now());
  const [showOverview, setShowOverview] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startExam = trpc.student.startExam.useMutation();
  const saveAnswer = trpc.student.saveAnswer.useMutation({
    onError: (err) => {
      // If the attempt was deleted (e.g. admin reset), reload the exam to get a fresh attempt
      if (err.data?.code === 'NOT_FOUND') {
        loadedRef.current = false;
        setExamData(null);
        setPhase('loading');
        startExam.mutateAsync({ examId: Number(examId), classId: Number(classId) })
          .then((data) => {
            if ((data as { alreadySubmitted?: boolean }).alreadySubmitted) {
              navigate(`/student/exam/${examId}/${classId}/complete`);
              return;
            }
            const ed = data as ExamData;
            setExamData(ed);
            const savedMap: Record<number, string> = {};
            const savedFlags = new Set<number>();
            for (const a of ed.savedAnswers) {
              if (a.answerGiven) savedMap[a.questionId] = a.answerGiven;
              if (a.isFlagged) savedFlags.add(a.questionId);
            }
            setAnswers(savedMap);
            setFlagged(savedFlags);
            const total = (ed.session1Minutes || 45) * 60;
            setTimeLeft(total);
            setPhase('session1');
          })
          .catch(() => {
            navigate(`/student/exam/${examId}/${classId}/instructions`);
          });
      }
    }
  });
  const submitExam = trpc.student.submitExam.useMutation();
  const completeSession1 = trpc.student.completeSession1.useMutation();
  const loadedRef = useRef(false);

  // Current session questions
  const currentSessionQuestions = examData
    ? (phase === "session2" ? examData.session2Questions : examData.session1Questions)
    : [];

  // Load exam on mount
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    startExam.mutateAsync({ examId: Number(examId), classId: Number(classId) })
      .then((data) => {
        if ((data as { alreadySubmitted?: boolean }).alreadySubmitted) {
          navigate(`/student/exam/${examId}/${classId}/complete`);
          return;
        }
        const ed = data as ExamData;
        setExamData(ed);
        const savedMap: Record<number, string> = {};
        const savedFlags = new Set<number>();
        for (const a of ed.savedAnswers) {
          if (a.answerGiven) savedMap[a.questionId] = a.answerGiven;
          if (a.isFlagged) savedFlags.add(a.questionId);
        }
        setAnswers(savedMap);
        setFlagged(savedFlags);

        // Determine phase from attempt state
        const currentSession = ed.currentSession;
        if (currentSession === "science_session" && ed.session2StartedAt) {
          // Resuming session 2
          const elapsed = Math.floor((Date.now() - new Date(ed.session2StartedAt).getTime()) / 1000);
          const total = (ed.session2Minutes || 45) * 60;
          setTimeLeft(Math.max(0, total - elapsed));
          setPhase("session2");
        } else if (currentSession === "science_session" && !ed.session2StartedAt) {
          // On break
          setPhase("break");
        } else {
          // Session 1 (math) — fresh or resuming
          const elapsed = ed.startedAt
            ? Math.floor((Date.now() - new Date(ed.startedAt).getTime()) / 1000) : 0;
          const total = (ed.session1Minutes || 45) * 60;
          setTimeLeft(Math.max(0, total - elapsed));
          setPhase("session1");
        }
        sessionStartRef.current = Date.now();
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load exam");
        setPhase("error");
      });
  }, [examId, classId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || phase === "break" || phase === "loading" || phase === "error") return;
    if (timeLeft <= 0) {
      if (phase === "session1") handleEndSession1(true);
      else if (phase === "session2") handleAutoSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t === null || t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, phase]);

  const handleEndSession1 = useCallback(async (autoEnd = false) => {
    if (!examData) return;
    const s1Spent = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    setSession1TimeSpent(s1Spent);
    try {
      await completeSession1.mutateAsync({ attemptId: examData.attemptId, session1TimeSpentSeconds: s1Spent });
      setPhase("break");
      if (autoEnd) toast.info("Session 1 time is up. Please take your break.");
    } catch {
      toast.error("Failed to end Session 1. Please try again.");
    }
  }, [examData]);

  const handleStartSession2 = useCallback(() => {
    if (!examData) return;
    const total = (examData.session2Minutes || 45) * 60;
    setTimeLeft(total);
    setCurrentIndex(0);
    sessionStartRef.current = Date.now();
    setPhase("session2");
  }, [examData]);

  const handleAutoSubmit = useCallback(async () => {
    if (!examData || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const s2Spent = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      const totalSpent = session1TimeSpent + s2Spent;
      await submitExam.mutateAsync({ attemptId: examData.attemptId, timeSpentSeconds: totalSpent, session2TimeSpentSeconds: s2Spent });
      navigate(`/student/exam/${examId}/${classId}/complete`);
    } catch {
      toast.error("Auto-submit failed. Please submit manually.");
      setIsSubmitting(false);
    }
  }, [examData, isSubmitting, session1TimeSpent, examId, classId]);

  const handleAnswerChange = (questionId: number, value: string, sessionType?: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (!examData) return;
      saveAnswer.mutate({
        attemptId: examData.attemptId,
        questionId,
        answerGiven: value,
        isFlagged: flagged.has(questionId),
        session: (sessionType || (phase === "session2" ? "science_session" : "math_session")) as "math_session" | "science_session",
        drawingPartBAnswer: partBAnswers[questionId] ?? null,
      });
    }, 600);
  };

  const handlePartBChange = (questionId: number, value: string) => {
    setPartBAnswers(prev => ({ ...prev, [questionId]: value }));
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (!examData) return;
      saveAnswer.mutate({
        attemptId: examData.attemptId,
        questionId,
        answerGiven: answers[questionId] ?? null,
        isFlagged: flagged.has(questionId),
        session: (phase === "session2" ? "science_session" : "math_session") as "math_session" | "science_session",
        drawingPartBAnswer: value,
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
      session: phase === "session2" ? "science_session" : "math_session",
    });
  };

  const handleSubmit = async () => {
    if (!examData) return;
    setIsSubmitting(true);
    try {
      const s2Spent = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      const totalSpent = session1TimeSpent + s2Spent;
      await submitExam.mutateAsync({ attemptId: examData.attemptId, timeSpentSeconds: totalSpent, session2TimeSpentSeconds: s2Spent });
      navigate(`/student/exam/${examId}/${classId}/complete`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Submission failed");
      setIsSubmitting(false);
    }
  };

  // ─── Loading / Error states ───────────────────────────────────────────────

  if (phase === "loading") {
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

  if (phase === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Cannot Load Assessment</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => navigate("/student")} className="px-5 py-2.5 bg-blue-700 text-white rounded-xl font-medium text-sm hover:bg-blue-800 transition-colors">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!examData) return null;

  // ─── Break Screen ─────────────────────────────────────────────────────────

  if (phase === "break") {
    return (
      <BreakScreen
        examName={examData.examName}
        breakMinutes={examData.breakMinutes || 5}
        session2Minutes={examData.session2Minutes || 45}
        attemptId={examData.attemptId}
        onStartSession2={handleStartSession2}
      />
    );
  }

  const questions = currentSessionQuestions;
  const currentQ = questions[currentIndex];
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
  const sessionAnsweredCount = questions.filter(q => {
    const v = answers[q.id];
    return v !== undefined && v !== "" && v !== "{}" && v !== "[]";
  }).length;
  const isTimeLow = timeLeft !== null && timeLeft < 300;
  const isTimeMedium = timeLeft !== null && timeLeft >= 300 && timeLeft < 600;
  const isSession1 = phase === "session1";
  const sessionLabel = isSession1 ? "Session 1 — Mathematics" : "Session 2 — Science";
  const sessionColor = isSession1 ? "bg-blue-700" : "bg-emerald-700";

  // ─── Overview Panel ───────────────────────────────────────────────────────

  if (showOverview) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className={`${sessionColor} text-white px-4 py-3 flex items-center justify-between`}>
          <div>
            <div className="font-bold text-sm">{examData.examName}</div>
            <div className="text-white/60 text-xs">{sessionLabel} — Overview</div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${isTimeLow ? "bg-red-600 animate-pulse" : isTimeMedium ? "bg-yellow-500" : "bg-white/10"}`}>
            {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
          </div>
        </header>
        <div className="max-w-3xl mx-auto w-full px-4 py-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
            <h2 className="font-bold text-slate-800 mb-1">{sessionLabel} Progress</h2>
            <p className="text-slate-500 text-sm mb-4">{sessionAnsweredCount} of {questions.length} questions answered</p>
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
                  <button key={q.id} onClick={() => { setCurrentIndex(idx); setShowOverview(false); }}
                    className={`h-9 w-9 rounded-lg text-xs font-bold border-2 transition-all hover:scale-105 ${isFl ? "border-amber-400 bg-amber-50 text-amber-700" : isAns ? "border-green-400 bg-green-50 text-green-700" : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-300"}`}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowOverview(false)} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-blue-300 transition-colors">Continue</button>
            {isSession1
              ? <button onClick={() => { setShowOverview(false); handleEndSession1(); }}
                  className="flex-1 py-3 bg-blue-700 text-white rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors">End Session 1 & Take Break</button>
              : <button onClick={() => { setShowOverview(false); setShowSubmitConfirm(true); }}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors">Submit Exam</button>
            }
          </div>
        </div>
      </div>
    );
  }

  // ─── Submit Confirmation ──────────────────────────────────────────────────

  if (showSubmitConfirm) {
    const unanswered = questions.length - sessionAnsweredCount;
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={30} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Submit Assessment?</h2>
          <p className="text-slate-600 mb-4">You have answered <strong className="text-blue-700">{answeredCount}</strong> of <strong>{examData.session1Questions.length + examData.session2Questions.length}</strong> total questions.</p>
          {unanswered > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
              <strong>{unanswered} question{unanswered > 1 ? "s" : ""}</strong> in Session 2 left unanswered.
            </div>
          )}
          <div className="flex gap-3 mt-2">
            <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-blue-300 transition-colors">Go Back</button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 disabled:opacity-60 transition-colors">
              {isSubmitting ? "Submitting..." : "Confirm Submit"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Exam Screen ─────────────────────────────────────────────────────

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No questions available for this session.</p>
          <button onClick={() => navigate("/student")} className="px-5 py-2.5 bg-blue-700 text-white rounded-xl font-medium text-sm">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const isCurrentFlagged = flagged.has(currentQ.id);
  const currentAnswer = answers[currentQ.id] ?? "";
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const maxPoints = currentQ.maxPoints || 1;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.01_240)] flex flex-col">
      {/* ── Top Bar ── */}
      <header className={`${sessionColor} text-white sticky top-0 z-40 shadow-lg`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${isSession1 ? "bg-blue-500" : "bg-emerald-500"} flex items-center justify-center`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">{examData.examName}</div>
              <div className="text-white/60 text-xs">{sessionLabel} · Q{currentIndex + 1}/{questions.length}</div>
            </div>
          </div>

          {/* Center: timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold flex-shrink-0 ${isTimeLow ? "bg-red-600 animate-pulse" : isTimeMedium ? "bg-yellow-500 text-slate-900" : "bg-white/10"}`}>
            <span className="text-xs font-normal opacity-70 hidden sm:inline">TIME</span>
            {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
          </div>

          {/* Right: tools */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isSession1 && (
              <button onClick={() => setShowCalc(!showCalc)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${showCalc ? "bg-white text-blue-900" : "bg-white/10 hover:bg-white/20"}`}>
                <Calculator size={14} />
                <span className="hidden sm:inline">Calc</span>
              </button>
            )}
            <button onClick={() => setShowOverview(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors">
              <Grid size={14} />
              <span className="hidden sm:inline">Overview</span>
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <div className={`h-full ${isSession1 ? "bg-blue-300" : "bg-emerald-300"} transition-all duration-500`} style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* ── Question Area ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Question meta */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${isSession1 ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                {currentQ.subject}
                {currentQ.scienceSubDomain && ` · ${currentQ.scienceSubDomain}`}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{currentQ.contentDomain}</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">{currentQ.cognitiveDomain}</span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${currentQ.difficulty === "Hard" ? "bg-red-100 text-red-600" : currentQ.difficulty === "Medium" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>
                {currentQ.difficulty}
              </span>
              {maxPoints > 1 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                  <Zap size={10} /> {maxPoints} pts
                </span>
              )}
            </div>
            <button onClick={() => handleToggleFlag(currentQ.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isCurrentFlagged ? "bg-amber-100 text-amber-700 border border-amber-300" : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-600"}`}>
              <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? "fill-amber-500" : ""}`} />
              {isCurrentFlagged ? "Flagged" : "Flag for Review"}
            </button>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="p-7 border-b border-slate-100">
              {currentQ.imageUrl && (
                <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={currentQ.imageUrl} alt="Question diagram" className="max-w-full max-h-72 mx-auto object-contain p-3" />
                </div>
              )}
              <div className="text-base leading-relaxed text-slate-900 font-medium whitespace-pre-wrap">{currentQ.questionText}</div>
            </div>

            <div className="p-7">
              {/* Type label */}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {currentQ.questionType === "multiple_choice" && "Select one answer"}
                {(currentQ.questionType === "short_answer" || currentQ.questionType === "partial_credit_short_answer") && `Write your answer below${maxPoints > 1 ? ` (up to ${maxPoints} points)` : ""}`}
                {currentQ.questionType === "drag_drop" && "Drag and drop — place each item in the correct category"}
                {currentQ.questionType === "matching" && "Matching — connect each item in Column A to Column B"}
                {currentQ.questionType === "ordering" && "Ordering — arrange items in the correct sequence"}
                {currentQ.questionType === "pattern_interaction" && "Pattern — complete the missing elements"}
                {currentQ.questionType === "psi_lab" && "Lab Investigation — follow the steps and record your findings"}
                {currentQ.questionType === "drawing_canvas" && "Drawing — use the canvas to draw your answer"}
                {currentQ.questionType === "hotspot" && "Select the correct region"}
              </p>

              {/* Multiple choice */}
              {currentQ.questionType === "multiple_choice" && options && (
                <div className="space-y-3 mt-3">
                  {options.map((opt) => {
                    const optKey = (opt.label ?? opt.id) as string;
                    const isSelected = currentAnswer === optKey;
                    return (
                      <label key={optKey} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "border-blue-600 bg-blue-50 shadow-sm" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"}`}>
                        <input type="radio" name={`q-${currentQ.id}`} value={optKey} checked={isSelected}
                          onChange={() => handleAnswerChange(currentQ.id, optKey)}
                          className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0" />
                        <div className="flex items-start gap-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{optKey}</span>
                          <span className="text-slate-800 leading-relaxed pt-0.5">{opt.text}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Short answer / Partial credit */}
              {(currentQ.questionType === "short_answer" || currentQ.questionType === "partial_credit_short_answer") && (
                <div className="mt-3">
                  <textarea value={currentAnswer} onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Type your answer here. Show your working where applicable."
                    rows={5}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 resize-none text-sm leading-relaxed transition-colors" />
                  {maxPoints > 1 && <p className="text-xs text-purple-600 mt-1.5 font-medium">This question awards up to {maxPoints} points. Show full working for maximum credit.</p>}
                  {maxPoints === 1 && <p className="text-xs text-slate-400 mt-1.5">Write clearly. Partial credit may be awarded for correct working.</p>}
                </div>
              )}

              {/* Drag & Drop */}
              {currentQ.questionType === "drag_drop" && interactiveData && (
                <DragDropQuestion data={interactiveData} answer={currentAnswer} onChange={(v) => handleAnswerChange(currentQ.id, v)} />
              )}

              {/* Matching */}
              {currentQ.questionType === "matching" && interactiveData && (
                <MatchingQuestion data={interactiveData} answer={currentAnswer} onChange={(v) => handleAnswerChange(currentQ.id, v)} />
              )}

              {/* Ordering */}
              {currentQ.questionType === "ordering" && interactiveData && (
                <OrderingQuestion data={interactiveData} answer={currentAnswer} onChange={(v) => handleAnswerChange(currentQ.id, v)} />
              )}

              {/* Pattern Interaction */}
              {currentQ.questionType === "pattern_interaction" && interactiveData && (
                <PatternQuestion data={interactiveData} answer={currentAnswer} onChange={(v) => handleAnswerChange(currentQ.id, v)} />
              )}

              {/* PSI Lab */}
              {currentQ.questionType === "psi_lab" && interactiveData && (
                <PSILabQuestion data={interactiveData} answer={currentAnswer} onChange={(v) => handleAnswerChange(currentQ.id, v)} />
              )}

              {/* Drawing Canvas */}
              {currentQ.questionType === "drawing_canvas" && interactiveData && (
                <div className="space-y-4">
                  <DrawingCanvasQuestion data={interactiveData} answer={currentAnswer} onChange={(v) => handleAnswerChange(currentQ.id, v)} />
                  {/* Part B: written answer */}
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Part B</span>
                      <span className="text-sm font-medium text-slate-700">Written Answer</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Write your answer in the box below. This will be automatically corrected.</p>
                    <textarea
                      value={partBAnswers[currentQ.id] ?? ""}
                      onChange={(e) => handlePartBChange(currentQ.id, e.target.value)}
                      placeholder="Write your answer here..."
                      rows={3}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 resize-none text-sm leading-relaxed transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Fallback: interactive question with no data — show textarea */}
              {["drag_drop", "matching", "ordering", "pattern_interaction", "psi_lab", "drawing_canvas"].includes(currentQ.questionType) && !interactiveData && (
                <div className="mt-3">
                  <textarea value={currentAnswer} onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Type your answer here. Show your working where applicable."
                    rows={5}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 resize-none text-sm leading-relaxed transition-colors" />
                  <p className="text-xs text-slate-400 mt-1.5">Write your answer clearly.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {/* Dot navigator */}
            <div className="hidden md:flex items-center gap-1 flex-wrap justify-center max-w-sm">
              {questions.map((q, idx) => {
                const isAns = !!(answers[q.id] && answers[q.id] !== "{}" && answers[q.id] !== "[]");
                const isFl = flagged.has(q.id);
                return (
                  <button key={q.id} onClick={() => setCurrentIndex(idx)}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${idx === currentIndex ? `${isSession1 ? "bg-blue-700" : "bg-emerald-700"} text-white scale-110 shadow-md` : isFl ? "bg-amber-400 text-white" : isAns ? "bg-green-400 text-white" : "bg-slate-200 text-slate-500 hover:bg-slate-300"}`}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
                className={`flex items-center gap-2 px-5 py-2.5 ${isSession1 ? "bg-blue-700 hover:bg-blue-800" : "bg-emerald-600 hover:bg-emerald-700"} text-white rounded-xl font-semibold text-sm transition-colors`}>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : isSession1 ? (
              <button onClick={() => handleEndSession1()}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors">
                End Session 1 <Coffee className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setShowSubmitConfirm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors">
                Submit Exam <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status bar */}
          <div className="mt-4 text-center text-sm text-slate-500">
            <span className="font-semibold text-blue-700">{sessionAnsweredCount}</span> of <span className="font-semibold">{questions.length}</span> answered in this session
            {flagged.size > 0 && <span className="ml-3 text-amber-600">· {flagged.size} flagged</span>}
          </div>
        </div>
      </main>

      {/* Calculator widget */}
      {showCalc && <CalculatorWidget onClose={() => setShowCalc(false)} />}
    </div>
  );
}
