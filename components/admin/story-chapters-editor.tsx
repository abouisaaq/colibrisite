"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveStoryChaptersCms } from "@/actions/admin";
import {
  type StoryChapterCmsTexts,
  type StoryChaptersCms,
} from "@/lib/about-story-cms";
import { StorySeismeMediaUpload } from "@/components/admin/story-seisme-media-upload";
import { StoryPremieresMediaUpload } from "@/components/admin/story-premieres-media-upload";
import { StoryConfortMediaUpload } from "@/components/admin/story-confort-media-upload";
import { StoryTerrainMediaUpload } from "@/components/admin/story-terrain-media-upload";
import { StoryCreationMediaUpload } from "@/components/admin/story-creation-media-upload";

type MediaProps = {
  seisme: {
    photos: { photo1: string; photo2: string; photo3: string };
    videoUrl?: string;
    youtubeUrl?: string;
  };
  premieres: Record<string, string>;
  confort: Record<string, string>;
  terrain: {
    photos: { photo1: string; photo2: string; photo3: string };
    videoUrl?: string;
    youtubeUrl?: string;
  };
  creationImageUrl?: string;
};

const CHAPTER_TABS: { id: string; label: string }[] = [
  { id: "seisme", label: "Séisme" },
  { id: "premieres-actions", label: "Premières actions" },
  { id: "confort-reconfort", label: "Confort" },
  { id: "terrain-de-foot", label: "Terrain de foot" },
  { id: "creation-association", label: "Création" },
];

function ensureChapter(
  chapters: Record<string, StoryChapterCmsTexts>,
  id: string
): StoryChapterCmsTexts {
  return chapters[id] ?? {};
}

export function StoryChaptersEditor({
  initialCms,
  media,
}: {
  initialCms: StoryChaptersCms;
  media: MediaProps;
}) {
  const [cms, setCms] = useState<StoryChaptersCms>(initialCms);
  const [isPending, startTransition] = useTransition();

  function updateChapter(id: string, patch: Partial<StoryChapterCmsTexts>) {
    setCms((prev) => ({
      ...prev,
      chapters: {
        ...(prev.chapters ?? {}),
        [id]: {
          ...ensureChapter(prev.chapters ?? {}, id),
          ...patch,
        },
      },
    }));
  }

  function updateSection(
    chapterId: string,
    index: number,
    field: "heading" | "body",
    value: string
  ) {
    const chapter = ensureChapter(cms.chapters ?? {}, chapterId);
    const sections = [...(chapter.sections ?? [])];
    const current = sections[index] ?? { heading: "", body: "" };
    sections[index] = { ...current, [field]: value };
    updateChapter(chapterId, { sections });
  }

  function updateParagraph(chapterId: string, index: number, value: string) {
    const chapter = ensureChapter(cms.chapters ?? {}, chapterId);
    const paragraphs = [...(chapter.paragraphs ?? [])];
    paragraphs[index] = value;
    updateChapter(chapterId, { paragraphs });
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveStoryChaptersCms(cms);
        toast.success("Textes de l'histoire enregistrés");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors de l'enregistrement"
        );
      }
    });
  }

  const chapters = cms.chapters ?? {};

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
        <p className="text-sm text-[#6B7280]">
          Les images des <strong>cercles de la frise</strong> (œuf, poussin, nid…)
          sont fixes dans le site et ne se changent pas ici. Vous pouvez
          modifier les textes, photos et vidéos de chaque chapitre.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="story-eyebrow">Sur-titre</Label>
            <Input
              id="story-eyebrow"
              className="mt-1.5"
              value={cms.eyebrow ?? ""}
              onChange={(e) =>
                setCms((prev) => ({ ...prev, eyebrow: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="story-heading">Titre de section</Label>
            <Input
              id="story-heading"
              className="mt-1.5"
              value={cms.heading ?? ""}
              onChange={(e) =>
                setCms((prev) => ({ ...prev, heading: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="seisme" className="w-full">
        <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1">
          {CHAPTER_TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-xs sm:text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Séisme */}
        <TabsContent value="seisme" className="space-y-4">
          <ChapterTextsCard
            year={chapters.seisme?.year ?? ""}
            stageLabel={chapters.seisme?.stageLabel ?? ""}
            title={chapters.seisme?.title ?? ""}
            onYear={(v) => updateChapter("seisme", { year: v })}
            onStageLabel={(v) => updateChapter("seisme", { stageLabel: v })}
            onTitle={(v) => updateChapter("seisme", { title: v })}
          />
          <SectionsEditor
            sections={chapters.seisme?.sections ?? []}
            onChange={(index, field, value) =>
              updateSection("seisme", index, field, value)
            }
          />
          <StorySeismeMediaUpload
            photoUrls={media.seisme.photos}
            videoUrl={media.seisme.videoUrl}
            youtubeUrl={media.seisme.youtubeUrl}
          />
        </TabsContent>

        {/* Premières actions */}
        <TabsContent value="premieres-actions" className="space-y-4">
          <ChapterTextsCard
            year={chapters["premieres-actions"]?.year ?? ""}
            stageLabel={chapters["premieres-actions"]?.stageLabel ?? ""}
            title={chapters["premieres-actions"]?.title ?? ""}
            hideTitle
            onYear={(v) => updateChapter("premieres-actions", { year: v })}
            onStageLabel={(v) =>
              updateChapter("premieres-actions", { stageLabel: v })
            }
            onTitle={(v) => updateChapter("premieres-actions", { title: v })}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <SplitBlockEditor
              label="Bloc gauche"
              section={chapters["premieres-actions"]?.splitLeft}
              onChange={(section) =>
                updateChapter("premieres-actions", { splitLeft: section })
              }
            />
            <SplitBlockEditor
              label="Bloc droite"
              section={chapters["premieres-actions"]?.splitRight}
              onChange={(section) =>
                updateChapter("premieres-actions", { splitRight: section })
              }
            />
          </div>
          <StoryPremieresMediaUpload
            photoUrls={{
              left1: media.premieres.left1 ?? "",
              left2: media.premieres.left2 ?? "",
              left3: media.premieres.left3 ?? "",
              right1: media.premieres.right1 ?? "",
              right2: media.premieres.right2 ?? "",
              right3: media.premieres.right3 ?? "",
            }}
          />
        </TabsContent>

        {/* Confort */}
        <TabsContent value="confort-reconfort" className="space-y-4">
          <ChapterTextsCard
            year={chapters["confort-reconfort"]?.year ?? ""}
            stageLabel={chapters["confort-reconfort"]?.stageLabel ?? ""}
            title={chapters["confort-reconfort"]?.title ?? ""}
            hideTitle
            onYear={(v) => updateChapter("confort-reconfort", { year: v })}
            onStageLabel={(v) =>
              updateChapter("confort-reconfort", { stageLabel: v })
            }
            onTitle={(v) => updateChapter("confort-reconfort", { title: v })}
          />
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-3">
            <h4 className="font-semibold text-[#111827]">Paragraphes</h4>
            {(chapters["confort-reconfort"]?.paragraphs ?? []).map(
              (paragraph, index) => (
                <div key={index}>
                  <Label>Paragraphe {index + 1}</Label>
                  <Textarea
                    className="mt-1.5 min-h-[88px]"
                    value={paragraph}
                    onChange={(e) =>
                      updateParagraph("confort-reconfort", index, e.target.value)
                    }
                  />
                </div>
              )
            )}
          </div>
          <StoryConfortMediaUpload
            photoUrls={{
              left1: media.confort.left1 ?? "",
              left2: media.confort.left2 ?? "",
              left3: media.confort.left3 ?? "",
              right1: media.confort.right1 ?? "",
              right2: media.confort.right2 ?? "",
              right3: media.confort.right3 ?? "",
            }}
          />
        </TabsContent>

        {/* Terrain */}
        <TabsContent value="terrain-de-foot" className="space-y-4">
          <ChapterTextsCard
            year={chapters["terrain-de-foot"]?.year ?? ""}
            stageLabel={chapters["terrain-de-foot"]?.stageLabel ?? ""}
            title={chapters["terrain-de-foot"]?.title ?? ""}
            hideTitle
            onYear={(v) => updateChapter("terrain-de-foot", { year: v })}
            onStageLabel={(v) =>
              updateChapter("terrain-de-foot", { stageLabel: v })
            }
            onTitle={(v) => updateChapter("terrain-de-foot", { title: v })}
          />
          <SectionsEditor
            sections={chapters["terrain-de-foot"]?.sections ?? []}
            onChange={(index, field, value) =>
              updateSection("terrain-de-foot", index, field, value)
            }
          />
          <StoryTerrainMediaUpload
            photoUrls={media.terrain.photos}
            videoUrl={media.terrain.videoUrl}
            youtubeUrl={media.terrain.youtubeUrl}
          />
        </TabsContent>

        {/* Création */}
        <TabsContent value="creation-association" className="space-y-4">
          <ChapterTextsCard
            year={chapters["creation-association"]?.year ?? ""}
            stageLabel={chapters["creation-association"]?.stageLabel ?? ""}
            title={chapters["creation-association"]?.title ?? ""}
            onYear={(v) => updateChapter("creation-association", { year: v })}
            onStageLabel={(v) =>
              updateChapter("creation-association", { stageLabel: v })
            }
            onTitle={(v) => updateChapter("creation-association", { title: v })}
          />
          <SectionsEditor
            sections={chapters["creation-association"]?.sections ?? []}
            onChange={(index, field, value) =>
              updateSection("creation-association", index, field, value)
            }
            bodyHint="Pour plusieurs paragraphes, séparez-les par une ligne vide."
          />
          <StoryCreationMediaUpload imageUrl={media.creationImageUrl} />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="bg-[#0d8f5f] hover:bg-[#0b7a51]"
        >
          {isPending ? "Enregistrement…" : "Enregistrer les textes"}
        </Button>
      </div>
    </div>
  );
}

function ChapterTextsCard({
  year,
  stageLabel,
  title,
  hideTitle,
  onYear,
  onStageLabel,
  onTitle,
}: {
  year: string;
  stageLabel: string;
  title: string;
  hideTitle?: boolean;
  onYear: (v: string) => void;
  onStageLabel: (v: string) => void;
  onTitle: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-3">
      <h4 className="font-semibold text-[#111827]">Textes</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Label frise</Label>
          <Input className="mt-1.5" value={year} onChange={(e) => onYear(e.target.value)} />
        </div>
        <div>
          <Label>Sous-label (optionnel)</Label>
          <Input
            className="mt-1.5"
            value={stageLabel}
            onChange={(e) => onStageLabel(e.target.value)}
          />
        </div>
      </div>
      {!hideTitle ? (
        <div>
          <Label>Titre du panneau</Label>
          <Input className="mt-1.5" value={title} onChange={(e) => onTitle(e.target.value)} />
        </div>
      ) : null}
    </div>
  );
}

function SectionsEditor({
  sections,
  onChange,
  bodyHint,
}: {
  sections: { heading: string; body: string }[];
  onChange: (index: number, field: "heading" | "body", value: string) => void;
  bodyHint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-4">
      <h4 className="font-semibold text-[#111827]">Sections</h4>
      {sections.map((section, index) => (
        <div key={index} className="space-y-2 rounded-xl border border-[#E5E7EB]/80 p-3">
          <div>
            <Label>Sous-titre {index + 1}</Label>
            <Input
              className="mt-1.5"
              value={section.heading}
              onChange={(e) => onChange(index, "heading", e.target.value)}
            />
          </div>
          <div>
            <Label>Texte {index + 1}</Label>
            <Textarea
              className="mt-1.5 min-h-[120px]"
              value={section.body}
              onChange={(e) => onChange(index, "body", e.target.value)}
            />
            {bodyHint && index === 0 ? (
              <p className="mt-1 text-xs text-[#9CA3AF]">{bodyHint}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function SplitBlockEditor({
  label,
  section,
  onChange,
}: {
  label: string;
  section?: { heading: string; body: string };
  onChange: (section: { heading: string; body: string }) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-3">
      <h4 className="font-semibold text-[#111827]">{label}</h4>
      <div>
        <Label>Titre</Label>
        <Input
          className="mt-1.5"
          value={section?.heading ?? ""}
          onChange={(e) =>
            onChange({ heading: e.target.value, body: section?.body ?? "" })
          }
        />
      </div>
      <div>
        <Label>Texte</Label>
        <Textarea
          className="mt-1.5 min-h-[120px]"
          value={section?.body ?? ""}
          onChange={(e) =>
            onChange({ heading: section?.heading ?? "", body: e.target.value })
          }
        />
      </div>
    </div>
  );
}
