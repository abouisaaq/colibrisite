import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { MissionImagesUpload } from "@/components/admin/mission-images-upload";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AccueilMissionPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="Accueil"
      pageHref="/admin/accueil"
      title="Notre mission"
      description="Textes et images de la section mission."
    >
      <div className="space-y-8">
        <SectionFieldsForm
          values={settings}
          fields={[
            { key: SETTING_KEYS.missionTitle, label: "Titre" },
            {
              key: SETTING_KEYS.missionText,
              label: "Texte",
              type: "textarea",
            },
            {
              key: SETTING_KEYS.missionQuote,
              label: "Citation",
              type: "textarea",
              rows: 3,
            },
          ]}
        />
        <MissionImagesUpload
          currentUrls={{
            main: settings.mission_image_main ?? "",
            left: settings.mission_image_left ?? "",
            right: settings.mission_image_right ?? "",
          }}
        />
      </div>
    </CmsSectionShell>
  );
}
