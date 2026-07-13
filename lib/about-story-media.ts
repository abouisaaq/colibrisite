/**
 * Médias du chapitre « Séisme » (page À propos — Notre histoire).
 * Gérés depuis Admin → Médias.
 */

import type { AboutStoryMedia, AboutStoryPhotos } from "@/lib/about-story-chapters";

export const STORY_SEISME_SETTING_KEYS = {
  photo1: "story_seisme_photo_1",
  photo2: "story_seisme_photo_2",
  photo3: "story_seisme_photo_3",
  videoFile: "story_seisme_video_file",
  videoPoster: "story_seisme_video_poster",
  youtubeUrl: "story_seisme_youtube_url",
} as const;

export type StorySeismePhotoSlot = "photo1" | "photo2" | "photo3";

export const STORY_SEISME_PHOTO_KEYS: Record<
  StorySeismePhotoSlot,
  (typeof STORY_SEISME_SETTING_KEYS)[StorySeismePhotoSlot]
> = {
  photo1: STORY_SEISME_SETTING_KEYS.photo1,
  photo2: STORY_SEISME_SETTING_KEYS.photo2,
  photo3: STORY_SEISME_SETTING_KEYS.photo3,
};

export const DEFAULT_STORY_SEISME_PHOTOS: Record<StorySeismePhotoSlot, string> = {
  photo1:
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=85",
  photo2:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=85",
  photo3:
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=85",
};

const PHOTO_ALTS: Record<StorySeismePhotoSlot, string> = {
  photo1: "Solidarité après le séisme",
  photo2: "Aide aux familles",
  photo3: "Mobilisation sur le terrain",
};

/** Extrait l’ID YouTube depuis une URL (watch, youtu.be, shorts, embed). */
export function parseYouTubeVideoId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const v = url.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;

      const parts = url.pathname.split("/").filter(Boolean);
      const kind = parts[0];
      const id = parts[1];
      if (
        (kind === "embed" || kind === "shorts" || kind === "live" || kind === "v") &&
        id &&
        /^[\w-]{11}$/.test(id)
      ) {
        return id;
      }
    }
  } catch {
    return null;
  }

  return null;
}

/** Miniature YouTube (hq). */
export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function resolveStorySeismePhotos(
  settings: Record<string, string | undefined>
): AboutStoryPhotos {
  const photo1 =
    settings[STORY_SEISME_SETTING_KEYS.photo1]?.trim() ||
    DEFAULT_STORY_SEISME_PHOTOS.photo1;
  const photo2 =
    settings[STORY_SEISME_SETTING_KEYS.photo2]?.trim() ||
    DEFAULT_STORY_SEISME_PHOTOS.photo2;
  const photo3 =
    settings[STORY_SEISME_SETTING_KEYS.photo3]?.trim() ||
    DEFAULT_STORY_SEISME_PHOTOS.photo3;

  return {
    main: photo1,
    left: photo2,
    right: photo3,
    mainAlt: PHOTO_ALTS.photo1,
    leftAlt: PHOTO_ALTS.photo2,
    rightAlt: PHOTO_ALTS.photo3,
  };
}

export function resolveStorySeismeMedia(
  settings: Record<string, string | undefined>
): AboutStoryMedia {
  const youtubeUrl = settings[STORY_SEISME_SETTING_KEYS.youtubeUrl]?.trim() || undefined;
  const videoSrc = settings[STORY_SEISME_SETTING_KEYS.videoFile]?.trim() || undefined;
  const customPoster =
    settings[STORY_SEISME_SETTING_KEYS.videoPoster]?.trim() || undefined;
  const youtubeId = youtubeUrl ? parseYouTubeVideoId(youtubeUrl) : null;

  return {
    youtubeUrl,
    videoSrc,
    videoPoster:
      customPoster ||
      (youtubeId ? youtubeThumbnailUrl(youtubeId) : undefined),
    photos: resolveStorySeismePhotos(settings),
  };
}
