"use client";

import { useEffect, useState } from "react";
import {
  Utensils,
  GraduationCap,
  HeartPulse,
  Home,
  Palette,
  Droplets,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/home/section-header";
import { ScrollReveal, StaggerReveal, useSectionInView } from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

function useActionsGridColumns() {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    function update() {
      if (window.matchMedia("(min-width: 1024px)").matches) setColumns(3);
      else if (window.matchMedia("(min-width: 640px)").matches) setColumns(2);
      else setColumns(1);
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return columns;
}

/** Entrée selon la position dans la grille : gauche ←, droite →, milieu haut ↓, milieu bas ↑ */
function getActionCardEntryOffset(index: number, columns: number): { x: number; y: number } {
  const col = index % columns;
  const row = Math.floor(index / columns);

  if (columns === 1) {
    return { x: 0, y: 56 };
  }

  if (columns === 2) {
    return col === 0 ? { x: -72, y: 0 } : { x: 72, y: 0 };
  }

  if (col === 0) return { x: -72, y: 0 };
  if (col === 2) return { x: 72, y: 0 };
  return row % 2 === 0 ? { x: 0, y: -56 } : { x: 0, y: 56 };
}

const iconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  "graduation-cap": GraduationCap,
  "heart-pulse": HeartPulse,
  home: Home,
  palette: Palette,
  droplets: Droplets,
  heart: HeartPulse,
};

const ACTION_STYLES: Record<
  string,
  {
    iconBg: string;
    iconColor: string;
    accentBar: string;
    panelBg: string;
    glow: string;
    ring: string;
  }
> = {
  "aide-alimentaire": {
    iconBg: "bg-[#F59E0B]",
    iconColor: "text-white",
    accentBar: "from-[#F59E0B] to-[#F97316]",
    panelBg: "from-[#F59E0B]/[0.16] via-[#F59E0B]/[0.06] to-transparent",
    glow: "bg-[#F59E0B]/30",
    ring: "ring-[#F59E0B]/20",
  },
  education: {
    iconBg: "bg-[#3B82F6]",
    iconColor: "text-white",
    accentBar: "from-[#3B82F6] to-[#6366F1]",
    panelBg: "from-[#3B82F6]/[0.16] via-[#3B82F6]/[0.06] to-transparent",
    glow: "bg-[#3B82F6]/30",
    ring: "ring-[#3B82F6]/20",
  },
  sante: {
    iconBg: "bg-[#EF4444]",
    iconColor: "text-white",
    accentBar: "from-[#EF4444] to-[#F43F5E]",
    panelBg: "from-[#EF4444]/[0.14] via-[#EF4444]/[0.05] to-transparent",
    glow: "bg-[#EF4444]/25",
    ring: "ring-[#EF4444]/20",
  },
  logement: {
    iconBg: "bg-[#8B5CF6]",
    iconColor: "text-white",
    accentBar: "from-[#8B5CF6] to-[#A855F7]",
    panelBg: "from-[#8B5CF6]/[0.16] via-[#8B5CF6]/[0.06] to-transparent",
    glow: "bg-[#8B5CF6]/30",
    ring: "ring-[#8B5CF6]/20",
  },
  "culture-loisirs": {
    iconBg: "bg-[#EC4899]",
    iconColor: "text-white",
    accentBar: "from-[#EC4899] to-[#F472B6]",
    panelBg: "from-[#EC4899]/[0.16] via-[#EC4899]/[0.06] to-transparent",
    glow: "bg-[#EC4899]/30",
    ring: "ring-[#EC4899]/20",
  },
  "acces-eau": {
    iconBg: "bg-[#06B6D4]",
    iconColor: "text-white",
    accentBar: "from-[#06B6D4] to-[#22D3EE]",
    panelBg: "from-[#06B6D4]/[0.16] via-[#06B6D4]/[0.06] to-transparent",
    glow: "bg-[#06B6D4]/30",
    ring: "ring-[#06B6D4]/20",
  },
};

interface Action {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl: string | null;
  order: number;
}

interface ActionsGridProps {
  actions: Action[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function ActionsGrid({
  actions,
  eyebrow = "Nos engagements",
  title = "Nos Actions",
  subtitle = "Des initiatives concrètes pour répondre aux besoins essentiels des familles que nous accompagnons.",
}: ActionsGridProps) {
  const sorted = [...actions].sort((a, b) => a.order - b.order);
  const { ref: sectionRef, inView } = useSectionInView(0.12);
  const columns = useActionsGridColumns();

  return (
    <section id="nos-actions" ref={sectionRef} className="site-section bg-white">
      <div className="site-container">
        <ScrollReveal inView={inView} direction="up">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={subtitle}
          />
        </ScrollReveal>

        <div className="actions-row-grid mt-10">
          {sorted.map((action, index) => {
            const Icon = iconMap[action.icon] ?? HeartPulse;
            const style = ACTION_STYLES[action.slug] ?? {
              iconBg: "bg-[#14B8A6]",
              iconColor: "text-white",
              accentBar: "from-[#14B8A6] to-[#2DD4BF]",
              panelBg: "from-[#14B8A6]/[0.16] via-[#14B8A6]/[0.06] to-transparent",
              glow: "bg-[#14B8A6]/30",
              ring: "ring-[#14B8A6]/20",
            };

            return (
              <StaggerReveal
                key={action.id}
                index={index}
                inView={inView}
                customOffset={getActionCardEntryOffset(index, columns)}
                delayStep={0.16}
                baseDelay={0.12}
                duration={1.05}
              >
                <article
                  className={cn(
                    "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5E7EB]/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-1.5 hover:border-[#E5E7EB] hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0 left-0 z-20 h-0.5 w-full origin-left scale-x-0 rounded-t-2xl bg-gradient-to-r transition-transform duration-300 group-hover:scale-x-100",
                      style.accentBar
                    )}
                    aria-hidden
                  />

                  <div
                    className={cn(
                      "relative flex h-24 w-full shrink-0 items-center justify-center overflow-hidden sm:h-28",
                      "bg-gradient-to-b",
                      style.panelBg
                    )}
                  >
                    <div
                      className={cn(
                        "pointer-events-none absolute h-20 w-20 rounded-full blur-2xl transition-all duration-500",
                        "opacity-50 scale-90 group-hover:scale-125 group-hover:opacity-80",
                        style.glow
                      )}
                      aria-hidden
                    />

                    <div
                      className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-xl sm:h-[3.25rem] sm:w-[3.25rem]",
                        "shadow-[0_8px_24px_rgba(15,23,42,0.1)] ring-4",
                        "animate-float-gentle transition-all duration-500 ease-out",
                        "group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:rotate-6",
                        style.iconBg,
                        style.ring
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-transform duration-500 ease-out sm:h-6 sm:w-6",
                          "group-hover:scale-110",
                          style.iconColor
                        )}
                        strokeWidth={1.6}
                        aria-hidden
                      />
                    </div>
                  </div>

                  <div className="px-3.5 py-3.5 text-center sm:px-4 sm:py-4">
                    <h3 className="text-[14px] font-bold leading-snug text-[#111827] sm:text-[15px]">
                      {action.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-3 text-[12px] leading-[1.5] text-[#6B7280] sm:text-[13px]">
                      {action.description}
                    </p>
                  </div>
                </article>
              </StaggerReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
