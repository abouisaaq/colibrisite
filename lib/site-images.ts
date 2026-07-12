import { ABOUT_IMAGES } from "@/lib/about-content";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { VOLUNTEER_HERO_IMAGE } from "@/lib/volunteer-options";

export const SITE_PAGE_IMAGE_SLOTS = {
  donation: SETTING_KEYS.donationImage,
  about_story: SETTING_KEYS.aboutImageStory,
  about_colibri: SETTING_KEYS.aboutImageColibri,
  volunteer: SETTING_KEYS.volunteerImage,
} as const;

export type SitePageImageSlot = keyof typeof SITE_PAGE_IMAGE_SLOTS;

export const DEFAULT_SITE_PAGE_IMAGES: Record<SitePageImageSlot, string> = {
  donation:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1000&q=85",
  about_story: ABOUT_IMAGES.story,
  about_colibri: ABOUT_IMAGES.colibri,
  volunteer: VOLUNTEER_HERO_IMAGE,
};

export function resolveSitePageImage(
  settings: Record<string, string | undefined>,
  slot: SitePageImageSlot
): string {
  return settings[SITE_PAGE_IMAGE_SLOTS[slot]] || DEFAULT_SITE_PAGE_IMAGES[slot];
}
