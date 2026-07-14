"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Film, Images, MapPin, Play, ZoomIn } from "lucide-react";
import { HOME_EASE } from "@/components/home/scroll-reveal";
import { AlbumLightbox } from "@/components/gallery/album-lightbox";
import {
  GALLERY_FILTERS,
  imageMatchesFilter,
  MASONRY_ASPECT_RATIOS,
  parseImageMeta,
  type GalleryFilterId,
} from "@/components/gallery/gallery-filters";
import { isGalleryVideo } from "@/lib/gallery-media";
import { cn } from "@/lib/utils";

export type AlbumImageItem = {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  createdAt: string;
  kind?: "photo" | "video" | null;
  mimeType?: string | null;
  posterUrl?: string | null;
};

export type AlbumGalleryData = {
  title: string;
  description: string | null;
  createdAt: string;
  images: AlbumImageItem[];
};

interface AlbumGalleryProps {
  album: AlbumGalleryData;
}

function photoLabel(count: number) {
  return count === 1 ? "1 photo" : `${count} photos`;
}

function videoLabel(count: number) {
  return count === 1 ? "1 vidéo" : `${count} vidéos`;
}

function formatAlbumDate(value: string) {
  const formatted = format(new Date(value), "MMMM yyyy", { locale: fr });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatImageDate(value: string) {
  const formatted = format(new Date(value), "d MMM yyyy", { locale: fr });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function MasonryPhotoCard({
  image,
  albumTitle,
  index,
  inView,
  onOpen,
}: {
  image: AlbumImageItem;
  albumTitle: string;
  index: number;
  inView: boolean;
  onOpen: () => void;
}) {
  const meta = parseImageMeta(image.alt, `Photo ${index + 1}`);
  const aspectRatio = MASONRY_ASPECT_RATIOS[index % MASONRY_ASPECT_RATIOS.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.52, delay: (index % 12) * 0.05, ease: HOME_EASE }}
      className="mb-[18px] break-inside-avoid"
    >
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "group relative w-full overflow-hidden rounded-[19px] bg-[#F1F5F9] text-left",
          "shadow-[0_6px_24px_rgba(15,23,42,0.05)]",
          "transition-all duration-[380ms] ease-out",
          "hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-colibri-teal focus-visible:ring-offset-2"
        )}
        style={{ aspectRatio }}
        aria-label={`Ouvrir ${meta.name}`}
      >
        <Image
          src={image.url}
          alt={image.alt ?? albumTitle}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          className="object-cover transition-transform duration-[380ms] ease-out group-hover:scale-[1.03]"
        />

        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent",
            "opacity-100 transition-opacity duration-[380ms] ease-out sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100"
          )}
          aria-hidden
        />

        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 p-4",
            "translate-y-0 opacity-100 transition-all duration-[380ms] ease-out",
            "sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100"
          )}
        >
          <p className="font-heading text-[15px] font-semibold leading-snug text-white sm:text-base">
            {meta.name}
          </p>
          {meta.location ? (
            <p className="mt-1 flex items-center gap-1.5 text-[12px] text-white/75">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden />
              {meta.location}
            </p>
          ) : null}
          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-white/65">
            <Calendar className="h-3 w-3 shrink-0" aria-hidden />
            {formatImageDate(image.createdAt)}
          </p>
        </div>

        <span
          className={cn(
            "pointer-events-none absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full",
            "border border-white/35 bg-white/80 text-[#111827] shadow-sm backdrop-blur-md",
            "translate-y-0 opacity-100 transition-all duration-[380ms] ease-out",
            "sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100"
          )}
          aria-hidden
        >
          <ZoomIn className="h-4 w-4" />
        </span>
      </button>
    </motion.article>
  );
}

function AlbumVideoCard({
  video,
  index,
  inView,
}: {
  video: AlbumImageItem;
  index: number;
  inView: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const title = video.alt?.trim() || `Vidéo ${index + 1}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.48, delay: index * 0.06, ease: HOME_EASE }}
      className="overflow-hidden rounded-[19px] border border-[#E8EDF3] bg-[#0f172a] shadow-[0_6px_24px_rgba(15,23,42,0.06)]"
    >
      <div className="relative aspect-video">
        {playing ? (
          <video
            className="absolute inset-0 h-full w-full object-contain bg-black"
            src={video.url}
            poster={video.posterUrl || undefined}
            controls
            playsInline
            autoPlay
            preload="metadata"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 w-full cursor-pointer p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-colibri-teal focus-visible:ring-offset-2"
            aria-label={`Lire : ${title}`}
          >
            {video.posterUrl ? (
              <Image
                src={video.posterUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={`${video.url}#t=0.1`}
                muted
                playsInline
                preload="metadata"
                aria-hidden
              />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-colibri-teal shadow-lg transition duration-300 group-hover:scale-105">
                <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
              </span>
            </span>
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[11px] text-white">
              <Film className="h-3 w-3" />
              Vidéo
            </span>
          </button>
        )}
      </div>
      <div className="border-t border-white/10 bg-[#111827] px-4 py-3">
        <p className="truncate text-sm font-medium text-white">{title}</p>
        <p className="mt-0.5 text-xs text-white/55">
          {formatImageDate(video.createdAt)}
        </p>
      </div>
    </motion.article>
  );
}

export function AlbumGallery({ album }: AlbumGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<GalleryFilterId>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const photosRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);
  const photosInView = useInView(photosRef, { once: true, amount: 0.08 });
  const videosInView = useInView(videosRef, { once: true, amount: 0.08 });

  const photos = useMemo(
    () => album.images.filter((item) => !isGalleryVideo(item)),
    [album.images]
  );
  const videos = useMemo(
    () => album.images.filter((item) => isGalleryVideo(item)),
    [album.images]
  );

  const filteredPhotos = useMemo(
    () =>
      photos.filter((image) =>
        imageMatchesFilter(activeFilter, image.alt, album.title)
      ),
    [activeFilter, photos, album.title]
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className="site-section bg-white">
        <div className="site-container">
          <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-[#6B7280]">
            <span className="inline-flex items-center gap-2">
              <Images className="h-4 w-4 text-colibri-teal" aria-hidden />
              {photoLabel(photos.length)}
            </span>
            {videos.length > 0 ? (
              <span className="inline-flex items-center gap-2">
                <Film className="h-4 w-4 text-colibri-teal" aria-hidden />
                {videoLabel(videos.length)}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-colibri-teal" aria-hidden />
              {formatAlbumDate(album.createdAt)}
            </span>
          </div>

          {videos.length > 0 ? (
            <div className="mb-12 sm:mb-14">
              <h2 className="mb-5 font-heading text-xl font-semibold text-colibri-blue sm:text-2xl">
                Vidéos
              </h2>
              <div
                ref={videosRef}
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >
                {videos.map((video, index) => (
                  <AlbumVideoCard
                    key={video.id}
                    video={video}
                    index={index}
                    inView={videosInView}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <h2 className="mb-5 font-heading text-xl font-semibold text-colibri-blue sm:text-2xl">
              Photos
            </h2>

            <div className="mb-8 flex flex-wrap gap-2 sm:mb-10">
              {GALLERY_FILTERS.map((filter) => {
                const isActive = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={cn(
                      "relative overflow-hidden rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-colibri-teal focus-visible:ring-offset-2",
                      isActive
                        ? "text-white"
                        : "border border-[#E8EDF3] bg-white text-[#4B5563] hover:border-[#D7DEE8] hover:text-colibri-blue"
                    )}
                    aria-pressed={isActive}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="album-gallery-filter"
                        className="absolute inset-0 rounded-full bg-colibri-blue"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    ) : null}
                    <span className="relative z-10">{filter.label}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {filteredPhotos.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: HOME_EASE }}
                  className="py-16 text-center text-[15px] text-[#6B7280]"
                >
                  {photos.length === 0
                    ? "Aucune photo dans cet album pour le moment."
                    : "Aucune photo dans cette catégorie pour le moment."}
                </motion.p>
              ) : (
                <motion.div
                  key={activeFilter}
                  ref={photosRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="columns-1 [column-gap:18px] sm:columns-2 lg:columns-3 xl:columns-4"
                >
                  {filteredPhotos.map((image, index) => (
                    <MasonryPhotoCard
                      key={image.id}
                      image={image}
                      albumTitle={album.title}
                      index={index}
                      inView={photosInView}
                      onOpen={() => openLightbox(index)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <AlbumLightbox
        images={filteredPhotos}
        albumTitle={album.title}
        currentIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
