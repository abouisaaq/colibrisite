/**
 * Registre des sections CMS (Accueil / À propos) :
 * ordre, visibilité, et liens d’édition.
 */

export const HOME_SECTIONS_LAYOUT_KEY = "home_sections_layout";
export const ABOUT_SECTIONS_LAYOUT_KEY = "about_sections_layout";

export type CmsPageId = "accueil" | "a-propos";

export type SectionLayoutItem = {
  id: string;
  visible: boolean;
  order: number;
};

export type CmsSectionDef = {
  id: string;
  label: string;
  description: string;
  /** Route admin pour éditer le contenu (relatif) */
  href: string;
  /** Si false : section fixe (toujours visible, non réordonnable) — ex. header site */
  movable?: boolean;
};

export const HOME_SECTIONS: CmsSectionDef[] = [
  {
    id: "header",
    label: "Identité / Header",
    description: "Logo et taille du logo (menu & hero).",
    href: "/admin/accueil/header",
    movable: false,
  },
  {
    id: "hero",
    label: "Hero",
    description: "Grande image d’accueil, titre et sous-titre.",
    href: "/admin/accueil/hero",
  },
  {
    id: "stats",
    label: "Chiffres",
    description: "Familles, bénévoles, projets, partenaires.",
    href: "/admin/accueil/chiffres",
  },
  {
    id: "mission",
    label: "Notre mission",
    description: "Textes et images de la mission.",
    href: "/admin/accueil/mission",
  },
  {
    id: "actions",
    label: "Nos actions",
    description: "Titres de section + cartes (menu Contenu → Actions).",
    href: "/admin/accueil/actions",
  },
  {
    id: "news_events",
    label: "Actualités & événements",
    description: "Blocs actualités et événements (contenu séparé).",
    href: "/admin/accueil/actualites",
  },
  {
    id: "testimonials",
    label: "Témoignages",
    description: "Titres de section + cartes (menu Contenu → Témoignages).",
    href: "/admin/accueil/temoignages",
  },
  {
    id: "gallery",
    label: "Galerie spotlight",
    description: "Vidéos + frise photos + lien galerie.",
    href: "/admin/accueil/galerie",
  },
  {
    id: "newsletter",
    label: "WhatsApp",
    description: "Bloc d’inscription WhatsApp.",
    href: "/admin/accueil/whatsapp",
  },
  {
    id: "cta",
    label: "Faire un don (CTA)",
    description: "Bloc don en bas de page.",
    href: "/admin/accueil/don",
  },
  {
    id: "partners",
    label: "Partenaires",
    description: "Titres + logos (menu Contenu → Partenaires).",
    href: "/admin/accueil/partenaires",
  },
];

export const ABOUT_SECTIONS: CmsSectionDef[] = [
  {
    id: "hero",
    label: "En-tête de page",
    description: "Texte sous le titre « À propos ».",
    href: "/admin/a-propos/hero",
  },
  {
    id: "valeurs",
    label: "Nos valeurs",
    description: "Titre et liste des valeurs.",
    href: "/admin/a-propos/valeurs",
  },
  {
    id: "impact",
    label: "Notre impact",
    description: "Chiffres (partagés avec l’accueil).",
    href: "/admin/a-propos/impact",
  },
  {
    id: "colibri",
    label: "Pourquoi le Colibri",
    description: "Texte et image.",
    href: "/admin/a-propos/colibri",
  },
  {
    id: "equipe",
    label: "Notre équipe",
    description: "Intro et membres.",
    href: "/admin/a-propos/equipe",
  },
  {
    id: "engagements",
    label: "Nos engagements",
    description: "Titres et photos (voyages au Village).",
    href: "/admin/a-propos/engagements",
  },
  {
    id: "cta",
    label: "Appel à l’action",
    description: "Bloc final À propos.",
    href: "/admin/a-propos/cta",
  },
];

function defaultLayout(defs: CmsSectionDef[]): SectionLayoutItem[] {
  return defs.map((def, index) => ({
    id: def.id,
    visible: true,
    order: index,
  }));
}

export function getDefaultHomeLayout(): SectionLayoutItem[] {
  return defaultLayout(HOME_SECTIONS);
}

export function getDefaultAboutLayout(): SectionLayoutItem[] {
  return defaultLayout(ABOUT_SECTIONS);
}

export function parseSectionsLayout(
  raw: string | undefined | null,
  defs: CmsSectionDef[]
): SectionLayoutItem[] {
  const defaults = defaultLayout(defs);
  if (!raw?.trim()) return defaults;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return defaults;

    const byId = new Map<string, SectionLayoutItem>();
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      if (typeof row.id !== "string") continue;
      byId.set(row.id, {
        id: row.id,
        visible: row.visible !== false,
        order: typeof row.order === "number" ? row.order : 0,
      });
    }

    const merged = defs.map((def, index) => {
      const existing = byId.get(def.id);
      if (!existing) {
        return { id: def.id, visible: true, order: index };
      }
      return {
        id: def.id,
        visible: def.movable === false ? true : existing.visible,
        order: existing.order,
      };
    });

    return merged.sort((a, b) => a.order - b.order).map((item, index) => ({
      ...item,
      order: index,
    }));
  } catch {
    return defaults;
  }
}

export function resolveHomeLayout(settings: Record<string, string>): SectionLayoutItem[] {
  return parseSectionsLayout(settings[HOME_SECTIONS_LAYOUT_KEY], HOME_SECTIONS);
}

export function resolveAboutLayout(settings: Record<string, string>): SectionLayoutItem[] {
  return parseSectionsLayout(settings[ABOUT_SECTIONS_LAYOUT_KEY], ABOUT_SECTIONS);
}

export function isSectionVisible(
  layout: SectionLayoutItem[],
  id: string
): boolean {
  const item = layout.find((row) => row.id === id);
  return item ? item.visible : true;
}

export function orderedVisibleSectionIds(layout: SectionLayoutItem[]): string[] {
  return [...layout]
    .sort((a, b) => a.order - b.order)
    .filter((row) => row.visible)
    .map((row) => row.id);
}

export function getHomeSectionDef(id: string): CmsSectionDef | undefined {
  return HOME_SECTIONS.find((s) => s.id === id);
}

export function getAboutSectionDef(id: string): CmsSectionDef | undefined {
  return ABOUT_SECTIONS.find((s) => s.id === id);
}
