"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleImageItem } from "@/components/admin/rich-text/article-image-types";

type ContentPart =
  | { type: "html"; html: string }
  | { type: "carousel"; images: ArticleImageItem[]; key: string };

function parseImages(el: Element): ArticleImageItem[] {
  const raw = el.getAttribute("data-images");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as ArticleImageItem[];
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => item?.src);
      }
    } catch {
      /* ignore */
    }
  }
  return Array.from(el.querySelectorAll("img")).map((img) => ({
    src: img.getAttribute("src") || "",
    alt: img.getAttribute("alt") || "",
  }));
}

function splitArticleHtml(html: string): ContentPart[] {
  if (typeof window === "undefined") {
    return [{ type: "html", html }];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const parts: ContentPart[] = [];
  let htmlBuffer = "";

  const flushHtml = () => {
    if (!htmlBuffer.trim()) {
      htmlBuffer = "";
      return;
    }
    parts.push({ type: "html", html: htmlBuffer });
    htmlBuffer = "";
  };

  Array.from(doc.body.childNodes).forEach((node, index) => {
    if (node.nodeType === 1) {
      const el = node as HTMLElement;
      if (el.getAttribute("data-type") === "image-carousel") {
        flushHtml();
        parts.push({
          type: "carousel",
          images: parseImages(el),
          key: `carousel-${index}`,
        });
        return;
      }
      htmlBuffer += el.outerHTML;
      return;
    }
    if (node.nodeType === 3) {
      htmlBuffer += node.textContent || "";
    }
  });

  flushHtml();
  return parts.length > 0 ? parts : [{ type: "html", html }];
}

function ArticleCarousel({ images }: { images: ArticleImageItem[] }) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  if (count === 0) return null;

  const current = images[Math.min(index, count - 1)]!;

  const go = (next: number) => {
    setIndex(((next % count) + count) % count);
  };

  return (
    <div className="article-carousel-react not-prose my-8">
      <div className="relative overflow-hidden rounded-2xl bg-[#0F172A]/5 shadow-md">
        <div className="relative aspect-[16/10] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.alt || ""}
            className="h-full w-full object-cover"
          />
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Photo précédente"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F172A] shadow-md transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Photo suivante"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F172A] shadow-md transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Aller à la photo ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 w-2 rounded-full transition",
                    i === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <p className="mt-2 text-center text-sm text-[#94A3B8]">
          {index + 1} / {count}
        </p>
      ) : null}
    </div>
  );
}

const ARTICLE_PROSE_CLASS =
  "article-content prose prose-lg max-w-none leading-relaxed text-[#475569] " +
  "prose-headings:font-heading prose-headings:text-[#0F172A] prose-headings:font-bold " +
  "prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl " +
  "prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl " +
  "prose-p:mb-4 prose-a:text-colibri-teal prose-a:no-underline hover:prose-a:underline " +
  "prose-img:my-8 prose-img:rounded-2xl prose-img:shadow-md " +
  "prose-blockquote:border-l-colibri-teal prose-blockquote:text-[#64748B] " +
  "prose-ul:my-4 prose-ol:my-4 " +
  "[&_img]:h-auto [&_img]:max-w-full";

export function ArticleContent({ html }: { html: string }) {
  const [parts, setParts] = useState<ContentPart[]>([{ type: "html", html }]);

  useEffect(() => {
    setParts(splitArticleHtml(html));
  }, [html]);

  return (
    <div className={ARTICLE_PROSE_CLASS}>
      {parts.map((part, i) =>
        part.type === "html" ? (
          <div
            key={`html-${i}`}
            dangerouslySetInnerHTML={{ __html: part.html }}
          />
        ) : (
          <ArticleCarousel key={part.key} images={part.images} />
        )
      )}
    </div>
  );
}
