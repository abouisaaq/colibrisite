"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Trash2 } from "lucide-react";
import type { ArticleImageItem } from "@/components/admin/rich-text/article-image-types";

export function ArticleImageBlockView({
  node,
  deleteNode,
  selected,
}: NodeViewProps) {
  const images = (node.attrs.images || []) as ArticleImageItem[];
  const isCarousel = node.type.name === "imageCarousel";

  return (
    <NodeViewWrapper
      className={
        selected
          ? "my-4 rounded-xl ring-2 ring-[#14B8A6] ring-offset-2"
          : "my-4"
      }
      data-drag-handle
    >
      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] bg-white px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            {isCarousel
              ? `Carrousel · ${images.length} photo${images.length > 1 ? "s" : ""}`
              : `Rangée · ${images.length} photo${images.length > 1 ? "s" : ""}`}
          </p>
          <button
            type="button"
            onClick={deleteNode}
            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-[#EF4444] transition-colors hover:bg-[#FEF2F2]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Supprimer
          </button>
        </div>

        {isCarousel ? (
          <div className="flex gap-2 overflow-x-auto p-3">
            {images.map((img, index) => (
              <div
                key={`${img.src}-${index}`}
                className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg bg-[#E2E8F0]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt || ""}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-1.5 top-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="grid gap-2 p-3"
            style={{
              gridTemplateColumns: `repeat(${Math.min(images.length || 1, 4)}, minmax(0, 1fr))`,
            }}
          >
            {images.map((img, index) => (
              <div
                key={`${img.src}-${index}`}
                className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#E2E8F0]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt || ""}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
