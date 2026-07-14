"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import {
  parseYouTubeVideoId,
  youtubeThumbnailUrl,
} from "@/lib/about-story-media";
import type { HomeSpotlightMedia } from "@/lib/home-spotlight";
import { hasHomeSpotlightVideo } from "@/lib/home-spotlight";
import { SectionHeader } from "@/components/home/section-header";
import {
  ScrollReveal,
  useSectionInView,
} from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

export type GallerySpotlightPhoto = {
  id: string;
  url: string;
  alt?: string;
};

export type GallerySpotlightVideo = {
  id: string;
  url: string;
  alt?: string;
  posterUrl?: string;
  youtubeUrl?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

function SpotlightLightbox({
  photos,
  index,
  open,
  onClose,
  onNavigate,
}: {
  photos: GallerySpotlightPhoto[];
  index: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = photos[index];

  const goPrev = useCallback(() => {
    if (photos.length === 0) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [photos.length, index, onNavigate]);

  const goNext = useCallback(() => {
    if (photos.length === 0) return;
    onNavigate((index + 1) % photos.length);
  }, [photos.length, index, onNavigate]);

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

  if (!mounted || !open || !photo) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt || "Aperçu de la photo"}
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-4 py-4 sm:px-6"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="truncate text-sm text-white/80">
          {photo.alt || "Photo"}
          <span className="ml-2 text-white/45">
            {index + 1} / {photos.length}
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
        {photos.length > 1 ? (
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
            key={photo.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="flex max-h-[calc(100svh-7.5rem)] max-w-[min(100%,92vw)] items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.alt || ""}
              className="h-auto max-h-[calc(100svh-7.5rem)] w-auto max-w-full object-contain shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>

        {photos.length > 1 ? (
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

function GalleryVideoPlayer({
  video,
}: {
  video: GallerySpotlightVideo;
}) {
  const [playing, setPlaying] = useState(false);
  const youtubeId = video.youtubeUrl
    ? parseYouTubeVideoId(video.youtubeUrl)
    : null;
  const poster =
    video.posterUrl ||
    (youtubeId ? youtubeThumbnailUrl(youtubeId) : undefined);

  const frameClass = cn(
    "relative aspect-video w-full overflow-hidden rounded-[18px] sm:rounded-[22px]",
    "border border-white/12 bg-[#0B1220]",
    "shadow-[0_20px_48px_rgba(0,0,0,0.35)] ring-1 ring-white/5"
  );

  if (!playing) {
    return (
      <button
        type="button"
        className={cn(
          frameClass,
          "group cursor-pointer p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d8f5f] focus-visible:ring-offset-2"
        )}
        onClick={() => setPlaying(true)}
        aria-label={video.alt ? `Lire : ${video.alt}` : "Lire la vidéo"}
      >
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover"
          />
        ) : video.url ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={`${video.url}#t=0.1`}
            muted
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : (
          <span className="absolute inset-0 bg-[#1e293b]" aria-hidden />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#0d8f5f] shadow-lg transition duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
            <Play
              className="h-5 w-5 translate-x-0.5 sm:h-6 sm:w-6"
              fill="currentColor"
              aria-hidden
            />
          </span>
        </span>
      </button>
    );
  }

  if (youtubeId) {
    return (
      <div className={frameClass}>
        <iframe
          title={video.alt || "Vidéo Accueil"}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <video
        className="absolute inset-0 h-full w-full object-cover"
        controls
        playsInline
        autoPlay
        poster={poster}
        preload="metadata"
      >
        <source src={video.url} />
      </video>
    </div>
  );
}

function useVideosPerPage() {
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setPerPage(mq.matches ? 2 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return perPage;
}

function SpotlightVideoCarousel({ videos }: { videos: GallerySpotlightVideo[] }) {
  const perPage = useVideosPerPage();
  const [ordered, setOrdered] = useState(videos);
  const [page, setPage] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setOrdered(shuffle(videos));
    setPage(0);
  }, [videos]);

  const pageCount = Math.max(1, Math.ceil(ordered.length / perPage));
  const canSlide = ordered.length > perPage;

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  const goPrev = useCallback(() => {
    setPage((current) => (current <= 0 ? pageCount - 1 : current - 1));
  }, [pageCount]);

  const goNext = useCallback(() => {
    setPage((current) => (current >= pageCount - 1 ? 0 : current + 1));
  }, [pageCount]);

  const visible = ordered.slice(page * perPage, page * perPage + perPage);

  if (ordered.length === 0) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <div
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (!canSlide || touchStartX.current == null) return;
          const endX = event.changedTouches[0]?.clientX;
          if (endX == null) return;
          const delta = endX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) < 48) return;
          if (delta < 0) goNext();
          else goPrev();
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={cn(
              "grid gap-3 sm:gap-5",
              visible.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
            )}
          >
            {visible.map((video) => (
              <GalleryVideoPlayer key={video.id} video={video} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {canSlide ? (
        <div className="mt-4 flex items-center justify-center gap-2.5 sm:mt-6 sm:gap-5">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Vidéos précédentes"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11",
              "border border-white/15 bg-white/5 text-white/75 backdrop-blur-sm",
              "transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:text-white"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex max-w-[min(100%,12rem)] flex-wrap items-center justify-center gap-0.5 sm:max-w-none sm:gap-1.5">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Page vidéos ${i + 1}`}
                aria-current={i === page ? "true" : undefined}
                className="flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10"
              >
                <span
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === page
                      ? "h-1.5 w-5 bg-gradient-to-r from-[#42D7C8] to-[#3CCB8A] sm:w-7"
                      : "h-1.5 w-1.5 bg-white/25 hover:bg-white/40"
                  )}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Vidéos suivantes"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11",
              "border border-white/15 bg-white/5 text-white/75 backdrop-blur-sm",
              "transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:text-white"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Repli CMS (1 vidéo YouTube ou uploadée) si la galerie n’a pas encore de vidéos. */
function SpotlightCmsVideo({ media }: { media: HomeSpotlightMedia }) {
  const [playing, setPlaying] = useState(false);
  const youtubeId = media.youtubeUrl
    ? parseYouTubeVideoId(media.youtubeUrl)
    : null;
  const poster =
    media.videoPoster ||
    (youtubeId ? youtubeThumbnailUrl(youtubeId) : undefined);

  const frameClass = cn(
    "relative mx-auto aspect-video w-full max-w-xl overflow-hidden rounded-[18px] sm:max-w-2xl sm:rounded-[22px]",
    "border border-white/12 bg-[#0B1220]",
    "shadow-[0_20px_48px_rgba(0,0,0,0.35)] ring-1 ring-white/5"
  );

  if (!hasHomeSpotlightVideo(media)) return null;

  if (!playing) {
    return (
      <button
        type="button"
        className={cn(
          frameClass,
          "group cursor-pointer p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d8f5f] focus-visible:ring-offset-2"
        )}
        onClick={() => setPlaying(true)}
        aria-label="Lire la vidéo"
      >
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 640px) 90vw, 672px"
            className="object-cover"
          />
        ) : media.videoSrc ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={`${media.videoSrc}#t=0.1`}
            muted
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : (
          <span className="absolute inset-0 bg-[#1e293b]" aria-hidden />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#0d8f5f] shadow-lg transition duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
            <Play
              className="h-5 w-5 translate-x-0.5 sm:h-6 sm:w-6"
              fill="currentColor"
              aria-hidden
            />
          </span>
        </span>
      </button>
    );
  }

  if (youtubeId) {
    return (
      <div className={frameClass}>
        <iframe
          title="Vidéo Accueil"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <video
        className="absolute inset-0 h-full w-full object-cover"
        controls
        playsInline
        autoPlay
        poster={poster}
        preload="metadata"
      >
        <source src={media.videoSrc} />
      </video>
    </div>
  );
}

function buildMarqueeGroup(photos: GallerySpotlightPhoto[]): GallerySpotlightPhoto[] {
  if (photos.length === 0) return [];
  const minCount = 14;
  const group: GallerySpotlightPhoto[] = [];
  while (group.length < minCount) {
    group.push(...photos);
  }
  return group;
}

function GalleryMarquee({
  photos,
  paused,
  onOpen,
}: {
  photos: GallerySpotlightPhoto[];
  paused?: boolean;
  onOpen: (index: number) => void;
}) {
  const group = useMemo(() => buildMarqueeGroup(photos), [photos]);

  if (group.length === 0) return null;

  return (
    <div className="gallery-marquee gallery-marquee--on-dark mt-7 sm:mt-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#0F172A] to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#0F172A] to-transparent sm:w-16" />

      <div
        className={cn(
          "gallery-marquee-track",
          paused && "gallery-marquee-paused"
        )}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="gallery-marquee-group"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {group.map((photo, index) => {
              const sourceIndex = photos.findIndex((item) => item.id === photo.id);
              return (
                <button
                  key={`${copy}-${photo.id}-${index}`}
                  type="button"
                  className="gallery-marquee-item cursor-zoom-in"
                  aria-label={photo.alt || "Agrandir la photo"}
                  tabIndex={copy === 1 ? -1 : undefined}
                  onClick={() => onOpen(sourceIndex >= 0 ? sourceIndex : 0)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.alt || ""}
                    loading={copy === 0 && index < 6 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GallerySpotlightSection({
  media,
  photos,
  videos = [],
}: {
  media: HomeSpotlightMedia;
  photos: GallerySpotlightPhoto[];
  videos?: GallerySpotlightVideo[];
}) {
  const { ref: sectionRef, inView } = useSectionInView(0.18);
  const [shuffledPhotos, setShuffledPhotos] =
    useState<GallerySpotlightPhoto[]>(photos);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setShuffledPhotos(shuffle(photos));
  }, [photos]);

  const showGalleryVideos = videos.length > 0;
  const showCmsFallback = !showGalleryVideos && hasHomeSpotlightVideo(media);
  const showMarquee = shuffledPhotos.length > 0;

  if (!showGalleryVideos && !showCmsFallback && !showMarquee) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-8 sm:py-12 lg:py-14"
      aria-label="Des moments qui restent"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0B1220] via-[#0F172A] to-[#132038]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#42D7C8]/[0.09] blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-[#4A8BFF]/[0.08] blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[#6B4EFF]/[0.05] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        aria-hidden
      />

      <div className="site-container relative">
        <ScrollReveal inView={inView} direction="up">
          <SectionHeader
            light
            eyebrow="Galerie"
            title="Des moments qui restent"
            description="Films et photos de nos missions — le terrain, les rencontres, l’élan qui nous porte."
            className="[&_h2]:mt-2 [&_h2]:text-[1.75rem] sm:[&_h2]:text-3xl lg:[&_h2]:text-[2.15rem] [&_p]:mt-2.5 [&_p]:text-[15px] sm:[&_p]:text-base"
          />
        </ScrollReveal>

        <ScrollReveal
          inView={inView}
          direction="up"
          delay={0.1}
          className="mt-5 sm:mt-8"
        >
          {showGalleryVideos ? (
            <SpotlightVideoCarousel videos={videos} />
          ) : showCmsFallback ? (
            <SpotlightCmsVideo media={media} />
          ) : null}
        </ScrollReveal>
      </div>

      {showMarquee ? (
        <ScrollReveal inView={inView} direction="up" delay={0.16}>
          <GalleryMarquee
            photos={shuffledPhotos}
            paused={lightboxOpen}
            onOpen={(index) => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
          />
        </ScrollReveal>
      ) : null}

      <div className="site-container relative mt-6 sm:mt-8">
        <ScrollReveal inView={inView} direction="up" delay={0.22}>
          <div className="flex justify-center">
            <Link
              href="/galerie"
              className={cn(
                "group inline-flex items-center gap-2.5 rounded-full border border-white/15",
                "bg-white/[0.06] px-5 py-2.5 text-[13px] font-medium tracking-wide text-white/90",
                "backdrop-blur-sm transition-all duration-300",
                "hover:border-[#42D7C8]/40 hover:bg-white/[0.1] hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#42D7C8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
              )}
            >
              Voir toute la galerie
              <span
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full",
                  "bg-[#42D7C8]/15 text-[#42D7C8]",
                  "transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-[#42D7C8]/25"
                )}
              >
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </span>
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <SpotlightLightbox
        photos={shuffledPhotos}
        index={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
