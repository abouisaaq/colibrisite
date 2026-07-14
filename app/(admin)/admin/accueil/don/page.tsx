import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { DonationImageUpload } from "@/components/admin/donation-image-upload";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AccueilDonPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="Accueil"
      pageHref="/admin/accueil"
      title="Faire un don (CTA)"
      description="Bloc don en bas de l’accueil (textes aussi utilisés sur la page Don)."
    >
      <div className="space-y-8">
        <SectionFieldsForm
          values={settings}
          fields={[
            { key: SETTING_KEYS.ctaTitle, label: "Titre" },
            {
              key: SETTING_KEYS.ctaSubtitle,
              label: "Sous-titre",
              type: "textarea",
            },
          ]}
        />
        <DonationImageUpload currentUrl={settings.donation_image} />
      </div>
    </CmsSectionShell>
  );
}
