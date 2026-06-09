import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
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

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherClassDetail from "./pages/teacher/TeacherClassDetail";
import TeacherReports from "./pages/teacher/TeacherReports";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import ExamInstructions from "./pages/student/ExamInstructions";
import ExamInterface from "./pages/student/ExamInterface";
import ExamComplete from "./pages/student/ExamComplete";

function ProtectedRoute({
  component: Component,
  allowedRoles,
}: {
  component: React.ComponentType;
  allowedRoles: string[];
}) {
  const { user, isLoading } = usePlatformAuth();
  const [, navigate] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-2 border-[oklch(0.42_0.14_240)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "teacher") navigate("/teacher");
    else navigate("/student");
    return null;
  }

  return <Component />;
}

function Router() {
  const { user, isLoading } = usePlatformAuth();
  const [, navigate] = useLocation();

  return (
    <Switch>
      {/* Public */}
      <Route path="/login" component={Login} />

      {/* Root redirect */}
      <Route path="/">
        {() => {
          if (isLoading) return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="animate-spin w-8 h-8 border-2 border-[oklch(0.42_0.14_240)] border-t-transparent rounded-full" />
            </div>
          );
          if (!user) return <Login />;
          if (user.role === "admin") { navigate("/admin"); return null; }
          if (user.role === "teacher") { navigate("/teacher"); return null; }
          navigate("/student");
          return null;
        }}
      </Route>

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
      <Route path="/student/exam/:examId/:classId">
        {() => <ProtectedRoute component={ExamInterface} allowedRoles={["student"]} />}
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
