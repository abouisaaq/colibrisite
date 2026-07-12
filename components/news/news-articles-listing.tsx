"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { HOME_EASE } from "@/components/home/scroll-reveal";

export type NewsArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string | null;
  category: string;
  createdAt: string;
};

interface NewsArticlesListingProps {
  articles: NewsArticleItem[];
}

const CATEGORY_STYLES: Record<
  string,
  { badge: string; bar: string; soft: string; glow: string }
> = {
  Atelier: {
    badge: "bg-[#3B82F6]/10 text-[#2563EB]",
    bar: "from-[#3B82F6] to-[#6366F1]",
    soft: "from-[#3B82F6]/[0.12] via-[#3B82F6]/[0.04] to-transparent",
    glow: "bg-[#3B82F6]/20",
  },
  Collecte: {
    badge: "bg-[#F59E0B]/10 text-[#D97706]",
    bar: "from-[#F59E0B] to-[#F97316]",
    soft: "from-[#F59E0B]/[0.12] via-[#F59E0B]/[0.04] to-transparent",
    glow: "bg-[#F59E0B]/20",
  },
  Partenariat: {
    badge: "bg-[#8B5CF6]/10 text-[#7C3AED]",
    bar: "from-[#8B5CF6] to-[#A855F7]",
    soft: "from-[#8B5CF6]/[0.12] via-[#8B5CF6]/[0.04] to-transparent",
    glow: "bg-[#8B5CF6]/20",
  },
  Événement: {
    badge: "bg-[#EC4899]/10 text-[#DB2777]",
    bar: "from-[#EC4899] to-[#F472B6]",
    soft: "from-[#EC4899]/[0.12] via-[#EC4899]/[0.04] to-transparent",
    glow: "bg-[#EC4899]/20",
  },
  Actualité: {
    badge: "bg-[#06B6D4]/10 text-[#0891B2]",
    bar: "from-[#06B6D4] to-[#22D3EE]",
    soft: "from-[#06B6D4]/[0.12] via-[#06B6D4]/[0.04] to-transparent",
    glow: "bg-[#06B6D4]/20",
  },
};

const DEFAULT_STYLE = {
  badge: "bg-[#14B8A6]/10 text-[#0D9488]",
  bar: "from-[#14B8A6] to-[#2DD4BF]",
  soft: "from-[#14B8A6]/[0.12] via-[#14B8A6]/[0.04] to-transparent",
  glow: "bg-[#14B8A6]/20",
};

function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category] ?? DEFAULT_STYLE;
}

function FeaturedArticle({ article }: { article: NewsArticleItem }) {
  const style = getCategoryStyle(article.category);

  return (
    <Link
      href={`/actualites/${article.slug}`}
      className={cn(
        "group relative grid overflow-hidden rounded-[1.5rem] border border-[#E8EDF3] bg-white",
        "shadow-[0_10px_40px_rgba(15,23,42,0.06)]",
        "transition-all duration-[400ms] ease-out",
        "hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(15,23,42,0.12)]",
        "lg:grid-cols-[1.15fr_1fr]"
      )}
    >
      <div className="relative min-h-[240px] overflow-hidden bg-[#F1F5F9] sm:min-h-[280px] lg:min-h-[340px]">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-transform duration-[500ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-br", style.soft)} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/10" />
        <span
          className={cn(
            "absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-md",
            "border border-white/40 bg-white/85 text-[#111827]"
          )}
        >
          À la une
        </span>
      </div>

      <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <span
          className={cn(
            "absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-gradient-to-b transition-transform duration-500 group-hover:scale-y-100",
            style.bar
          )}
          aria-hidden
        />

        <div className="flex flex-wrap items-center gap-2.5">
          <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", style.badge)}>
            {article.category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            {formatDate(article.createdAt)}
          </span>
        </div>

        <h2 className="font-heading mt-4 text-[1.65rem] font-bold leading-tight tracking-tight text-[#111827] sm:text-[1.9rem] lg:text-[2.15rem]">
          {article.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-[#64748B] sm:text-base">
          {article.excerpt}
        </p>

        <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-colibri-teal transition-all duration-300 group-hover:gap-3">
          Lire l&apos;article
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function ArticleRow({
  article,
  index,
  inView,
}: {
  article: NewsArticleItem;
  index: number;
  inView: boolean;
}) {
  const style = getCategoryStyle(article.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: HOME_EASE }}
    >
      <Link
        href={`/actualites/${article.slug}`}
        className={cn(
          "group relative flex gap-4 overflow-hidden rounded-[1.25rem] border border-[#E8EDF3] bg-white p-3 sm:gap-5 sm:p-4",
          "shadow-[0_6px_24px_rgba(15,23,42,0.04)]",
          "transition-all duration-[380ms] ease-out",
          "hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]"
        )}
      >
        <span
          className={cn(
            "absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-[400ms] group-hover:scale-x-100",
            style.bar
          )}
          aria-hidden
        />

        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[1rem] bg-[#F1F5F9] sm:h-[108px] sm:w-[120px]">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              sizes="120px"
              className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.08]"
            />
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center bg-gradient-to-br",
                style.soft
              )}
            >
              <Newspaper className="h-7 w-7 text-[#94A3B8]" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", style.badge)}>
              {article.category}
            </span>
            <span className="text-[11px] text-[#94A3B8]">{formatDate(article.createdAt)}</span>
          </div>

          <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-[#111827] sm:text-base">
            {article.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#64748B]">
            {article.excerpt}
          </p>

          <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-colibri-teal opacity-0 transition-all duration-300 group-hover:opacity-100 sm:mt-2.5">
            Lire
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function NewsArticlesListing({ articles }: NewsArticlesListingProps) {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const listRef = useRef<HTMLDivElement>(null);
  const inView = useInView(listRef, { once: true, amount: 0.08 });

  const categories = useMemo(() => {
    const unique = Array.from(new Set(articles.map((article) => article.category)));
    return ["Tous", ...unique];
  }, [articles]);

  const filtered = useMemo(() => {
    if (activeCategory === "Tous") return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [activeCategory, articles]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  if (articles.length === 0) {
    return (
      <p className="py-16 text-center text-[15px] text-[#6B7280]">
        Aucun article pour le moment.
      </p>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const style = category === "Tous" ? DEFAULT_STYLE : getCategoryStyle(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
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
                  layoutId="news-category-filter"
                  className={cn("absolute inset-0 rounded-full bg-gradient-to-r", style.bar)}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10">{category}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: HOME_EASE }}
          className="space-y-6 sm:space-y-8"
        >
          {featured ? <FeaturedArticle article={featured} /> : null}

          {rest.length > 0 ? (
            <div ref={listRef} className="grid gap-4 lg:grid-cols-2 lg:gap-5">
              {rest.map((article, index) => (
                <ArticleRow
                  key={article.id}
                  article={article}
                  index={index}
                  inView={inView}
                />
              ))}
            </div>
          ) : null}

          {!featured ? (
            <p className="py-12 text-center text-[15px] text-[#6B7280]">
              Aucun article dans cette catégorie.
            </p>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
