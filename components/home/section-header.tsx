import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  light = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <span
        className={cn(
          "inline-block text-[11px] font-semibold uppercase tracking-[0.18em]",
          light ? "text-white/80" : "text-[#42D7C8]"
        )}
      >
        {eyebrow}
      </span>
      <h2
        className={cn(
          "font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]",
          light ? "text-white" : "text-[#111827]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            light ? "text-white/85" : "text-[#6B7280]"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
