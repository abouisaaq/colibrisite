"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import {
  createAlbum,
  updateAlbum,
  addGalleryImage,
  deleteGalleryImage,
  uploadMedia,
} from "@/actions/admin";

interface AlbumData {
  id?: string;
  title: string;
  slug: string;
  description?: string | null;
  coverUrl?: string | null;
  images?: { id: string; url: string; alt: string | null }[];
}

export function AlbumForm({ album }: { album?: AlbumData }) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState(album?.coverUrl ?? "");
  const [isPending, startTransition] = useTransition();
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string) || slugify(formData.get("title") as string),
      description: (formData.get("description") as string) || undefined,
      coverUrl: coverUrl.trim() || undefined,
    };

    startTransition(async () => {
      try {
        if (album?.id) {
          await updateAlbum(album.id, data);
          toast.success("Album enregistré");
          router.refresh();
        } else {
          const created = await createAlbum(data);
          toast.success("Album créé — vous pouvez maintenant ajouter des photos");
          router.push(`/admin/galerie/${created.id}`);
          router.refresh();
        }
      } catch {
        toast.error("Erreur");
      }
    });
  }

  async function uploadImageFile(file: File): Promise<string> {
    if (!file.type.startsWith("image/")) {
      throw new Error("Veuillez sélectionner une image");
    }
    if (file.size > 8 * 1024 * 1024) {
      throw new Error("L'image ne doit pas dépasser 8 Mo");
    }
    const formData = new FormData();
    formData.append("file", file);
    const media = await uploadMedia(formData);
    return media.url;
  }

  function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    void (async () => {
      try {
        const url = await uploadImageFile(file);
        setCoverUrl(url);
        toast.success("Couverture téléversée");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur téléversement");
      } finally {
        setIsUploadingCover(false);
        if (coverInputRef.current) coverInputRef.current.value = "";
      }
    })();
  }

  function handlePhotosUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length || !album?.id) return;

    setIsUploadingPhotos(true);
    void (async () => {
      try {
        let added = 0;
        for (const file of Array.from(files)) {
          const url = await uploadImageFile(file);
          await addGalleryImage(album.id!, url, file.name);
          added += 1;
        }
        toast.success(
          added > 1 ? `${added} photos ajoutées` : "Photo ajoutée"
        );
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur téléversement");
      } finally {
        setIsUploadingPhotos(false);
        if (photosInputRef.current) photosInputRef.current.value = "";
      }
    })();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              defaultValue={album?.title}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={album?.slug}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={album?.description ?? ""}
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Image de couverture</Label>
          <div className="mt-2 flex flex-col gap-4 rounded-xl border border-[#E8EDF3] bg-[#F8FAFC] p-4 sm:flex-row sm:items-center">
            <div className="relative h-36 w-full overflow-hidden rounded-xl border border-dashed border-[#CBD5E1] bg-white sm:h-28 sm:w-44">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt="Couverture de l'album"
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
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploadingCover || isPending}
                onClick={() => coverInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploadingCover
                  ? "Téléversement…"
                  : coverUrl
                    ? "Remplacer"
                    : "Téléverser"}
              </Button>
              {coverUrl ? (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isUploadingCover || isPending}
                  onClick={() => setCoverUrl("")}
                  className="gap-2 text-[#64748B]"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              ) : null}
            </div>
          </div>
          <p className="mt-2 text-xs text-[#94A3B8]">
            PNG, JPG ou WebP — max. 8 Mo. Format paysage recommandé.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isPending || isUploadingCover}
          className="bg-colibri-teal hover:bg-colibri-teal/90"
        >
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </form>

      {album?.id ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-colibri-blue">Photos de l&apos;album</h3>
            <div>
              <input
                ref={photosInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotosUpload}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploadingPhotos || isPending}
                onClick={() => photosInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploadingPhotos ? "Téléversement…" : "Téléverser des photos"}
              </Button>
            </div>
          </div>

          {album.images && album.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {album.images.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-[#E8EDF3]"
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? ""}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await deleteGalleryImage(img.id);
                        toast.success("Photo supprimée");
                        router.refresh();
                      })
                    }
                    className="absolute right-2 top-2 rounded-lg bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Supprimer la photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-10 text-center text-sm text-[#94A3B8]">
              Aucune photo pour le moment. Cliquez sur « Téléverser des photos ».
            </div>
          )}
        </div>
      ) : (
        <p className="rounded-xl border border-[#E8EDF3] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]">
          Enregistrez d&apos;abord l&apos;album pour pouvoir y téléverser des photos.
        </p>
      )}
    </div>
  );
}
