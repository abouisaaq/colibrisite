"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import { formatDate, formatCountdown, cn } from "@/lib/utils";
import {
  getEventTypePresentation,
  DEFAULT_EVENT_TYPE_PRESENTATION,
} from "@/lib/event-type-styles";
import { HOME_EASE } from "@/components/home/scroll-reveal";

export type EventListItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string | null;
  status: string;
  eventType: { name: string; color: string } | null;
};

interface EventsListingProps {
  events: EventListItem[];
}

const STATUS_LABELS: Record<string, string> = {
  UPCOMING: "À venir",
  ONGOING: "En cours",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

function EventDateBadge({
  date,
  color,
  size = "md",
}: {
  date: Date;
  color: string;
  size?: "md" | "lg";
}) {
  const presentation = getEventTypePresentation("Événement", color);
  const large = size === "lg";

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center justify-center rounded-[1.25rem] px-3 text-white shadow-[0_12px_32px_rgba(15,23,42,0.14)]",
        large ? "h-[120px] w-[100px] sm:h-[132px] sm:w-[110px]" : "h-[88px] w-[72px] sm:h-[100px] sm:w-[80px]"
      )}
      style={presentation.dateBgStyle}
    >
      <span className={cn("font-semibold uppercase tracking-[0.14em]", large ? "text-[11px]" : "text-[10px]")}>
        {date.toLocaleDateString("fr-FR", { month: "short" })}
      </span>
      <span className={cn("mt-1 font-bold leading-none", large ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl")}>
        {date.getDate()}
      </span>
      <span className={cn("mt-1.5 opacity-90", large ? "text-[12px]" : "text-[11px]")}>
        {date.getFullYear()}
      </span>
    </div>
  );
}

function FeaturedEvent({ event }: { event: EventListItem }) {
  const date = new Date(event.startDate);
  const typeConfig = event.eventType
    ? getEventTypePresentation(event.eventType.name, event.eventType.color)
    : DEFAULT_EVENT_TYPE_PRESENTATION;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border border-[#E8EDF3]",
        "bg-gradient-to-br from-white via-white to-[#F8FAFC]",
        "shadow-[0_14px_48px_rgba(15,23,42,0.07)]",
        "transition-all duration-[400ms] ease-out",
        "hover:-translate-y-1.5 hover:shadow-[0_28px_64px_rgba(15,23,42,0.12)]"
      )}
    >
      {/* Soft color atmosphere — no photo slot */}
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl opacity-40 transition-opacity duration-500 group-hover:opacity-60"
        style={{ backgroundColor: typeConfig.color }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: typeConfig.color }}
        aria-hidden
      />

      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${typeConfig.color}, ${typeConfig.color}40, transparent)`,
        }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8 lg:p-10">
        <EventDateBadge date={date} color={typeConfig.color} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              <Sparkles className="h-3.5 w-3.5 text-[#42D7C8]" aria-hidden />
              Prochain rendez-vous
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold"
              style={typeConfig.badgeStyle}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={typeConfig.dotStyle} />
              {typeConfig.label}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8EDF3] bg-white/80 px-2.5 py-1.5 text-[11px] font-semibold text-colibri-teal backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {formatCountdown(event.startDate)}
            </span>
          </div>

          <h2 className="font-heading mt-4 text-[1.7rem] font-bold leading-[1.15] tracking-tight text-[#0F172A] sm:text-[2rem] lg:text-[2.35rem]">
            {event.title}
          </h2>

          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#64748B] sm:text-base">
            {event.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E8EDF3] bg-white/90 px-3.5 py-2 text-[13px] font-medium text-[#334155] shadow-sm">
              <Calendar className="h-4 w-4 text-colibri-teal" aria-hidden />
              {formatDate(event.startDate)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E8EDF3] bg-white/90 px-3.5 py-2 text-[13px] font-medium text-[#334155] shadow-sm">
              <MapPin className="h-4 w-4 text-colibri-teal" aria-hidden />
              {event.location}
            </span>
            <span className="inline-flex items-center rounded-full bg-[#F1F5F9] px-3.5 py-2 text-[12px] font-medium text-[#64748B]">
              {STATUS_LABELS[event.status] ?? event.status}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function EventRow({
  event,
  index,
  inView,
}: {
  event: EventListItem;
  index: number;
  inView: boolean;
}) {
  const date = new Date(event.startDate);
  const typeConfig = event.eventType
    ? getEventTypePresentation(event.eventType.name, event.eventType.color)
    : DEFAULT_EVENT_TYPE_PRESENTATION;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: HOME_EASE }}
      className={cn(
        "group relative flex gap-4 overflow-hidden rounded-[1.25rem] border border-[#E8EDF3] bg-white p-3.5 sm:gap-5 sm:p-4",
        "shadow-[0_6px_24px_rgba(15,23,42,0.04)]",
        "transition-all duration-[380ms] ease-out",
        "hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]"
      )}
    >
      <div
        className="absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: typeConfig.color }}
        aria-hidden
      />

      <EventDateBadge date={date} color={typeConfig.color} />

      <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={typeConfig.badgeStyle}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={typeConfig.dotStyle} />
            {typeConfig.label}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-colibri-teal">
            <Clock className="h-3 w-3" aria-hidden />
            {formatCountdown(event.startDate)}
          </span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-[#111827] sm:text-base">
          {event.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#64748B]">
          {event.description}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#94A3B8]">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            {formatDate(event.startDate)}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{event.location}</span>
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function EventsListing({ events }: EventsListingProps) {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const listRef = useRef<HTMLDivElement>(null);
  const inView = useInView(listRef, { once: true, amount: 0.08 });

  const typeFilters = useMemo(() => {
    const names = Array.from(
      new Set(
        events
          .map((event) => event.eventType?.name)
          .filter((name): name is string => Boolean(name))
      )
    );
    return ["Tous", "À venir", "Passés", ...names];
  }, [events]);

  const filtered = useMemo(() => {
    const now = Date.now();

    return events.filter((event) => {
      const start = new Date(event.startDate).getTime();

      if (activeFilter === "Tous") return true;
      if (activeFilter === "À venir") return start >= now;
      if (activeFilter === "Passés") return start < now;
      return event.eventType?.name === activeFilter;
    });
  }, [activeFilter, events]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }, [filtered]);

  const featured = useMemo(() => {
    const now = Date.now();
    const upcoming = sorted.find((event) => new Date(event.startDate).getTime() >= now);
    return upcoming ?? sorted[0];
  }, [sorted]);

  const rest = useMemo(() => {
    if (!featured) return [];
    return sorted.filter((event) => event.id !== featured.id);
  }, [sorted, featured]);

  if (events.length === 0) {
    return (
      <p className="py-16 text-center text-[15px] text-[#6B7280]">
        Aucun événement prévu pour le moment.
      </p>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-wrap gap-2">
        {typeFilters.map((filter) => {
          const isActive = activeFilter === filter;
          const typeEvent = events.find((event) => event.eventType?.name === filter);
          const accent = typeEvent?.eventType?.color ?? "#26a69a";

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
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
                  layoutId="events-filter"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10">{filter}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: HOME_EASE }}
          className="space-y-6 sm:space-y-8"
        >
          {featured ? <FeaturedEvent event={featured} /> : null}

          {rest.length > 0 ? (
            <div ref={listRef} className="grid gap-4 lg:grid-cols-2 lg:gap-5">
              {rest.map((event, index) => (
                <EventRow key={event.id} event={event} index={index} inView={inView} />
              ))}
            </div>
          ) : null}

          {!featured ? (
            <p className="py-12 text-center text-[15px] text-[#6B7280]">
              Aucun événement dans ce filtre.
            </p>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
