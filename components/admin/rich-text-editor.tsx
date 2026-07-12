"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Link2,
  ImagePlus,
  Minus,
  Pilcrow,
} from "lucide-react";
import { uploadMedia } from "@/actions/admin";
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

const ResizableImage = ImageExtension.extend({
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
            width: typeof width === "string" && width.endsWith("%") ? undefined : width,
            "data-width": width,
            style: `width: ${width}; max-width: 100%; height: auto;`,
          };
        },
      },
    };
  },
});

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

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Écrivez votre article…",
}: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageFile = useCallback(
    async (file: File) => {
      if (!editor || uploadingRef.current) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner une image");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 8 Mo");
        return;
      }

      uploadingRef.current = true;
      const formData = new FormData();
      formData.append("file", file);

      try {
        const media = await uploadMedia(formData);
        editor
          .chain()
          .focus()
          .setImage({ src: media.url, alt: file.name })
          .updateAttributes("image", { width: "100%" })
          .run();
        toast.success("Image ajoutée — cliquez dessus pour changer la taille");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur téléversement");
      } finally {
        uploadingRef.current = false;
        if (imageInputRef.current) imageInputRef.current.value = "";
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
  const currentWidth = (editor.getAttributes("image").width as string | undefined) ?? "100%";

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
            if (file) void handleImageFile(file);
          }}
        />
        <ToolbarButton label="Insérer une image" onClick={() => imageInputRef.current?.click()}>
          <ImagePlus className="h-4 w-4" />
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
        <p className="text-[11px] text-[#94A3B8]">
          Cliquez sur une image puis choisissez S / M / L / XL pour la redimensionner
        </p>
      </div>
    </div>
  );
}
