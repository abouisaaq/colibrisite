export const MISSION_IMAGE_SETTING_KEYS = {
  main: "mission_image_main",
  left: "mission_image_left",
  right: "mission_image_right",
} as const;

export type MissionImageSlot = keyof typeof MISSION_IMAGE_SETTING_KEYS;

export const DEFAULT_MISSION_IMAGES: Record<MissionImageSlot, string> = {
  main: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=85",
  left: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=85",
  right: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=85",
};

export function resolveMissionImages(
  settings: Record<string, string | undefined>
): Record<MissionImageSlot, string> {
  return {
    main: settings[MISSION_IMAGE_SETTING_KEYS.main] || DEFAULT_MISSION_IMAGES.main,
    left: settings[MISSION_IMAGE_SETTING_KEYS.left] || DEFAULT_MISSION_IMAGES.left,
    right: settings[MISSION_IMAGE_SETTING_KEYS.right] || DEFAULT_MISSION_IMAGES.right,
  };
}
