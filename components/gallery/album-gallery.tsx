"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Images, MapPin, ZoomIn } from "lucide-react";
import { HOME_EASE } from "@/components/home/scroll-reveal";
import { AlbumLightbox } from "@/components/gallery/album-lightbox";
import {
  GALLERY_FILTERS,
  imageMatchesFilter,
  MASONRY_ASPECT_RATIOS,
  parseImageMeta,
  type GalleryFilterId,
} from "@/components/gallery/gallery-filters";
import { cn } from "@/lib/utils";

export type AlbumImageItem = {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  createdAt: string;
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

export function AlbumGallery({ album }: AlbumGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<GalleryFilterId>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.08 });

  const filteredImages = useMemo(
    () =>
      album.images.filter((image) =>
        imageMatchesFilter(activeFilter, image.alt, album.title)
      ),
    [activeFilter, album.images, album.title]
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
              {photoLabel(album.images.length)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-colibri-teal" aria-hidden />
              {formatAlbumDate(album.createdAt)}
            </span>
          </div>

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
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative z-10">{filter.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {filteredImages.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: HOME_EASE }}
                className="py-16 text-center text-[15px] text-[#6B7280]"
              >
                Aucune photo dans cette catégorie pour le moment.
              </motion.p>
            ) : (
              <motion.div
                key={activeFilter}
                ref={gridRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="columns-1 [column-gap:18px] sm:columns-2 lg:columns-3 xl:columns-4"
              >
                {filteredImages.map((image, index) => (
                  <MasonryPhotoCard
                    key={image.id}
                    image={image}
                    albumTitle={album.title}
                    index={index}
                    inView={inView}
                    onOpen={() => openLightbox(index)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <AlbumLightbox
        images={filteredImages}
        albumTitle={album.title}
        currentIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
