/**
 * Contenu de la frise « Notre histoire » (6 chapitres).
 * Modifier ici : années, titres, textes.
 *
 * Médias Séisme (photos, vidéo upload, lien YouTube) :
 * Admin → Médias → « Histoire — Séisme ».
 */

export type AboutStorySection = {
  heading: string;
  body: string;
};

export type AboutStoryPhotos = {
  main: string;
  left: string;
  right: string;
  mainAlt?: string;
  leftAlt?: string;
  rightAlt?: string;
};

export type AboutStoryMedia = {
  /** Vidéo uploadée (Convex) — utilisée si pas de YouTube */
  videoSrc?: string;
  /** Lien YouTube (prioritaire si valide) */
  youtubeUrl?: string;
  /** Poster / vignette si pas de vidéo ou avant lecture */
  videoPoster?: string;
  photos: AboutStoryPhotos;
};

/** Mise en page asymétrique : texte+photos / photos+texte */
export type AboutStorySplitLayout = {
  left: AboutStorySection;
  right: AboutStorySection;
  leftPhotos: AboutStoryPhotos;
  rightPhotos: AboutStoryPhotos;
};

export type AboutStoryChapter = {
  id: string;
  /** Affiché sous l’illustration */
  year: string;
  /** Libellé secondaire (masqué s’il est identique à `year`) */
  stageLabel: string;
  /** Ligne d’intro au-dessus du titre (ex. date / contexte) */
  lead?: string;
  /** Titre du panneau descriptif */
  title: string;
  /** Premier paragraphe (sous le titre) */
  description: string;
  /** Paragraphes sans sous-titre (ex. frise chronologique) */
  paragraphs?: string[];
  /** Blocs supplémentaires avec sous-titre */
  sections?: AboutStorySection[];
  /** Lien optionnel du bouton « Découvrir ce chapitre » */
  href?: string;
  /** Chemin public vers l’illustration de la frise (PNG/WebP) */
  imageSrc?: string;
  imageAlt: string;
  /** Clé visuelle du placeholder SVG si pas d’image frise */
  visualKey:
    | "egg"
    | "chick"
    | "nest"
    | "wings"
    | "branch"
    | "flight";
  /** Mise en page riche : vidéo + texte + 3 photos (ex. Séisme / Terrain) */
  media?: AboutStoryMedia;
  /** Position de la vidéo : gauche (Séisme) ou droite (Terrain de foot) */
  mediaPlacement?: "video-left" | "video-right";
  /** Mise en page diagonale (ex. Premières actions) */
  splitLayout?: AboutStorySplitLayout;
  /** Mise en page type Séisme : photos | texte | photos */
  sidePhotos?: {
    leftPhotos: AboutStoryPhotos;
    rightPhotos: AboutStoryPhotos;
  };
  /** Texte à gauche + une grande image à droite */
  asideImage?: {
    src: string;
    alt: string;
  };
};

export const ABOUT_STORY_EYEBROW = "Notre histoire";
export const ABOUT_STORY_HEADING = "Grandir, agir, transmettre";

export const ABOUT_STORY_CHAPTERS: AboutStoryChapter[] = [
  {
    id: "seisme",
    year: "Séisme",
    stageLabel: "Séisme",
    title: "Séisme au Maroc — 8 septembre 2023",
    description: "",
    sections: [
      {
        heading: "Au lendemain de la catastrophe",
        body: "Le lendemain du séisme, nous apprenons que le village de notre ami Omar — gardien de nuit au village des artisans d’Agadir — a été durement touché. Face aux pertes humaines et à la détresse des familles, une évidence s’impose : nous devons agir.",
      },
      {
        heading: "Notre réaction",
        body: "Avec Hossin Baghach, artisan de la Kasbah Souss, nous décidons de nous mobiliser pour venir en aide aux habitants du village. Très vite, d’autres personnes sensibles à cette urgence rejoignent le mouvement. C’est le début d’une chaîne de solidarité.",
      },
    ],
    imageSrc: "/brand/story/01-oeuf-transparent.png?v=2",
    imageAlt: "Œuf — début de l'histoire",
    visualKey: "egg",
    mediaPlacement: "video-left",
    /** Médias injectés depuis les settings (Admin → Médias) */
    media: {
      photos: {
        main: "",
        left: "",
        right: "",
      },
    },
  },
  {
    id: "premieres-actions",
    year: "Premières actions",
    stageLabel: "Premières actions",
    title: "",
    description: "",
    imageSrc: "/brand/story/02-poussin-transparent.png?v=4",
    imageAlt: "Poussin — Premières actions",
    visualKey: "chick",
    /** Photos injectées depuis Admin → Médias */
    splitLayout: {
      left: {
        heading: "Premières Actions",
        body: "Le 23/09/2023, un chargement de 300 kgs de vêtements, tentes et autres objets de 1ère nécessité (lampes torches etc.) part du domicile d'Edith en Bretagne.",
      },
      right: {
        heading: "Premier Séjour",
        body: "Le 02/10/2023, 1er séjour pour Edith au village et 1ère distribution de vêtements, constat des dégâts et des besoins.",
      },
      leftPhotos: { main: "", left: "", right: "" },
      rightPhotos: { main: "", left: "", right: "" },
    },
  },
  {
    id: "confort-reconfort",
    year: "Confort et réconfort",
    stageLabel: "Confort et réconfort",
    title: "",
    description: "",
    paragraphs: [
      "Le 16/01/2024, sardinade, aménagement de la mosquée (bâche, filets et sono), aménagement de l'école (palettes, tapis, éclairage, tableaux), distribution de matériel scolaire, réunion avec les villageois.",
      "Le 04/02/2024, livraison d'une pompe de secours, invitation à un mariage, prise de connaissance avec une fratrie orpheline.",
      "Le 17/02/2024, journée évènement à la Kasbah Souss, pour récolter des fonds pour le projet « paniers ramadan », présence d'un groupe d'hommes du village qui sont venus témoigner.",
      "Le 27/02/2024, montage de pulvérisateurs, dons de vêtements, nourriture et fournitures scolaires.",
      "Le 07/03/2024, distribution de paniers ramadan à 65 familles — 3 T d'aliments ont quitté Inezgane pour le village sinistré.",
    ],
    imageSrc: "/brand/story/03-nid-transparent.png?v=4",
    imageAlt: "Colibri dans le nid — Confort et réconfort",
    visualKey: "nest",
    /** Photos injectées depuis Admin → Médias */
    sidePhotos: {
      leftPhotos: { main: "", left: "", right: "" },
      rightPhotos: { main: "", left: "", right: "" },
    },
  },
  {
    id: "terrain-de-foot",
    year: "Terrain de foot",
    stageLabel: "Terrain de foot",
    title: "",
    description: "",
    sections: [
      {
        heading: "04/05/2024",
        body: "Journée festive pour les enfants de El Khomss et de Taddart. Inauguration du terrain de foot.",
      },
      {
        heading: "06/05/2024",
        body: "Installation et début d'apprentissage pour Lahcen, 17 ans, orphelin de père et de mère suite au séisme. Lahcen a maintenant une chambre équipée à Agadir. Ses deux sœurs, quant à elles, sont restées au village pour le moment.",
      },
    ],
    imageSrc: "/brand/story/04-branche-transparent.png?v=2",
    imageAlt: "Colibri sur une branche — Terrain de foot",
    visualKey: "branch",
    mediaPlacement: "video-right",
    /** Médias injectés depuis Admin → Médias */
    media: {
      photos: {
        main: "",
        left: "",
        right: "",
      },
    },
  },
  {
    id: "ancrage",
    year: "Accompagnement",
    stageLabel: "Accompagnement",
    title: "",
    description: "",
    sections: [
      {
        heading: "Rester présent",
        body: "Après les premiers secours et les moments de fête, nous restons auprès des familles. L'aide se poursuit : suivi des besoins, accompagnement des enfants, et consolidation des liens tissés avec le village.",
      },
      {
        heading: "Préparer la suite",
        body: "Cette présence régulière nous montre qu'un engagement durable nécessite une structure. L'idée d'une association prend forme : pour agir ensemble, dans la durée, et faire sa part — comme le colibri.",
      },
    ],
    imageSrc: "/brand/story/06-accompagnement-transparent.png?v=2",
    imageAlt: "Colibri en vol — Accompagnement",
    visualKey: "wings",
    /** Photos injectées depuis Admin → Notre histoire */
    sidePhotos: {
      leftPhotos: { main: "", left: "", right: "" },
      rightPhotos: { main: "", left: "", right: "" },
    },
  },
  {
    id: "creation-association",
    year: "Création de l'association",
    stageLabel: "Création de l'association",
    title:
      'Création de l\'Association "Les Colibris Porteurs d\'Espoir" le 7 avril 2024',
    description: "",
    sections: [
      {
        heading: "À propos de l'association",
        body: [
          "L’histoire du colibri et de l’incendie est une légende amérindienne qui illustre l’importance de faire sa part, même si elle semble petite. Voici un résumé :",
          "Un jour, une grande forêt est ravagée par un incendie. Tous les animaux, terrifiés, observent impuissants le désastre. Seul un petit colibri s’active, allant chercher quelques gouttes d’eau avec son bec pour les jeter sur le feu. Les autres animaux, incrédules, lui demandent : « Que fais-tu, colibri ? Tu ne vois pas que cela ne sert à rien ? » Le colibri répond : « Je fais ma part. »",
          "Cette histoire nous enseigne que chaque geste compte, même le plus petit, et que chacun peut contribuer à sa manière à un changement positif.",
        ].join("\n\n"),
      },
    ],
    imageSrc: "/brand/story/05-vol-transparent.png?v=2",
    imageAlt: "Colibri en vol — Création de l'association",
    visualKey: "flight",
    /** Image injectée depuis Admin → Médias */
    asideImage: {
      src: "",
      alt: "Création de l'association Les Colibris Porteurs d'Espoir",
    },
  },
];
