import type { Metadata } from "next";
import { VolunteerForm } from "@/components/forms/volunteer-form";
import { PageHero } from "@/components/layout/page-hero";
import { SiteMain } from "@/components/layout/site-main";
import { getPublicSettings } from "@/lib/settings";
import { resolveSitePageImage } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Devenir bénévole",
  description: "Rejoignez l'équipe de bénévoles des Colibris Porteurs d'Espoir.",
};

export default async function VolunteerPage() {
  const settings = await getPublicSettings();

  return (
    <>
      <PageHero
        eyebrow="BÉNÉVOLE"
        title="Devenir bénévole"
        description={
          settings.volunteer_hero_description?.trim() ||
          "Rejoignez notre équipe de bénévoles passionnés et faites la différence sur le terrain."
        }
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Devenir bénévole" },
        ]}
      />

      <SiteMain>
      <section className="site-section bg-[#F8FAFC]">
        <div className="site-container">
          <VolunteerForm
            volunteersCount={settings.stat_volunteers ?? "100"}
            familiesCount={settings.stat_families ?? "500"}
            projectsCount={settings.stat_projects ?? "50"}
            imageUrl={resolveSitePageImage(settings, "volunteer")}
          />
        </div>
      </section>
      </SiteMain>
    </>
  );
}
