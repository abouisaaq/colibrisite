"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export type PageHeroBreadcrumb = {
  label: string;
  href?: string;
};

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs?: PageHeroBreadcrumb[];
  className?: string;
}

function ColibriSignature() {
  return (
    <svg
      className="pointer-events-none absolute right-[6%] top-1/2 h-[min(420px,70%)] w-[min(420px,55%)] -translate-y-1/2 text-white/[0.05] lg:right-[10%]"
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
      <path
        d="M118 126 C 152 108, 198 98, 248 92"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <ellipse
        cx="248"
        cy="92"
        rx="22"
        ry="10"
        stroke="currentColor"
        strokeWidth="1"
        transform="rotate(-18 248 92)"
        opacity="0.6"
      />
      <path
        d="M92 168 L 108 132 L 124 168 Z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

function PageHeroBackground() {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ scale: 1.02 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#1A2544]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E2F57] via-[#1B2848] to-[#16233F]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(53,211,153,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(96,165,250,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(139,92,246,0.06),transparent_45%)]" />

      <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-[#35D399]/[0.07] blur-[100px]" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#60A5FA]/[0.06] blur-[110px]" />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.02]"
        aria-hidden
      >
        <defs>
          <pattern id="page-hero-noise" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#page-hero-noise)" />
      </svg>

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04]"
        viewBox="0 0 1200 380"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 280 C 200 220, 400 320, 600 260 C 800 200, 1000 300, 1200 240"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M0 120 C 180 80, 360 160, 540 100 C 720 40, 900 120, 1200 80"
          stroke="white"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>

      <ColibriSignature />
    </motion.div>
  );
}

function PageHeroBreadcrumbs({ items }: { items: PageHeroBreadcrumb[] }) {
  if (items.length === 0) return null;

  return (
    <motion.nav
      aria-label="Fil d'Ariane"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="mb-3"
    >
      <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-white/70">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span className="text-white/40">/</span>}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-white/90">
                {item.label}
              </Link>
            ) : (
              <span className="text-white/80">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </motion.nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  className,
}: PageHeroProps) {
  const crumbs = breadcrumbs ?? [{ label: "Accueil", href: "/" }];

  return (
    <div className="site-frame">
    <section
      className={cn(
        "relative flex min-h-0 items-center overflow-hidden rounded-[1.25rem] text-white shadow-[0_8px_32px_rgba(15,23,42,0.08)] sm:min-h-[220px] lg:min-h-[240px]",
        className
      )}
    >
      <PageHeroBackground />

      <div className="relative z-10 w-full px-4 py-8 text-center sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <PageHeroBreadcrumbs items={crumbs} />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#35D399]"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
          className="font-heading mt-3 break-words text-[1.75rem] font-bold leading-[1.12] tracking-tight sm:text-[2rem] md:text-4xl lg:text-[3rem] xl:text-[3.5rem]"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="mx-auto mt-3 max-w-[650px] text-[14px] leading-relaxed text-white/80 sm:text-[15px] md:line-clamp-2 md:text-base"
        >
          {description}
        </motion.p>
      </div>
    </section>
    </div>
  );
}
