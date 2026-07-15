/**
 * Médias du chapitre « Terrain de foot » (7 photos gauche + 2 vidéos droite).
 * Admin → Notre histoire → « Terrain de foot ».
 */

import type { AboutStoryMedia, AboutStoryVideo } from "@/lib/about-story-chapters";
import {
  parseYouTubeVideoId,
  youtubeThumbnailUrl,
} from "@/lib/about-story-media";

export const STORY_TERRAIN_SETTING_KEYS = {
  photo1: "story_terrain_photo_1",
  photo2: "story_terrain_photo_2",
  photo3: "story_terrain_photo_3",
  photo4: "story_terrain_photo_4",
  photo5: "story_terrain_photo_5",
  photo6: "story_terrain_photo_6",
  photo7: "story_terrain_photo_7",
  videoFile: "story_terrain_video_file",
  videoPoster: "story_terrain_video_poster",
  youtubeUrl: "story_terrain_youtube_url",
  video2File: "story_terrain_video_2_file",
  video2Poster: "story_terrain_video_2_poster",
  youtubeUrl2: "story_terrain_youtube_url_2",
} as const;

export type StoryTerrainPhotoSlot =
  | "photo1"
  | "photo2"
  | "photo3"
  | "photo4"
  | "photo5"
  | "photo6"
  | "photo7";

export const STORY_TERRAIN_PHOTO_SLOTS: StoryTerrainPhotoSlot[] = [
  "photo1",
  "photo2",
  "photo3",
  "photo4",
  "photo5",
  "photo6",
  "photo7",
];

export const STORY_TERRAIN_PHOTO_KEYS: Record<
  StoryTerrainPhotoSlot,
  (typeof STORY_TERRAIN_SETTING_KEYS)[StoryTerrainPhotoSlot]
> = {
  photo1: STORY_TERRAIN_SETTING_KEYS.photo1,
  photo2: STORY_TERRAIN_SETTING_KEYS.photo2,
  photo3: STORY_TERRAIN_SETTING_KEYS.photo3,
  photo4: STORY_TERRAIN_SETTING_KEYS.photo4,
  photo5: STORY_TERRAIN_SETTING_KEYS.photo5,
  photo6: STORY_TERRAIN_SETTING_KEYS.photo6,
  photo7: STORY_TERRAIN_SETTING_KEYS.photo7,
};

export const DEFAULT_STORY_TERRAIN_PHOTOS: Record<StoryTerrainPhotoSlot, string> =
  {
    photo1:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=85",
    photo2:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=85",
    photo3:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=85",
    photo4:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=85",
    photo5:
      "https://images.unsplash.com/photo-1517466787929-bc90951f0987?w=600&q=85",
    photo6:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=85",
    photo7:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=85",
  };

const PHOTO_ALTS: Record<StoryTerrainPhotoSlot, string> = {
  photo1: "Inauguration du terrain de foot",
  photo2: "Journée festive pour les enfants",
  photo3: "Accompagnement de Lahcen",
  photo4: "Terrain de foot — photo 4",
  photo5: "Terrain de foot — photo 5",
  photo6: "Terrain de foot — photo 6",
  photo7: "Terrain de foot — photo 7",
};

function resolveVideo(
  settings: Record<string, string | undefined>,
  fileKey: string,
  posterKey: string,
  youtubeKey: string
): AboutStoryVideo {
  const youtubeUrl = settings[youtubeKey]?.trim() || undefined;
  const videoSrc = settings[fileKey]?.trim() || undefined;
  const customPoster = settings[posterKey]?.trim() || undefined;
  const youtubeId = youtubeUrl ? parseYouTubeVideoId(youtubeUrl) : null;

  return {
    youtubeUrl,
    videoSrc,
    videoPoster:
      customPoster ||
      (youtubeId ? youtubeThumbnailUrl(youtubeId) : undefined),
  };
}

export function resolveStoryTerrainMedia(
  settings: Record<string, string | undefined>
): AboutStoryMedia {
  const primary = resolveVideo(
    settings,
    STORY_TERRAIN_SETTING_KEYS.videoFile,
    STORY_TERRAIN_SETTING_KEYS.videoPoster,
    STORY_TERRAIN_SETTING_KEYS.youtubeUrl
  );

  const secondary = resolveVideo(
    settings,
    STORY_TERRAIN_SETTING_KEYS.video2File,
    STORY_TERRAIN_SETTING_KEYS.video2Poster,
    STORY_TERRAIN_SETTING_KEYS.youtubeUrl2
  );

  const photoList = STORY_TERRAIN_PHOTO_SLOTS.map((slot) => ({
    src:
      settings[STORY_TERRAIN_SETTING_KEYS[slot]]?.trim() ||
      DEFAULT_STORY_TERRAIN_PHOTOS[slot],
    alt: PHOTO_ALTS[slot],
  }));

  const [main, left, right] = photoList;

  return {
    youtubeUrl: primary.youtubeUrl,
    videoSrc: primary.videoSrc,
    videoPoster: primary.videoPoster,
    photos: {
      main: main?.src ?? "",
      left: left?.src ?? "",
      right: right?.src ?? "",
      mainAlt: main?.alt,
      leftAlt: left?.alt,
      rightAlt: right?.alt,
    },
    photoList,
    extraVideos: [secondary],
  };
}
