"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMedia, deleteMedia } from "@/actions/admin";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt?: Date | number | string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function MediaLibrary({ initialMedia }: { initialMedia: MediaItem[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState(initialMedia);
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    startTransition(async () => {
      let uploaded = 0;
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 8 * 1024 * 1024) {
          toast.error(`${file.name} : trop volumineux (max 8 Mo)`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          const item = await uploadMedia(formData);
          setMedia((prev) => [item as MediaItem, ...prev]);
          uploaded++;
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : `Erreur pour ${file.name}`
          );
        }
      }

      if (uploaded > 0) {
        toast.success(`${uploaded} image${uploaded > 1 ? "s" : ""} téléversée${uploaded > 1 ? "s" : ""}`);
      }

      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteMedia(id);
        setMedia((prev) => prev.filter((m) => m.id !== id));
        toast.success("Image supprimée");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    });
  }

  async function copyUrl(id: string, url: string) {
    const fullUrl = `${window.location.origin}${url}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success("URL copiée");
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-semibold text-[#111827]">Bibliothèque de photos</h4>
          <p className="mt-1 text-sm text-[#6B7280]">
            Téléversez toutes les images du site. Copiez l&apos;URL pour l&apos;utiliser dans les articles, actions, témoignages, etc.
          </p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            type="button"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
            className="gap-2 bg-colibri-teal hover:bg-colibri-teal/90"
          >
            <Upload className="h-4 w-4" />
            {isPending ? "Téléversement…" : "Ajouter des images"}
          </Button>
        </div>
      </div>

      {media.length === 0 ? (
        <div className="rounded-2xl border bg-white py-16 text-center text-muted-foreground">
          Aucune image pour le moment. Cliquez sur &quot;Ajouter des images&quot; pour commencer.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-[#F1F5F9]">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-xs font-medium text-[#111827]" title={item.filename}>
                  {item.filename}
                </p>
                <p className="text-[11px] text-[#9CA3AF]">{formatSize(item.size)}</p>
                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 gap-1 text-xs"
                    onClick={() => copyUrl(item.id, item.url)}
                  >
                    {copiedId === item.id ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    Copier URL
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-red-600 hover:text-red-700"
                    disabled={isPending}
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
