import type { LucideIcon } from "lucide-react";
import {
  User,
  UserRound,
  UserCircle,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  UserCog,
  UserSearch,
  Users,
  UsersRound,
  CircleUser,
  CircleUserRound,
  Contact,
  ContactRound,
  PersonStanding,
  Baby,
  Accessibility,
  Heart,
  HeartHandshake,
  HandHeart,
  Handshake,
  HandHelping,
  Gift,
  HeartPulse,
  Rainbow,
  Smile,
  SmilePlus,
  Laugh,
  GraduationCap,
  BookOpen,
  BookUser,
  School,
  Library,
  Pencil,
  PenLine,
  Stethoscope,
  Hospital,
  Pill,
  Activity,
  Cross,
  Building2,
  Briefcase,
  Landmark,
  Store,
  Flower2,
  Leaf,
  Sun,
  Sparkles,
  Star,
  Bird,
  Feather,
  TreePine,
  Sprout,
  PartyPopper,
  Trophy,
  Medal,
  Award,
  ThumbsUp,
  Shield,
  ShieldCheck,
  Globe,
  Home,
  Lightbulb,
  Zap,
  Target,
  Compass,
  Anchor,
  Music,
  Camera,
  Palette,
  Coffee,
  Utensils,
  Plane,
  Car,
  Bike,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  MessagesSquare,
  Calendar,
  Clock,
  Infinity,
  Gem,
  Crown,
  Wand2,
} from "lucide-react";
import { TESTIMONIAL_TYPE_CONFIG, type TestimonialTypeKey } from "@/lib/testimonial-types";

export type TestimonialIconEntry = {
  key: string;
  label: string;
  category: string;
  Icon: LucideIcon;
};

export const TESTIMONIAL_ICON_CATEGORIES = [
  "Tous",
  "Personnes",
  "Solidarité",
  "Éducation",
  "Santé",
  "Professionnel",
  "Nature & espoir",
  "Célébration",
  "Symboles",
] as const;

export const TESTIMONIAL_ICON_CATALOG: TestimonialIconEntry[] = [
  // Personnes
  { key: "UserRound", label: "Personne", category: "Personnes", Icon: UserRound },
  { key: "User", label: "Profil", category: "Personnes", Icon: User },
  { key: "UserCircle", label: "Profil cercle", category: "Personnes", Icon: UserCircle },
  { key: "CircleUser", label: "Avatar", category: "Personnes", Icon: CircleUser },
  { key: "CircleUserRound", label: "Avatar rond", category: "Personnes", Icon: CircleUserRound },
  { key: "UserPlus", label: "Nouvelle personne", category: "Personnes", Icon: UserPlus },
  { key: "UserMinus", label: "Personne partie", category: "Personnes", Icon: UserMinus },
  { key: "UserCheck", label: "Personne validée", category: "Personnes", Icon: UserCheck },
  { key: "UserX", label: "Personne absente", category: "Personnes", Icon: UserX },
  { key: "UserCog", label: "Personne engagée", category: "Personnes", Icon: UserCog },
  { key: "UserSearch", label: "Recherche", category: "Personnes", Icon: UserSearch },
  { key: "Users", label: "Groupe", category: "Personnes", Icon: Users },
  { key: "UsersRound", label: "Groupe rond", category: "Personnes", Icon: UsersRound },
  { key: "Contact", label: "Contact", category: "Personnes", Icon: Contact },
  { key: "ContactRound", label: "Contact rond", category: "Personnes", Icon: ContactRound },
  { key: "PersonStanding", label: "Silhouette", category: "Personnes", Icon: PersonStanding },
  { key: "Baby", label: "Enfant", category: "Personnes", Icon: Baby },
  { key: "Accessibility", label: "Accessibilité", category: "Personnes", Icon: Accessibility },

  // Solidarité
  { key: "Heart", label: "Cœur", category: "Solidarité", Icon: Heart },
  { key: "HeartHandshake", label: "Entraide", category: "Solidarité", Icon: HeartHandshake },
  { key: "HandHeart", label: "Main cœur", category: "Solidarité", Icon: HandHeart },
  { key: "Handshake", label: "Poignée de main", category: "Solidarité", Icon: Handshake },
  { key: "HandHelping", label: "Main tendue", category: "Solidarité", Icon: HandHelping },
  { key: "Gift", label: "Cadeau", category: "Solidarité", Icon: Gift },
  { key: "HeartPulse", label: "Vitalité", category: "Solidarité", Icon: HeartPulse },
  { key: "Rainbow", label: "Arc-en-ciel", category: "Solidarité", Icon: Rainbow },
  { key: "Smile", label: "Sourire", category: "Solidarité", Icon: Smile },
  { key: "SmilePlus", label: "Joie", category: "Solidarité", Icon: SmilePlus },
  { key: "Laugh", label: "Rire", category: "Solidarité", Icon: Laugh },
  { key: "Shield", label: "Protection", category: "Solidarité", Icon: Shield },
  { key: "ShieldCheck", label: "Sécurité", category: "Solidarité", Icon: ShieldCheck },

  // Éducation
  { key: "GraduationCap", label: "Diplôme", category: "Éducation", Icon: GraduationCap },
  { key: "BookOpen", label: "Livre ouvert", category: "Éducation", Icon: BookOpen },
  { key: "BookUser", label: "Lecteur", category: "Éducation", Icon: BookUser },
  { key: "School", label: "École", category: "Éducation", Icon: School },
  { key: "Library", label: "Bibliothèque", category: "Éducation", Icon: Library },
  { key: "Pencil", label: "Crayon", category: "Éducation", Icon: Pencil },
  { key: "PenLine", label: "Écriture", category: "Éducation", Icon: PenLine },
  { key: "Lightbulb", label: "Idée", category: "Éducation", Icon: Lightbulb },

  // Santé
  { key: "Stethoscope", label: "Stéthoscope", category: "Santé", Icon: Stethoscope },
  { key: "Hospital", label: "Hôpital", category: "Santé", Icon: Hospital },
  { key: "Pill", label: "Soin", category: "Santé", Icon: Pill },
  { key: "Activity", label: "Activité", category: "Santé", Icon: Activity },
  { key: "Cross", label: "Croix", category: "Santé", Icon: Cross },

  // Professionnel
  { key: "Building2", label: "Bâtiment", category: "Professionnel", Icon: Building2 },
  { key: "Briefcase", label: "Mallette", category: "Professionnel", Icon: Briefcase },
  { key: "Landmark", label: "Institution", category: "Professionnel", Icon: Landmark },
  { key: "Store", label: "Commerce", category: "Professionnel", Icon: Store },
  { key: "Globe", label: "Monde", category: "Professionnel", Icon: Globe },
  { key: "Home", label: "Maison", category: "Professionnel", Icon: Home },

  // Nature & espoir
  { key: "Bird", label: "Oiseau", category: "Nature & espoir", Icon: Bird },
  { key: "Feather", label: "Plume", category: "Nature & espoir", Icon: Feather },
  { key: "Flower2", label: "Fleur", category: "Nature & espoir", Icon: Flower2 },
  { key: "Leaf", label: "Feuille", category: "Nature & espoir", Icon: Leaf },
  { key: "Sprout", label: "Pousse", category: "Nature & espoir", Icon: Sprout },
  { key: "TreePine", label: "Arbre", category: "Nature & espoir", Icon: TreePine },
  { key: "Sun", label: "Soleil", category: "Nature & espoir", Icon: Sun },
  { key: "Sparkles", label: "Étincelles", category: "Nature & espoir", Icon: Sparkles },
  { key: "Star", label: "Étoile", category: "Nature & espoir", Icon: Star },
  { key: "Compass", label: "Boussole", category: "Nature & espoir", Icon: Compass },

  // Célébration
  { key: "PartyPopper", label: "Fête", category: "Célébration", Icon: PartyPopper },
  { key: "Trophy", label: "Trophée", category: "Célébration", Icon: Trophy },
  { key: "Medal", label: "Médaille", category: "Célébration", Icon: Medal },
  { key: "Award", label: "Récompense", category: "Célébration", Icon: Award },
  { key: "ThumbsUp", label: "Bravo", category: "Célébration", Icon: ThumbsUp },
  { key: "Crown", label: "Couronne", category: "Célébration", Icon: Crown },
  { key: "Gem", label: "Gemme", category: "Célébration", Icon: Gem },
  { key: "Wand2", label: "Magie", category: "Célébration", Icon: Wand2 },

  // Symboles
  { key: "Target", label: "Objectif", category: "Symboles", Icon: Target },
  { key: "Zap", label: "Énergie", category: "Symboles", Icon: Zap },
  { key: "Anchor", label: "Ancre", category: "Symboles", Icon: Anchor },
  { key: "Infinity", label: "Infini", category: "Symboles", Icon: Infinity },
  { key: "MapPin", label: "Lieu", category: "Symboles", Icon: MapPin },
  { key: "Phone", label: "Téléphone", category: "Symboles", Icon: Phone },
  { key: "Mail", label: "Courrier", category: "Symboles", Icon: Mail },
  { key: "MessageCircle", label: "Message", category: "Symboles", Icon: MessageCircle },
  { key: "MessagesSquare", label: "Échange", category: "Symboles", Icon: MessagesSquare },
  { key: "Calendar", label: "Calendrier", category: "Symboles", Icon: Calendar },
  { key: "Clock", label: "Temps", category: "Symboles", Icon: Clock },
  { key: "Music", label: "Musique", category: "Symboles", Icon: Music },
  { key: "Camera", label: "Photo", category: "Symboles", Icon: Camera },
  { key: "Palette", label: "Art", category: "Symboles", Icon: Palette },
  { key: "Coffee", label: "Convivialité", category: "Symboles", Icon: Coffee },
  { key: "Utensils", label: "Repas", category: "Symboles", Icon: Utensils },
  { key: "Plane", label: "Voyage", category: "Symboles", Icon: Plane },
  { key: "Car", label: "Transport", category: "Symboles", Icon: Car },
  { key: "Bike", label: "Vélo", category: "Symboles", Icon: Bike },
];

const ICON_MAP = new Map(TESTIMONIAL_ICON_CATALOG.map((entry) => [entry.key, entry]));

export const DEFAULT_ICON_BY_TYPE: Record<TestimonialTypeKey, string> = {
  BENEFICIAIRE: "UserRound",
  BENEVOLE: "HandHeart",
  DONATEUR: "UserPlus",
  PARTENAIRE: "Users",
  ENSEIGNANT: "CircleUserRound",
  MEDECIN: "UserCheck",
};

export function resolveTestimonialIcon(
  iconKey: string | null | undefined,
  type: TestimonialTypeKey
): LucideIcon {
  if (iconKey && ICON_MAP.has(iconKey)) {
    return ICON_MAP.get(iconKey)!.Icon;
  }

  const defaultKey = DEFAULT_ICON_BY_TYPE[type];
  if (ICON_MAP.has(defaultKey)) {
    return ICON_MAP.get(defaultKey)!.Icon;
  }

  return TESTIMONIAL_TYPE_CONFIG[type].Icon;
}

export function getDefaultIconKey(type: TestimonialTypeKey): string {
  return DEFAULT_ICON_BY_TYPE[type];
}

export function getIconEntry(iconKey: string | null | undefined) {
  if (iconKey && ICON_MAP.has(iconKey)) return ICON_MAP.get(iconKey)!;
  return null;
}
