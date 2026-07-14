"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Heart, Handshake, ShieldCheck, Sprout, Users, FolderKanban, type LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/about/animated-counter";
import { AboutTeamSection } from "@/components/about/about-team-section";
import { AboutCommitmentsSection } from "@/components/about/about-commitments-section";
import {
  ABOUT_COLIBRI_FABLE,
  ABOUT_IMAGES,
  ABOUT_TEAM_INTRO,
  ABOUT_TEAM_MEMBERS,
  ABOUT_VALUES,
  type AboutCommitmentItem,
  type AboutTeamMember,
  type AboutValue,
  resolveAboutCommitmentItems,
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
    iconWrap: "bg-[#EF4444]/10",
    iconColor: "text-[#EF4444]",
    cardHover: "hover:bg-[#EF4444]/[0.08] hover:border-[#EF4444]/25",
  },
  {
    iconWrap: "bg-[#3B82F6]/10",
    iconColor: "text-[#3B82F6]",
    cardHover: "hover:bg-[#3B82F6]/[0.08] hover:border-[#3B82F6]/25",
  },
  {
    iconWrap: "bg-[#8B5CF6]/10",
    iconColor: "text-[#8B5CF6]",
    cardHover: "hover:bg-[#8B5CF6]/[0.08] hover:border-[#8B5CF6]/25",
  },
  {
    iconWrap: "bg-[#10B981]/10",
    iconColor: "text-[#10B981]",
    cardHover: "hover:bg-[#10B981]/[0.08] hover:border-[#10B981]/25",
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
  valuesTitle?: string;
  values?: AboutValue[];
  colibriTitle?: string;
  colibriText?: string;
  commitmentsTitle?: string;
  commitments?: AboutCommitmentItem[];
  ctaTitle?: string;
  ctaSubtitle?: string;
  families: string;
  volunteers: string;
  projects: string;
  partners: string;
  colibriImageUrl?: string;
  /** Ids ordonnés et visibles (layout CMS). Si absent : ordre par défaut. */
  sectionLayout?: { id: string; visible: boolean; order: number }[];
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
  mission: _mission,
  teamIntro: teamIntroProp,
  teamMembers,
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
  colibriImageUrl,
  sectionLayout,
}: AboutPageContentProps) {
  const impactRef = useRef<HTMLElement>(null);
  const impactInView = useInView(impactRef, { once: true, amount: 0.2 });

  const layoutMeta = (id: string) => {
    const item = sectionLayout?.find((row) => row.id === id);
    return {
      visible: item ? item.visible : true,
      order: item?.order ?? 0,
    };
  };
  const wrap = (id: string, node: ReactNode) => {
    const meta = layoutMeta(id);
    if (!meta.visible) return null;
    return (
      <div key={id} style={{ order: meta.order }}>
        {node}
      </div>
    );
  };

  const resolvedValuesTitle = valuesTitle?.trim() || "Ce qui nous guide chaque jour";
  const resolvedValues = values?.length ? values : [...ABOUT_VALUES];
  const resolvedColibriTitle = colibriTitle?.trim() || "Faire sa part, ensemble";
  const resolvedColibriText = colibriText?.trim() || ABOUT_COLIBRI_FABLE;
  const resolvedCommitmentsTitle =
    commitmentsTitle?.trim() || "Notre promesse envers vous";
  const resolvedCommitments = commitments?.length
    ? commitments
    : resolveAboutCommitmentItems();
  const resolvedCtaTitle = ctaTitle?.trim() || "Ensemble, faisons grandir l'espoir";
  const resolvedCtaSubtitle =
    ctaSubtitle?.trim() ||
    "Chaque geste compte. Rejoignez notre communauté de donateurs et de bénévoles pour porter l'espoir aux familles qui en ont le plus besoin.";
  const teamIntro = teamIntroProp?.trim() || ABOUT_TEAM_INTRO;
  const members = teamMembers?.length ? teamMembers : ABOUT_TEAM_MEMBERS;
  const colibriImage = colibriImageUrl || ABOUT_IMAGES.colibri;

  const impactStats = [
    { value: Number(families) || 0, label: "Familles accompagnées" },
    { value: Number(volunteers) || 0, label: "Bénévoles" },
    { value: Number(projects) || 0, label: "Actions solidaires" },
    { value: Number(partners) || 0, label: "Partenaires" },
  ];

  return (
    <div className="flex flex-col">
      {wrap(
        "valeurs",
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

          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
            {resolvedValues.map((value, index) => {
              const Icon = VALUE_ICONS[value.icon];
              const style = VALUE_STYLES[index] ?? VALUE_STYLES[0];

              return (
                <Reveal key={value.title} delay={index * 0.06}>
                  <article
                    className={cn(
                      "flex h-full gap-3 rounded-xl border border-[#E5E7EB]/90 bg-white px-3.5 py-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:gap-3.5 sm:px-4 sm:py-4",
                      "origin-center transition-all duration-300 ease-out",
                      "hover:z-10 hover:scale-[1.03] hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]",
                      style.cardHover
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9",
                        style.iconWrap
                      )}
                    >
                      <Icon
                        className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", style.iconColor)}
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-semibold leading-snug text-[#111827] sm:text-[16px]">
                        {value.title}
                      </h3>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
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
      )}

      {wrap(
        "impact",
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
      )}

      {wrap(
        "colibri",
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
      )}

      {wrap("equipe", <AboutTeamSection intro={teamIntro} members={members} />)}

      {wrap(
        "engagements",
        <AboutCommitmentsSection
          title={resolvedCommitmentsTitle}
          items={resolvedCommitments}
        />
      )}

      {wrap(
        "cta",
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
      )}
    </div>
  );
}
