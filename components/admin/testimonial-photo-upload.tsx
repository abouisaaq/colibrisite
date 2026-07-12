"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMedia } from "@/actions/admin";
import { toast } from "sonner";

interface TestimonialPhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  name?: string;
  onUploadingChange?: (uploading: boolean) => void;
}

export function TestimonialPhotoUpload({
  value,
  onChange,
  name,
  onUploadingChange,
}: TestimonialPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    onUploadingChange?.(isPending);
  }, [isPending, onUploadingChange]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image (PNG, JPG, WebP…)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const media = await uploadMedia(formData);
        onChange(media.url);
        toast.success("Photo téléversée");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur lors du téléversement");
      }
    });
  }

  function handleRemove() {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-4 rounded-xl border bg-[#F8FAFC] p-4 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)]">
          {value ? (
            <div className="relative h-full w-full">
              <Image
                src={value}
                alt={name ? `Photo de ${name}` : "Aperçu photo"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-[#9CA3AF]">
              <UserRound className="h-8 w-8" />
              <span className="text-[10px]">Aucune photo</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isPending ? "Téléversement…" : value ? "Remplacer la photo" : "Téléverser une photo"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" disabled={isPending} onClick={handleRemove}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">
          Ou coller une URL d&apos;image
        </Label>
        <Input
          id="imageUrl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... ou /uploads/..."
          className="mt-1"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        La photo s&apos;affiche dans le cercle à la place de l&apos;icône. Format carré recommandé.
      </p>
    </div>
  );
}
