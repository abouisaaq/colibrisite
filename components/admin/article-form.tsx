"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { uploadMedia } from "@/actions/admin";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

interface Article {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string | null;
  category: string;
  published: boolean;
  metaTitle?: string | null;
  metaDesc?: string | null;
}

interface ArticleFormProps {
  article?: Article;
  action: (data: unknown) => Promise<unknown>;
  updateAction?: (id: string, data: unknown) => Promise<unknown>;
}

function excerptFromContent(html: string) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= 160) return text || "Article";
  return `${text.slice(0, 157).trim()}…`;
}

export function ArticleForm({ article, action, updateAction }: ArticleFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(article?.imageUrl ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUpload] = useTransition();

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image (PNG, JPG, WebP…)");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 8 Mo");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startUpload(async () => {
      try {
        const media = await uploadMedia(formData);
        setImageUrl(media.url);
        toast.success("Image téléversée");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur lors du téléversement");
      }
    });
  }

  function handleRemoveImage() {
    setImageUrl("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const plain = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!plain) {
      toast.error("Le contenu de l'article est requis");
      return;
    }

    const data = {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || slugify(formData.get("title") as string),
      excerpt: excerptFromContent(content),
      content,
      imageUrl: imageUrl.trim() || undefined,
      category: formData.get("category") as string,
      published: formData.get("published") === "on",
      metaTitle: (formData.get("metaTitle") as string) || undefined,
      metaDesc: (formData.get("metaDesc") as string) || undefined,
    };

    startTransition(async () => {
      try {
        if (article?.id && updateAction) {
          await updateAction(article.id, data);
        } else {
          await action(data);
        }
        toast.success("Article enregistré");
        router.push("/admin/articles");
        router.refresh();
      } catch {
        toast.error("Erreur lors de l'enregistrement");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" defaultValue={article?.title} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={article?.slug} className="mt-1" />
        </div>
      </div>

      <div>
        <Label>Contenu</Label>
        <div className="mt-2">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Rédigez votre article : titres, listes, images…"
          />
        </div>
      </div>

      <div>
        <Label>Image de couverture</Label>
        <div className="mt-2 flex flex-col gap-4 rounded-xl border border-[#E8EDF3] bg-[#F8FAFC] p-4 sm:flex-row sm:items-center">
          <div className="relative h-36 w-full overflow-hidden rounded-xl border border-dashed border-[#CBD5E1] bg-white sm:h-28 sm:w-44">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Aperçu de la couverture"
                fill
                className="object-cover"
                sizes="176px"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1 text-[#94A3B8]">
                <ImageIcon className="h-7 w-7" />
                <span className="text-xs">Aucune image</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading
                ? "Téléversement…"
                : imageUrl
                  ? "Remplacer l'image"
                  : "Téléverser une image"}
            </Button>
            {imageUrl ? (
              <Button
                type="button"
                variant="ghost"
                disabled={isUploading}
                onClick={handleRemoveImage}
                className="gap-2 text-[#64748B]"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-3">
          <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">
            Ou coller une URL
          </Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://... ou /uploads/..."
            className="mt-1"
          />
        </div>
        <p className="mt-2 text-xs text-[#94A3B8]">
          Format paysage recommandé. PNG, JPG ou WebP — max. 8 Mo.
        </p>
      </div>

      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Input
          id="category"
          name="category"
          defaultValue={article?.category ?? "Actualité"}
          className="mt-1"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="metaTitle">Meta titre SEO</Label>
          <Input
            id="metaTitle"
            name="metaTitle"
            defaultValue={article?.metaTitle ?? ""}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="metaDesc">Meta description SEO</Label>
          <Input
            id="metaDesc"
            name="metaDesc"
            defaultValue={article?.metaDesc ?? ""}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          name="published"
          defaultChecked={article?.published ?? false}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="published">Publié</Label>
      </div>

      <Button
        type="submit"
        disabled={isPending || isUploading}
        className="rounded-full admin-btn-primary hover:opacity-95"
      >
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
