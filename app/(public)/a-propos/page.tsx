import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/about-page-content";
import { PageHero } from "@/components/layout/page-hero";
import { SiteMain } from "@/components/layout/site-main";
import { getPublicSettings } from "@/lib/settings";
import { resolveSitePageImage } from "@/lib/site-images";
import {
  parseAboutCommitments,
  parseAboutTeamMembers,
  parseAboutValues,
} from "@/lib/about-content";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez la mission, l'équipe et les valeurs de Les Colibris Porteurs d'Espoir.",
};

export default async function AboutPage() {
  const settings = await getPublicSettings();
  const teamMembers = parseAboutTeamMembers(settings.about_team_members);
  const values = parseAboutValues(settings.about_values);
  const commitments = parseAboutCommitments(settings.about_commitments);

  return (
    <>
      <PageHero
        eyebrow="À PROPOS"
        title="À propos"
        description={
          settings.about_hero_description?.trim() ||
          "Découvrez qui nous sommes et ce qui nous anime au quotidien."
        }
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "À propos" },
        ]}
      />

      <SiteMain>
        <AboutPageContent
          mission={settings.about_mission}
          storyTitle={settings.about_story_title}
          storyQuote={settings.about_story_quote}
          valuesTitle={settings.about_values_title}
          values={values}
          colibriTitle={settings.about_colibri_title}
          colibriText={settings.about_colibri_text}
          teamIntro={settings.about_team}
          teamMembers={teamMembers}
          commitmentsTitle={settings.about_commitments_title}
          commitments={commitments}
          ctaTitle={settings.about_cta_title}
          ctaSubtitle={settings.about_cta_subtitle}
          families={settings.stat_families ?? "500"}
          volunteers={settings.stat_volunteers ?? "100"}
          projects={settings.stat_projects ?? "50"}
          partners={settings.stat_partners ?? "15"}
          storyImageUrl={resolveSitePageImage(settings, "about_story")}
          colibriImageUrl={resolveSitePageImage(settings, "about_colibri")}
        />
      </SiteMain>
    </>
  );
}
