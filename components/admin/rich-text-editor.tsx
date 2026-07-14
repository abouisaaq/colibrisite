"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Film,
  GalleryHorizontal,
  Heading2,
  Heading3,
  ImagePlus,
  Images,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Undo2,
  Video,
} from "lucide-react";
import { finalizeUploadedMedia, uploadMedia } from "@/actions/admin";
import {
  ImageCarousel,
  ImageRow,
  ResizableImage,
  type ImageAlign,
} from "@/components/admin/rich-text/article-image-extensions";
import type { ArticleImageItem } from "@/components/admin/rich-text/article-image-types";
import { ArticleVideo } from "@/components/admin/rich-text/article-video-extension";
import type { ArticleVideoAspect } from "@/components/admin/rich-text/article-video-types";
import { parseYouTubeVideoId } from "@/lib/about-story-media";
import { uploadVideoToConvex } from "@/lib/client-video-upload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const IMAGE_SIZES = [
  { label: "S", width: "25%", title: "Petite (25%)" },
  { label: "M", width: "50%", title: "Moyenne (50%)" },
  { label: "L", width: "75%", title: "Grande (75%)" },
  { label: "XL", width: "100%", title: "Pleine largeur" },
] as const;

const IMAGE_ALIGNS: { align: ImageAlign; label: string; icon: typeof AlignLeft }[] =
  [
    { align: "left", label: "À gauche", icon: AlignLeft },
    { align: "center", label: "Centré", icon: AlignCenter },
    { align: "right", label: "À droite", icon: AlignRight },
  ];

const VIDEO_ASPECTS: { aspect: ArticleVideoAspect; label: string; title: string }[] =
  [
    { aspect: "16/9", label: "16:9", title: "Paysage large" },
    { aspect: "4/3", label: "4:3", title: "Classique" },
    { aspect: "1/1", label: "1:1", title: "Carré" },
    { aspect: "9/16", label: "9:16", title: "Vertical (Stories)" },
  ];

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
  className,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-[#475569] transition-colors",
        "hover:bg-[#F1F5F9] hover:text-[#0F172A]",
        "disabled:pointer-events-none disabled:opacity-40",
        active && "bg-[#14B8A6]/15 text-[#0D9488]",
        className
      )}
    >
      {children}
    </button>
  );
}

async function uploadImageFiles(files: FileList | File[]): Promise<ArticleImageItem[]> {
  const list = Array.from(files);
  const images: ArticleImageItem[] = [];

  for (const file of list) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`Fichier non image : ${file.name}`);
    }
    if (file.size > 8 * 1024 * 1024) {
      throw new Error("Chaque image ne doit pas dépasser 8 Mo");
    }
    const formData = new FormData();
    formData.append("file", file);
    const media = await uploadMedia(formData);
    images.push({ src: media.url, alt: file.name });
  }

  return images;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Écrivez votre article…",
}: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const rowInputRef = useRef<HTMLInputElement>(null);
  const carouselInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);
  const [, setTick] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      ResizableImage.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-xl h-auto my-4 cursor-pointer",
        },
      }),
      ImageRow,
      ImageCarousel,
      ArticleVideo,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[280px] px-4 py-3 focus:outline-none text-[#334155] " +
          "prose-headings:font-heading prose-headings:text-[#0F172A] " +
          "prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3 " +
          "prose-h3:text-xl prose-h3:mt-5 prose-h3:mb-2 " +
          "prose-p:my-3 prose-a:text-[#0D9488] " +
          "prose-img:rounded-xl prose-blockquote:border-l-[#14B8A6]",
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
    onSelectionUpdate: () => {
      setTick((n) => n + 1);
    },
    onTransaction: () => {
      setTick((n) => n + 1);
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL du lien", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const setImageWidth = useCallback(
    (width: string) => {
      if (!editor) return;
      editor.chain().focus().updateAttributes("image", { width }).run();
    },
    [editor]
  );

  const setImageAlign = useCallback(
    (align: ImageAlign) => {
      if (!editor) return;
      editor.chain().focus().updateAttributes("image", { align }).run();
    },
    [editor]
  );

  const setVideoAttr = useCallback(
    (attrs: Record<string, string>) => {
      if (!editor) return;
      editor.chain().focus().updateAttributes("articleVideo", attrs).run();
    },
    [editor]
  );

  const insertYoutubeVideo = useCallback(() => {
    if (!editor) return;
    const url = window.prompt(
      "Collez l’URL YouTube (watch, youtu.be, Shorts…)",
      "https://www.youtube.com/watch?v="
    );
    if (url === null) return;
    const youtubeId = parseYouTubeVideoId(url);
    if (!youtubeId) {
      toast.error("URL YouTube invalide");
      return;
    }
    editor
      .chain()
      .focus()
      .insertContent({
        type: "articleVideo",
        attrs: {
          youtubeId,
          src: "",
          poster: "",
          width: "100%",
          align: "center",
          aspect: "16/9",
        },
      })
      .run();
    toast.success("Vidéo YouTube ajoutée — ajustez taille et mise en page");
  }, [editor]);

  const handleSingleImage = useCallback(
    async (file: File) => {
      if (!editor || uploadingRef.current) return;
      uploadingRef.current = true;
      try {
        const [image] = await uploadImageFiles([file]);
        if (!image) return;
        editor
          .chain()
          .focus()
          .setImage({ src: image.src, alt: image.alt })
          .updateAttributes("image", { width: "100%", align: "center" })
          .run();
        toast.success("Image ajoutée — taille et alignement dans la barre");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur téléversement");
      } finally {
        uploadingRef.current = false;
        if (imageInputRef.current) imageInputRef.current.value = "";
      }
    },
    [editor]
  );

  const handleVideoFile = useCallback(
    async (file: File) => {
      if (!editor || uploadingRef.current) return;
      uploadingRef.current = true;
      try {
        toast.message("Téléversement de la vidéo…");
        const meta = await uploadVideoToConvex(file);
        const media = await finalizeUploadedMedia(meta);
        editor
          .chain()
          .focus()
          .insertContent({
            type: "articleVideo",
            attrs: {
              src: media.url,
              youtubeId: "",
              poster: "",
              width: "100%",
              align: "center",
              aspect: "16/9",
            },
          })
          .run();
        toast.success("Vidéo ajoutée — ajustez taille et mise en page");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur téléversement");
      } finally {
        uploadingRef.current = false;
        if (videoInputRef.current) videoInputRef.current.value = "";
      }
    },
    [editor]
  );

  const handleImageBlock = useCallback(
    async (files: FileList, kind: "imageRow" | "imageCarousel") => {
      if (!editor || uploadingRef.current) return;
      if (files.length === 0) return;

      const max = kind === "imageRow" ? 4 : 12;
      if (files.length > max) {
        toast.error(
          kind === "imageRow"
            ? "Maximum 4 photos sur une rangée"
            : "Maximum 12 photos dans un carrousel"
        );
        return;
      }

      uploadingRef.current = true;
      try {
        toast.message(
          `Téléversement de ${files.length} image${files.length > 1 ? "s" : ""}…`
        );
        const images = await uploadImageFiles(files);
        editor
          .chain()
          .focus()
          .insertContent({
            type: kind,
            attrs: { images },
          })
          .run();
        toast.success(
          kind === "imageRow" ? "Rangée de photos ajoutée" : "Carrousel ajouté"
        );
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur téléversement");
      } finally {
        uploadingRef.current = false;
        if (rowInputRef.current) rowInputRef.current.value = "";
        if (carouselInputRef.current) carouselInputRef.current.value = "";
      }
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="min-h-[320px] animate-pulse rounded-xl border border-[#E8EDF3] bg-[#F8FAFC]" />
    );
  }

  const imageSelected = editor.isActive("image");
  const videoSelected = editor.isActive("articleVideo");
  const currentWidth =
    (editor.getAttributes("image").width as string | undefined) ?? "100%";
  const currentAlign =
    (editor.getAttributes("image").align as ImageAlign | undefined) ?? "center";
  const videoWidth =
    (editor.getAttributes("articleVideo").width as string | undefined) ?? "100%";
  const videoAlign =
    (editor.getAttributes("articleVideo").align as ImageAlign | undefined) ??
    "center";
  const videoAspect =
    (editor.getAttributes("articleVideo").aspect as ArticleVideoAspect | undefined) ??
    "16/9";

  return (
    <div className="overflow-hidden rounded-xl border border-[#E8EDF3] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#E8EDF3] bg-[#F8FAFC] px-2 py-2">
        <ToolbarButton
          label="Paragraphe"
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph") && !editor.isActive("heading")}
        >
          <Pilcrow className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Sous-titre"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Petit titre"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-[#E2E8F0]" aria-hidden />

        <ToolbarButton
          label="Gras"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italique"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Lien" onClick={setLink} active={editor.isActive("link")}>
          <Link2 className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-[#E2E8F0]" aria-hidden />

        <ToolbarButton
          label="Liste à puces"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Liste numérotée"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Citation"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Séparateur"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-[#E2E8F0]" aria-hidden />

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleSingleImage(file);
          }}
        />
        <input
          ref={rowInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              void handleImageBlock(e.target.files, "imageRow");
            }
          }}
        />
        <input
          ref={carouselInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              void handleImageBlock(e.target.files, "imageCarousel");
            }
          }}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleVideoFile(file);
          }}
        />

        <ToolbarButton label="Insérer une image" onClick={() => imageInputRef.current?.click()}>
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Rangée de photos (plusieurs images côte à côte)"
          onClick={() => rowInputRef.current?.click()}
        >
          <Images className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Carrousel photo"
          onClick={() => carouselInputRef.current?.click()}
        >
          <GalleryHorizontal className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Vidéo YouTube" onClick={insertYoutubeVideo}>
          <Video className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Vidéo fichier (MP4, WebM… max. 80 Mo)"
          onClick={() => videoInputRef.current?.click()}
        >
          <Film className="h-4 w-4" />
        </ToolbarButton>

        {imageSelected ? (
          <>
            <span className="mx-1 h-5 w-px bg-[#E2E8F0]" aria-hidden />
            <span className="px-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
              Taille
            </span>
            {IMAGE_SIZES.map((size) => (
              <ToolbarButton
                key={size.width}
                label={size.title}
                active={currentWidth === size.width}
                onClick={() => setImageWidth(size.width)}
                className="text-[11px] font-bold"
              >
                {size.label}
              </ToolbarButton>
            ))}
            <span className="mx-1 h-5 w-px bg-[#E2E8F0]" aria-hidden />
            <span className="px-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
              Align.
            </span>
            {IMAGE_ALIGNS.map(({ align, label, icon: Icon }) => (
              <ToolbarButton
                key={align}
                label={label}
                active={currentAlign === align}
                onClick={() => setImageAlign(align)}
              >
                <Icon className="h-4 w-4" />
              </ToolbarButton>
            ))}
          </>
        ) : null}

        {videoSelected ? (
          <>
            <span className="mx-1 h-5 w-px bg-[#E2E8F0]" aria-hidden />
            <span className="px-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
              Taille
            </span>
            {IMAGE_SIZES.map((size) => (
              <ToolbarButton
                key={`v-${size.width}`}
                label={size.title}
                active={videoWidth === size.width}
                onClick={() => setVideoAttr({ width: size.width })}
                className="text-[11px] font-bold"
              >
                {size.label}
              </ToolbarButton>
            ))}
            <span className="mx-1 h-5 w-px bg-[#E2E8F0]" aria-hidden />
            <span className="px-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
              Align.
            </span>
            {IMAGE_ALIGNS.map(({ align, label, icon: Icon }) => (
              <ToolbarButton
                key={`v-${align}`}
                label={label}
                active={videoAlign === align}
                onClick={() => setVideoAttr({ align })}
              >
                <Icon className="h-4 w-4" />
              </ToolbarButton>
            ))}
            <span className="mx-1 h-5 w-px bg-[#E2E8F0]" aria-hidden />
            <span className="px-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
              Format
            </span>
            {VIDEO_ASPECTS.map(({ aspect, label, title }) => (
              <ToolbarButton
                key={aspect}
                label={title}
                active={videoAspect === aspect}
                onClick={() => setVideoAttr({ aspect })}
                className="text-[11px] font-bold"
              >
                {label}
              </ToolbarButton>
            ))}
          </>
        ) : null}

        <span className="mx-1 h-5 w-px bg-[#E2E8F0]" aria-hidden />

        <ToolbarButton
          label="Annuler"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Rétablir"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <div className="border-t border-[#E8EDF3] bg-[#F8FAFC] px-3 py-2">
        <p className="text-[11px] leading-relaxed text-[#94A3B8]">
          Images : taille S–XL et alignement. Rangée (max. 4) · Carrousel (max.
          12). Vidéos : YouTube ou fichier MP4/WebM — puis taille, alignement et
          format (16:9, 4:3, carré, vertical).
        </p>
      </div>
    </div>
  );
}
