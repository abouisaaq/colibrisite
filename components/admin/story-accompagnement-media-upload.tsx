"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  removeStoryAccompagnementPhoto,
  uploadStoryAccompagnementPhoto,
} from "@/actions/admin";
import {
  DEFAULT_STORY_ACCOMPAGNEMENT_PHOTOS,
  type StoryAccompagnementPhotoSlot,
} from "@/lib/about-story-accompagnement";
import { toast } from "sonner";

const LEFT_SLOTS: { slot: StoryAccompagnementPhotoSlot; label: string }[] = [
  { slot: "left1", label: "Photo 1" },
  { slot: "left2", label: "Photo 2" },
  { slot: "left3", label: "Photo 3" },
];

const RIGHT_SLOTS: { slot: StoryAccompagnementPhotoSlot; label: string }[] = [
  { slot: "right1", label: "Photo 1" },
  { slot: "right2", label: "Photo 2" },
  { slot: "right3", label: "Photo 3" },
];

function PhotoSlot({
  slot,
  label,
  preview,
  onPreviewChange,
}: {
  slot: StoryAccompagnementPhotoSlot;
  label: string;
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
        const url = await uploadStoryAccompagnementPhoto(slot, formData);
        onPreviewChange(url);
        toast.success(`${label} enregistrée`);
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
        await removeStoryAccompagnementPhoto(slot);
        onPreviewChange("");
        if (inputRef.current) inputRef.current.value = "";
        toast.success(`${label} supprimée`);
      } catch {
        toast.error("Erreur");
      }
    });
  }

  const displayUrl = preview || DEFAULT_STORY_ACCOMPAGNEMENT_PHOTOS[slot];
  const isCustom = Boolean(preview);

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-3">
      <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC]">
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt={label}
            fill
            className="object-cover"
            sizes="140px"
          />
        ) : (
          <div className="flex h-full min-h-[100px] flex-col items-center justify-center gap-1 text-[#94A3B8]">
            <ImageIcon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </div>
        )}
      </div>
      <p className="text-xs font-semibold text-[#111827]">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
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
          className="h-8 gap-1 px-2 text-xs"
        >
          <Upload className="h-3 w-3" />
          {isCustom ? "Changer" : "Upload"}
        </Button>
        {isCustom ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={handleRemove}
            className="h-8 gap-1 px-2 text-xs text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

interface StoryAccompagnementMediaUploadProps {
  photoUrls: Record<StoryAccompagnementPhotoSlot, string>;
}

export function StoryAccompagnementMediaUpload({
  photoUrls,
}: StoryAccompagnementMediaUploadProps) {
  const [photos, setPhotos] = useState(photoUrls);

  function update(slot: StoryAccompagnementPhotoSlot, url: string) {
    setPhotos((prev) => ({ ...prev, [slot]: url }));
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-6">
      <div className="mb-5">
        <h4 className="font-semibold text-[#111827]">Histoire — Accompagnement</h4>
        <p className="mt-1 text-sm text-[#6B7280]">
          Même style que Confort et réconfort : 3 photos à gauche, texte au
          centre, 3 photos à droite.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-medium text-[#111827]">Gauche</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {LEFT_SLOTS.map((item) => (
              <PhotoSlot
                key={item.slot}
                slot={item.slot}
                label={item.label}
                preview={photos[item.slot]}
                onPreviewChange={(url) => update(item.slot, url)}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-[#111827]">Droite</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {RIGHT_SLOTS.map((item) => (
              <PhotoSlot
                key={item.slot}
                slot={item.slot}
                label={item.label}
                preview={photos[item.slot]}
                onPreviewChange={(url) => update(item.slot, url)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
