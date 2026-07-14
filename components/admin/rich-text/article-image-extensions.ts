import ImageExtension from "@tiptap/extension-image";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ArticleImageBlockView } from "@/components/admin/rich-text/article-image-block-view";
import type {
  ArticleImageItem,
  ImageAlign,
} from "@/components/admin/rich-text/article-image-types";

export type { ArticleImageItem, ImageAlign };

function parseImagesAttr(element: HTMLElement): ArticleImageItem[] {
  const raw = element.getAttribute("data-images");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as ArticleImageItem[];
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => item && typeof item.src === "string");
      }
    } catch {
      /* ignore */
    }
  }

  return Array.from(element.querySelectorAll("img")).map((img) => ({
    src: img.getAttribute("src") || "",
    alt: img.getAttribute("alt") || "",
  }));
}

function alignStyle(align: ImageAlign): string {
  if (align === "left") return "margin-left: 0; margin-right: auto;";
  if (align === "right") return "margin-left: auto; margin-right: 0;";
  return "margin-left: auto; margin-right: auto;";
}

export const ResizableImage = ImageExtension.extend({
  name: "image",
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) =>
          element.getAttribute("width") ||
          element.style.width ||
          element.getAttribute("data-width") ||
          "100%",
        renderHTML: (attributes) => {
          const width = attributes.width || "100%";
          return {
            width:
              typeof width === "string" && width.endsWith("%") ? undefined : width,
            "data-width": width,
          };
        },
      },
      align: {
        default: "center" satisfies ImageAlign,
        parseHTML: (element) =>
          (element.getAttribute("data-align") as ImageAlign | null) || "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align || "center",
        }),
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    const width = (node.attrs.width as string) || "100%";
    const align = (node.attrs.align as ImageAlign) || "center";
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-width": width,
        "data-align": align,
        class: `article-img article-img--${align}`,
        style: `width: ${width}; max-width: 100%; height: auto; display: block; ${alignStyle(align)}`,
      }),
    ];
  },
});

function createImageBlock(name: "imageRow" | "imageCarousel", cssClass: string) {
  return Node.create({
    name,
    group: "block",
    atom: true,
    draggable: true,
    addAttributes() {
      return {
        images: {
          default: [] as ArticleImageItem[],
          parseHTML: (element) => parseImagesAttr(element),
          renderHTML: (attributes) => ({
            "data-images": JSON.stringify(attributes.images || []),
          }),
        },
      };
    },
    parseHTML() {
      return [
        {
          tag: `div[data-type="${name === "imageRow" ? "image-row" : "image-carousel"}"]`,
        },
      ];
    },
    renderHTML({ node, HTMLAttributes }) {
      const images = (node.attrs.images || []) as ArticleImageItem[];
      const dataType = name === "imageRow" ? "image-row" : "image-carousel";
      return [
        "div",
        mergeAttributes(HTMLAttributes, {
          "data-type": dataType,
          "data-images": JSON.stringify(images),
          class: cssClass,
        }),
        ...images.map((img) => [
          "img",
          {
            src: img.src,
            alt: img.alt || "",
            loading: "lazy",
          },
        ]),
      ];
    },
    addNodeView() {
      return ReactNodeViewRenderer(ArticleImageBlockView);
    },
  });
}

export const ImageRow = createImageBlock("imageRow", "article-image-row");
export const ImageCarousel = createImageBlock(
  "imageCarousel",
  "article-carousel"
);
