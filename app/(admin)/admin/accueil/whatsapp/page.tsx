import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AccueilWhatsappPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="Accueil"
      pageHref="/admin/accueil"
      title="WhatsApp"
      description="Textes du bloc d’inscription WhatsApp."
    >
      <SectionFieldsForm
        values={settings}
        fields={[
          { key: SETTING_KEYS.newsletterTitle, label: "Titre" },
          {
            key: SETTING_KEYS.newsletterSubtitle,
            label: "Sous-titre",
            type: "textarea",
          },
        ]}
      />
    </CmsSectionShell>
  );
}
