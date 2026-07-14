import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import {
  ABOUT_VALUES,
  formatAboutValuesForEditor,
} from "@/lib/about-content";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AProposValeursPage() {
  const settings = await getAllSettings();
  const values =
    settings[SETTING_KEYS.aboutValues] ||
    formatAboutValuesForEditor([...ABOUT_VALUES]);

  return (
    <CmsSectionShell
      pageLabel="À propos"
      pageHref="/admin/a-propos"
      title="Nos valeurs"
      description="Titre et cartes des valeurs."
    >
      <SectionFieldsForm
        values={{
          ...settings,
          [SETTING_KEYS.aboutValues]: values,
        }}
        fields={[
          { key: SETTING_KEYS.aboutValuesTitle, label: "Titre" },
          {
            key: SETTING_KEYS.aboutValues,
            label: "Cartes des valeurs",
            type: "textarea",
            rows: 12,
            hint: "Jusqu’à 4 valeurs. Format : titre, puis description, blocs séparés par une ligne vide.",
          },
        ]}
      />
    </CmsSectionShell>
  );
}
