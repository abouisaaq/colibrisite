/**
 * Médias du chapitre « Accompagnement » (3 photos gauche + 3 droite).
 * Même mise en page que « Confort et réconfort ».
 */

import type { AboutStoryPhotos } from "@/lib/about-story-chapters";

export const STORY_ACCOMPAGNEMENT_SETTING_KEYS = {
  left1: "story_accompagnement_left_1",
  left2: "story_accompagnement_left_2",
  left3: "story_accompagnement_left_3",
  right1: "story_accompagnement_right_1",
  right2: "story_accompagnement_right_2",
  right3: "story_accompagnement_right_3",
} as const;

export type StoryAccompagnementPhotoSlot =
  keyof typeof STORY_ACCOMPAGNEMENT_SETTING_KEYS;

export const DEFAULT_STORY_ACCOMPAGNEMENT_PHOTOS: Record<
  StoryAccompagnementPhotoSlot,
  string
> = {
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
  slots: [
    StoryAccompagnementPhotoSlot,
    StoryAccompagnementPhotoSlot,
    StoryAccompagnementPhotoSlot,
  ],
  alts: [string, string, string]
): AboutStoryPhotos {
  const [a, b, c] = slots;
  return {
    main:
      settings[STORY_ACCOMPAGNEMENT_SETTING_KEYS[a]]?.trim() ||
      DEFAULT_STORY_ACCOMPAGNEMENT_PHOTOS[a],
    left:
      settings[STORY_ACCOMPAGNEMENT_SETTING_KEYS[b]]?.trim() ||
      DEFAULT_STORY_ACCOMPAGNEMENT_PHOTOS[b],
    right:
      settings[STORY_ACCOMPAGNEMENT_SETTING_KEYS[c]]?.trim() ||
      DEFAULT_STORY_ACCOMPAGNEMENT_PHOTOS[c],
    mainAlt: alts[0],
    leftAlt: alts[1],
    rightAlt: alts[2],
  };
}

export type StoryAccompagnementMedia = {
  leftPhotos: AboutStoryPhotos;
  rightPhotos: AboutStoryPhotos;
};

export function resolveStoryAccompagnementMedia(
  settings: Record<string, string | undefined>
): StoryAccompagnementMedia {
  return {
    leftPhotos: resolveTrio(
      settings,
      ["left1", "left2", "left3"],
      [
        "Accompagnement — action 1",
        "Accompagnement — action 2",
        "Accompagnement — action 3",
      ]
    ),
    rightPhotos: resolveTrio(
      settings,
      ["right1", "right2", "right3"],
      [
        "Accompagnement — action 4",
        "Accompagnement — action 5",
        "Accompagnement — action 6",
      ]
    ),
  };
}
