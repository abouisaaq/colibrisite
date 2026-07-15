import ImageExtension from "@tiptap/extension-image";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ArticleImageBlockView } from "@/components/admin/rich-text/article-image-block-view";
import type {
  ArticleImageItem,
  ImageAlign,
  MediaItemAspect,
  MediaObjectFit,
} from "@/components/admin/rich-text/article-image-types";

export type { ArticleImageItem, ImageAlign, MediaItemAspect, MediaObjectFit };

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

function parseAspect(value: string | null): MediaItemAspect {
  if (
    value === "4/3" ||
    value === "16/10" ||
    value === "1/1" ||
    value === "16/9" ||
    value === "auto"
  ) {
    return value;
  }
  return "16/10";
}

function parseObjectFit(value: string | null): MediaObjectFit {
  return value === "cover" ? "cover" : "contain";
}

function aspectStyle(aspect: MediaItemAspect): string {
  if (aspect === "auto") return "height: auto; aspect-ratio: auto;";
  return `aspect-ratio: ${aspect};`;
}

function blockAttrs() {
  return {
    width: {
      default: "100%",
      parseHTML: (element: HTMLElement) =>
        element.getAttribute("data-width") || element.style.width || "100%",
      renderHTML: (attributes: { width?: string }) => ({
        "data-width": attributes.width || "100%",
      }),
    },
    align: {
      default: "center" satisfies ImageAlign,
      parseHTML: (element: HTMLElement) =>
        (element.getAttribute("data-align") as ImageAlign | null) || "center",
      renderHTML: (attributes: { align?: ImageAlign }) => ({
        "data-align": attributes.align || "center",
      }),
    },
    itemAspect: {
      default: "16/10" satisfies MediaItemAspect,
      parseHTML: (element: HTMLElement) => parseAspect(element.getAttribute("data-item-aspect")),
      renderHTML: (attributes: { itemAspect?: MediaItemAspect }) => ({
        "data-item-aspect": attributes.itemAspect || "16/10",
      }),
    },
    objectFit: {
      default: "contain" satisfies MediaObjectFit,
      parseHTML: (element: HTMLElement) =>
        parseObjectFit(element.getAttribute("data-object-fit")),
      renderHTML: (attributes: { objectFit?: MediaObjectFit }) => ({
        "data-object-fit": attributes.objectFit || "contain",
      }),
    },
  };
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
        ...blockAttrs(),
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
      const width = (node.attrs.width as string) || "100%";
      const align = (node.attrs.align as ImageAlign) || "center";
      const itemAspect = (node.attrs.itemAspect as MediaItemAspect) || "16/10";
      const objectFit = (node.attrs.objectFit as MediaObjectFit) || "contain";

      return [
        "div",
        mergeAttributes(HTMLAttributes, {
          "data-type": dataType,
          "data-images": JSON.stringify(images),
          "data-width": width,
          "data-align": align,
          "data-item-aspect": itemAspect,
          "data-object-fit": objectFit,
          class: `${cssClass} ${cssClass}--${align}`,
          style: `width: ${width}; max-width: 100%; ${alignStyle(align)}`,
        }),
        ...images.map((img) => [
          "img",
          {
            src: img.src,
            alt: img.alt || "",
            loading: "lazy",
            style: `${aspectStyle(itemAspect)} object-fit: ${objectFit}; width: 100%;`,
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
