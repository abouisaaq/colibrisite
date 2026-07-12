import {
  UserRound,
  HandHeart,
  UserPlus,
  Users,
  CircleUserRound,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { resolveTestimonialIcon, getDefaultIconKey } from "@/lib/testimonial-icons";

export const TESTIMONIAL_TYPES = [
  "BENEFICIAIRE",
  "BENEVOLE",
  "DONATEUR",
  "PARTENAIRE",
  "ENSEIGNANT",
  "MEDECIN",
] as const;

export type TestimonialTypeKey = (typeof TESTIMONIAL_TYPES)[number];

export const TESTIMONIAL_TYPE_CONFIG: Record<
  TestimonialTypeKey,
  { label: string; Icon: LucideIcon }
> = {
  BENEFICIAIRE: { label: "Bénéficiaire", Icon: UserRound },
  BENEVOLE: { label: "Bénévole", Icon: HandHeart },
  DONATEUR: { label: "Donateur", Icon: UserPlus },
  PARTENAIRE: { label: "Partenaire", Icon: Users },
  ENSEIGNANT: { label: "Enseignant", Icon: CircleUserRound },
  MEDECIN: { label: "Médecin", Icon: UserCheck },
};

export function resolveTestimonialType(
  type: string | null | undefined,
  role: string | null | undefined
): TestimonialTypeKey {
  if (type && type in TESTIMONIAL_TYPE_CONFIG) {
    return type as TestimonialTypeKey;
  }

  const normalized = (role ?? "").toLowerCase();

  if (normalized.includes("bénévol") || normalized.includes("benevol")) return "BENEVOLE";
  if (normalized.includes("donat")) return "DONATEUR";
  if (normalized.includes("partenaire")) return "PARTENAIRE";
  if (normalized.includes("enseignant") || normalized.includes("prof")) return "ENSEIGNANT";
  if (normalized.includes("médecin") || normalized.includes("medecin") || normalized.includes("soignant")) {
    return "MEDECIN";
  }

  return "BENEFICIAIRE";
}

export function getTestimonialVisual(
  type: string | null | undefined,
  role: string | null | undefined,
  name: string,
  iconKey?: string | null
) {
  const key = resolveTestimonialType(type, role);
  const config = TESTIMONIAL_TYPE_CONFIG[key];
  const Icon = resolveTestimonialIcon(iconKey, key);
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  const resolvedIconKey = iconKey && iconKey.length > 0 ? iconKey : getDefaultIconKey(key);

  return { ...config, key, letter, Icon, iconKey: resolvedIconKey };
}
