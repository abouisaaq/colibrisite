"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  removeStoryCreationImage,
  uploadStoryCreationImage,
} from "@/actions/admin";
import {
  DEFAULT_STORY_CREATION_IMAGE,
} from "@/lib/about-story-creation";
import { toast } from "sonner";

export function StoryCreationMediaUpload({
  imageUrl,
}: {
  imageUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(imageUrl || "");
  const [isPending, startTransition] = useTransition();
  const displayUrl = preview || DEFAULT_STORY_CREATION_IMAGE;
  const isCustom = Boolean(preview);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 8 Mo");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const url = await uploadStoryCreationImage(formData);
        setPreview(url);
        toast.success("Image enregistrée");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors du téléversement"
        );
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      try {
        await removeStoryCreationImage();
        setPreview("");
        if (inputRef.current) inputRef.current.value = "";
        toast.success("Image supprimée");
      } catch {
        toast.error("Erreur");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-[#111827]">
          Histoire — Création de l&apos;association
        </h3>
        <p className="mt-1 text-sm text-[#6B7280]">
          Une image à droite du texte (page À propos). Portrait recommandé.
        </p>
      </div>

      <div className="max-w-xs rounded-xl border border-[#E5E7EB] bg-white p-3">
        <div className="relative mb-2 aspect-[4/5] w-full overflow-hidden rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC]">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Création de l'association"
              fill
              className="object-cover"
              sizes="240px"
            />
          ) : (
            <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-1 text-[#94A3B8]">
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs">Image</span>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
            className="flex-1"
          >
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            {isPending ? "…" : isCustom ? "Remplacer" : "Uploader"}
          </Button>
          {isCustom ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isPending}
              onClick={handleRemove}
              aria-label="Supprimer l'image"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
