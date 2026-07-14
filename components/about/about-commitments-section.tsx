"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { AboutCommitmentItem } from "@/lib/about-content";
import { cn } from "@/lib/utils";

function CommitmentsLightbox({
  items,
  index,
  open,
  onClose,
  onNavigate,
}: {
  items: AboutCommitmentItem[];
  index: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const item = items[index];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
      if (e.key === "ArrowRight") onNavigate((index + 1) % items.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onClose, onNavigate]);

  if (!mounted || !item) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/88 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:left-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((index - 1 + items.length) % items.length);
                }}
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:right-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((index + 1) % items.length);
                }}
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          <motion.div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-[#0F172A] shadow-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
            <div className="border-t border-white/10 px-5 py-4">
              <p className="text-center text-[15px] font-semibold text-white sm:text-base">
                {item.title}
              </p>
              <p className="mt-1 text-center text-[12px] text-white/55">
                Voyage au Village · {index + 1} / {items.length}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function AboutCommitmentsSection({
  title,
  items,
}: {
  title: string;
  items: AboutCommitmentItem[];
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);

  return (
    <section className="bg-[#F8FAFC] site-section">
      <div className="site-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d8f5f]">
            Nos engagements
          </p>
          <h2 className="mt-3 font-heading text-[2rem] font-bold text-[#111827] sm:text-[2.25rem]">
            {title}
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#6B7280] sm:text-[15px]">
            Cliquez sur une photo pour découvrir nos voyages au Village.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-2.5 sm:mt-10 sm:gap-3 lg:max-w-4xl lg:grid-cols-3">
          {items.map((item, i) => (
            <button
              key={`${item.title}-${i}`}
              type="button"
              onClick={() => openAt(i)}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-xl text-left",
                "shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-black/5",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)] hover:ring-[#42D7C8]/40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#42D7C8]"
              )}
            >
              <div className="relative aspect-[5/3] w-full overflow-hidden bg-[#E5E7EB] sm:aspect-[3/2]">
                <Image
                  src={item.imageUrl}
                  alt={`Voyage au Village — ${item.title}`}
                  fill
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 28vw, 240px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />

                {/* Dégradé bas un peu plus dense uniquement sous le titre */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 via-black/35 to-transparent"
                  aria-hidden
                />

                <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-8 sm:px-3.5 sm:pb-3">
                  <p className="text-[15px] font-semibold leading-snug text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55),0_2px_12px_rgba(0,0,0,0.4)] sm:text-[17px]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/85 sm:translate-y-1 sm:text-[12px] sm:text-white/0 sm:transition-all sm:duration-300 sm:group-hover:translate-y-0 sm:group-hover:text-white/85">
                    Voir la photo →
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <CommitmentsLightbox
        items={items}
        index={index}
        open={open}
        onClose={() => setOpen(false)}
        onNavigate={setIndex}
      />
    </section>
  );
}
