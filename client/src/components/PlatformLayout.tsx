import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { BrandStripe, SchoolLockup } from "@/components/SchoolBrand";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  BarChart2,
  ChevronDown,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface PlatformLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function PlatformLayout({ children, title }: PlatformLayoutProps) {
  const { user, logout } = usePlatformAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNav: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Students", href: "/admin/students", icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Teachers", href: "/admin/teachers", icon: <Users className="w-4 h-4" /> },
    { label: "Classes", href: "/admin/classes", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Question Bank", href: "/admin/questions", icon: <ClipboardList className="w-4 h-4" /> },
    { label: "Exams", href: "/admin/exams", icon: <ClipboardList className="w-4 h-4" /> },
  ];

  const teacherNav: NavItem[] = [
    { label: "Dashboard", href: "/teacher", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "My Classes", href: "/teacher/classes", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Reports", href: "/teacher/reports", icon: <ClipboardList className="w-4 h-4" /> },
    { label: "Analytics", href: "/teacher/analytics", icon: <BarChart2 className="w-4 h-4" /> },
  ];

  const navItems = user?.role === "admin" ? adminNav : teacherNav;

  const isActive = (href: string) => {
    if (href === "/admin" || href === "/teacher") return location === href;
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300",
          "bg-brand-navy-deep",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <SchoolLockup subtitle="TIMSS Mock Assessment · Grades 4 & 8" className="pr-6" />
          <button
            className="absolute top-4 right-4 text-white/50 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-6 py-3 border-b border-white/10">
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
            user?.role === "admin" ? "bg-amber-500/20 text-amber-300" : "bg-blue-500/20 text-blue-300"
          )}>
            {user?.role}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive(item.href)
                  ? "bg-white/10 text-white shadow-[inset_3px_0_0_var(--brand-red)]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User profile */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{user?.name}</div>
              <div className="text-white/40 text-xs truncate">{user?.username}</div>
            </div>
            <button
              onClick={logout}
              className="text-white/40 hover:text-red-400 transition-colors p-1"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <BrandStripe />
          <div className="px-4 lg:px-8 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            {title && <h1 className="text-lg font-semibold text-brand-navy">{title}</h1>}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{user?.name}</span>
          </div>
          <img src="/school-logo.png" alt="American School of Creative Science" className="hidden md:block h-9 w-auto" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
