"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Film, Trash2, Upload, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addHomeSpotlightVideo,
  addHomeSpotlightYoutubeVideo,
  deleteHomeSpotlightVideo,
  uploadMedia,
} from "@/actions/admin";
import { parseYouTubeVideoId, youtubeThumbnailUrl } from "@/lib/about-story-media";
import { uploadVideoToConvex } from "@/lib/client-video-upload";
import { extractVideoPosterFrame } from "@/lib/extract-video-poster";
import { toast } from "sonner";

export type HomeSpotlightVideoItem = {
  id: string;
  title?: string | null;
  url?: string | null;
  posterUrl?: string | null;
  youtubeUrl?: string | null;
};

export function HomeSpotlightVideosManager({
  videos,
}: {
  videos: HomeSpotlightVideoItem[];
}) {
  const router = useRouter();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [youtubeDraft, setYoutubeDraft] = useState("");
  const [titleDraft, setTitleDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  async function uploadPosterFromFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const media = await uploadMedia(formData);
    return media.url;
  }

  function handleVideosUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    void (async () => {
      try {
        let added = 0;
        for (const file of Array.from(files)) {
          const meta = await uploadVideoToConvex(file);
          let posterUrl: string | undefined;
          const frame = await extractVideoPosterFrame(file);
          if (frame) {
            posterUrl = await uploadPosterFromFile(frame);
          }
          await addHomeSpotlightVideo(meta, {
            title: titleDraft.trim() || file.name,
            posterUrl,
          });
          added += 1;
        }
        setTitleDraft("");
        toast.success(added > 1 ? `${added} vidéos ajoutées` : "Vidéo ajoutée");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur téléversement"
        );
      } finally {
        setIsUploading(false);
        if (videoInputRef.current) videoInputRef.current.value = "";
      }
    })();
  }

  function handleAddYoutube() {
    const trimmed = youtubeDraft.trim();
    if (!trimmed) {
      toast.error("Collez un lien YouTube");
      return;
    }
    if (!parseYouTubeVideoId(trimmed)) {
      toast.error("Lien YouTube invalide");
      return;
    }

    startTransition(async () => {
      try {
        await addHomeSpotlightYoutubeVideo({
          youtubeUrl: trimmed,
          title: titleDraft.trim() || undefined,
        });
        setYoutubeDraft("");
        setTitleDraft("");
        toast.success("Vidéo YouTube ajoutée");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur enregistrement"
        );
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteHomeSpotlightVideo(id);
        toast.success("Vidéo retirée");
        router.refresh();
      } catch {
        toast.error("Erreur suppression");
      }
    });
  }

  const busy = isPending || isUploading;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:p-6">
        <h3 className="font-semibold text-[#111827]">Ajouter des vidéos</h3>
        <p className="mt-1 text-sm text-[#6B7280]">
          Elles s’affichent sur l’accueil (2 choisies au hasard à chaque visite).
          Ajoutez-en autant que vous voulez.
        </p>

        <div className="mt-4 space-y-2">
          <Label htmlFor="spotlight-video-title">Titre (optionnel)</Label>
          <Input
            id="spotlight-video-title"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            placeholder="Ex. : Mission Al Haouz 2024"
            className="bg-white"
            disabled={busy}
          />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-[#374151]">
              <Upload className="h-4 w-4 text-colibri-teal" />
              Téléverser (MP4 / WebM)
            </p>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              multiple
              className="hidden"
              onChange={handleVideosUpload}
            />
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => videoInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Téléversement…" : "Choisir des fichiers"}
            </Button>
            <p className="mt-2 text-xs text-[#94A3B8]">
              Max. 80 Mo par fichier. Plusieurs fichiers à la fois possibles.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-[#374151]">
              <Link2 className="h-4 w-4 text-colibri-teal" />
              Lien YouTube
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={youtubeDraft}
                onChange={(e) => setYoutubeDraft(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
                className="bg-white"
                disabled={busy}
              />
              <Button
                type="button"
                disabled={busy}
                onClick={handleAddYoutube}
                className="shrink-0 bg-colibri-teal hover:bg-colibri-teal/90"
              >
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h3 className="font-semibold text-colibri-blue">
            Bibliothèque ({videos.length})
          </h3>
          <p className="text-xs text-[#94A3B8]">2 affichées au hasard sur l’accueil</p>
        </div>

        {videos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-14 text-center text-sm text-[#94A3B8]">
            Aucune vidéo pour l’instant. Ajoutez-en ci-dessus.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => {
              const ytId = video.youtubeUrl
                ? parseYouTubeVideoId(video.youtubeUrl)
                : null;
              const poster =
                video.posterUrl ||
                (ytId ? youtubeThumbnailUrl(ytId) : undefined);

              return (
                <div
                  key={video.id}
                  className="group overflow-hidden rounded-xl border border-[#E8EDF3] bg-white"
                >
                  <div className="relative aspect-video bg-black">
                    {video.url ? (
                      <video
                        src={video.url}
                        poster={poster}
                        controls
                        className="h-full w-full object-contain"
                        preload="metadata"
                      />
                    ) : poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={poster}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#94A3B8]">
                        <Film className="h-8 w-8" />
                      </div>
                    )}
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[11px] text-white">
                      {ytId ? (
                        <>
                          <Link2 className="h-3 w-3" />
                          YouTube
                        </>
                      ) : (
                        <>
                          <Film className="h-3 w-3" />
                          Fichier
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#111827]">
                        {video.title?.trim() || "Sans titre"}
                      </p>
                      {video.youtubeUrl ? (
                        <p className="mt-0.5 truncate text-xs text-[#94A3B8]">
                          {video.youtubeUrl}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => handleDelete(video.id)}
                      className="shrink-0 gap-1.5 text-red-600 hover:text-red-700"
                      aria-label="Supprimer la vidéo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
