"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Heart,
  ArrowRight,
  Shield,
  Lock,
  Leaf,
} from "lucide-react";
import { HeroWave } from "@/components/home/hero-wave";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  logoUrl?: string;
  logoHeight?: number;
}

function HeroTitle({ title }: { title: string }) {
  const parts = title.split(/(l'espoir)/i);

  return (
    <h1 className="font-heading text-[clamp(1.85rem,7vw,2.25rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#111827] sm:text-[2.75rem] lg:text-[4.25rem] xl:text-[4.5rem]">
      {parts.map((part, i) =>
        /^l'espoir$/i.test(part) ? (
          <span key={i} className="text-[#26a69a]">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </h1>
  );
}

export function HeroSection({
  title,
  subtitle,
  imageUrl,
  logoUrl,
  logoHeight,
}: HeroSectionProps) {
  const [ready, setReady] = useState(false);
  const heroSrc = imageUrl || "/hero/hero-main.jpg";

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <section className="relative isolate min-h-[min(100svh,640px)] w-full overflow-hidden bg-white sm:min-h-[min(100svh,720px)] lg:min-h-[820px]">
      <SiteHeader
        logoUrl={logoUrl}
        logoHeight={logoHeight}
        variant="hero"
      />

      {/* Photo plein écran — composition type maquette (texte à gauche, photo vive à droite) */}
      <div className="absolute inset-0">
        <Image
          src={heroSrc}
          alt="Bénévoles accompagnant des familles"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] sm:object-[68%_center] lg:object-[62%_center]"
        />
        <div className="hero-white-veil absolute inset-0" aria-hidden />
        <div
          className="hero-junction-glow pointer-events-none absolute inset-0"
          aria-hidden
        />
      </div>

      <div className="relative z-10 site-container">
        <div className="flex min-h-[min(100svh,640px)] flex-col justify-center pb-24 pt-[84px] sm:min-h-[min(100svh,720px)] sm:pb-32 sm:pt-[96px] lg:min-h-[820px] lg:pb-36 lg:pt-[108px]">
          <div
            className={cn(
              "w-full transition-all duration-700 ease-out",
              ready ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            )}
          >
            <div className="max-w-[560px] lg:max-w-[520px] xl:max-w-[580px]">
              <HeroTitle title={title} />

              <p className="mt-5 max-w-[540px] text-[15px] leading-[1.7] text-[#4B5563] sm:mt-6 sm:text-[16px] lg:mt-7 lg:text-[17px] lg:leading-[1.75]">
                {subtitle}
              </p>
            </div>

            <div className="relative mt-8 w-full sm:mt-9 lg:mt-10">
              <div className="flex max-w-[560px] flex-col gap-3 md:flex-row md:gap-4 lg:max-w-[520px] xl:max-w-[580px]">
                <Link
                  href="/faire-un-don"
                  className="group inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4FD1A5] via-[#5BB8F0] to-[#8B5CF6] px-8 text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(79,209,165,0.32)] transition-transform duration-300 hover:scale-[1.02] md:w-auto"
                >
                  <Heart className="h-4 w-4 fill-white" strokeWidth={0} />
                  Faire un don
                </Link>
                <Link
                  href="/notre-histoire"
                  className="group inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full border border-[#E5E7EB] bg-white/90 px-6 text-[15px] font-semibold text-[#111827] shadow-[0_2px_16px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D1D5DB] hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)] sm:px-8 md:w-auto"
                >
                  <span className="sm:hidden">Notre histoire</span>
                  <span className="hidden sm:inline">Découvrir notre histoire</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <Link
                href="/faire-un-don"
                className={cn(
                  "glass-card group absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-4 rounded-[1.35rem] px-5 py-4 md:flex",
                  "w-[240px] animate-float-gentle sm:w-[260px] sm:px-6 sm:py-5",
                  "transition-all duration-300 hover:-translate-y-[calc(50%+2px)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                )}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFE8F0] transition-transform duration-300 group-hover:scale-105">
                  <Heart
                    className="h-5 w-5 fill-[#E8707A]/35 text-[#E8707A]"
                    strokeWidth={1.75}
                  />
                </div>
                <p className="text-[17px] font-semibold leading-snug tracking-tight text-[#111827] sm:text-[18px]">
                  Je fais ma part
                </p>
              </Link>
            </div>

            <div className="mt-10 flex max-w-[560px] flex-col gap-4 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3 lg:max-w-[520px] xl:max-w-[580px]">
              {[
                { icon: Shield, label: "Association reconnue" },
                { icon: Lock, label: "100% Transparence" },
                { icon: Leaf, label: "Impact local" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon
                    className="h-4 w-4 shrink-0 text-[#26a69a]"
                    strokeWidth={1.75}
                  />
                  <span className="text-[13px] font-medium text-[#6B7280]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <HeroWave />
    </section>
  );
}
