"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadHeroImage, removeHeroImage } from "@/actions/admin";
import { toast } from "sonner";

export function HeroImageUpload({ currentUrl }: { currentUrl?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [isPending, startTransition] = useTransition();

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
        const url = await uploadHeroImage(formData);
        setPreview(url);
        toast.success("Image hero enregistrée");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erreur lors du téléversement";
        toast.error(message);
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      try {
        await removeHeroImage();
        setPreview("");
        if (inputRef.current) inputRef.current.value = "";
        toast.success("Image hero supprimée");
      } catch {
        toast.error("Erreur");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-white sm:w-64">
          {preview ? (
            <Image src={preview} alt="Image hero" fill className="object-cover" sizes="256px" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#94A3B8]">
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs font-medium">Image d&apos;accueil</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-semibold text-[#111827]">Photo du hero (accueil)</h4>
            <p className="mt-1 text-sm text-[#6B7280]">
              Image principale affichée sur la page d&apos;accueil. Format paysage recommandé.
            </p>
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
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {preview ? "Changer l'image" : "Téléverser une image"}
            </Button>
            {preview && (
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={handleRemove}
                className="gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            )}
          </div>
          {preview && (
            <p className="text-xs text-[#6B7280]">
              URL : <code className="rounded bg-white px-1.5 py-0.5">{preview}</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
