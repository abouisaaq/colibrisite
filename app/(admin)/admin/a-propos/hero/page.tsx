import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AProposHeroPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="À propos"
      pageHref="/admin/a-propos"
      title="En-tête de page"
      description="Texte sous le titre de la page À propos."
    >
      <SectionFieldsForm
        values={settings}
        fields={[
          {
            key: SETTING_KEYS.aboutHeroDescription,
            label: "Sous-titre",
            type: "textarea",
          },
        ]}
      />
    </CmsSectionShell>
  );
}
