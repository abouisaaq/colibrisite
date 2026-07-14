"use client";

import { useCallback, useState } from "react";
import { Users, Heart, FolderKanban, Handshake } from "lucide-react";
import { AnimatedCounter } from "@/components/about/animated-counter";
import {
  CARD_ENTRY_OFFSETS,
  ScrollReveal,
  StaggerReveal,
  useSectionInView,
} from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

interface StatBannerProps {
  families: string;
  volunteers: string;
  projects: string;
  partners: string;
}

const stats = [
  {
    key: "families",
    icon: Users,
    label: "Familles aidées",
    gradient: "from-[#3CCB8A] to-[#42D7C8]",
    ring: "from-[#3CCB8A] via-[#42D7C8] to-[#3CCB8A]",
    glow: "bg-[#3CCB8A]/30",
    hoverHalo: "bg-[#3CCB8A]/25",
    iconColor: "text-[#0d8f5f]",
  },
  {
    key: "volunteers",
    icon: Heart,
    label: "Bénévoles actifs",
    gradient: "from-[#42D7C8] to-[#4A8BFF]",
    ring: "from-[#42D7C8] via-[#4A8BFF] to-[#42D7C8]",
    glow: "bg-[#42D7C8]/30",
    hoverHalo: "bg-[#42D7C8]/25",
    iconColor: "text-[#2B7DE9]",
  },
  {
    key: "projects",
    icon: FolderKanban,
    label: "Projets réalisés",
    gradient: "from-[#4A8BFF] to-[#6B4EFF]",
    ring: "from-[#4A8BFF] via-[#6B4EFF] to-[#4A8BFF]",
    glow: "bg-[#4A8BFF]/30",
    hoverHalo: "bg-[#4A8BFF]/25",
    iconColor: "text-[#4A8BFF]",
  },
  {
    key: "partners",
    icon: Handshake,
    label: "Partenaires",
    gradient: "from-[#6B4EFF] to-[#9B5DE5]",
    ring: "from-[#6B4EFF] via-[#9B5DE5] to-[#6B4EFF]",
    glow: "bg-[#6B4EFF]/30",
    hoverHalo: "bg-[#6B4EFF]/25",
    iconColor: "text-[#6B4EFF]",
  },
] as const;

function PremiumStatIcon({
  icon: Icon,
  ring,
  glow,
  iconColor,
  visible,
}: {
  icon: (typeof stats)[number]["icon"];
  ring: string;
  glow: string;
  iconColor: string;
  visible: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto mb-2 flex h-[68px] w-[68px] items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[74px] sm:w-[74px]",
        visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-90 opacity-0"
      )}
    >
      <div
        className={cn(
          "stat-icon-glow pointer-events-none absolute inset-2 rounded-full blur-lg",
          glow
        )}
        aria-hidden
      />
      <div
        className={cn(
          "stat-icon-ring absolute inset-0 rounded-full bg-gradient-to-r p-[2px]",
          ring
        )}
        aria-hidden
      >
        <div className="h-full w-full rounded-full bg-[rgba(248,250,255,0.9)]" />
      </div>
      <div className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full border border-white/90 bg-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:h-[62px] sm:w-[62px]">
        <Icon
          className={cn("stat-icon-float h-7 w-7", iconColor, visible && "fill-current/15")}
          strokeWidth={1.75}
        />
      </div>
    </div>
  );
}

export function StatBanner({ families, volunteers, projects, partners }: StatBannerProps) {
  const { ref: sectionRef, inView } = useSectionInView(0.32);
  const [countingReady, setCountingReady] = useState<boolean[]>(() =>
    Array.from({ length: stats.length }, () => false)
  );

  const values: Record<string, number> = {
    families: Number(families) || 0,
    volunteers: Number(volunteers) || 0,
    projects: Number(projects) || 0,
    partners: Number(partners) || 0,
  };

  const markCardSettled = useCallback((index: number) => {
    setCountingReady((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  return (
    <section ref={sectionRef} className="site-section relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute -left-20 top-1/2 h-[22rem] w-[22rem] -translate-y-1/2 rounded-full bg-[#3CCB8A] opacity-[0.05] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4A8BFF] opacity-[0.05] blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/2 h-[22rem] w-[22rem] -translate-y-1/2 rounded-full bg-[#6B4EFF] opacity-[0.05] blur-[100px]"
        aria-hidden
      />

      <div className="site-container relative">
        <ScrollReveal inView={inView} direction="up" className="mb-6 text-center lg:mb-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#3CCB8A]">
            Notre impact
          </p>
          <h2 className="mt-3 font-heading text-[1.75rem] font-bold tracking-tight text-[#111827] sm:text-[2rem]">
            Des chiffres qui parlent
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-4">
          {stats.map((stat, index) => (
            <StaggerReveal
              key={stat.key}
              index={index}
              inView={inView}
              customOffset={CARD_ENTRY_OFFSETS[index % CARD_ENTRY_OFFSETS.length]}
              delayStep={0.22}
              duration={1.15}
              onSettled={() => markCardSettled(index)}
            >
              <article
                className={cn(
                  "group relative flex flex-col items-center overflow-hidden rounded-2xl px-3 py-3 text-center sm:px-4 sm:py-3.5",
                  "stat-card-glass transition-shadow duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgba(15,23,42,0.12)]"
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -inset-3 rounded-[1.4rem] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                    stat.hoverHalo
                  )}
                  aria-hidden
                />

                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r opacity-90",
                    stat.gradient
                  )}
                  aria-hidden
                />

                <PremiumStatIcon
                  icon={stat.icon}
                  ring={stat.ring}
                  glow={stat.glow}
                  iconColor={stat.iconColor}
                  visible={countingReady[index]}
                />

                <p
                  className={cn(
                    "flex items-baseline justify-center gap-0.5 bg-gradient-to-r bg-clip-text text-[1.75rem] font-extrabold leading-none text-transparent sm:text-[2.25rem] lg:text-[2.5rem]",
                    stat.gradient
                  )}
                >
                  <span className="text-[1.125rem] font-extrabold sm:text-[1.375rem] lg:text-[1.5rem]">
                    +
                  </span>
                  <span className="tabular-nums tracking-tight">
                    <AnimatedCounter
                      value={values[stat.key]}
                      active={countingReady[index]}
                      delay={220}
                    />
                  </span>
                </p>

                <p className="mt-1.5 max-w-[8.5rem] text-center text-[12px] font-medium leading-snug text-[#6B7280] sm:text-[13px]">
                  {stat.label}
                </p>
              </article>
            </StaggerReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
