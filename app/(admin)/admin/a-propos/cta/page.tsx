import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AProposCtaPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="À propos"
      pageHref="/admin/a-propos"
      title="Appel à l’action"
      description="Bloc final de la page À propos."
    >
      <SectionFieldsForm
        values={settings}
        fields={[
          { key: SETTING_KEYS.aboutCtaTitle, label: "Titre" },
          {
            key: SETTING_KEYS.aboutCtaSubtitle,
            label: "Texte",
            type: "textarea",
          },
        ]}
      />
    </CmsSectionShell>
  );
}
