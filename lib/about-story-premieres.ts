/**
 * Médias du chapitre « Premières actions » (2 × 3 photos).
 * Admin → Médias → « Histoire — Premières actions ».
 */

import type { AboutStoryPhotos } from "@/lib/about-story-chapters";

export const STORY_PREMIERES_SETTING_KEYS = {
  left1: "story_premieres_left_1",
  left2: "story_premieres_left_2",
  left3: "story_premieres_left_3",
  right1: "story_premieres_right_1",
  right2: "story_premieres_right_2",
  right3: "story_premieres_right_3",
} as const;

export type StoryPremieresPhotoSlot = keyof typeof STORY_PREMIERES_SETTING_KEYS;

export const DEFAULT_STORY_PREMIERES_PHOTOS: Record<
  StoryPremieresPhotoSlot,
  string
> = {
  left1:
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=85",
  left2:
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=85",
  left3:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=85",
  right1:
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=85",
  right2:
    "https://images.unsplash.com/photo-1593113598332-cd288d298e48?w=800&q=85",
  right3:
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=85",
};

function resolveTrio(
  settings: Record<string, string | undefined>,
  slots: [StoryPremieresPhotoSlot, StoryPremieresPhotoSlot, StoryPremieresPhotoSlot],
  alts: [string, string, string]
): AboutStoryPhotos {
  const [a, b, c] = slots;
  return {
    main:
      settings[STORY_PREMIERES_SETTING_KEYS[a]]?.trim() ||
      DEFAULT_STORY_PREMIERES_PHOTOS[a],
    left:
      settings[STORY_PREMIERES_SETTING_KEYS[b]]?.trim() ||
      DEFAULT_STORY_PREMIERES_PHOTOS[b],
    right:
      settings[STORY_PREMIERES_SETTING_KEYS[c]]?.trim() ||
      DEFAULT_STORY_PREMIERES_PHOTOS[c],
    mainAlt: alts[0],
    leftAlt: alts[1],
    rightAlt: alts[2],
  };
}

export type StoryPremieresMedia = {
  leftPhotos: AboutStoryPhotos;
  rightPhotos: AboutStoryPhotos;
};

export function resolveStoryPremieresMedia(
  settings: Record<string, string | undefined>
): StoryPremieresMedia {
  return {
    leftPhotos: resolveTrio(
      settings,
      ["left1", "left2", "left3"],
      [
        "Chargement — Premières actions",
        "Préparation du départ",
        "Aide humanitaire",
      ]
    ),
    rightPhotos: resolveTrio(
      settings,
      ["right1", "right2", "right3"],
      [
        "Premier séjour au village",
        "Distribution de vêtements",
        "Constat des besoins",
      ]
    ),
  };
}
