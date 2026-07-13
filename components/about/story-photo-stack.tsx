"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { AboutStoryPhotos } from "@/lib/about-story-chapters";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type StoryPhotoItem = { src: string; alt: string };

function StoryPhotoLightbox({
  images,
  index,
  open,
  onClose,
  onNavigate,
}: {
  images: StoryPhotoItem[];
  index: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = images[index];

  const goPrev = useCallback(() => {
    if (images.length === 0) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [images.length, index, onNavigate]);

  const goNext = useCallback(() => {
    if (images.length === 0) return;
    onNavigate((index + 1) % images.length);
  }, [images.length, index, onNavigate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

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
      aria-label={image.alt || "Aperçu de la photo"}
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-4 py-4 sm:px-6"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="truncate text-sm text-white/80">
          {image.alt || "Photo"}
          <span className="ml-2 text-white/45">
            {index + 1} / {images.length}
          </span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-8 sm:px-16"
        onClick={(event) => event.stopPropagation()}
      >
        {images.length > 1 ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition-colors hover:bg-white/20 sm:left-5"
            aria-label="Photo précédente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={image.src}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="flex max-h-[calc(100svh-7.5rem)] max-w-[min(100%,92vw)] items-center justify-center"
          >
            {/* Taille réelle de la photo, limitée au viewport */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="h-auto max-h-[calc(100svh-7.5rem)] w-auto max-w-full object-contain shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition-colors hover:bg-white/20 sm:right-5"
            aria-label="Photo suivante"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

function StoryPhotoFrame({
  src,
  alt,
  className,
  onOpen,
}: {
  src: string;
  alt: string;
  className?: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Agrandir : ${alt || "photo"}`}
      className={cn(
        "group/photo relative block w-full cursor-zoom-in overflow-hidden bg-white",
        "transition-all duration-[400ms] ease-out",
        "hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d8f5f]/45 focus-visible:ring-offset-2",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width:1024px) 33vw, 160px"
        className="object-cover transition-transform duration-[400ms] ease-out group-hover/photo:scale-[1.06]"
      />
      <span
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center",
          "bg-black/0 transition-colors duration-300 group-hover/photo:bg-black/25"
        )}
        aria-hidden
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#111827] opacity-0 shadow-md transition-opacity duration-300 group-hover/photo:opacity-100">
          <ZoomIn className="h-4 w-4" />
        </span>
      </span>
    </button>
  );
}

export function StoryPhotoStack({
  photos,
  layout = "stack",
  className,
}: {
  photos: AboutStoryPhotos;
  layout?: "stack" | "row";
  className?: string;
}) {
  const items = [
    { src: photos.main, alt: photos.mainAlt ?? "" },
    { src: photos.left, alt: photos.leftAlt ?? "" },
    { src: photos.right, alt: photos.rightAlt ?? "" },
  ].filter((item) => Boolean(item.src));

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (items.length === 0) return null;

  return (
    <>
      <div
        className={cn(
          layout === "row"
            ? "grid w-full grid-cols-3 gap-2 sm:gap-2.5"
            : /* Même cadre que Premières actions, empilé verticalement */
              "mx-auto flex w-[153px] shrink-0 flex-col gap-2 sm:gap-2.5 lg:mx-0",
          className
        )}
      >
        {items.map((item, index) => (
          <StoryPhotoFrame
            key={item.src + item.alt}
            src={item.src}
            alt={item.alt}
            onOpen={() => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
            className={cn(
              "aspect-[4/3] min-h-0 flex-none rounded-[10px] border border-[#E5E7EB]/80 shadow-[0_8px_24px_rgba(15,23,42,0.07)]",
              layout === "stack" && "w-[153px]"
            )}
          />
        ))}
      </div>

      <StoryPhotoLightbox
        images={items}
        index={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
