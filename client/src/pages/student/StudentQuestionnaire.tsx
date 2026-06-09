import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { toast } from "sonner";
import { CheckCircle2, Clock, ChevronRight, ChevronLeft, BookOpen, Home } from "lucide-react";

// ─── TIMSS Background Questionnaire ──────────────────────────────────────────
// Based on the official TIMSS Grade 8 Student Background Questionnaire

type QItem =
  | { id: string; type: "single"; question: string; options: string[] }
  | { id: string; type: "scale"; question: string; options: string[] }
  | { id: string; type: "text"; question: string; placeholder?: string }
  | { id: string; type: "number"; question: string; placeholder?: string; unit?: string }
  | { id: string; type: "grid"; question: string; rows: string[]; cols: string[] };

type Section = { title: string; description?: string; items: QItem[] };

const QUESTIONNAIRE_SECTIONS: Section[] = [
  {
    title: "About You",
    description: "Tell us about yourself and your background.",
    items: [
      {
        id: "q_gender",
        type: "single",
        question: "What is your gender?",
        options: ["Girl", "Boy", "Prefer not to say"],
      },
      {
        id: "q_age",
        type: "number",
        question: "How old are you?",
        placeholder: "Enter your age",
        unit: "years",
      },
      {
        id: "q_language_home",
        type: "single",
        question: "What language do you speak at home most of the time?",
        options: ["Arabic", "English", "Both Arabic and English", "Other"],
      },
      {
        id: "q_born_country",
        type: "single",
        question: "Were you born in this country?",
        options: ["Yes", "No"],
      },
      {
        id: "q_books_home",
        type: "single",
        question: "About how many books are there in your home? (Do not count magazines, newspapers, or school books.)",
        options: [
          "None or very few (0–10 books)",
          "Enough to fill one shelf (11–25 books)",
          "Enough to fill one bookcase (26–100 books)",
          "Enough to fill two bookcases (101–200 books)",
          "Enough to fill three or more bookcases (more than 200 books)",
        ],
      },
      {
        id: "q_computer_home",
        type: "single",
        question: "Do you have a computer (including tablets) at home that you use for school work?",
        options: ["Yes", "No"],
      },
      {
        id: "q_internet_home",
        type: "single",
        question: "Do you have internet connection at home?",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    title: "Your Parents / Guardians",
    description: "Tell us about the adults who take care of you.",
    items: [
      {
        id: "q_parent_education",
        type: "single",
        question: "What is the highest level of education completed by either of your parents or guardians?",
        options: [
          "Did not finish secondary school",
          "Finished secondary school",
          "Some post-secondary education",
          "University degree or higher",
          "I don't know",
        ],
      },
      {
        id: "q_parent_occupation",
        type: "single",
        question: "What is the main job of the parent or guardian who earns the most?",
        options: [
          "Professional (doctor, lawyer, engineer, teacher, etc.)",
          "Business owner or manager",
          "Clerical or office worker",
          "Skilled worker (mechanic, electrician, etc.)",
          "Unskilled worker",
          "Does not work outside the home",
          "I don't know",
        ],
      },
    ],
  },
  {
    title: "Your School",
    description: "Tell us about your school experience.",
    items: [
      {
        id: "q_feel_safe",
        type: "single",
        question: "How safe do you feel at school?",
        options: ["Very safe", "Safe", "A little unsafe", "Unsafe"],
      },
      {
        id: "q_belong",
        type: "single",
        question: "I feel like I belong at this school.",
        options: ["Agree a lot", "Agree a little", "Disagree a little", "Disagree a lot"],
      },
      {
        id: "q_school_problems",
        type: "grid",
        question: "How often do these things happen at your school?",
        rows: [
          "Students bully or intimidate others",
          "Students damage school property",
          "Students are disrespectful to teachers",
          "Students are absent from school without permission",
        ],
        cols: ["Never", "Monthly", "Weekly", "Daily"],
      },
    ],
  },
  {
    title: "Your Mathematics Class",
    description: "Tell us about your experience in mathematics.",
    items: [
      {
        id: "q_math_like",
        type: "single",
        question: "How much do you like learning mathematics?",
        options: ["Like it very much", "Like it somewhat", "Do not like it very much", "Do not like it at all"],
      },
      {
        id: "q_math_confident",
        type: "single",
        question: "How confident are you in mathematics?",
        options: ["Very confident", "Somewhat confident", "Not very confident", "Not at all confident"],
      },
      {
        id: "q_math_value",
        type: "single",
        question: "How much do you value mathematics?",
        options: ["Value it a lot", "Value it somewhat", "Do not value it very much", "Do not value it at all"],
      },
      {
        id: "q_math_homework",
        type: "single",
        question: "How often does your mathematics teacher give you homework?",
        options: ["Every day", "3–4 times a week", "1–2 times a week", "Less than once a week", "Never"],
      },
      {
        id: "q_math_activities",
        type: "grid",
        question: "How often do you do these things in your mathematics class?",
        rows: [
          "Listen to the teacher explain new content",
          "Work on problems on your own",
          "Work in small groups",
          "Discuss solutions with the class",
          "Use calculators",
          "Use computers or tablets",
        ],
        cols: ["Every lesson", "About half the lessons", "Some lessons", "Never"],
      },
    ],
  },
  {
    title: "Your Science Class",
    description: "Tell us about your experience in science.",
    items: [
      {
        id: "q_science_like",
        type: "single",
        question: "How much do you like learning science?",
        options: ["Like it very much", "Like it somewhat", "Do not like it very much", "Do not like it at all"],
      },
      {
        id: "q_science_confident",
        type: "single",
        question: "How confident are you in science?",
        options: ["Very confident", "Somewhat confident", "Not very confident", "Not at all confident"],
      },
      {
        id: "q_science_value",
        type: "single",
        question: "How much do you value science?",
        options: ["Value it a lot", "Value it somewhat", "Do not value it very much", "Do not value it at all"],
      },
      {
        id: "q_science_activities",
        type: "grid",
        question: "How often do you do these things in your science class?",
        rows: [
          "Watch the teacher do an experiment or investigation",
          "Do experiments or investigations yourself",
          "Work in small groups on experiments",
          "Use computers or tablets for science",
          "Discuss the results of experiments",
        ],
        cols: ["Every lesson", "About half the lessons", "Some lessons", "Never"],
      },
    ],
  },
  {
    title: "Outside of School",
    description: "Tell us about your activities outside of school.",
    items: [
      {
        id: "q_study_hours",
        type: "single",
        question: "On a typical school day, how much time do you spend studying or doing homework outside of school?",
        options: [
          "No time",
          "Less than 1 hour",
          "1–2 hours",
          "More than 2 hours but less than 4 hours",
          "4 or more hours",
        ],
      },
      {
        id: "q_tutoring",
        type: "single",
        question: "Do you attend tutoring or extra lessons outside of school for mathematics or science?",
        options: ["Yes, for both", "Yes, for mathematics only", "Yes, for science only", "No"],
      },
      {
        id: "q_extracurricular",
        type: "single",
        question: "How often do you participate in sports or other extracurricular activities?",
        options: ["Every day", "A few times a week", "Once a week", "Less than once a week", "Never"],
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudentQuestionnaire() {
  const { examId, classId, attemptId } = useParams<{ examId: string; classId: string; attemptId: string }>();
  const [, navigate] = useLocation();

  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitQuestionnaire = trpc.student.submitQuestionnaire.useMutation();

  // Countdown timer
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const setResponse = (id: string, value: unknown) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const setGridResponse = (id: string, row: string, col: string) => {
    setResponses(prev => ({
      ...prev,
      [id]: { ...(prev[id] as Record<string, string> || {}), [row]: col },
    }));
  };

  const section = QUESTIONNAIRE_SECTIONS[currentSection];
  const totalSections = QUESTIONNAIRE_SECTIONS.length;
  const progress = ((currentSection + 1) / totalSections) * 100;

  const sectionAnsweredCount = section.items.filter(item => {
    const r = responses[item.id];
    if (!r) return false;
    if (item.type === "grid") {
      const gridR = r as Record<string, string>;
      return item.rows.every(row => !!gridR[row]);
    }
    return true;
  }).length;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitQuestionnaire.mutateAsync({
        attemptId: Number(attemptId),
        responses,
      });
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit questionnaire. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Assessment Complete!</h1>
          <p className="text-blue-200 mb-2">Thank you for completing the assessment and background questionnaire.</p>
          <p className="text-slate-400 text-sm mb-8">Your responses have been recorded and will help improve educational research.</p>
          <button onClick={() => navigate("/student")}
            className="flex items-center gap-2 mx-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-colors">
            <Home size={18} /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isTimeLow = timeLeft < 300;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.01_240)] flex flex-col">
      {/* Header */}
      <header className="bg-[oklch(0.20_0.06_240)] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm">Background Questionnaire</div>
              <div className="text-white/60 text-xs">Section {currentSection + 1} of {totalSections}: {section.title}</div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold flex-shrink-0 ${isTimeLow ? "bg-red-600 animate-pulse" : "bg-white/10"}`}>
            <Clock size={13} className="opacity-70" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="h-1 bg-white/10">
          <div className="h-full bg-purple-400 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Section header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                {currentSection + 1}
              </span>
              <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
            </div>
            {section.description && <p className="text-slate-500 text-sm ml-11">{section.description}</p>}
            <div className="ml-11 mt-1 text-xs text-slate-400">{sectionAnsweredCount} of {section.items.length} answered</div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {section.items.map((item, itemIdx) => {
              const response = responses[item.id];
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <p className="text-sm font-semibold text-slate-800 mb-4 leading-relaxed">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mr-2 flex-shrink-0">{itemIdx + 1}</span>
                    {item.question}
                  </p>

                  {/* Single choice */}
                  {item.type === "single" && (
                    <div className="space-y-2">
                      {item.options.map(opt => (
                        <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${response === opt ? "border-purple-500 bg-purple-50" : "border-slate-200 hover:border-purple-300"}`}>
                          <input type="radio" name={item.id} value={opt} checked={response === opt}
                            onChange={() => setResponse(item.id, opt)}
                            className="w-4 h-4 accent-purple-600 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Number */}
                  {item.type === "number" && (
                    <div className="flex items-center gap-2">
                      <input type="number" value={(response as string) || ""}
                        onChange={e => setResponse(item.id, e.target.value)}
                        placeholder={item.placeholder}
                        className="border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 w-32" />
                      {item.unit && <span className="text-sm text-slate-500">{item.unit}</span>}
                    </div>
                  )}

                  {/* Text */}
                  {item.type === "text" && (
                    <textarea value={(response as string) || ""}
                      onChange={e => setResponse(item.id, e.target.value)}
                      placeholder={item.placeholder || "Type your answer here..."}
                      rows={3}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 resize-none" />
                  )}

                  {/* Grid */}
                  {item.type === "grid" && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr>
                            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 pr-4 w-1/2"></th>
                            {item.cols.map(col => (
                              <th key={col} className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 px-2">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.rows.map((row, rowIdx) => {
                            const gridR = (response as Record<string, string>) || {};
                            return (
                              <tr key={row} className={rowIdx % 2 === 0 ? "bg-slate-50 rounded-lg" : ""}>
                                <td className="py-2.5 pr-4 text-slate-700 text-sm">{row}</td>
                                {item.cols.map(col => (
                                  <td key={col} className="py-2.5 px-2 text-center">
                                    <input type="radio" name={`${item.id}_${row}`} value={col}
                                      checked={gridR[row] === col}
                                      onChange={() => setGridResponse(item.id, row, col)}
                                      className="w-4 h-4 accent-purple-600" />
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 mt-8">
            <button onClick={() => setCurrentSection(s => Math.max(0, s - 1))} disabled={currentSection === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-purple-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {/* Section dots */}
            <div className="flex items-center gap-1.5">
              {QUESTIONNAIRE_SECTIONS.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSection(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSection ? "bg-purple-600 scale-125" : idx < currentSection ? "bg-purple-300" : "bg-slate-300"}`} />
              ))}
            </div>

            {currentSection < totalSections - 1 ? (
              <button onClick={() => setCurrentSection(s => s + 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors">
                Next Section <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-60 transition-colors">
                {isSubmitting ? "Submitting..." : "Submit Questionnaire"} <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            You can skip questions. All responses are confidential and used only for educational research.
          </p>
        </div>
      </main>
    </div>
  );
}
