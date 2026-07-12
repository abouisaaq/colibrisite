"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionHeader } from "@/components/home/section-header";
import { ThemedPersonIcon } from "@/components/icons/themed-person-icon";
import { getTestimonialVisual } from "@/lib/testimonial-types";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;
const EASE = [0.22, 1, 0.36, 1] as const;

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  type?: string | null;
  iconKey?: string | null;
  usePhoto?: boolean;
  imageUrl?: string | null;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

function useVisibleCount() {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    function update() {
      if (window.matchMedia("(min-width: 1024px)").matches) setVisible(3);
      else if (window.matchMedia("(min-width: 640px)").matches) setVisible(2);
      else setVisible(1);
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return visible;
}

function ColibriOrnaments({ compact }: { compact?: boolean }) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute",
        compact ? "-inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)]" : "-inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)]"
      )}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="colibri-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4FD1A5" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path
        d="M28 108 C 48 72, 72 58, 98 64 C 88 48, 76 36, 58 32"
        stroke="url(#colibri-stroke)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M142 52 C 128 78, 118 96, 108 118 C 124 108, 148 98, 168 88"
        stroke="url(#colibri-stroke)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="42" cy="124" r="2.5" fill="#4FD1A5" fillOpacity="0.2" />
      <circle cx="172" cy="96" r="2" fill="#8B5CF6" fillOpacity="0.18" />
    </svg>
  );
}

function TestimonialVisual({
  type,
  role,
  name,
  iconKey,
  usePhoto,
  imageUrl,
  compact,
}: {
  type?: string | null;
  role: string | null;
  name: string;
  iconKey?: string | null;
  usePhoto?: boolean;
  imageUrl?: string | null;
  compact?: boolean;
}) {
  const { Icon, label } = getTestimonialVisual(type, role, name, iconKey);
  const size = compact ? "h-[72px] w-[72px]" : "h-[120px] w-[120px]";
  const iconSize = compact ? "h-8 w-8" : "h-11 w-11";
  const haloSize = compact ? "h-28 w-28" : "h-44 w-44";
  const showPhoto = usePhoto && !!imageUrl;

  return (
    <div className="relative flex shrink-0 items-center justify-center">
      <div
        className={cn("absolute rounded-full bg-gradient-to-br from-[#4FD1A5]/20 via-[#60A5FA]/15 to-[#8B5CF6]/20 blur-2xl", haloSize)}
        aria-hidden
      />
      <ColibriOrnaments compact={compact} />
      <div
        className={cn(
          "relative overflow-hidden rounded-full",
          size,
          showPhoto
            ? "border-2 border-white shadow-[0_8px_32px_rgba(79,209,165,0.2)]"
            : "flex items-center justify-center bg-gradient-to-br from-[#4FD1A5]/25 via-[#60A5FA]/20 to-[#8B5CF6]/25 border border-white/80 shadow-[0_8px_32px_rgba(79,209,165,0.18),inset_0_1px_0_rgba(255,255,255,0.6)]",
          "transition-transform duration-500 ease-out group-hover/card:rotate-6 group-hover/card:scale-105"
        )}
      >
        {showPhoto ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes={compact ? "72px" : "120px"}
            className="object-cover"
          />
        ) : (
          <ThemedPersonIcon icon={Icon} label={label} className={iconSize} />
        )}
      </div>
    </div>
  );
}

function StarRating() {
  return (
    <div className="flex justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5 transition-all duration-300",
            "fill-[#D1FAE5] text-[#A7F3D0]",
            "group-hover/card:fill-[#4FD1A5] group-hover/card:text-[#4FD1A5]",
            "group-hover/card:drop-shadow-[0_0_6px_rgba(79,209,165,0.45)]"
          )}
          strokeWidth={0}
          style={{ transitionDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  inView,
  delay,
}: {
  testimonial: Testimonial;
  inView: boolean;
  delay: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={cn(
        "group/card flex h-full min-w-0 flex-col items-center rounded-[1.75rem] border border-[#E5E7EB]/50 bg-white p-6 sm:p-7",
        "shadow-[0_4px_32px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out",
        "hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(15,23,42,0.08)]"
      )}
    >
      <TestimonialVisual
        type={testimonial.type}
        role={testimonial.role}
        name={testimonial.name}
        iconKey={testimonial.iconKey}
        usePhoto={testimonial.usePhoto}
        imageUrl={testimonial.imageUrl}
        compact
      />

      <div className="relative mt-6 w-full flex-1 text-center">
        <span
          className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 font-heading text-[4.5rem] leading-none text-[#4FD1A5]/[0.07] select-none"
          aria-hidden
        >
          &ldquo;
        </span>

        <blockquote className="relative z-10 line-clamp-3 font-heading text-base font-medium leading-[1.55] tracking-tight text-[#1B2233] sm:text-[1.05rem]">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        <div className="relative z-10 mt-5 space-y-2">
          <StarRating />
          <p className="text-sm font-semibold tracking-tight text-[#111827]">
            {testimonial.name}
          </p>
          {testimonial.role && (
            <p className="text-xs text-[#6B7280]">{testimonial.role}</p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function TestimonialsSection({
  testimonials,
  eyebrow = "Témoignages",
  title = "Leurs mots, notre plus belle récompense",
  subtitle = "Découvrez les témoignages de bénéficiaires, bénévoles et partenaires qui font vivre notre mission.",
}: TestimonialsSectionProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const visible = useVisibleCount();

  const count = testimonials.length;
  const maxIndex = Math.max(0, count - visible);
  const pageCount = maxIndex + 1;
  const canSlide = count > visible;

  const goTo = useCallback(
    (next: number) => {
      if (!canSlide) return;
      setIndex(Math.min(Math.max(next, 0), maxIndex));
    },
    [canSlide, maxIndex]
  );

  const goNext = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (!inView || isPaused || !canSlide) return;
    const timer = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [inView, isPaused, canSlide, goNext]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const swipe = info.offset.x;
    if (swipe < -60) goNext();
    else if (swipe > 60) goPrev();
  }

  if (count === 0) return null;

  const trackWidthPercent = (count / visible) * 100;
  const cardWidthPercent = 100 / count;
  const translatePercent = index * cardWidthPercent;

  return (
    <section
      ref={sectionRef}
      id="temoignages"
      className="site-section relative overflow-hidden bg-white"
    >
      <div
        className="pointer-events-none absolute -left-28 top-16 h-80 w-80 rounded-full bg-[#4FD1A5]/[0.06] blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-8 h-96 w-96 rounded-full bg-[#8B5CF6]/[0.05] blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-[#60A5FA]/[0.04] blur-[100px]"
        aria-hidden
      />

      <div className="site-container relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={subtitle}
          />
        </motion.div>

        <motion.div
          className="group/carousel relative mt-10 lg:mt-12"
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <motion.div
              className="flex touch-pan-y"
              style={{ width: `${trackWidthPercent}%` }}
              drag={canSlide ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              onDragEnd={handleDragEnd}
              animate={{ x: `-${translatePercent}%` }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              {testimonials.map((item, i) => (
                <div
                  key={item.id}
                  className="shrink-0 px-2 sm:px-2.5 lg:px-3"
                  style={{ width: `${cardWidthPercent}%` }}
                >
                  <TestimonialCard testimonial={item} inView={inView} delay={0.05 * (i % visible)} />
                </div>
              ))}
            </motion.div>
          </div>

          {canSlide && (
            <div className="mt-10 flex items-center justify-center gap-4 sm:gap-5">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Témoignages précédents"
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB]/70",
                  "bg-white/90 text-[#6B7280] shadow-[0_2px_12px_rgba(15,23,42,0.04)]",
                  "transition-all duration-300 hover:border-[#D1D5DB] hover:text-[#374151] hover:shadow-[0_4px_16px_rgba(15,23,42,0.07)]"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Page ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className="flex h-11 w-11 items-center justify-center"
                  >
                    <span
                      className={cn(
                        "rounded-full transition-all duration-300",
                        i === index
                          ? "h-1.5 w-8 bg-gradient-to-r from-[#4FD1A5] via-[#60A5FA] to-[#8B5CF6]"
                          : "h-1.5 w-1.5 bg-[#E5E7EB] hover:bg-[#D1D5DB]"
                      )}
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                aria-label="Témoignages suivants"
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB]/70",
                  "bg-white/90 text-[#6B7280] shadow-[0_2px_12px_rgba(15,23,42,0.04)]",
                  "transition-all duration-300 hover:border-[#D1D5DB] hover:text-[#374151] hover:shadow-[0_4px_16px_rgba(15,23,42,0.07)]"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
