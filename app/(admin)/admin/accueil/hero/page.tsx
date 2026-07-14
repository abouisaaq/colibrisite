import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { HeroImageUpload } from "@/components/admin/hero-image-upload";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AccueilHeroPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="Accueil"
      pageHref="/admin/accueil"
      title="Hero"
      description="Image de fond, titre et sous-titre de la première section."
    >
      <div className="space-y-8">
        <HeroImageUpload currentUrl={settings.hero_image} />
        <SectionFieldsForm
          values={settings}
          fields={[
            { key: SETTING_KEYS.heroTitle, label: "Titre" },
            {
              key: SETTING_KEYS.heroSubtitle,
              label: "Sous-titre",
              type: "textarea",
            },
          ]}
        />
      </div>
    </CmsSectionShell>
  );
}
