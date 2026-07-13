"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Film, ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  removeStorySeismePhoto,
  removeStorySeismeVideo,
  removeStorySeismeVideoPoster,
  saveStorySeismeYoutubeUrl,
  uploadStorySeismePhoto,
  uploadStorySeismeVideo,
  uploadStorySeismeVideoPoster,
} from "@/actions/admin";
import {
  DEFAULT_STORY_SEISME_PHOTOS,
  parseYouTubeVideoId,
  type StorySeismePhotoSlot,
} from "@/lib/about-story-media";
import { uploadVideoToConvex } from "@/lib/client-video-upload";
import { extractVideoPosterFrame } from "@/lib/extract-video-poster";
import { toast } from "sonner";

const PHOTO_SLOTS: {
  slot: StorySeismePhotoSlot;
  label: string;
}[] = [
  { slot: "photo1", label: "Photo 1" },
  { slot: "photo2", label: "Photo 2" },
  { slot: "photo3", label: "Photo 3" },
];

interface StorySeismeMediaUploadProps {
  photoUrls: Record<StorySeismePhotoSlot, string>;
  videoUrl?: string;
  videoPosterUrl?: string;
  youtubeUrl?: string;
}

function PhotoSlot({
  slot,
  label,
  preview,
  onPreviewChange,
}: {
  slot: StorySeismePhotoSlot;
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
        const url = await uploadStorySeismePhoto(slot, formData);
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
        await removeStorySeismePhoto(slot);
        onPreviewChange("");
        if (inputRef.current) inputRef.current.value = "";
        toast.success(`${label} supprimée`);
      } catch {
        toast.error("Erreur");
      }
    });
  }

  const displayUrl = preview || DEFAULT_STORY_SEISME_PHOTOS[slot];
  const isCustom = Boolean(preview);

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
      <div className="relative mb-3 aspect-[3/4] w-full overflow-hidden rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC]">
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt={label}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 text-[#94A3B8]">
            <ImageIcon className="h-7 w-7" />
            <span className="text-xs font-medium">{label}</span>
          </div>
        )}
      </div>
      <h5 className="text-sm font-semibold text-[#111827]">{label}</h5>
      <p className="mt-0.5 text-xs text-[#6B7280]">Même taille, empilée verticalement</p>
      <div className="mt-3 flex flex-wrap gap-2">
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
        {isCustom ? (
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
        ) : null}
      </div>
    </div>
  );
}

export function StorySeismeMediaUpload({
  photoUrls,
  videoUrl = "",
  videoPosterUrl = "",
  youtubeUrl = "",
}: StorySeismeMediaUploadProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState(photoUrls);
  const [video, setVideo] = useState(videoUrl);
  const [poster, setPoster] = useState(videoPosterUrl);
  const [youtube, setYoutube] = useState(youtubeUrl);
  const [isPending, startTransition] = useTransition();

  async function uploadPosterFromFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const url = await uploadStorySeismeVideoPoster(formData);
    setPoster(url);
    return url;
  }

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      try {
        const meta = await uploadVideoToConvex(file);
        const url = await uploadStorySeismeVideo(meta);
        setVideo(url);

        const frame = await extractVideoPosterFrame(file);
        if (frame) {
          await uploadPosterFromFile(frame);
          toast.success("Vidéo et miniature enregistrées");
        } else {
          toast.success("Vidéo enregistrée — ajoutez une miniature manuellement");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors du téléversement"
        );
      } finally {
        if (videoInputRef.current) videoInputRef.current.value = "";
      }
    });
  }

  function handlePosterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    startTransition(async () => {
      try {
        await uploadPosterFromFile(file);
        toast.success("Miniature enregistrée");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors du téléversement"
        );
      } finally {
        if (posterInputRef.current) posterInputRef.current.value = "";
      }
    });
  }

  function handleRemoveVideo() {
    startTransition(async () => {
      try {
        await removeStorySeismeVideo();
        setVideo("");
        setPoster("");
        if (videoInputRef.current) videoInputRef.current.value = "";
        toast.success("Vidéo supprimée");
      } catch {
        toast.error("Erreur");
      }
    });
  }

  function handleRemovePoster() {
    startTransition(async () => {
      try {
        await removeStorySeismeVideoPoster();
        setPoster("");
        toast.success("Miniature supprimée");
      } catch {
        toast.error("Erreur");
      }
    });
  }

  function handleSaveYoutube() {
    const trimmed = youtube.trim();
    if (trimmed && !parseYouTubeVideoId(trimmed)) {
      toast.error("Lien YouTube invalide");
      return;
    }

    startTransition(async () => {
      try {
        await saveStorySeismeYoutubeUrl(trimmed);
        toast.success(trimmed ? "Lien YouTube enregistré" : "Lien YouTube effacé");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors de l'enregistrement"
        );
      }
    });
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-6">
      <div className="mb-5">
        <h4 className="font-semibold text-[#111827]">Histoire — Séisme</h4>
        <p className="mt-1 text-sm text-[#6B7280]">
          Vidéo à gauche (upload ou YouTube) et 3 photos empilées à droite, sur la
          page À propos.
        </p>
      </div>

      <div className="mb-6 space-y-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
        <div>
          <h5 className="text-sm font-semibold text-[#111827]">Vidéo</h5>
          <p className="mt-0.5 text-xs text-[#6B7280]">
            Un lien YouTube est prioritaire s’il est renseigné. Sinon, la vidéo
            uploadée est utilisée. Une miniature s’affiche avant la lecture.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="story-seisme-youtube">Lien YouTube</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="story-seisme-youtube"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              className="bg-white"
            />
            <Button
              type="button"
              disabled={isPending}
              onClick={handleSaveYoutube}
              className="shrink-0"
            >
              Enregistrer
            </Button>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pt-4">
          <p className="mb-2 text-xs font-medium text-[#6B7280]">Ou téléverser une vidéo</p>
          {video ? (
            <div className="mb-3 overflow-hidden rounded-xl border border-[#E5E7EB] bg-black">
              <video
                src={video}
                controls
                poster={poster || undefined}
                className="aspect-video max-h-48 w-full object-contain"
                preload="metadata"
              />
            </div>
          ) : (
            <div className="mb-3 flex aspect-video max-h-40 items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-[#94A3B8]">
              <div className="flex flex-col items-center gap-2">
                <Film className="h-7 w-7" />
                <span className="text-xs">Aucune vidéo uploadée</span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={handleVideoChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => videoInputRef.current?.click()}
              className="gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              {video ? "Changer la vidéo" : "Téléverser une vidéo"}
            </Button>
            {video ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={handleRemoveVideo}
                className="gap-1.5 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
              </Button>
            ) : null}
          </div>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">
            MP4 / WebM, max. 80 Mo (idéal &lt; 20 Mo). Sinon utilisez un lien YouTube.
          </p>
        </div>

        <div className="border-t border-[#E5E7EB] pt-4">
          <p className="mb-2 text-xs font-medium text-[#6B7280]">
            Miniature (affichée avant la lecture)
          </p>
          {poster ? (
            <div className="relative mb-3 aspect-video max-h-40 overflow-hidden rounded-xl border border-[#E5E7EB]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={poster} alt="Miniature vidéo" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="mb-3 flex aspect-video max-h-32 items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-[#94A3B8]">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">Aucune miniature</span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <input
              ref={posterInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePosterChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => posterInputRef.current?.click()}
              className="gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              {poster ? "Changer la miniature" : "Téléverser une miniature"}
            </Button>
            {poster ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={handleRemovePoster}
                className="gap-1.5 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
              </Button>
            ) : null}
          </div>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">
            Générée automatiquement à l’upload de la vidéo, ou choisissez une image.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PHOTO_SLOTS.map((item) => (
          <PhotoSlot
            key={item.slot}
            slot={item.slot}
            label={item.label}
            preview={photos[item.slot]}
            onPreviewChange={(url) =>
              setPhotos((prev) => ({ ...prev, [item.slot]: url }))
            }
          />
        ))}
      </div>
    </div>
  );
}
