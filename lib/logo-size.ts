export const DEFAULT_SITE_LOGO_HEIGHT = 44;
export const MIN_SITE_LOGO_HEIGHT = 28;
export const MAX_SITE_LOGO_HEIGHT = 72;

export function parseSiteLogoHeight(value?: string | null): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed)) return DEFAULT_SITE_LOGO_HEIGHT;
  return Math.min(MAX_SITE_LOGO_HEIGHT, Math.max(MIN_SITE_LOGO_HEIGHT, parsed));
}
