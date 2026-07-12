import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminPanelProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  padded?: boolean;
  title?: string;
  description?: string;
  headerAction?: ReactNode;
}

export function AdminPanel({
  children,
  className,
  contentClassName,
  padded = false,
  title,
  description,
  headerAction,
}: AdminPanelProps) {
  return (
    <div className={cn("admin-panel", className)}>
      {(title || headerAction) && (
        <div className="flex items-start justify-between gap-4 border-b border-[#E8EDF3] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-[15px] font-semibold text-[#0F172A]">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-[13px] text-[#64748B]">{description}</p>
            ) : null}
          </div>
          {headerAction}
        </div>
      )}
      <div
        className={cn(
          "admin-table-wrap",
          padded && "p-5 sm:p-6",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
