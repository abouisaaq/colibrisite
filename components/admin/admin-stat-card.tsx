import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  glow?: string;
}

export function AdminStatCard({
  title,
  value,
  icon: Icon,
  iconBg = "bg-[#14B8A6]",
  iconColor = "text-white",
  glow = "bg-[#14B8A6]/20",
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[1.35rem] border border-[#E8EDF3] bg-white p-5",
        "shadow-[0_8px_28px_rgba(15,23,42,0.04)]",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-50 transition-opacity group-hover:opacity-80",
          glow
        )}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-[1.75rem]">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-[0_8px_20px_rgba(15,23,42,0.12)]",
            "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6",
            iconBg,
            iconColor
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
