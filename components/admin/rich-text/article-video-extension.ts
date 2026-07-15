import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ArticleVideoView } from "@/components/admin/rich-text/article-video-view";
import { ArticleVideoRowView } from "@/components/admin/rich-text/article-video-row-view";
import type {
  ArticleVideoAspect,
  ArticleVideoAttrs,
  ArticleVideoItem,
} from "@/components/admin/rich-text/article-video-types";
import type { ImageAlign } from "@/components/admin/rich-text/article-image-types";

export type { ArticleVideoAspect, ArticleVideoAttrs, ArticleVideoItem };

function parseVideosAttr(element: HTMLElement): ArticleVideoItem[] {
  const raw = element.getAttribute("data-videos");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as ArticleVideoItem[];
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) => item && (typeof item.src === "string" || typeof item.youtubeId === "string")
        );
      }
    } catch {
      /* ignore */
    }
  }
  return [];
}

function alignStyle(align: ImageAlign): string {
  if (align === "left") return "margin-left: 0; margin-right: auto;";
  if (align === "right") return "margin-left: auto; margin-right: 0;";
  return "margin-left: auto; margin-right: auto;";
}

function parseAspect(value: string | null): ArticleVideoAspect {
  if (value === "4/3" || value === "1/1" || value === "9/16" || value === "16/9") {
    return value;
  }
  return "16/9";
}

export const ArticleVideo = Node.create({
  name: "articleVideo",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-src") || "",
        renderHTML: (attributes) =>
          attributes.src ? { "data-src": attributes.src } : {},
      },
      youtubeId: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-youtube-id") || "",
        renderHTML: (attributes) =>
          attributes.youtubeId
            ? { "data-youtube-id": attributes.youtubeId }
            : {},
      },
      poster: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-poster") || "",
        renderHTML: (attributes) =>
          attributes.poster ? { "data-poster": attributes.poster } : {},
      },
      width: {
        default: "100%",
        parseHTML: (element) =>
          element.getAttribute("data-width") ||
          element.style.width ||
          "100%",
        renderHTML: (attributes) => ({
          "data-width": attributes.width || "100%",
        }),
      },
      align: {
        default: "center" satisfies ImageAlign,
        parseHTML: (element) =>
          (element.getAttribute("data-align") as ImageAlign | null) || "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align || "center",
        }),
      },
      aspect: {
        default: "16/9" satisfies ArticleVideoAspect,
        parseHTML: (element) => parseAspect(element.getAttribute("data-aspect")),
        renderHTML: (attributes) => ({
          "data-aspect": attributes.aspect || "16/9",
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="article-video"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const src = (node.attrs.src as string) || "";
    const youtubeId = (node.attrs.youtubeId as string) || "";
    const poster = (node.attrs.poster as string) || "";
    const width = (node.attrs.width as string) || "100%";
    const align = (node.attrs.align as ImageAlign) || "center";
    const aspect = (node.attrs.aspect as ArticleVideoAspect) || "16/9";

    const mediaChild = youtubeId
      ? [
          "iframe",
          {
            src: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
            title: "Vidéo YouTube",
            loading: "lazy",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowfullscreen: "true",
            referrerpolicy: "strict-origin-when-cross-origin",
          },
        ]
      : src
        ? [
            "video",
            {
              src,
              controls: "true",
              playsinline: "true",
              preload: "metadata",
              ...(poster ? { poster } : {}),
            },
          ]
        : ["div", { class: "article-video-empty" }, "Vidéo"];

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "article-video",
        "data-src": src || undefined,
        "data-youtube-id": youtubeId || undefined,
        "data-poster": poster || undefined,
        "data-width": width,
        "data-align": align,
        "data-aspect": aspect,
        class: `article-video article-video--${align}`,
        style: `width: ${width}; max-width: 100%; ${alignStyle(align)}`,
      }),
      [
        "div",
        {
          class: "article-video-frame",
          style: `aspect-ratio: ${aspect};`,
        },
        mediaChild,
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ArticleVideoView);
  },
});

export const VideoRow = Node.create({
  name: "videoRow",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      videos: {
        default: [] as ArticleVideoItem[],
        parseHTML: (element) => parseVideosAttr(element),
        renderHTML: (attributes) => ({
          "data-videos": JSON.stringify(attributes.videos || []),
        }),
      },
      width: {
        default: "100%",
        parseHTML: (element) =>
          element.getAttribute("data-width") || element.style.width || "100%",
        renderHTML: (attributes) => ({
          "data-width": attributes.width || "100%",
        }),
      },
      align: {
        default: "center" satisfies ImageAlign,
        parseHTML: (element) =>
          (element.getAttribute("data-align") as ImageAlign | null) || "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align || "center",
        }),
      },
      aspect: {
        default: "16/9" satisfies ArticleVideoAspect,
        parseHTML: (element) => parseAspect(element.getAttribute("data-aspect")),
        renderHTML: (attributes) => ({
          "data-aspect": attributes.aspect || "16/9",
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="video-row"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const videos = (node.attrs.videos || []) as ArticleVideoItem[];
    const width = (node.attrs.width as string) || "100%";
    const align = (node.attrs.align as ImageAlign) || "center";
    const aspect = (node.attrs.aspect as ArticleVideoAspect) || "16/9";

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "video-row",
        "data-videos": JSON.stringify(videos),
        "data-width": width,
        "data-align": align,
        "data-aspect": aspect,
        class: `article-video-row article-video-row--${align}`,
        style: `width: ${width}; max-width: 100%; ${alignStyle(align)}`,
      }),
      ...videos.map((video) => {
        const youtubeId = video.youtubeId || "";
        const src = video.src || "";
        const itemAspect = video.aspect || aspect;
        const mediaChild = youtubeId
          ? [
              "iframe",
              {
                src: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
                title: "Vidéo YouTube",
                loading: "lazy",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                allowfullscreen: "true",
                referrerpolicy: "strict-origin-when-cross-origin",
              },
            ]
          : src
            ? [
                "video",
                {
                  src,
                  controls: "true",
                  playsinline: "true",
                  preload: "metadata",
                  ...(video.poster ? { poster: video.poster } : {}),
                },
              ]
            : ["div", { class: "article-video-empty" }, "Vidéo"];

        return [
          "div",
          {
            class: "article-video article-video--center",
            style: "width: 100%; max-width: 100%;",
          },
          [
            "div",
            {
              class: "article-video-frame",
              style: `aspect-ratio: ${itemAspect};`,
            },
            mediaChild,
          ],
        ];
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ArticleVideoRowView);
  },
});

