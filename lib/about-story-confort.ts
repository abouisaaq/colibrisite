/**
 * Médias du chapitre « Confort et réconfort » (3 photos gauche + 3 droite).
 * Admin → Médias → « Histoire — Confort et réconfort ».
 */

import type { AboutStoryPhotos } from "@/lib/about-story-chapters";

export const STORY_CONFORT_SETTING_KEYS = {
  left1: "story_confort_left_1",
  left2: "story_confort_left_2",
  left3: "story_confort_left_3",
  right1: "story_confort_right_1",
  right2: "story_confort_right_2",
  right3: "story_confort_right_3",
} as const;

export type StoryConfortPhotoSlot = keyof typeof STORY_CONFORT_SETTING_KEYS;

export const DEFAULT_STORY_CONFORT_PHOTOS: Record<StoryConfortPhotoSlot, string> =
  {
    left1:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=85",
    left2:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=85",
    left3:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=85",
    right1:
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=85",
    right2:
      "https://images.unsplash.com/photo-1593113598332-cd288d298e48?w=800&q=85",
    right3:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=85",
  };

function resolveTrio(
  settings: Record<string, string | undefined>,
  slots: [StoryConfortPhotoSlot, StoryConfortPhotoSlot, StoryConfortPhotoSlot],
  alts: [string, string, string]
): AboutStoryPhotos {
  const [a, b, c] = slots;
  return {
    main:
      settings[STORY_CONFORT_SETTING_KEYS[a]]?.trim() ||
      DEFAULT_STORY_CONFORT_PHOTOS[a],
    left:
      settings[STORY_CONFORT_SETTING_KEYS[b]]?.trim() ||
      DEFAULT_STORY_CONFORT_PHOTOS[b],
    right:
      settings[STORY_CONFORT_SETTING_KEYS[c]]?.trim() ||
      DEFAULT_STORY_CONFORT_PHOTOS[c],
    mainAlt: alts[0],
    leftAlt: alts[1],
    rightAlt: alts[2],
  };
}

export type StoryConfortMedia = {
  leftPhotos: AboutStoryPhotos;
  rightPhotos: AboutStoryPhotos;
};

export function resolveStoryConfortMedia(
  settings: Record<string, string | undefined>
): StoryConfortMedia {
  return {
    leftPhotos: resolveTrio(
      settings,
      ["left1", "left2", "left3"],
      [
        "Confort et réconfort — action 1",
        "Confort et réconfort — action 2",
        "Confort et réconfort — action 3",
      ]
    ),
    rightPhotos: resolveTrio(
      settings,
      ["right1", "right2", "right3"],
      [
        "Confort et réconfort — action 4",
        "Confort et réconfort — action 5",
        "Confort et réconfort — action 6",
      ]
    ),
  };
}
