"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  removeCommitmentImage,
  uploadCommitmentImage,
} from "@/actions/admin";
import { toast } from "sonner";

type Item = {
  title: string;
  imageUrl: string;
};

export function CommitmentImagesUpload({ items }: { items: Item[] }) {
  const [previews, setPreviews] = useState(items.map((item) => item.imageUrl));
  const [isPending, startTransition] = useTransition();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleUpload(index: number, file: File | undefined) {
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
        const url = await uploadCommitmentImage(index, formData);
        setPreviews((prev) => {
          const next = [...prev];
          next[index] = url;
          return next;
        });
        toast.success("Photo enregistrée");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors du téléversement"
        );
      }
    });
  }

  function handleRemove(index: number) {
    startTransition(async () => {
      try {
        const result = await removeCommitmentImage(index);
        setPreviews((prev) => {
          const next = [...prev];
          next[index] = result.defaultUrl;
          return next;
        });
        const input = inputRefs.current[index];
        if (input) input.value = "";
        toast.success("Photo réinitialisée");
      } catch {
        toast.error("Erreur");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-[#111827]">Photos des engagements</p>
        <p className="mt-0.5 text-xs text-[#94A3B8]">
          Une photo par engagement (voyages au Village). L’ordre suit la liste ci-dessus.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]"
          >
            <div className="relative aspect-[4/3] bg-[#E5E7EB]">
              {previews[index] ? (
                <Image
                  src={previews[index]}
                  alt={item.title}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-semibold text-[#111827]">{item.title}</p>
              <div className="flex gap-2">
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(index, e.target.files?.[0])}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  className="flex-1"
                  onClick={() => inputRefs.current[index]?.click()}
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  Changer
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => handleRemove(index)}
                  aria-label={`Réinitialiser la photo de ${item.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5 text-[#94A3B8]" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
