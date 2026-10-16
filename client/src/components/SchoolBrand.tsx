import { PLATFORM_NAME, SCHOOL_CAMPUS, SCHOOL_NAME } from "@shared/brand";
import { cn } from "@/lib/utils";

/** The school shield on a white tile, for dark headers and small spaces. */
export function SchoolCrest({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const box = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-14 h-14" : "w-10 h-10";
  return (
    <div className={cn("rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden", box, className)}>
      <img src="/school-crest.png" alt={`${SCHOOL_NAME} crest`} className="w-full h-full object-contain" />
    </div>
  );
}

/** The full school logo (crest and name). Use it on white backgrounds. */
export function SchoolLogo({ className }: { className?: string }) {
  return <img src="/school-logo.png" alt={`${SCHOOL_NAME}, ${SCHOOL_CAMPUS}`} className={cn("h-auto object-contain", className)} />;
}

/** Crest plus school and platform name, for dark headers and the sidebar. */
export function SchoolLockup({ subtitle, className }: { subtitle?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 min-w-0", className)}>
      <SchoolCrest />
      <div className="min-w-0">
        <div className="font-brand text-white text-sm leading-tight tracking-wide uppercase truncate">{SCHOOL_NAME}</div>
        <div className="text-white/60 text-xs truncate">{subtitle ?? `${PLATFORM_NAME} · Grades 4 & 8`}</div>
      </div>
    </div>
  );
}

/** Thin navy / blue / red stripe that echoes the bands of the crest. */
export function BrandStripe({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-1 w-full", className)} aria-hidden="true">
      <span className="flex-[3] bg-brand-navy" />
      <span className="flex-1 bg-brand-blue" />
      <span className="flex-[2] bg-brand-red" />
    </div>
  );
}
