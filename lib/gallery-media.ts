/**
 * Helpers galerie : séparer photos et vidéos.
 */

export type GalleryMediaKind = "photo" | "video";

export function guessGalleryKind(input: {
  kind?: string | null;
  mimeType?: string | null;
  url?: string | null;
}): GalleryMediaKind {
  if (input.kind === "video" || input.kind === "photo") return input.kind;
  if (input.mimeType?.startsWith("video/")) return "video";
  const url = input.url?.toLowerCase() ?? "";
  if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url)) return "video";
  return "photo";
}

export function isGalleryVideo(item: {
  kind?: string | null;
  mimeType?: string | null;
  url?: string | null;
}): boolean {
  return guessGalleryKind(item) === "video";
}
