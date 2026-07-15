"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Trash2 } from "lucide-react";
import type {
  ImageAlign,
  MediaItemAspect,
  MediaObjectFit,
} from "@/components/admin/rich-text/article-image-types";
import type { ArticleImageItem } from "@/components/admin/rich-text/article-image-types";

function aspectClass(aspect: MediaItemAspect): string {
  if (aspect === "auto") return "h-auto min-h-[120px]";
  if (aspect === "4/3") return "aspect-[4/3]";
  if (aspect === "1/1") return "aspect-square";
  if (aspect === "16/9") return "aspect-video";
  return "aspect-[16/10]";
}

export function ArticleImageBlockView({
  node,
  deleteNode,
  selected,
}: NodeViewProps) {
  const images = (node.attrs.images || []) as ArticleImageItem[];
  const isCarousel = node.type.name === "imageCarousel";
  const width = (node.attrs.width as string) || "100%";
  const align = (node.attrs.align as ImageAlign) || "center";
  const itemAspect = (node.attrs.itemAspect as MediaItemAspect) || "16/10";
  const objectFit = (node.attrs.objectFit as MediaObjectFit) || "contain";

  return (
    <NodeViewWrapper
      className={
        selected
          ? "my-4 rounded-xl ring-2 ring-[#14B8A6] ring-offset-2"
          : "my-4"
      }
      data-drag-handle
      style={{
        width,
        maxWidth: "100%",
        marginLeft: align === "left" ? 0 : align === "right" ? "auto" : "auto",
        marginRight: align === "right" ? 0 : align === "left" ? "auto" : "auto",
      }}
    >
      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] bg-white px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            {isCarousel
              ? `Carrousel · ${images.length} photo${images.length > 1 ? "s" : ""}`
              : `Rangée · ${images.length} photo${images.length > 1 ? "s" : ""}`}
            {" · "}
            {width} · {itemAspect} · {objectFit}
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
                className={`relative w-44 shrink-0 overflow-hidden rounded-lg bg-[#E2E8F0] ${aspectClass(itemAspect)}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt || ""}
                  className="h-full w-full"
                  style={{ objectFit }}
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
                className={`relative overflow-hidden rounded-lg bg-[#E2E8F0] ${aspectClass(itemAspect)}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt || ""}
                  className="h-full w-full"
                  style={{ objectFit }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
