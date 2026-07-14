export const ABOUT_STORY_QUOTE =
  "Chaque geste, aussi petit soit-il, peut changer une vie.";

export const ABOUT_STORY_DEFAULT = `Inspirés par la fable du colibri, nous avons créé Les Colibris Porteurs d'Espoir avec une conviction simple : personne ne devrait affronter seul les difficultés du quotidien.

Depuis nos premières actions sur le terrain, nous accompagnons les familles les plus vulnérables avec humanité, proximité et exigence. Chaque distribution, chaque atelier, chaque moment d'écoute participe à reconstruire du lien et de la dignité.

Notre association grandit grâce à des bénévoles engagés, des partenaires de confiance et une communauté qui croit que l'espoir se partage.`;

export const ABOUT_VALUES = [
  {
    icon: "heart",
    title: "Solidarité",
    description:
      "Nous agissons ensemble, main dans la main, pour que personne ne soit laissé de côté.",
  },
  {
    icon: "handshake",
    title: "Engagement",
    description:
      "Chaque bénévole, chaque donateur et chaque partenaire contribue concrètement à notre mission.",
  },
  {
    icon: "shield",
    title: "Transparence",
    description:
      "Nous rendons compte de nos actions avec clarté, honnêteté et responsabilité.",
  },
  {
    icon: "sprout",
    title: "Dignité",
    description:
      "Nous accueillons chaque personne avec respect, sans jugement et avec bienveillance.",
  },
] as const;

export type AboutValueIcon = (typeof ABOUT_VALUES)[number]["icon"];

export type AboutValue = {
  icon: AboutValueIcon;
  title: string;
  description: string;
};

const VALUE_ICONS: AboutValueIcon[] = ["heart", "handshake", "shield", "sprout"];

/** Format admin : blocs séparés par une ligne vide — 1re ligne = titre, suite = description */
export function parseAboutValues(raw?: string | null): AboutValue[] {
  if (!raw?.trim()) return [...ABOUT_VALUES];

  const trimmed = raw.trim();

  // Ancien format seed (phrase libre) → défauts
  if (!trimmed.includes("\n") && trimmed.includes(",")) {
    return [...ABOUT_VALUES];
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
        .slice(0, 4)
        .map((item, index): AboutValue | null => {
          if (!item || typeof item !== "object") return null;
          const record = item as Record<string, unknown>;
          const title = typeof record.title === "string" ? record.title.trim() : "";
          const description =
            typeof record.description === "string" ? record.description.trim() : "";
          if (!title) return null;
          return {
            icon: VALUE_ICONS[index] ?? "heart",
            title,
            description,
          };
        })
        .filter((v): v is AboutValue => v !== null);
    }
  } catch {
    // format texte
  }

  const blocks = trimmed
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) return [...ABOUT_VALUES];

  const values = blocks.slice(0, 4).map((block, index): AboutValue => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const title = lines[0] ?? `Valeur ${index + 1}`;
    const description = lines.slice(1).join(" ").trim();
    return {
      icon: VALUE_ICONS[index] ?? "heart",
      title,
      description,
    };
  });

  return values.length > 0 ? values : [...ABOUT_VALUES];
}

export function formatAboutValuesForEditor(values: AboutValue[] = [...ABOUT_VALUES]): string {
  return values
    .map((value) => `${value.title}\n${value.description}`)
    .join("\n\n");
}

export const ABOUT_COLIBRI_FABLE = `Face à un incendie dévastateur, tous les animaux fuient — sauf un minuscule colibri qui va et vient, une goutte d'eau à la fois.

On lui demande : « Que peux-tu vraiment changer ? »

Il répond : « Je fais ma part. »

C'est de cette fable que nous tirons notre nom et notre engagement : nous ne prétendons pas tout résoudre seuls, mais nous agissons chaque jour avec conviction, proximité et cœur.`;

export const ABOUT_COMMITMENTS = [
  "Respect",
  "Transparence",
  "Inclusion",
  "Humanité",
  "Proximité",
  "Responsabilité",
] as const;

/** Photos par défaut (voyages au village) — une par engagement. */
export const ABOUT_COMMITMENT_DEFAULT_IMAGES = [
  "/uploads/1783597350403-IMG-20251222-WA0024.jpg",
  "/uploads/1783596825669-IMG-20251221-WA0056.jpg",
  "/uploads/1783596521237-IMG-20251213-WA0007.jpg",
  "/uploads/1783530293004-1564553933_0.jpg",
  "/uploads/1783596119122-szzsz.jpg",
  "/uploads/1783530284380-consulat.jpg",
] as const;

export type AboutCommitmentItem = {
  title: string;
  imageUrl: string;
};

export function parseAboutCommitments(raw?: string | null): string[] {
  if (!raw?.trim()) return [...ABOUT_COMMITMENTS];

  const items = raw
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : [...ABOUT_COMMITMENTS];
}

export function parseAboutCommitmentImages(raw?: string | null): string[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
  } catch {
    return [];
  }
}

export function resolveAboutCommitmentItems(
  titlesRaw?: string | null,
  imagesRaw?: string | null
): AboutCommitmentItem[] {
  const titles = parseAboutCommitments(titlesRaw);
  const images = parseAboutCommitmentImages(imagesRaw);

  return titles.map((title, index) => ({
    title,
    imageUrl:
      images[index] ||
      ABOUT_COMMITMENT_DEFAULT_IMAGES[index % ABOUT_COMMITMENT_DEFAULT_IMAGES.length],
  }));
}

export type AboutTeamMember = {
  name: string;
  role: string;
  description: string;
  photoUrl?: string;
};

export const ABOUT_TEAM_INTRO =
  "Notre association est portée par des bénévoles, des fondateurs et des partenaires qui œuvrent chaque jour pour apporter de l'espoir aux familles les plus vulnérables.";

export const ABOUT_TEAM_MEMBERS: AboutTeamMember[] = [
  {
    name: "Ahmed Benali",
    role: "Président fondateur",
    description: "À l'origine de la création des Colibris Porteurs d'Espoir.",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=440&h=440&fit=crop&q=85",
  },
  {
    name: "Sarah El Idrissi",
    role: "Vice-présidente",
    description: "Coordonne les actions solidaires et les partenariats.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=440&h=440&fit=crop&q=85",
  },
  {
    name: "Youssef Amrani",
    role: "Coordinateur terrain",
    description: "Supervise les distributions alimentaires et les équipes.",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=440&h=440&fit=crop&q=85",
  },
  {
    name: "Fatima Zahra",
    role: "Bénévole",
    description: "Participe aux collectes et aux actions de proximité.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=440&h=440&fit=crop&q=85",
  },
  {
    name: "Khalid Mansouri",
    role: "Bénévole",
    description: "Accompagne les familles lors des événements solidaires.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=440&h=440&fit=crop&q=85",
  },
  {
    name: "Nadia Bennis",
    role: "Donatrice engagée",
    description: "Soutient régulièrement les projets de l'association.",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=440&h=440&fit=crop&q=85",
  },
];

export const MAX_ABOUT_TEAM_MEMBERS = 6;

export function parseAboutTeamMembers(raw?: string | null): AboutTeamMember[] {
  if (!raw?.trim()) return ABOUT_TEAM_MEMBERS;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return ABOUT_TEAM_MEMBERS;

    const members = parsed
      .map((item): AboutTeamMember | null => {
        if (!item || typeof item !== "object") return null;
        const record = item as Record<string, unknown>;
        const name = typeof record.name === "string" ? record.name.trim() : "";
        const role = typeof record.role === "string" ? record.role.trim() : "";
        if (!name || !role) return null;
        const description =
          typeof record.description === "string" ? record.description.trim() : "";
        const photoUrl =
          typeof record.photoUrl === "string" && record.photoUrl.trim()
            ? record.photoUrl.trim()
            : undefined;
        return { name, role, description, photoUrl };
      })
      .filter((member): member is AboutTeamMember => member !== null)
      .slice(0, MAX_ABOUT_TEAM_MEMBERS);

    return members.length > 0 ? members : ABOUT_TEAM_MEMBERS;
  } catch {
    return ABOUT_TEAM_MEMBERS;
  }
}

export const ABOUT_IMAGES = {
  story: "https://images.unsplash.com/photo-1532629345428-abbaf279893a?w=1200&q=85",
  colibri: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&q=85",
} as const;
