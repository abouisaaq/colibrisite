"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Images } from "lucide-react";
import { HOME_EASE } from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

export type GalleryAlbumItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  _count: { images: number };
};

interface GalleryAlbumGridProps {
  albums: GalleryAlbumItem[];
}

function photoLabel(count: number): string {
  return count === 1 ? "1 photo" : `${count} photos`;
}

function GalleryAlbumCard({
  album,
  index,
  inView,
}: {
  album: GalleryAlbumItem;
  index: number;
  inView: boolean;
}) {
  const count = album._count.images;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: HOME_EASE }}
    >
      <Link href={`/galerie/${album.slug}`} className="group block h-full">
        <article
          className={cn(
            "flex h-full flex-col overflow-hidden rounded-[22px] border border-[#E8EDF3] bg-white",
            "shadow-[0_8px_30px_rgba(15,23,42,0.06)]",
            "transition-all duration-[400ms] ease-out",
            "hover:-translate-y-2 hover:shadow-[0_24px_52px_rgba(15,23,42,0.12)]"
          )}
        >
          <div className="relative h-[168px] shrink-0 overflow-hidden bg-[#F1F5F9] sm:h-[172px]">
            {album.coverUrl ? (
              <Image
                src={album.coverUrl}
                alt={album.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.08]"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Images className="h-10 w-10 text-[#94A3B8]" strokeWidth={1.5} />
              </div>
            )}

            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-[rgba(0,0,0,0.15)] to-transparent"
              aria-hidden
            />

            <span
              className={cn(
                "absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full",
                "border border-white/50 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-[#111827]",
                "shadow-[0_4px_16px_rgba(15,23,42,0.08)] backdrop-blur-md"
              )}
            >
              <span aria-hidden>📷</span>
              {photoLabel(count)}
            </span>

            <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:pr-28">
              <h3 className="font-heading text-[1.125rem] font-semibold leading-snug tracking-tight text-white sm:text-xl">
                {album.title}
              </h3>
              <p className="mt-1 text-[13px] text-white/70">
                <span aria-hidden>📷 </span>
                {photoLabel(count)}
              </p>
            </div>

            <span
              className={cn(
                "absolute bottom-4 right-4 z-10 hidden items-center gap-1.5 text-[13px] font-semibold text-white sm:inline-flex",
                "translate-x-2 opacity-0 transition-all duration-[400ms] ease-out",
                "sm:group-hover:translate-x-0 sm:group-hover:opacity-100"
              )}
            >
              Voir l&apos;album
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-[400ms] group-hover:translate-x-0.5" />
            </span>
          </div>

          <div className="flex min-h-[4.75rem] flex-1 flex-col justify-center px-5 py-4">
            {album.description ? (
              <p className="line-clamp-2 text-[14px] leading-relaxed text-[#374151]">
                {album.description}
              </p>
            ) : (
              <p className="line-clamp-2 text-[14px] leading-relaxed text-transparent" aria-hidden>
                &nbsp;
              </p>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export function GalleryAlbumGrid({ albums }: GalleryAlbumGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.12 });

  if (albums.length === 0) {
    return (
      <p className="py-12 text-center text-[15px] text-[#6B7280]">
        Aucun album pour le moment.
      </p>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8"
    >
      {albums.map((album, index) => (
        <GalleryAlbumCard key={album.id} album={album} index={index} inView={inView} />
      ))}
    </div>
  );
}
