"use client";

import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemedPersonIconProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

export function ThemedPersonIcon({ icon: Icon, label, className }: ThemedPersonIconProps) {
  const rawId = useId();
  const gradientId = `person-grad-${rawId.replace(/:/g, "")}`;

  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)}>
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4FD1A5" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <Icon
        className="h-full w-full"
        stroke={`url(#${gradientId})`}
        strokeWidth={1.75}
        aria-label={label}
      />
    </span>
  );
}
