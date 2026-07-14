import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import {
  ABOUT_COMMITMENTS,
  resolveAboutCommitmentItems,
} from "@/lib/about-content";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CommitmentImagesUpload } from "@/components/admin/commitment-images-upload";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AProposEngagementsPage() {
  const settings = await getAllSettings();
  const commitments =
    settings[SETTING_KEYS.aboutCommitments] || ABOUT_COMMITMENTS.join("\n");
  const items = resolveAboutCommitmentItems(
    commitments,
    settings[SETTING_KEYS.aboutCommitmentsImages]
  );

  return (
    <CmsSectionShell
      pageLabel="À propos"
      pageHref="/admin/a-propos"
      title="Nos engagements"
      description="Titres et photos des voyages au Village."
    >
      <div className="space-y-8">
        <SectionFieldsForm
          values={{
            ...settings,
            [SETTING_KEYS.aboutCommitments]: commitments,
          }}
          fields={[
            { key: SETTING_KEYS.aboutCommitmentsTitle, label: "Titre" },
            {
              key: SETTING_KEYS.aboutCommitments,
              label: "Liste des engagements",
              type: "textarea",
              rows: 10,
              hint: "Un engagement par ligne (ordre = ordre des photos).",
            },
          ]}
        />
        <CommitmentImagesUpload items={items} />
      </div>
    </CmsSectionShell>
  );
}
