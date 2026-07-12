export const GALLERY_FILTERS = [
  { id: "all", label: "Tous", keywords: [] as string[] },
  {
    id: "evenements",
    label: "Évènements",
    keywords: ["évènement", "événement", "evenement", "event"],
  },
  {
    id: "benevolat",
    label: "Bénévolat",
    keywords: ["bénévolat", "benevolat", "bénévole", "benevole", "volontaire"],
  },
  {
    id: "collectes",
    label: "Collectes",
    keywords: ["collecte", "collectes", "don", "dons"],
  },
  {
    id: "sensibilisation",
    label: "Sensibilisation",
    keywords: ["sensibilisation", "sensibiliser", "awareness"],
  },
  {
    id: "education",
    label: "Éducation",
    keywords: ["éducation", "education", "école", "ecole", "scolaire"],
  },
] as const;

export type GalleryFilterId = (typeof GALLERY_FILTERS)[number]["id"];

export function imageMatchesFilter(
  filterId: GalleryFilterId,
  alt: string | null,
  albumTitle: string
): boolean {
  if (filterId === "all") return true;

  const filter = GALLERY_FILTERS.find((item) => item.id === filterId);
  if (!filter) return true;

  const haystack = `${alt ?? ""} ${albumTitle}`.toLowerCase();
  return filter.keywords.some((keyword) => haystack.includes(keyword));
}

export function parseImageMeta(alt: string | null, fallbackName: string) {
  if (!alt?.trim()) {
    return { name: fallbackName, location: null as string | null };
  }

  const separators = /\s*[·|–—]\s*/;
  const parts = alt.split(separators).map((part) => part.trim()).filter(Boolean);

  if (parts.length >= 2) {
    return { name: parts[0], location: parts[1] };
  }

  return { name: alt, location: null };
}

export const MASONRY_ASPECT_RATIOS = [
  "4/5",
  "1/1",
  "3/4",
  "5/4",
  "4/3",
  "2/3",
  "3/5",
  "1/1",
] as const;
