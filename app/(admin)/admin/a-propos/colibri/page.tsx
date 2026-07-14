import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { AboutImagesUpload } from "@/components/admin/about-images-upload";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AProposColibriPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="À propos"
      pageHref="/admin/a-propos"
      title="Pourquoi le Colibri"
      description="Texte et image de la section."
    >
      <div className="space-y-8">
        <SectionFieldsForm
          values={settings}
          fields={[
            { key: SETTING_KEYS.aboutColibriTitle, label: "Titre" },
            {
              key: SETTING_KEYS.aboutColibriText,
              label: "Texte",
              type: "textarea",
              rows: 8,
            },
          ]}
        />
        <AboutImagesUpload
          storyUrl={settings.about_image_story}
          colibriUrl={settings.about_image_colibri}
        />
      </div>
    </CmsSectionShell>
  );
}
