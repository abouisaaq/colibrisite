import type { Metadata } from "next";
import { AboutStoryTimeline } from "@/components/about/about-story-timeline";
import { PageHero } from "@/components/layout/page-hero";
import { SiteMain } from "@/components/layout/site-main";
import { getPublicSettings } from "@/lib/settings";
import { resolveStorySeismeMedia } from "@/lib/about-story-media";
import { resolveStoryPremieresMedia } from "@/lib/about-story-premieres";
import { resolveStoryConfortMedia } from "@/lib/about-story-confort";
import { resolveStoryTerrainMedia } from "@/lib/about-story-terrain";
import { resolveStoryAccompagnementMedia } from "@/lib/about-story-accompagnement";
import { resolveStoryCreationImage } from "@/lib/about-story-creation";
import {
  parseStoryChaptersCms,
  STORY_CHAPTERS_CMS_KEY,
} from "@/lib/about-story-cms";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "Découvrez le parcours de Les Colibris Porteurs d'Espoir, de la création à aujourd'hui.",
};

export default async function NotreHistoirePage() {
  const settings = await getPublicSettings();

  return (
    <>
      <PageHero
        eyebrow="NOTRE HISTOIRE"
        title="Notre histoire"
        description="Le fil de notre engagement, chapitre après chapitre."
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Notre histoire" },
        ]}
      />

      <SiteMain>
        <AboutStoryTimeline
          seismeMedia={resolveStorySeismeMedia(settings)}
          premieresMedia={resolveStoryPremieresMedia(settings)}
          confortMedia={resolveStoryConfortMedia(settings)}
          terrainMedia={resolveStoryTerrainMedia(settings)}
          accompagnementMedia={resolveStoryAccompagnementMedia(settings)}
          creationImage={resolveStoryCreationImage(settings)}
          storyCms={parseStoryChaptersCms(settings[STORY_CHAPTERS_CMS_KEY])}
        />
      </SiteMain>
    </>
  );
}
