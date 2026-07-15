"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Film, ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  removeStoryTerrainPhoto,
  removeStoryTerrainVideo,
  removeStoryTerrainVideo2,
  removeStoryTerrainVideoPoster,
  removeStoryTerrainVideo2Poster,
  saveStoryTerrainYoutubeUrl,
  saveStoryTerrainYoutubeUrl2,
  uploadStoryTerrainPhoto,
  uploadStoryTerrainVideo,
  uploadStoryTerrainVideo2,
  uploadStoryTerrainVideoPoster,
  uploadStoryTerrainVideo2Poster,
} from "@/actions/admin";
import {
  DEFAULT_STORY_TERRAIN_PHOTOS,
  STORY_TERRAIN_PHOTO_SLOTS,
  type StoryTerrainPhotoSlot,
} from "@/lib/about-story-terrain";
import { parseYouTubeVideoId } from "@/lib/about-story-media";
import { uploadVideoToConvex } from "@/lib/client-video-upload";
import { extractVideoPosterFrame } from "@/lib/extract-video-poster";
import { toast } from "sonner";

interface StoryTerrainMediaUploadProps {
  photoUrls: Record<StoryTerrainPhotoSlot, string>;
  videoUrl?: string;
  videoPosterUrl?: string;
  youtubeUrl?: string;
  video2Url?: string;
  video2PosterUrl?: string;
  youtubeUrl2?: string;
}

function PhotoSlot({
  slot,
  label,
  preview,
  onPreviewChange,
}: {
  slot: StoryTerrainPhotoSlot;
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
        const url = await uploadStoryTerrainPhoto(slot, formData);
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
        await removeStoryTerrainPhoto(slot);
        onPreviewChange("");
        if (inputRef.current) inputRef.current.value = "";
        toast.success(`${label} supprimée`);
      } catch {
        toast.error("Erreur");
      }
    });
  }

  const displayUrl = preview || DEFAULT_STORY_TERRAIN_PHOTOS[slot];
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
      <p className="mt-0.5 text-xs text-[#6B7280]">Empilée verticalement à gauche</p>
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

function VideoSection({
  title,
  video,
  poster,
  youtube,
  onVideoChange,
  onPosterChange,
  onYoutubeChange,
  onUploadVideo,
  onUploadPoster,
  onRemoveVideo,
  onRemovePoster,
  onSaveYoutube,
  isPending,
}: {
  title: string;
  video: string;
  poster: string;
  youtube: string;
  onVideoChange: (value: string) => void;
  onPosterChange: (value: string) => void;
  onYoutubeChange: (value: string) => void;
  onUploadVideo: (file: File) => void;
  onUploadPoster: (file: File) => void;
  onRemoveVideo: () => void;
  onRemovePoster: () => void;
  onSaveYoutube: () => void;
  isPending: boolean;
}) {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
      <div>
        <h5 className="text-sm font-semibold text-[#111827]">{title}</h5>
        <p className="mt-0.5 text-xs text-[#6B7280]">
          YouTube prioritaire si renseigné, sinon vidéo uploadée.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Lien YouTube</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={youtube}
            onChange={(e) => onYoutubeChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="bg-white"
          />
          <Button
            type="button"
            disabled={isPending}
            onClick={onSaveYoutube}
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadVideo(file);
              if (videoInputRef.current) videoInputRef.current.value = "";
            }}
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
              onClick={onRemoveVideo}
              className="gap-1.5 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </Button>
          ) : null}
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] pt-4">
        <p className="mb-2 text-xs font-medium text-[#6B7280]">Miniature</p>
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadPoster(file);
              if (posterInputRef.current) posterInputRef.current.value = "";
            }}
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
              onClick={onRemovePoster}
              className="gap-1.5 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function StoryTerrainMediaUpload({
  photoUrls,
  videoUrl = "",
  videoPosterUrl = "",
  youtubeUrl = "",
  video2Url = "",
  video2PosterUrl = "",
  youtubeUrl2 = "",
}: StoryTerrainMediaUploadProps) {
  const [photos, setPhotos] = useState(photoUrls);
  const [video, setVideo] = useState(videoUrl);
  const [poster, setPoster] = useState(videoPosterUrl);
  const [youtube, setYoutube] = useState(youtubeUrl);
  const [video2, setVideo2] = useState(video2Url);
  const [poster2, setPoster2] = useState(video2PosterUrl);
  const [youtube2, setYoutube2] = useState(youtubeUrl2);
  const [isPending, startTransition] = useTransition();

  async function uploadPosterFromFile(
    file: File,
    slot: "primary" | "secondary"
  ) {
    const formData = new FormData();
    formData.append("file", file);
    const url =
      slot === "primary"
        ? await uploadStoryTerrainVideoPoster(formData)
        : await uploadStoryTerrainVideo2Poster(formData);
    if (slot === "primary") setPoster(url);
    else setPoster2(url);
    return url;
  }

  function handleVideoUpload(file: File, slot: "primary" | "secondary") {
    startTransition(async () => {
      try {
        const meta = await uploadVideoToConvex(file);
        const url =
          slot === "primary"
            ? await uploadStoryTerrainVideo(meta)
            : await uploadStoryTerrainVideo2(meta);
        if (slot === "primary") setVideo(url);
        else setVideo2(url);

        const frame = await extractVideoPosterFrame(file);
        if (frame) {
          await uploadPosterFromFile(frame, slot);
          toast.success("Vidéo et miniature enregistrées");
        } else {
          toast.success("Vidéo enregistrée — ajoutez une miniature manuellement");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors du téléversement"
        );
      }
    });
  }

  function handlePosterUpload(file: File, slot: "primary" | "secondary") {
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    startTransition(async () => {
      try {
        await uploadPosterFromFile(file, slot);
        toast.success("Miniature enregistrée");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors du téléversement"
        );
      }
    });
  }

  function handleSaveYoutube(slot: "primary" | "secondary") {
    const trimmed = slot === "primary" ? youtube.trim() : youtube2.trim();
    if (trimmed && !parseYouTubeVideoId(trimmed)) {
      toast.error("Lien YouTube invalide");
      return;
    }

    startTransition(async () => {
      try {
        if (slot === "primary") {
          await saveStoryTerrainYoutubeUrl(trimmed);
        } else {
          await saveStoryTerrainYoutubeUrl2(trimmed);
        }
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
        <h4 className="font-semibold text-[#111827]">Histoire — Terrain de foot</h4>
        <p className="mt-1 text-sm text-[#6B7280]">
          7 photos à gauche et 2 vidéos empilées à droite, sur la page Notre histoire.
        </p>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <VideoSection
          title="Vidéo 1 (droite, en haut)"
          video={video}
          poster={poster}
          youtube={youtube}
          onVideoChange={setVideo}
          onPosterChange={setPoster}
          onYoutubeChange={setYoutube}
          onUploadVideo={(file) => handleVideoUpload(file, "primary")}
          onUploadPoster={(file) => handlePosterUpload(file, "primary")}
          onRemoveVideo={() => {
            startTransition(async () => {
              try {
                await removeStoryTerrainVideo();
                setVideo("");
                setPoster("");
                toast.success("Vidéo 1 supprimée");
              } catch {
                toast.error("Erreur");
              }
            });
          }}
          onRemovePoster={() => {
            startTransition(async () => {
              try {
                await removeStoryTerrainVideoPoster();
                setPoster("");
                toast.success("Miniature supprimée");
              } catch {
                toast.error("Erreur");
              }
            });
          }}
          onSaveYoutube={() => handleSaveYoutube("primary")}
          isPending={isPending}
        />
        <VideoSection
          title="Vidéo 2 (droite, en bas)"
          video={video2}
          poster={poster2}
          youtube={youtube2}
          onVideoChange={setVideo2}
          onPosterChange={setPoster2}
          onYoutubeChange={setYoutube2}
          onUploadVideo={(file) => handleVideoUpload(file, "secondary")}
          onUploadPoster={(file) => handlePosterUpload(file, "secondary")}
          onRemoveVideo={() => {
            startTransition(async () => {
              try {
                await removeStoryTerrainVideo2();
                setVideo2("");
                setPoster2("");
                toast.success("Vidéo 2 supprimée");
              } catch {
                toast.error("Erreur");
              }
            });
          }}
          onRemovePoster={() => {
            startTransition(async () => {
              try {
                await removeStoryTerrainVideo2Poster();
                setPoster2("");
                toast.success("Miniature supprimée");
              } catch {
                toast.error("Erreur");
              }
            });
          }}
          onSaveYoutube={() => handleSaveYoutube("secondary")}
          isPending={isPending}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {STORY_TERRAIN_PHOTO_SLOTS.map((slot, index) => (
          <PhotoSlot
            key={slot}
            slot={slot}
            label={`Photo ${index + 1}`}
            preview={photos[slot]}
            onPreviewChange={(url) =>
              setPhotos((prev) => ({ ...prev, [slot]: url }))
            }
          />
        ))}
      </div>
    </div>
  );
}
