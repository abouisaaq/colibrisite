export const VOLUNTEER_AVAILABILITY_OPTIONS = [
  { value: "week", label: "Semaine" },
  { value: "weekend", label: "Week-end" },
  { value: "flexible", label: "Selon les besoins" },
] as const;

export const VOLUNTEER_DOMAIN_OPTIONS = [
  { value: "food", label: "Distribution alimentaire" },
  { value: "school", label: "Soutien scolaire" },
  { value: "events", label: "Événementiel" },
  { value: "logistics", label: "Logistique" },
  { value: "comms", label: "Communication" },
  { value: "collection", label: "Collecte" },
] as const;

export const VOLUNTEER_WHY_POINTS = [
  "Aidez concrètement les familles.",
  "Rencontrez des personnes engagées.",
  "Développez de nouvelles compétences.",
  "Participez à des actions solidaires.",
] as const;

export const VOLUNTEER_HERO_IMAGE =
  "https://images.unsplash.com/photo-1532629345428-abbaf279893a?w=1200&q=85";

export function formatVolunteerAvailability(value?: string | null): string {
  if (!value) return "—";
  const map = Object.fromEntries(
    VOLUNTEER_AVAILABILITY_OPTIONS.map((item) => [item.value, item.label])
  );
  return value
    .split(",")
    .map((part) => map[part] ?? part)
    .join(", ");
}

export function formatVolunteerDomains(value?: string | null): string {
  if (!value) return "—";
  const map = Object.fromEntries(VOLUNTEER_DOMAIN_OPTIONS.map((item) => [item.value, item.label]));
  return value
    .split(",")
    .map((part) => map[part] ?? part)
    .join(", ");
}

export function formatVolunteerList(value?: string | null): string {
  if (!value) return "—";
  const availabilityMap = Object.fromEntries(
    VOLUNTEER_AVAILABILITY_OPTIONS.map((item) => [item.value, item.label])
  );
  const domainMap = Object.fromEntries(
    VOLUNTEER_DOMAIN_OPTIONS.map((item) => [item.value, item.label])
  );
  return value
    .split(",")
    .map((part) => availabilityMap[part] ?? domainMap[part] ?? part)
    .join(", ");
}

export const VOLUNTEER_STATUS_LABELS: Record<string, string> = {
  NEW: "Nouvelle",
  REVIEWING: "En cours",
  ACCEPTED: "Acceptée",
  REJECTED: "Refusée",
};
