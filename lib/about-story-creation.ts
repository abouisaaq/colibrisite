/**
 * Image du chapitre « Création de l'association ».
 * Admin → Médias → « Histoire — Création de l'association ».
 */

export const STORY_CREATION_SETTING_KEYS = {
  image: "story_creation_image",
} as const;

export const DEFAULT_STORY_CREATION_IMAGE =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=85";

export const DEFAULT_STORY_CREATION_IMAGE_ALT =
  "Création de l'association Les Colibris Porteurs d'Espoir";

export type StoryCreationAsideImage = {
  src: string;
  alt: string;
};

export function resolveStoryCreationImage(
  settings: Record<string, string | undefined>
): StoryCreationAsideImage {
  const src =
    settings[STORY_CREATION_SETTING_KEYS.image]?.trim() ||
    DEFAULT_STORY_CREATION_IMAGE;

  return {
    src,
    alt: DEFAULT_STORY_CREATION_IMAGE_ALT,
  };
}
