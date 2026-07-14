/**
 * Médias de la section Accueil (vidéo + frise galerie), au-dessus de WhatsApp.
 */

import {
  parseYouTubeVideoId,
  youtubeThumbnailUrl,
} from "@/lib/about-story-media";

export const HOME_SPOTLIGHT_SETTING_KEYS = {
  videoFile: "home_spotlight_video_file",
  videoPoster: "home_spotlight_video_poster",
  youtubeUrl: "home_spotlight_youtube_url",
} as const;

export type HomeSpotlightMedia = {
  videoSrc?: string;
  videoPoster?: string;
  youtubeUrl?: string;
};

export function resolveHomeSpotlightMedia(
  settings: Record<string, string | undefined>
): HomeSpotlightMedia {
  const youtubeUrl =
    settings[HOME_SPOTLIGHT_SETTING_KEYS.youtubeUrl]?.trim() || undefined;
  const videoSrc =
    settings[HOME_SPOTLIGHT_SETTING_KEYS.videoFile]?.trim() || undefined;
  const customPoster =
    settings[HOME_SPOTLIGHT_SETTING_KEYS.videoPoster]?.trim() || undefined;
  const youtubeId = youtubeUrl ? parseYouTubeVideoId(youtubeUrl) : null;

  return {
    youtubeUrl,
    videoSrc,
    videoPoster:
      customPoster ||
      (youtubeId ? youtubeThumbnailUrl(youtubeId) : undefined),
  };
}

export function hasHomeSpotlightVideo(media: HomeSpotlightMedia): boolean {
  if (media.youtubeUrl && parseYouTubeVideoId(media.youtubeUrl)) return true;
  return Boolean(media.videoSrc);
}
