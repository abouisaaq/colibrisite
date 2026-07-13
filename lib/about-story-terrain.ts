/**
 * Médias du chapitre « Terrain de foot » (3 photos + vidéo / YouTube).
 * Admin → Médias → « Histoire — Terrain de foot ».
 */

import type { AboutStoryMedia, AboutStoryPhotos } from "@/lib/about-story-chapters";

export const STORY_TERRAIN_SETTING_KEYS = {
  photo1: "story_terrain_photo_1",
  photo2: "story_terrain_photo_2",
  photo3: "story_terrain_photo_3",
  videoFile: "story_terrain_video_file",
  youtubeUrl: "story_terrain_youtube_url",
} as const;

export type StoryTerrainPhotoSlot = "photo1" | "photo2" | "photo3";

export const STORY_TERRAIN_PHOTO_KEYS: Record<
  StoryTerrainPhotoSlot,
  (typeof STORY_TERRAIN_SETTING_KEYS)[StoryTerrainPhotoSlot]
> = {
  photo1: STORY_TERRAIN_SETTING_KEYS.photo1,
  photo2: STORY_TERRAIN_SETTING_KEYS.photo2,
  photo3: STORY_TERRAIN_SETTING_KEYS.photo3,
};

export const DEFAULT_STORY_TERRAIN_PHOTOS: Record<StoryTerrainPhotoSlot, string> =
  {
    photo1:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=85",
    photo2:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=85",
    photo3:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=85",
  };

const PHOTO_ALTS: Record<StoryTerrainPhotoSlot, string> = {
  photo1: "Inauguration du terrain de foot",
  photo2: "Journée festive pour les enfants",
  photo3: "Accompagnement de Lahcen",
};

export function resolveStoryTerrainMedia(
  settings: Record<string, string | undefined>
): AboutStoryMedia {
  const youtubeUrl =
    settings[STORY_TERRAIN_SETTING_KEYS.youtubeUrl]?.trim() || undefined;
  const videoSrc =
    settings[STORY_TERRAIN_SETTING_KEYS.videoFile]?.trim() || undefined;

  const photos: AboutStoryPhotos = {
    main:
      settings[STORY_TERRAIN_SETTING_KEYS.photo1]?.trim() ||
      DEFAULT_STORY_TERRAIN_PHOTOS.photo1,
    left:
      settings[STORY_TERRAIN_SETTING_KEYS.photo2]?.trim() ||
      DEFAULT_STORY_TERRAIN_PHOTOS.photo2,
    right:
      settings[STORY_TERRAIN_SETTING_KEYS.photo3]?.trim() ||
      DEFAULT_STORY_TERRAIN_PHOTOS.photo3,
    mainAlt: PHOTO_ALTS.photo1,
    leftAlt: PHOTO_ALTS.photo2,
    rightAlt: PHOTO_ALTS.photo3,
  };

  return { youtubeUrl, videoSrc, photos };
}
