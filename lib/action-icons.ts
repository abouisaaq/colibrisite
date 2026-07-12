import type { LucideIcon } from "lucide-react";
import {
  Utensils,
  UtensilsCrossed,
  Soup,
  Apple,
  ShoppingBasket,
  Package,
  Gift,
  GraduationCap,
  BookOpen,
  School,
  Library,
  Pencil,
  Lightbulb,
  HeartPulse,
  Heart,
  HeartHandshake,
  HandHeart,
  Handshake,
  HandHelping,
  Stethoscope,
  Hospital,
  Pill,
  Activity,
  Cross,
  Home,
  Building2,
  KeyRound,
  BedDouble,
  Droplets,
  Droplet,
  Waves,
  Palette,
  Music,
  Camera,
  PartyPopper,
  Users,
  UsersRound,
  Baby,
  Accessibility,
  Shield,
  ShieldCheck,
  Globe,
  MapPin,
  Leaf,
  Sprout,
  TreePine,
  Flower2,
  Sun,
  Sparkles,
  Star,
  Bird,
  Target,
  Compass,
  Trophy,
  Medal,
  Award,
  Briefcase,
  Landmark,
  Store,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  Bike,
  Bus,
  Car,
  Plane,
  Shirt,
  Footprints,
  Smile,
  ThumbsUp,
  Zap,
  Infinity,
} from "lucide-react";

export type ActionIconEntry = {
  key: string;
  label: string;
  category: string;
  Icon: LucideIcon;
};

export const ACTION_ICON_CATEGORIES = [
  "Tous",
  "Alimentation",
  "Éducation",
  "Santé",
  "Logement",
  "Eau & environnement",
  "Culture & loisirs",
  "Solidarité",
  "Communauté",
  "Symboles",
] as const;

export const ACTION_ICON_CATALOG: ActionIconEntry[] = [
  // Alimentation
  { key: "Utensils", label: "Couverts", category: "Alimentation", Icon: Utensils },
  { key: "UtensilsCrossed", label: "Repas", category: "Alimentation", Icon: UtensilsCrossed },
  { key: "Soup", label: "Soupe", category: "Alimentation", Icon: Soup },
  { key: "Apple", label: "Fruit", category: "Alimentation", Icon: Apple },
  { key: "ShoppingBasket", label: "Panier", category: "Alimentation", Icon: ShoppingBasket },
  { key: "Package", label: "Colis", category: "Alimentation", Icon: Package },
  { key: "Gift", label: "Don", category: "Alimentation", Icon: Gift },

  // Éducation
  { key: "GraduationCap", label: "Diplôme", category: "Éducation", Icon: GraduationCap },
  { key: "BookOpen", label: "Livre", category: "Éducation", Icon: BookOpen },
  { key: "School", label: "École", category: "Éducation", Icon: School },
  { key: "Library", label: "Bibliothèque", category: "Éducation", Icon: Library },
  { key: "Pencil", label: "Crayon", category: "Éducation", Icon: Pencil },
  { key: "Lightbulb", label: "Idée", category: "Éducation", Icon: Lightbulb },

  // Santé
  { key: "HeartPulse", label: "Santé", category: "Santé", Icon: HeartPulse },
  { key: "Stethoscope", label: "Stéthoscope", category: "Santé", Icon: Stethoscope },
  { key: "Hospital", label: "Hôpital", category: "Santé", Icon: Hospital },
  { key: "Pill", label: "Médicament", category: "Santé", Icon: Pill },
  { key: "Activity", label: "Activité", category: "Santé", Icon: Activity },
  { key: "Cross", label: "Croix", category: "Santé", Icon: Cross },
  { key: "Heart", label: "Cœur", category: "Santé", Icon: Heart },

  // Logement
  { key: "Home", label: "Maison", category: "Logement", Icon: Home },
  { key: "Building2", label: "Immeuble", category: "Logement", Icon: Building2 },
  { key: "KeyRound", label: "Clé", category: "Logement", Icon: KeyRound },
  { key: "BedDouble", label: "Hébergement", category: "Logement", Icon: BedDouble },

  // Eau & environnement
  { key: "Droplets", label: "Eau", category: "Eau & environnement", Icon: Droplets },
  { key: "Droplet", label: "Goutte", category: "Eau & environnement", Icon: Droplet },
  { key: "Waves", label: "Vagues", category: "Eau & environnement", Icon: Waves },
  { key: "Leaf", label: "Feuille", category: "Eau & environnement", Icon: Leaf },
  { key: "Sprout", label: "Pousse", category: "Eau & environnement", Icon: Sprout },
  { key: "TreePine", label: "Arbre", category: "Eau & environnement", Icon: TreePine },
  { key: "Flower2", label: "Fleur", category: "Eau & environnement", Icon: Flower2 },
  { key: "Sun", label: "Soleil", category: "Eau & environnement", Icon: Sun },

  // Culture & loisirs
  { key: "Palette", label: "Art", category: "Culture & loisirs", Icon: Palette },
  { key: "Music", label: "Musique", category: "Culture & loisirs", Icon: Music },
  { key: "Camera", label: "Photo", category: "Culture & loisirs", Icon: Camera },
  { key: "PartyPopper", label: "Fête", category: "Culture & loisirs", Icon: PartyPopper },
  { key: "Trophy", label: "Trophée", category: "Culture & loisirs", Icon: Trophy },
  { key: "Medal", label: "Médaille", category: "Culture & loisirs", Icon: Medal },
  { key: "Award", label: "Récompense", category: "Culture & loisirs", Icon: Award },
  { key: "Bike", label: "Vélo", category: "Culture & loisirs", Icon: Bike },

  // Solidarité
  { key: "HeartHandshake", label: "Entraide", category: "Solidarité", Icon: HeartHandshake },
  { key: "HandHeart", label: "Main cœur", category: "Solidarité", Icon: HandHeart },
  { key: "Handshake", label: "Poignée de main", category: "Solidarité", Icon: Handshake },
  { key: "HandHelping", label: "Aide", category: "Solidarité", Icon: HandHelping },
  { key: "Shirt", label: "Vêtements", category: "Solidarité", Icon: Shirt },
  { key: "Footprints", label: "Pas", category: "Solidarité", Icon: Footprints },
  { key: "Shield", label: "Protection", category: "Solidarité", Icon: Shield },
  { key: "ShieldCheck", label: "Sécurité", category: "Solidarité", Icon: ShieldCheck },

  // Communauté
  { key: "Users", label: "Groupe", category: "Communauté", Icon: Users },
  { key: "UsersRound", label: "Communauté", category: "Communauté", Icon: UsersRound },
  { key: "Baby", label: "Enfant", category: "Communauté", Icon: Baby },
  { key: "Accessibility", label: "Accessibilité", category: "Communauté", Icon: Accessibility },
  { key: "Smile", label: "Sourire", category: "Communauté", Icon: Smile },
  { key: "ThumbsUp", label: "Soutien", category: "Communauté", Icon: ThumbsUp },
  { key: "Briefcase", label: "Emploi", category: "Communauté", Icon: Briefcase },
  { key: "Landmark", label: "Institution", category: "Communauté", Icon: Landmark },
  { key: "Store", label: "Commerce", category: "Communauté", Icon: Store },

  // Symboles
  { key: "Globe", label: "Monde", category: "Symboles", Icon: Globe },
  { key: "MapPin", label: "Lieu", category: "Symboles", Icon: MapPin },
  { key: "Bird", label: "Colibri", category: "Symboles", Icon: Bird },
  { key: "Sparkles", label: "Espoir", category: "Symboles", Icon: Sparkles },
  { key: "Star", label: "Étoile", category: "Symboles", Icon: Star },
  { key: "Target", label: "Objectif", category: "Symboles", Icon: Target },
  { key: "Compass", label: "Boussole", category: "Symboles", Icon: Compass },
  { key: "Zap", label: "Énergie", category: "Symboles", Icon: Zap },
  { key: "Infinity", label: "Infini", category: "Symboles", Icon: Infinity },
  { key: "Phone", label: "Téléphone", category: "Symboles", Icon: Phone },
  { key: "Mail", label: "Courrier", category: "Symboles", Icon: Mail },
  { key: "MessageCircle", label: "Message", category: "Symboles", Icon: MessageCircle },
  { key: "Calendar", label: "Calendrier", category: "Symboles", Icon: Calendar },
  { key: "Clock", label: "Temps", category: "Symboles", Icon: Clock },
  { key: "Bus", label: "Transport", category: "Symboles", Icon: Bus },
  { key: "Car", label: "Voiture", category: "Symboles", Icon: Car },
  { key: "Plane", label: "Voyage", category: "Symboles", Icon: Plane },
];

/** Anciennes clés kebab-case (seed / CMS texte libre) → clés Lucide */
const LEGACY_ICON_ALIASES: Record<string, string> = {
  utensils: "Utensils",
  "graduation-cap": "GraduationCap",
  "heart-pulse": "HeartPulse",
  heart: "Heart",
  home: "Home",
  palette: "Palette",
  droplets: "Droplets",
};

const ICON_MAP = new Map(ACTION_ICON_CATALOG.map((entry) => [entry.key, entry]));

export const DEFAULT_ACTION_ICON_KEY = "Heart";

export function normalizeActionIconKey(icon: string | null | undefined): string {
  if (!icon) return DEFAULT_ACTION_ICON_KEY;
  if (ICON_MAP.has(icon)) return icon;
  const aliased = LEGACY_ICON_ALIASES[icon.toLowerCase()];
  if (aliased && ICON_MAP.has(aliased)) return aliased;
  return DEFAULT_ACTION_ICON_KEY;
}

export function resolveActionIcon(icon: string | null | undefined): LucideIcon {
  const key = normalizeActionIconKey(icon);
  return ICON_MAP.get(key)?.Icon ?? Heart;
}

export function getActionIconEntry(icon: string | null | undefined) {
  const key = normalizeActionIconKey(icon);
  return ICON_MAP.get(key) ?? ICON_MAP.get(DEFAULT_ACTION_ICON_KEY)!;
}
