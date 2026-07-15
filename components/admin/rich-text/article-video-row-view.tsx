"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Film, Trash2, Video } from "lucide-react";
import type {
  ArticleVideoAspect,
  ArticleVideoItem,
} from "@/components/admin/rich-text/article-video-types";
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

function VideoPreview({
  item,
  aspect,
}: {
  item: ArticleVideoItem;
  aspect: ArticleVideoAspect;
}) {
  const youtubeId = item.youtubeId || "";
  const src = item.src || "";

  return (
    <div className={cn("relative w-full bg-black", aspectClass(aspect))}>
      {youtubeId ? (
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
          poster={item.poster || undefined}
          controls
          playsInline
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white/50">
          Vidéo vide
        </div>
      )}
    </div>
  );
}

export function ArticleVideoRowView({ node, deleteNode, selected }: NodeViewProps) {
  const videos = (node.attrs.videos || []) as ArticleVideoItem[];
  const width = (node.attrs.width as string) || "100%";
  const align = (node.attrs.align as string) || "center";
  const aspect = (node.attrs.aspect as ArticleVideoAspect) || "16/9";

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
      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] bg-white px-3 py-2">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            <Video className="h-3.5 w-3.5 text-[#F87171]" />
            Rangée vidéos · {videos.length} · {width} · {aspect}
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

        <div
          className="grid gap-2 p-3"
          style={{
            gridTemplateColumns: `repeat(${Math.min(videos.length || 1, 2)}, minmax(0, 1fr))`,
          }}
        >
          {videos.map((video, index) => (
            <div
              key={`${video.src}-${video.youtubeId}-${index}`}
              className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#0F172A]"
            >
              <div className="flex items-center gap-1.5 border-b border-white/10 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/60">
                {video.youtubeId ? (
                  <Video className="h-3 w-3 text-[#F87171]" />
                ) : (
                  <Film className="h-3 w-3 text-[#14B8A6]" />
                )}
                Vidéo {index + 1}
              </div>
              <VideoPreview item={video} aspect={video.aspect || aspect} />
            </div>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
