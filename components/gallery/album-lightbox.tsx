"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus, X, ZoomIn } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { parseImageMeta } from "@/components/gallery/gallery-filters";
import type { AlbumImageItem } from "@/components/gallery/album-gallery";

interface AlbumLightboxProps {
  images: AlbumImageItem[];
  albumTitle: string;
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function formatImageDate(value: string) {
  const formatted = format(new Date(value), "d MMMM yyyy", { locale: fr });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function AlbumLightbox({
  images,
  albumTitle,
  currentIndex,
  open,
  onClose,
  onNavigate,
}: AlbumLightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const image = images[currentIndex];
  const meta = image
    ? parseImageMeta(image.alt, `Photo ${currentIndex + 1}`)
    : { name: "", location: null };

  const goPrev = useCallback(() => {
    if (images.length === 0) return;
    setZoomed(false);
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    if (images.length === 0) return;
    setZoomed(false);
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    setZoomed(false);
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, goPrev, goNext]);

  if (!mounted || !open || !image) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visionneuse — ${meta.name}`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/92 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white/90">{meta.name}</p>
          {meta.location ? (
            <p className="truncate text-xs text-white/55">{meta.location}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setZoomed((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label={zoomed ? "Réduire le zoom" : "Agrandir la photo"}
          >
            {zoomed ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Fermer la visionneuse"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-3 pb-[env(safe-area-inset-bottom)] pt-2 sm:px-20"
        onTouchStart={(event) => {
          if (zoomed) return;
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (zoomed || touchStartX.current === null) return;
          const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
          const delta = endX - touchStartX.current;
          if (delta > 56) goPrev();
          if (delta < -56) goNext();
          touchStartX.current = null;
        }}
      >
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-1 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:left-5 sm:bg-white/10"
          aria-label="Photo précédente"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative h-full w-full max-h-[calc(100svh-9rem)] max-w-6xl transition-transform duration-[380ms] ease-out",
              zoomed ? "cursor-zoom-out scale-[1.65]" : "cursor-zoom-in scale-100"
            )}
            onClick={() => setZoomed((value) => !value)}
          >
            <Image
              src={image.url}
              alt={image.alt ?? albumTitle}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={goNext}
          className="absolute right-1 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:right-5 sm:bg-white/10"
          aria-label="Photo suivante"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 px-4 pb-6 pt-2 text-sm text-white/75">
        <ZoomIn className="hidden h-4 w-4 sm:block" aria-hidden />
        <span aria-live="polite" aria-atomic="true">
          {currentIndex + 1} / {images.length}
        </span>
        <span className="hidden text-white/45 sm:inline" aria-hidden>
          ·
        </span>
        <span className="hidden text-white/55 sm:inline">{formatImageDate(image.createdAt)}</span>
      </div>
    </div>,
    document.body
  );
}
