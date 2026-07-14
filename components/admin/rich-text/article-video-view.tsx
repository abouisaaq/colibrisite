"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Film, Trash2, Video } from "lucide-react";
import type { ArticleVideoAspect } from "@/components/admin/rich-text/article-video-types";
import { cn } from "@/lib/utils";

function aspectClass(aspect: ArticleVideoAspect): string {
  switch (aspect) {
    case "4/3":
      return "aspect-[4/3]";
    case "1/1":
      return "aspect-square";
    case "9/16":
      return "aspect-[9/16]";
    default:
      return "aspect-video";
  }
}

export function ArticleVideoView({ node, deleteNode, selected }: NodeViewProps) {
  const src = (node.attrs.src as string) || "";
  const youtubeId = (node.attrs.youtubeId as string) || "";
  const poster = (node.attrs.poster as string) || "";
  const width = (node.attrs.width as string) || "100%";
  const align = (node.attrs.align as string) || "center";
  const aspect = (node.attrs.aspect as ArticleVideoAspect) || "16/9";
  const isYoutube = Boolean(youtubeId);

  return (
    <NodeViewWrapper
      className={cn("my-4", selected && "rounded-xl ring-2 ring-[#14B8A6] ring-offset-2")}
      data-drag-handle
      style={{
        width,
        maxWidth: "100%",
        marginLeft: align === "left" ? 0 : align === "right" ? "auto" : "auto",
        marginRight: align === "right" ? 0 : align === "left" ? "auto" : "auto",
      }}
    >
      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#0F172A]">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#111827] px-3 py-2">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
            {isYoutube ? (
              <Video className="h-3.5 w-3.5 text-[#F87171]" />
            ) : (
              <Film className="h-3.5 w-3.5 text-[#14B8A6]" />
            )}
            {isYoutube ? "YouTube" : "Vidéo"} · {width} · {align} · {aspect}
          </p>
          <button
            type="button"
            onClick={deleteNode}
            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-[#FCA5A5] transition-colors hover:bg-white/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Supprimer
          </button>
        </div>

        <div className={cn("relative w-full bg-black", aspectClass(aspect))}>
          {isYoutube ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title="Vidéo YouTube"
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : src ? (
            <video
              src={src}
              poster={poster || undefined}
              controls
              playsInline
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50">
              Vidéo non configurée
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
