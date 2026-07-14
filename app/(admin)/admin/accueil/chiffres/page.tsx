import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AccueilChiffresPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="Accueil"
      pageHref="/admin/accueil"
      title="Chiffres"
      description="Statistiques d’impact (aussi utilisées sur À propos)."
    >
      <SectionFieldsForm
        values={settings}
        fields={[
          { key: SETTING_KEYS.statFamilies, label: "Familles aidées" },
          { key: SETTING_KEYS.statVolunteers, label: "Bénévoles actifs" },
          { key: SETTING_KEYS.statProjects, label: "Projets réalisés" },
          { key: SETTING_KEYS.statPartners, label: "Partenaires" },
        ]}
      />
    </CmsSectionShell>
  );
}
