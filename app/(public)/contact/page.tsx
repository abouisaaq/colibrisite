import type { Metadata } from "next";
import { getPublicSettings } from "@/lib/settings";
import { getContactPhones } from "@/lib/contact-phones";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import { SiteMain } from "@/components/layout/site-main";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Les Colibris Porteurs d'Espoir.",
};

export default async function ContactPage() {
  const settings = await getPublicSettings();

  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="Contact"
        description={
          settings.contact_hero_description?.trim() ||
          "Une question ? N'hésitez pas à nous écrire, nous vous répondrons avec attention."
        }
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Contact" },
        ]}
      />

      <SiteMain>
      <section className="site-section relative overflow-hidden bg-[#F8FAFC]">
        <div className="site-container relative">
          <ContactForm
            email={settings.contact_email ?? "contact@colibris-espoir.org"}
            phones={getContactPhones(settings)}
            address={settings.contact_address ?? "12 Rue de l'Espoir, 75011 Paris, France"}
            mapAddress={
              settings.contact_map_address?.trim() ||
              settings.contact_address?.trim() ||
              "12 Rue de l'Espoir, 75011 Paris, France"
            }
            mapEmbedUrl={settings.contact_map_embed_url}
          />
        </div>
      </section>
      </SiteMain>
    </>
  );
}
