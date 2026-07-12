import type { Metadata } from "next";
import { Suspense } from "react";
import { DonationForm } from "@/components/forms/donation-form";
import { PageHero } from "@/components/layout/page-hero";
import { SiteMain } from "@/components/layout/site-main";
import { getPayPalCredentials } from "@/lib/paypal-credentials";
import { getPublicSettings } from "@/lib/settings";
import { resolveSitePageImage } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Faire un don",
  description: "Soutenez Les Colibris Porteurs d'Espoir par un don ponctuel ou mensuel.",
};

export default async function DonatePage() {
  const [settings, paypalCredentials] = await Promise.all([
    getPublicSettings(),
    getPayPalCredentials(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="FAIRE UN DON"
        title="Faire un don"
        description={
          settings.donation_hero_description?.trim() ||
          "Votre générosité permet de porter l'espoir aux familles les plus vulnérables."
        }
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Faire un don" },
        ]}
      />

      <SiteMain>
      <section className="site-section bg-[#F8FAFC]">
        <div className="site-container">
          <Suspense
            fallback={
              <div className="h-[520px] animate-pulse overflow-hidden rounded-[28px] bg-[#F1F5F9]" />
            }
          >
            <DonationForm
              familiesCount={settings.stat_families ?? "500"}
              title={settings.cta_title}
              subtitle={settings.cta_subtitle}
              imageUrl={resolveSitePageImage(settings, "donation")}
              paypalClientId={paypalCredentials.clientId}
              paypalEnvironment={paypalCredentials.environment}
            />
          </Suspense>
        </div>
      </section>
      </SiteMain>
    </>
  );
}
