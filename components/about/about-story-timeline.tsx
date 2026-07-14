"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Play } from "lucide-react";
import { StoryPhotoStack } from "@/components/about/story-photo-stack";
import {
  type AboutStoryChapter,
  type AboutStoryMedia,
  type AboutStorySection,
  type AboutStorySplitLayout,
} from "@/lib/about-story-chapters";
import {
  getDefaultStoryChaptersCms,
  getStoryCmsMeta,
  mergeStoryChaptersWithCms,
  type StoryChaptersCms,
} from "@/lib/about-story-cms";
import { parseYouTubeVideoId, youtubeThumbnailUrl } from "@/lib/about-story-media";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function SectionBlock({
  section,
  className,
}: {
  section: AboutStorySection;
  className?: string;
}) {
  return (
    <div className={cn("text-left", className)}>
      <h4 className="font-heading text-lg font-semibold text-[#111827] sm:text-xl">
        {section.heading}
      </h4>
      <p className="mt-3 text-[15px] leading-relaxed text-[#6B7280] sm:text-base">
        {section.body}
      </p>
    </div>
  );
}

function SplitChapterPanel({
  year,
  stageLabel,
  layout,
}: {
  year: string;
  stageLabel: string;
  layout: AboutStorySplitLayout;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d8f5f]">
        {stageLabel && stageLabel !== year ? `${year} · ${stageLabel}` : year}
      </p>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* Gauche : texte puis 3 photos */}
        <div className="flex flex-col gap-5">
          <SectionBlock section={layout.left} />
          <StoryPhotoStack photos={layout.leftPhotos} layout="row" />
        </div>

        {/* Droite : 3 photos puis texte */}
        <div className="flex flex-col gap-5">
          <StoryPhotoStack photos={layout.rightPhotos} layout="row" />
          <SectionBlock section={layout.right} />
        </div>
      </div>
    </div>
  );
}

function StoryVideo({
  media,
  label = "Vidéo",
}: {
  media: AboutStoryMedia;
  label?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const youtubeId = media.youtubeUrl
    ? parseYouTubeVideoId(media.youtubeUrl)
    : null;
  const poster =
    media.videoPoster ||
    (youtubeId ? youtubeThumbnailUrl(youtubeId) : undefined);

  const frameClass = cn(
    "relative box-border w-full overflow-hidden rounded-[18px] aspect-[9/16]",
    "border border-[#E5E7EB]/80 bg-[#0f172a] shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
  );

  if (!youtubeId && !media.videoSrc) {
    return (
      <div
        className={cn(
          frameClass,
          "flex flex-col items-center justify-center gap-2.5 border-dashed border-[#0d8f5f]/35 bg-[#0d8f5f]/[0.06] px-3 text-center"
        )}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0d8f5f] text-white shadow-lg">
          <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" aria-hidden />
        </span>
        <p className="text-sm font-medium text-[#0d8f5f]">Vidéo à venir</p>
        <p className="text-[11px] leading-relaxed text-[#6B7280]">
          Uploadez une vidéo ou un lien YouTube
          <br />
          dans Admin → Histoire.
        </p>
      </div>
    );
  }

  if (!playing) {
    return (
      <button
        type="button"
        className={cn(
          frameClass,
          "group cursor-pointer p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d8f5f] focus-visible:ring-offset-2"
        )}
        onClick={() => setPlaying(true)}
        aria-label={`Lire la vidéo — ${label}`}
      >
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
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
        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#0d8f5f] shadow-lg transition duration-300 group-hover:scale-105">
            <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" aria-hidden />
          </span>
        </span>
      </button>
    );
  }

  if (youtubeId) {
    return (
      <div className={frameClass}>
        <iframe
          title={`${label} — YouTube`}
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

function MediaChapterPanel({
  chapter,
  media,
}: {
  chapter: AboutStoryChapter;
  media: AboutStoryMedia;
}) {
  const videoRight = chapter.mediaPlacement === "video-right";
  const video = (
    <div className="mx-auto w-[120px] shrink-0 sm:w-[160px] lg:mx-0 lg:w-[168px] xl:w-[180px]">
      <StoryVideo media={media} label={chapter.year} />
    </div>
  );
  const photos = (
    <div
      className={cn(
        "flex shrink-0 justify-center lg:items-start",
        videoRight ? "lg:justify-start" : "lg:justify-end"
      )}
    >
      <StoryPhotoStack photos={media.photos} />
    </div>
  );
  const text = (
    <div className="min-w-0 text-left lg:pt-1">
      <ChapterTextContent chapter={chapter} />
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start lg:gap-8 xl:gap-10">
      {videoRight ? (
        <>
          {photos}
          {text}
          {video}
        </>
      ) : (
        <>
          {video}
          {text}
          {photos}
        </>
      )}
    </div>
  );
}

function TextAsideImagePanel({
  chapter,
  image,
}: {
  chapter: AboutStoryChapter;
  image: NonNullable<AboutStoryChapter["asideImage"]>;
}) {
  return (
    <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 xl:gap-14">
      <div className="min-w-0 text-left">
        <ChapterTextContent chapter={chapter} />
      </div>
      <div
        className={cn(
          "relative mx-auto w-full max-w-md overflow-hidden rounded-[18px]",
          "border border-[#E5E7EB]/80 bg-[#F3F4F6] shadow-[0_16px_40px_rgba(15,23,42,0.08)]",
          "aspect-[4/5] lg:mx-0 lg:aspect-auto lg:min-h-full lg:max-w-none"
        )}
      >
        {image.src ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width:1024px) 90vw, 420px"
            className="object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}

function ChapterTextContent({ chapter }: { chapter: AboutStoryChapter }) {
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d8f5f]">
        {chapter.stageLabel && chapter.stageLabel !== chapter.year
          ? `${chapter.year} · ${chapter.stageLabel}`
          : chapter.year}
      </p>
      {chapter.title.trim() ? (
        <h3 className="mt-3 font-heading text-[1.35rem] font-bold leading-snug text-[#111827] sm:text-[1.65rem] lg:text-[1.85rem]">
          {chapter.title}
        </h3>
      ) : null}
      {chapter.description ? (
        <p className="mt-4 text-[15px] leading-relaxed text-[#6B7280] sm:text-base">
          {chapter.description}
        </p>
      ) : null}
      {chapter.paragraphs?.map((paragraph, index) => (
        <p
          key={`${index}-${paragraph.slice(0, 24)}`}
          className={cn(
            "text-left text-[15px] leading-relaxed text-[#6B7280] sm:text-base",
            index === 0 ? "mt-6" : "mt-5"
          )}
        >
          {paragraph}
        </p>
      ))}
      {chapter.sections?.map((section, index) => (
        <div
          key={section.heading}
          className={cn(index === 0 ? "mt-6" : "mt-8")}
        >
          <h4 className="font-heading text-lg font-semibold text-[#111827] sm:text-xl">
            {section.heading}
          </h4>
          {section.body
            .split(/\n\n+/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, paragraphIndex) => (
              <p
                key={`${section.heading}-${paragraphIndex}`}
                className="mt-3 text-[15px] leading-relaxed text-[#6B7280] sm:text-base"
              >
                {paragraph}
              </p>
            ))}
        </div>
      ))}
      {chapter.href ? (
        <Link
          href={chapter.href}
          className={cn(
            "mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold",
            "bg-[#0d8f5f] text-white transition-opacity hover:opacity-90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d8f5f]/40 focus-visible:ring-offset-2"
          )}
        >
          Découvrir ce chapitre
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
    </>
  );
}

/** Jalon de la frise : image custom ou numéro (hover zoom + actif plus grand). */
function ChapterStepMarker({
  index,
  active,
  completed,
  imageSrc,
  imageAlt,
}: {
  index: number;
  active: boolean;
  completed: boolean;
  imageSrc?: string;
  imageAlt?: string;
}) {
  const label = String(index + 1).padStart(2, "0");

  const sizeClass = cn(
    "relative flex shrink-0 items-center justify-center",
    "transition-all duration-300 ease-out motion-reduce:transition-none",
    active
      ? "h-[4.5rem] w-[4.5rem] scale-100 sm:h-[5.25rem] sm:w-[5.25rem] lg:h-24 lg:w-24"
      : "h-14 w-14 group-hover:scale-110 sm:h-[4.25rem] sm:w-[4.25rem] lg:h-[4.75rem] lg:w-[4.75rem]"
  );

  if (imageSrc) {
    return (
      <span className={sizeClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt || ""}
          width={96}
          height={96}
          className={cn(
            "h-full w-full object-contain transition-transform duration-300 ease-out",
            !active && "group-hover:scale-105"
          )}
          draggable={false}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        sizeClass,
        "rounded-full font-heading text-[13px] font-semibold tracking-wide sm:text-sm",
        active
          ? "bg-gradient-to-br from-[#0d8f5f] to-[#4FD1A5] text-white shadow-[0_10px_28px_rgba(13,143,95,0.32)] ring-[6px] ring-[#0d8f5f]/12"
          : completed
            ? "bg-[#0d8f5f] text-white shadow-[0_6px_16px_rgba(13,143,95,0.18)]"
            : "border border-[#E5E7EB] bg-white text-[#9CA3AF] shadow-[0_2px_8px_rgba(15,23,42,0.04)] group-hover:border-[#0d8f5f]/40 group-hover:text-[#0d8f5f]"
      )}
    >
      {completed && !active ? (
        <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
      ) : (
        <span aria-hidden>{label}</span>
      )}
    </span>
  );
}

export function AboutStoryTimeline({
  seismeMedia,
  premieresMedia,
  confortMedia,
  terrainMedia,
  accompagnementMedia,
  creationImage,
  storyCms,
}: {
  seismeMedia?: AboutStoryMedia;
  premieresMedia?: Pick<AboutStorySplitLayout, "leftPhotos" | "rightPhotos">;
  confortMedia?: NonNullable<AboutStoryChapter["sidePhotos"]>;
  terrainMedia?: AboutStoryMedia;
  accompagnementMedia?: NonNullable<AboutStoryChapter["sidePhotos"]>;
  creationImage?: NonNullable<AboutStoryChapter["asideImage"]>;
  storyCms?: StoryChaptersCms;
}) {
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cms = storyCms ?? getDefaultStoryChaptersCms();
  const { eyebrow, heading } = getStoryCmsMeta(cms);
  const chapters = mergeStoryChaptersWithCms(cms).map((chapter) => {
    if (chapter.id === "seisme" && seismeMedia) {
      return { ...chapter, media: seismeMedia };
    }
    if (chapter.id === "premieres-actions" && chapter.splitLayout && premieresMedia) {
      return {
        ...chapter,
        splitLayout: {
          ...chapter.splitLayout,
          leftPhotos: premieresMedia.leftPhotos,
          rightPhotos: premieresMedia.rightPhotos,
        },
      };
    }
    if (chapter.id === "confort-reconfort" && confortMedia) {
      return { ...chapter, sidePhotos: confortMedia };
    }
    if (chapter.id === "terrain-de-foot" && terrainMedia) {
      return { ...chapter, media: terrainMedia };
    }
    if (chapter.id === "ancrage" && accompagnementMedia) {
      return { ...chapter, sidePhotos: accompagnementMedia };
    }
    if (chapter.id === "creation-association" && creationImage) {
      return { ...chapter, asideImage: creationImage };
    }
    return chapter;
  });
  const active = chapters[activeIndex] ?? chapters[0]!;

  const select = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const tab = tabRefs.current[activeIndex];
    if (!tab) return;
    tab.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex, reduceMotion]);

  const onTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = chapters.length - 1;
      let next = index;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        next = index === last ? 0 : index + 1;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        next = index === 0 ? last : index - 1;
      } else if (event.key === "Home") {
        event.preventDefault();
        next = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        next = last;
      } else {
        return;
      }

      select(next);
      tabRefs.current[next]?.focus();
    },
    [chapters.length, select]
  );

  const progressRatio =
    chapters.length <= 1 ? 0 : activeIndex / (chapters.length - 1);

  return (
    <section className="site-section bg-white">
      <div className="site-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d8f5f]">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-[2rem] font-bold leading-tight text-[#111827] sm:text-[2.5rem]">
            {heading}
          </h2>
          <div
            className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[#0d8f5f]/50 to-transparent"
            aria-hidden
          />
        </div>

        <div className="mx-auto mt-10 max-w-6xl sm:mt-14">
          <div className="overflow-hidden rounded-[22px] border border-[#E5E7EB]/80 bg-[#F8FAFC] shadow-[0_16px_48px_rgba(15,23,42,0.05)] sm:rounded-[28px]">
            {/* Frise */}
            <div className="relative border-b border-[#E5E7EB]/70 px-3 py-6 sm:px-8 sm:py-10 lg:px-12">
              {/* Indices de scroll mobile */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-6 bg-gradient-to-r from-[#F8FAFC] to-transparent sm:hidden"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-6 bg-gradient-to-l from-[#F8FAFC] to-transparent sm:hidden"
                aria-hidden
              />
              <div
                role="tablist"
                aria-label="Chapitres de Notre histoire"
                className={cn(
                  "relative flex gap-2 overflow-x-auto overscroll-x-contain pb-1",
                  "snap-x snap-mandatory scroll-px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                  "touch-pan-x sm:gap-0 sm:overflow-visible sm:pb-0"
                )}
              >
                <div
                  className="pointer-events-none absolute top-8 right-[10%] left-[10%] hidden h-[2px] rounded-full bg-[#E5E7EB] sm:top-10 sm:block lg:top-11"
                  aria-hidden
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#0d8f5f] via-[#3CCB8A] to-[#4FD1A5]"
                    initial={false}
                    animate={{
                      width: `${progressRatio * 100}%`,
                    }}
                    transition={{ duration: reduceMotion ? 0 : 0.55, ease: EASE }}
                  />
                </div>

                {chapters.map((chapter, index) => {
                  const selected = index === activeIndex;
                  const completed = index < activeIndex;
                  const tabId = `${baseId}-tab-${chapter.id}`;
                  const panelId = `${baseId}-panel`;

                  return (
                    <div
                      key={chapter.id}
                      className="relative z-[1] flex w-[7.25rem] shrink-0 snap-center flex-col items-center px-1 sm:w-auto sm:min-w-0 sm:flex-1 sm:px-1.5"
                    >
                      <button
                        ref={(el) => {
                          tabRefs.current[index] = el;
                        }}
                        type="button"
                        role="tab"
                        id={tabId}
                        aria-selected={selected}
                        aria-controls={panelId}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => select(index)}
                        onKeyDown={(event) => onTabKeyDown(event, index)}
                        className={cn(
                          "group flex w-full flex-col items-center rounded-2xl px-1 py-1 text-center",
                          "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#0d8f5f]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC]"
                        )}
                      >
                        <ChapterStepMarker
                          index={index}
                          active={selected}
                          completed={completed}
                          imageSrc={chapter.imageSrc}
                          imageAlt={chapter.imageAlt}
                        />

                        <span
                          className={cn(
                            "mt-2.5 line-clamp-2 max-w-[6.75rem] font-heading text-[12px] font-semibold leading-snug tracking-tight sm:mt-3.5 sm:max-w-[9.5rem] sm:text-[15px] sm:text-base",
                            selected
                              ? "text-[#0d8f5f]"
                              : completed
                                ? "text-[#111827]"
                                : "text-[#6B7280] group-hover:text-[#111827]"
                          )}
                        >
                          {chapter.year}
                        </span>

                        <span
                          className={cn(
                            "mt-1.5 h-1 w-5 rounded-full transition-all duration-300 sm:mt-2 sm:w-6",
                            selected
                              ? "bg-[#0d8f5f] opacity-100"
                              : "bg-transparent opacity-0"
                          )}
                          aria-hidden
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-center text-[11px] text-[#9CA3AF] sm:hidden">
                Glissez pour voir tous les chapitres
              </p>
            </div>

            {/* Panneau descriptif */}
            <div
              role="tabpanel"
              id={`${baseId}-panel`}
              aria-labelledby={`${baseId}-tab-${active.id}`}
              className="bg-white px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
                  className={cn(
                    active.media ||
                      active.splitLayout ||
                      active.sidePhotos ||
                      active.asideImage?.src
                      ? "mx-auto max-w-5xl"
                      : "mx-auto max-w-xl text-left"
                  )}
                >
                  {active.splitLayout ? (
                    <SplitChapterPanel
                      year={active.year}
                      stageLabel={active.stageLabel}
                      layout={active.splitLayout}
                    />
                  ) : active.sidePhotos ? (
                    <div className="grid min-h-0 items-start gap-6 sm:gap-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-8 xl:gap-10">
                      <div className="flex justify-center lg:justify-start">
                        <StoryPhotoStack photos={active.sidePhotos.leftPhotos} />
                      </div>
                      <div className="min-w-0 text-left">
                        <ChapterTextContent chapter={active} />
                      </div>
                      <div className="flex justify-center lg:justify-end">
                        <StoryPhotoStack photos={active.sidePhotos.rightPhotos} />
                      </div>
                    </div>
                  ) : active.media ? (
                    <MediaChapterPanel chapter={active} media={active.media} />
                  ) : active.asideImage?.src ? (
                    <TextAsideImagePanel
                      chapter={active}
                      image={active.asideImage}
                    />
                  ) : (
                    <ChapterTextContent chapter={active} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
