/**
 * CMS « Notre histoire » — textes éditables via Admin → Notre histoire.
 * Les images des cercles de la frise restent en code (imageSrc), non modifiables ici.
 */

import {
  ABOUT_STORY_CHAPTERS,
  ABOUT_STORY_EYEBROW,
  ABOUT_STORY_HEADING,
  type AboutStoryChapter,
  type AboutStorySection,
} from "@/lib/about-story-chapters";

export const STORY_CHAPTERS_CMS_KEY = "story_chapters_cms";

export type StoryChapterCmsTexts = {
  /** Label sous le cercle (ex. Séisme) — pas l’image du cercle */
  year?: string;
  stageLabel?: string;
  title?: string;
  description?: string;
  paragraphs?: string[];
  sections?: AboutStorySection[];
  splitLeft?: AboutStorySection;
  splitRight?: AboutStorySection;
};

export type StoryChaptersCms = {
  eyebrow?: string;
  heading?: string;
  chapters?: Record<string, StoryChapterCmsTexts>;
};

function cloneSections(sections?: AboutStorySection[]): AboutStorySection[] {
  return (sections ?? []).map((s) => ({
    heading: s.heading,
    body: s.body,
  }));
}

/** Valeurs par défaut = contenu actuel du code. */
export function getDefaultStoryChaptersCms(): StoryChaptersCms {
  const chapters: Record<string, StoryChapterCmsTexts> = {};

  for (const chapter of ABOUT_STORY_CHAPTERS) {
    const texts: StoryChapterCmsTexts = {
      year: chapter.year,
      stageLabel: chapter.stageLabel,
      title: chapter.title,
      description: chapter.description,
    };

    if (chapter.paragraphs?.length) {
      texts.paragraphs = [...chapter.paragraphs];
    }
    if (chapter.sections?.length) {
      texts.sections = cloneSections(chapter.sections);
    }
    if (chapter.splitLayout) {
      texts.splitLeft = { ...chapter.splitLayout.left };
      texts.splitRight = { ...chapter.splitLayout.right };
    }

    chapters[chapter.id] = texts;
  }

  return {
    eyebrow: ABOUT_STORY_EYEBROW,
    heading: ABOUT_STORY_HEADING,
    chapters,
  };
}

export function parseStoryChaptersCms(
  raw: string | undefined | null
): StoryChaptersCms {
  const defaults = getDefaultStoryChaptersCms();
  if (!raw?.trim()) return defaults;
  try {
    const parsed = JSON.parse(raw) as StoryChaptersCms;
    if (!parsed || typeof parsed !== "object") return defaults;

    const chapters: Record<string, StoryChapterCmsTexts> = {
      ...(defaults.chapters ?? {}),
    };
    for (const [id, overlay] of Object.entries(parsed.chapters ?? {})) {
      chapters[id] = {
        ...(chapters[id] ?? {}),
        ...overlay,
      };
    }

    return {
      eyebrow: parsed.eyebrow?.trim() || defaults.eyebrow,
      heading: parsed.heading?.trim() || defaults.heading,
      chapters,
    };
  } catch {
    return defaults;
  }
}

/** Merge CMS texts onto code chapters. Never overrides imageSrc / visualKey / layout type. */
export function mergeStoryChaptersWithCms(
  cms: StoryChaptersCms
): AboutStoryChapter[] {
  return ABOUT_STORY_CHAPTERS.map((chapter) => {
    const overlay = cms.chapters?.[chapter.id];
    if (!overlay) return chapter;

    const next: AboutStoryChapter = { ...chapter };

    if (typeof overlay.year === "string" && overlay.year.trim()) {
      next.year = overlay.year.trim();
    }
    if (typeof overlay.stageLabel === "string" && overlay.stageLabel.trim()) {
      next.stageLabel = overlay.stageLabel.trim();
    }
    if (typeof overlay.title === "string") {
      next.title = overlay.title;
    }
    if (typeof overlay.description === "string") {
      next.description = overlay.description;
    }
    if (Array.isArray(overlay.paragraphs)) {
      next.paragraphs = overlay.paragraphs.map((p) => p.trim()).filter(Boolean);
    }
    if (Array.isArray(overlay.sections)) {
      next.sections = overlay.sections
        .map((s) => ({
          heading: (s.heading ?? "").trim(),
          body: (s.body ?? "").trim(),
        }))
        .filter((s) => s.heading || s.body);
    }
    if (chapter.splitLayout && (overlay.splitLeft || overlay.splitRight)) {
      next.splitLayout = {
        ...chapter.splitLayout,
        left: overlay.splitLeft
          ? {
              heading: (overlay.splitLeft.heading ?? "").trim(),
              body: (overlay.splitLeft.body ?? "").trim(),
            }
          : chapter.splitLayout.left,
        right: overlay.splitRight
          ? {
              heading: (overlay.splitRight.heading ?? "").trim(),
              body: (overlay.splitRight.body ?? "").trim(),
            }
          : chapter.splitLayout.right,
      };
    }

    return next;
  });
}

export function getStoryCmsMeta(cms: StoryChaptersCms): {
  eyebrow: string;
  heading: string;
} {
  return {
    eyebrow: cms.eyebrow?.trim() || ABOUT_STORY_EYEBROW,
    heading: cms.heading?.trim() || ABOUT_STORY_HEADING,
  };
}
