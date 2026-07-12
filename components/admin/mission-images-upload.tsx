"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMissionImage, removeMissionImage } from "@/actions/admin";
import {
  DEFAULT_MISSION_IMAGES,
  type MissionImageSlot,
} from "@/lib/mission-images";
import { toast } from "sonner";

const SLOTS: {
  slot: MissionImageSlot;
  label: string;
  hint: string;
  aspectClass: string;
}[] = [
  {
    slot: "main",
    label: "Photo principale",
    hint: "Grande image du collage (format paysage recommandé).",
    aspectClass: "aspect-[5/4]",
  },
  {
    slot: "left",
    label: "Photo gauche",
    hint: "Petite image en bas à gauche du collage.",
    aspectClass: "aspect-[4/3]",
  },
  {
    slot: "right",
    label: "Photo droite",
    hint: "Petite image en bas à droite du collage.",
    aspectClass: "aspect-[4/3]",
  },
];

interface MissionImagesUploadProps {
  currentUrls: Record<MissionImageSlot, string>;
}

function MissionImageSlotUpload({
  slot,
  label,
  hint,
  aspectClass,
  preview,
  onPreviewChange,
}: {
  slot: MissionImageSlot;
  label: string;
  hint: string;
  aspectClass: string;
  preview: string;
  onPreviewChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
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
        const url = await uploadMissionImage(slot, formData);
        onPreviewChange(url);
        toast.success(`${label} enregistrée`);
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
        await removeMissionImage(slot);
        onPreviewChange("");
        if (inputRef.current) inputRef.current.value = "";
        toast.success(`${label} supprimée`);
      } catch {
        toast.error("Erreur");
      }
    });
  }

  const displayUrl = preview || DEFAULT_MISSION_IMAGES[slot];
  const isCustom = Boolean(preview);

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
      <div className={`relative mb-3 w-full overflow-hidden rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] ${aspectClass}`}>
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 280px"
          />
        ) : (
          <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 text-[#94A3B8]">
            <ImageIcon className="h-7 w-7" />
            <span className="text-xs font-medium">{label}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <h5 className="text-sm font-semibold text-[#111827]">{label}</h5>
          <p className="text-xs text-[#6B7280]">{hint}</p>
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
            size="sm"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
            className="gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            {isCustom ? "Changer" : "Téléverser"}
          </Button>
          {isCustom && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={handleRemove}
              className="gap-1.5 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </Button>
          )}
        </div>
        {!isCustom && (
          <p className="text-[11px] text-[#9CA3AF]">Image par défaut affichée</p>
        )}
      </div>
    </div>
  );
}

export function MissionImagesUpload({ currentUrls }: MissionImagesUploadProps) {
  const [previews, setPreviews] = useState(currentUrls);

  function updatePreview(slot: MissionImageSlot, url: string) {
    setPreviews((prev) => ({ ...prev, [slot]: url }));
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-6">
      <div className="mb-5">
        <h4 className="font-semibold text-[#111827]">Photos « Qui sommes-nous »</h4>
        <p className="mt-1 text-sm text-[#6B7280]">
          Les 3 images du collage affiché sur la page d&apos;accueil, section Notre Mission.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {SLOTS.map((item) => (
          <MissionImageSlotUpload
            key={item.slot}
            slot={item.slot}
            label={item.label}
            hint={item.hint}
            aspectClass={item.aspectClass}
            preview={previews[item.slot]}
            onPreviewChange={(url) => updatePreview(item.slot, url)}
          />
        ))}
      </div>
    </div>
  );
}
