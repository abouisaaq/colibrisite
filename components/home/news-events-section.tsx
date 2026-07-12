"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { formatDate, formatCountdown } from "@/lib/utils";
import { getEventTypePresentation, DEFAULT_EVENT_TYPE_PRESENTATION } from "@/lib/event-type-styles";
import { MapPin, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/home/section-header";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string | null;
  createdAt: Date;
  category: string;
}

interface Event {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  location: string;
  eventType: {
    name: string;
    color: string;
  } | null;
}

interface NewsEventsSectionProps {
  articles: Article[];
  events: Event[];
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group block overflow-hidden rounded-[1.25rem] border border-[#E5E7EB]/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="relative h-32 overflow-hidden bg-[#F1F5F9] sm:h-36">
        {article.imageUrl && (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="rounded-full bg-[#F0FDFA] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0D9488]">
            {article.category}
          </span>
          <span className="text-[11px] text-[#9CA3AF]">{formatDate(article.createdAt)}</span>
        </div>
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[#111827] transition-transform duration-300 ease-out group-hover:-translate-y-[3px]">
          {article.title}
        </h3>
        <p className="mt-1.5 line-clamp-1 text-sm text-[#6B7280]">{article.excerpt}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#42D7C8]">
          Lire l&apos;article
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function EventCard({ event }: { event: Event }) {
  const date = new Date(event.startDate);
  const typeConfig = event.eventType
    ? getEventTypePresentation(event.eventType.name, event.eventType.color)
    : DEFAULT_EVENT_TYPE_PRESENTATION;

  return (
    <Link
      href="/evenements"
      className="group flex h-[96px] items-center gap-3.5 rounded-[1rem] border border-[#E5E7EB]/80 bg-[#F8FAFC] p-3.5 transition-all duration-300 hover:-translate-y-[5px] hover:border-[#42D7C8] hover:bg-white hover:shadow-xl"
    >
      <div
        className="flex h-[64px] w-[52px] shrink-0 flex-col items-center justify-center rounded-lg px-2 text-white"
        style={typeConfig.dateBgStyle}
      >
        <span className="text-[10px] font-semibold uppercase leading-none">
          {date.toLocaleDateString("fr-FR", { month: "short" })}
        </span>
        <span className="mt-1 text-xl font-bold leading-none">{date.getDate()}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="flex h-[18px] items-center gap-2 overflow-hidden">
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none"
            style={typeConfig.badgeStyle}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={typeConfig.dotStyle} />
            {typeConfig.label}
          </span>
          <span className="truncate text-[11px] font-semibold leading-none text-[#42D7C8]">
            {formatCountdown(event.startDate)}
          </span>
        </div>
        <h3 className="line-clamp-2 h-9 text-[15px] font-semibold leading-[18px] text-[#111827]">
          {event.title}
        </h3>
        <div className="flex h-4 items-center gap-1 text-xs leading-none text-[#6B7280]">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
    </Link>
  );
}

export function NewsEventsSection({ articles, events }: NewsEventsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.12 });

  return (
    <section ref={sectionRef} className="site-section bg-white">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <div className="mb-8 flex items-end justify-between gap-4">
              <SectionHeader
                eyebrow="Actualités"
                title="Nos dernières nouvelles"
                align="left"
                className="max-w-none"
              />
              <Link
                href="/actualites"
                className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[#42D7C8] transition-colors hover:text-[#3CCB8A] sm:inline-flex"
              >
                Toutes les actualités <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {articles.slice(0, 4).map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.12 + i * 0.1, ease: EASE }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </div>

            <Link
              href="/actualites"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#42D7C8] hover:text-[#3CCB8A] sm:hidden"
            >
              Toutes les actualités <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            className="lg:max-w-[300px] lg:justify-self-end"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
          >
            <SectionHeader
              eyebrow="Agenda"
              title="Prochains événements"
              align="left"
              className="mb-6 max-w-none [&_h2]:text-2xl [&_h2]:lg:text-[1.65rem]"
            />

            <div className="space-y-3">
              {events.slice(0, 4).map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 32 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.18 + i * 0.1, ease: EASE }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>

            <Link
              href="/evenements"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#42D7C8] hover:text-[#3CCB8A]"
            >
              Voir tous les événements <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
