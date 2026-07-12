"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check, Heart, Handshake, ShieldCheck, Sprout, Users, FolderKanban, type LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/about/animated-counter";
import { AboutTeamSection } from "@/components/about/about-team-section";
import {
  ABOUT_COLIBRI_FABLE,
  ABOUT_COMMITMENTS,
  ABOUT_IMAGES,
  ABOUT_STORY_DEFAULT,
  ABOUT_STORY_QUOTE,
  ABOUT_TEAM_INTRO,
  ABOUT_TEAM_MEMBERS,
  ABOUT_VALUES,
  type AboutTeamMember,
  type AboutValue,
} from "@/lib/about-content";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const VALUE_ICONS: Record<AboutValue["icon"], LucideIcon> = {
  heart: Heart,
  handshake: Handshake,
  shield: ShieldCheck,
  sprout: Sprout,
};

const VALUE_STYLES = [
  {
    iconBg: "bg-[#EF4444]",
    iconColor: "text-white",
    accentBar: "from-[#EF4444] to-[#F43F5E]",
    panelBg: "from-[#EF4444]/[0.14] via-[#EF4444]/[0.05] to-transparent",
    glow: "bg-[#EF4444]/25",
    ring: "ring-[#EF4444]/20",
  },
  {
    iconBg: "bg-[#3B82F6]",
    iconColor: "text-white",
    accentBar: "from-[#3B82F6] to-[#6366F1]",
    panelBg: "from-[#3B82F6]/[0.16] via-[#3B82F6]/[0.06] to-transparent",
    glow: "bg-[#3B82F6]/30",
    ring: "ring-[#3B82F6]/20",
  },
  {
    iconBg: "bg-[#8B5CF6]",
    iconColor: "text-white",
    accentBar: "from-[#8B5CF6] to-[#A855F7]",
    panelBg: "from-[#8B5CF6]/[0.16] via-[#8B5CF6]/[0.06] to-transparent",
    glow: "bg-[#8B5CF6]/30",
    ring: "ring-[#8B5CF6]/20",
  },
  {
    iconBg: "bg-[#10B981]",
    iconColor: "text-white",
    accentBar: "from-[#10B981] to-[#34D399]",
    panelBg: "from-[#10B981]/[0.16] via-[#10B981]/[0.06] to-transparent",
    glow: "bg-[#10B981]/30",
    ring: "ring-[#10B981]/20",
  },
] as const;

const IMPACT_STAT_STYLES = [
  {
    icon: Users,
    ring: "from-[#3CCB8A] via-[#42D7C8] to-[#3CCB8A]",
    glow: "bg-[#3CCB8A]/30",
    iconColor: "text-[#0d8f5f]",
    numberGradient: "from-[#3CCB8A] to-[#42D7C8]",
  },
  {
    icon: Heart,
    ring: "from-[#42D7C8] via-[#4A8BFF] to-[#42D7C8]",
    glow: "bg-[#42D7C8]/30",
    iconColor: "text-[#2B7DE9]",
    numberGradient: "from-[#42D7C8] to-[#4A8BFF]",
  },
  {
    icon: FolderKanban,
    ring: "from-[#4A8BFF] via-[#6B4EFF] to-[#4A8BFF]",
    glow: "bg-[#4A8BFF]/30",
    iconColor: "text-[#4A8BFF]",
    numberGradient: "from-[#4A8BFF] to-[#6B4EFF]",
  },
  {
    icon: Handshake,
    ring: "from-[#6B4EFF] via-[#9B5DE5] to-[#6B4EFF]",
    glow: "bg-[#6B4EFF]/30",
    iconColor: "text-[#6B4EFF]",
    numberGradient: "from-[#6B4EFF] to-[#9B5DE5]",
  },
] as const;

interface AboutPageContentProps {
  mission?: string;
  teamIntro?: string;
  teamMembers?: AboutTeamMember[];
  storyTitle?: string;
  storyQuote?: string;
  valuesTitle?: string;
  values?: AboutValue[];
  colibriTitle?: string;
  colibriText?: string;
  commitmentsTitle?: string;
  commitments?: string[];
  ctaTitle?: string;
  ctaSubtitle?: string;
  families: string;
  volunteers: string;
  projects: string;
  partners: string;
  storyImageUrl?: string;
  colibriImageUrl?: string;
}

function ColibriWatermark({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none text-[#4FD1A5]/[0.08]", className)}
      viewBox="0 0 320 240"
      fill="none"
      aria-hidden
    >
      <path
        d="M36 148 C 78 92, 132 68, 188 84 C 168 52, 142 28, 108 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M188 84 C 214 72, 248 58, 286 44"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <ellipse
        cx="248"
        cy="92"
        rx="22"
        ry="10"
        stroke="currentColor"
        strokeWidth="1"
        transform="rotate(-18 248 92)"
      />
      <path
        d="M92 168 L 108 132 L 124 168 Z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "up";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });

  const offset =
    direction === "left"
      ? { x: -48, y: 0 }
      : direction === "right"
        ? { x: 48, y: 0 }
        : { x: 0, y: 32 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function AboutPageContent({
  mission,
  teamIntro: teamIntroProp,
  teamMembers,
  storyTitle,
  storyQuote,
  valuesTitle,
  values,
  colibriTitle,
  colibriText,
  commitmentsTitle,
  commitments,
  ctaTitle,
  ctaSubtitle,
  families,
  volunteers,
  projects,
  partners,
  storyImageUrl,
  colibriImageUrl,
}: AboutPageContentProps) {
  const impactRef = useRef<HTMLElement>(null);
  const impactInView = useInView(impactRef, { once: true, amount: 0.2 });

  const storyText = mission?.trim() || ABOUT_STORY_DEFAULT;
  const resolvedStoryTitle = storyTitle?.trim() || "Des Colibris porteurs d'espoir";
  const resolvedStoryQuote = storyQuote?.trim() || ABOUT_STORY_QUOTE;
  const resolvedValuesTitle = valuesTitle?.trim() || "Ce qui nous guide chaque jour";
  const resolvedValues = values?.length ? values : [...ABOUT_VALUES];
  const resolvedColibriTitle = colibriTitle?.trim() || "Faire sa part, ensemble";
  const resolvedColibriText = colibriText?.trim() || ABOUT_COLIBRI_FABLE;
  const resolvedCommitmentsTitle =
    commitmentsTitle?.trim() || "Notre promesse envers vous";
  const resolvedCommitments = commitments?.length ? commitments : [...ABOUT_COMMITMENTS];
  const resolvedCtaTitle = ctaTitle?.trim() || "Ensemble, faisons grandir l'espoir";
  const resolvedCtaSubtitle =
    ctaSubtitle?.trim() ||
    "Chaque geste compte. Rejoignez notre communauté de donateurs et de bénévoles pour porter l'espoir aux familles qui en ont le plus besoin.";
  const teamIntro = teamIntroProp?.trim() || ABOUT_TEAM_INTRO;
  const members = teamMembers?.length ? teamMembers : ABOUT_TEAM_MEMBERS;
  const storyImage = storyImageUrl || ABOUT_IMAGES.story;
  const colibriImage = colibriImageUrl || ABOUT_IMAGES.colibri;

  const impactStats = [
    { value: Number(families) || 0, label: "Familles accompagnées" },
    { value: Number(volunteers) || 0, label: "Bénévoles" },
    { value: Number(projects) || 0, label: "Actions solidaires" },
    { value: Number(partners) || 0, label: "Partenaires" },
  ];

  return (
    <>
      {/* Notre histoire */}
      <section className="bg-white site-section">
        <div className="site-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="left">
            <div className="group relative min-h-[320px] overflow-hidden rounded-[32px] shadow-[0_16px_48px_rgba(15,23,42,0.1)] sm:min-h-[420px]">
              <Image
                src={storyImage}
                alt="Bénévoles en action solidaire"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                priority
              />
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.08}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d8f5f]">
              Notre histoire
            </p>
            <h2 className="mt-3 font-heading text-[2rem] font-bold leading-tight text-[#111827] sm:text-[2.5rem]">
              {resolvedStoryTitle}
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#6B7280]">
              {storyText.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <blockquote className="mt-8 border-l-4 border-[#4FD1A5] pl-5">
              <p className="font-heading text-lg italic leading-relaxed text-[#111827] sm:text-xl">
                « {resolvedStoryQuote} »
              </p>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="bg-[#F8FAFC] site-section">
        <div className="site-container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#42D7C8]">
              Nos valeurs
            </p>
            <h2 className="mt-3 font-heading text-[2rem] font-bold text-[#111827] sm:text-[2.25rem]">
              {resolvedValuesTitle}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-3.5 sm:grid-cols-2 sm:gap-4">
            {resolvedValues.map((value, index) => {
              const Icon = VALUE_ICONS[value.icon];
              const style = VALUE_STYLES[index] ?? VALUE_STYLES[0];

              return (
                <Reveal key={value.title} delay={index * 0.08}>
                  <article
                    className={cn(
                      "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5E7EB]/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
                      "transition-all duration-300 ease-out",
                      "hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
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
                        {value.title}
                      </h3>
                      <p className="mt-1.5 text-[12px] leading-[1.5] text-[#6B7280] sm:text-[13px]">
                        {value.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notre impact */}
      <section ref={impactRef} className="relative overflow-hidden bg-white site-section">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4FD1A5]/[0.04] via-transparent to-[#8B5CF6]/[0.05]"
          aria-hidden
        />
        <div className="relative site-container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d8f5f]">
              Notre impact
            </p>
            <h2 className="mt-3 font-heading text-[2rem] font-bold text-[#111827] sm:text-[2.25rem]">
              Des résultats concrets sur le terrain
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {impactStats.map((stat, index) => {
              const style = IMPACT_STAT_STYLES[index] ?? IMPACT_STAT_STYLES[0];
              const Icon = style.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 28 }}
                  animate={impactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                  transition={{ duration: 0.8, ease: EASE, delay: index * 0.1 }}
                  className={cn(
                    "group rounded-2xl border border-[#E5E7EB]/80 bg-white p-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] sm:p-5",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
                  )}
                >
                  <div className="relative mx-auto mb-2 flex h-[72px] w-[72px] items-center justify-center sm:h-[80px] sm:w-[80px]">
                    <div
                      className={cn(
                        "stat-icon-glow pointer-events-none absolute inset-2 rounded-full blur-lg transition-opacity duration-500",
                        "opacity-70 group-hover:opacity-100",
                        style.glow
                      )}
                      aria-hidden
                    />
                    <div
                      className={cn(
                        "stat-icon-ring absolute inset-0 rounded-full bg-gradient-to-r p-[2px]",
                        style.ring
                      )}
                      aria-hidden
                    >
                      <div className="h-full w-full rounded-full bg-[rgba(248,250,255,0.9)]" />
                    </div>
                    <div className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full border border-white/90 bg-white/80 shadow-[0_10px_28px_rgba(0,0,0,0.07)] backdrop-blur-sm sm:h-[66px] sm:w-[66px]">
                      <Icon
                        className={cn(
                          "stat-icon-float h-7 w-7 sm:h-8 sm:w-8",
                          style.iconColor,
                          "fill-current/15"
                        )}
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </div>
                  </div>

                  <p
                    className={cn(
                      "bg-gradient-to-r bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl",
                      style.numberGradient
                    )}
                  >
                    <AnimatedCounter value={stat.value} active={impactInView} delay={index * 120} />
                    <span>+</span>
                  </p>
                  <p className="mt-1.5 text-[13px] font-medium leading-snug text-[#6B7280] sm:text-sm">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pourquoi le Colibri */}
      <section className="relative overflow-hidden bg-[#F8FAFC] site-section">
        <ColibriWatermark className="absolute -right-8 top-1/2 h-72 w-72 -translate-y-1/2 sm:h-96 sm:w-96" />
        <div className="site-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d8f5f]">
              Pourquoi le Colibri ?
            </p>
            <h2 className="mt-3 font-heading text-[2rem] font-bold leading-tight text-[#111827] sm:text-[2.25rem]">
              {resolvedColibriTitle}
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#6B7280]">
              {resolvedColibriText.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <div className="group relative min-h-[320px] overflow-hidden rounded-[32px] shadow-[0_16px_48px_rgba(15,23,42,0.1)] sm:min-h-[400px]">
              <Image
                src={colibriImage}
                alt="Enfants souriants, symbole d'espoir"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/35 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      <AboutTeamSection intro={teamIntro} members={members} />

      {/* Nos engagements */}
      <section className="bg-[#F8FAFC] site-section">
        <div className="site-container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d8f5f]">
              Nos engagements
            </p>
            <h2 className="mt-3 font-heading text-[2rem] font-bold text-[#111827] sm:text-[2.25rem]">
              {resolvedCommitmentsTitle}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resolvedCommitments.map((commitment, index) => (
              <Reveal key={`${commitment}-${index}`} delay={index * 0.06}>
                <div className="flex items-center gap-3 rounded-[20px] border border-[#E5E7EB]/80 bg-white px-5 py-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4FD1A5]/12">
                    <Check className="h-4 w-4 text-[#0d8f5f]" strokeWidth={2.5} />
                  </span>
                  <p className="text-sm font-semibold text-[#111827]">{commitment}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden site-section">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#4FD1A5]/10 via-[#5BB8F0]/8 to-[#8B5CF6]/12"
          aria-hidden
        />
        <ColibriWatermark className="absolute bottom-0 right-[5%] h-56 w-56 opacity-60 sm:h-72 sm:w-72" />

        <div className="relative mx-auto max-w-[800px] px-5 text-center sm:px-8">
          <Reveal>
            <h2 className="font-heading text-[2rem] font-bold leading-tight text-[#111827] sm:text-[2.5rem]">
              {resolvedCtaTitle}
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#6B7280]">
              {resolvedCtaSubtitle}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/faire-un-don"
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4FD1A5] via-[#5BB8F0] to-[#8B5CF6] px-8 text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(79,209,165,0.32)] transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg sm:w-auto"
              >
                <Heart className="h-4 w-4 fill-white text-white" strokeWidth={0} />
                Faire un don
              </Link>
              <Link
                href="/benevole"
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-8 text-[15px] font-semibold text-[#111827] shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-all duration-300 hover:scale-[1.02] hover:border-[#4FD1A5]/40 hover:shadow-lg sm:w-auto"
              >
                <Handshake className="h-4 w-4 text-[#0d8f5f]" />
                Devenir bénévole
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
