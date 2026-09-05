import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { usePlatformAuth } from "./hooks/usePlatformAuth";

// Auth
import Login from "./pages/Login";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminExams from "./pages/admin/AdminExams";
import AdminExamDetail from "./pages/admin/AdminExamDetail";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherClassDetail from "./pages/teacher/TeacherClassDetail";
import TeacherReports from "./pages/teacher/TeacherReports";
import AnswerReview from "./pages/teacher/AnswerReview";
import TeacherAnalytics from "./pages/teacher/TeacherAnalytics";

import StudentProgress from "./pages/student/StudentProgress";
// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import ExamInstructions from "./pages/student/ExamInstructions";
import ExamInterface from "./pages/student/ExamInterface";
import ExamComplete from "./pages/student/ExamComplete";
import StudentQuestionnaire from "./pages/student/StudentQuestionnaire";
import MyResults from "./pages/student/MyResults";

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin w-8 h-8 border-2 border-[oklch(0.42_0.14_240)] border-t-transparent rounded-full" />
  </div>
);

// Safe redirect component — uses useEffect to avoid setState-during-render
function Redirect({ to }: { to: string }) {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate(to);
  }, [to, navigate]);
  return <Spinner />;
}

function ProtectedRoute({
  component: Component,
  allowedRoles,
}: {
  component: React.ComponentType;
  allowedRoles: string[];
}) {
  const { user, isLoading } = usePlatformAuth();

  if (isLoading) return <Spinner />;

  if (!user) return <Redirect to="/login" />;

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Redirect to="/admin" />;
    if (user.role === "teacher") return <Redirect to="/teacher" />;
    return <Redirect to="/student" />;
  }

  return <Component />;
}

function RootRedirect() {
  const { user, isLoading } = usePlatformAuth();

  if (isLoading) return <Spinner />;
  if (!user) return <Redirect to="/login" />;
  if (user.role === "admin") return <Redirect to="/admin" />;
  if (user.role === "teacher") return <Redirect to="/teacher" />;
  return <Redirect to="/student" />;
}

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/login" component={Login} />

      {/* Root redirect */}
      <Route path="/" component={RootRedirect} />

      {/* Admin routes */}
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/students">
        {() => <ProtectedRoute component={AdminStudents} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/teachers">
        {() => <ProtectedRoute component={AdminTeachers} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/classes">
        {() => <ProtectedRoute component={AdminClasses} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/questions">
        {() => <ProtectedRoute component={AdminQuestions} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/exams">
        {() => <ProtectedRoute component={AdminExams} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/exams/:id">
        {() => <ProtectedRoute component={AdminExamDetail} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/analytics">
        {() => <ProtectedRoute component={AdminAnalytics} allowedRoles={["admin"]} />}
      </Route>

      {/* Teacher routes */}
      <Route path="/teacher">
        {() => <ProtectedRoute component={TeacherDashboard} allowedRoles={["teacher", "admin"]} />}
      </Route>
      <Route path="/teacher/classes">
        {() => <ProtectedRoute component={TeacherClasses} allowedRoles={["teacher", "admin"]} />}
      </Route>
      <Route path="/teacher/classes/:id">
        {() => <ProtectedRoute component={TeacherClassDetail} allowedRoles={["teacher", "admin"]} />}
      </Route>
      <Route path="/teacher/reports">
        {() => <ProtectedRoute component={TeacherReports} allowedRoles={["teacher", "admin"]} />}
      </Route>
      <Route path="/teacher/answer-review">
        {() => <ProtectedRoute component={AnswerReview} allowedRoles={["teacher", "admin"]} />}
      </Route>
      <Route path="/teacher/analytics">
        {() => <ProtectedRoute component={TeacherAnalytics} allowedRoles={["teacher", "admin"]} />}
      </Route>

      {/* Student routes */}
      <Route path="/student">
        {() => <ProtectedRoute component={StudentDashboard} allowedRoles={["student"]} />}
      </Route>
      <Route path="/student/exam/:examId/:classId/instructions">
        {() => <ProtectedRoute component={ExamInstructions} allowedRoles={["student"]} />}
      </Route>
      <Route path="/student/exam/:examId/:classId/complete">
        {() => <ProtectedRoute component={ExamComplete} allowedRoles={["student"]} />}
      </Route>
      <Route path="/student/exam/:examId/:classId/questionnaire/:attemptId">
        {() => <ProtectedRoute component={StudentQuestionnaire} allowedRoles={["student"]} />}
      </Route>
      <Route path="/student/exam/:examId/:classId">
        {() => <ProtectedRoute component={ExamInterface} allowedRoles={["student"]} />}
      </Route>
      <Route path="/student/results">
        {() => <ProtectedRoute component={MyResults} allowedRoles={["student"]} />}
      </Route>
      <Route path="/student/progress">
        {() => <ProtectedRoute component={StudentProgress} allowedRoles={["student"]} />}
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
