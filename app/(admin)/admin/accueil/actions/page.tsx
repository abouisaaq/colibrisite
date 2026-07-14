import Link from "next/link";
import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AccueilActionsPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="Accueil"
      pageHref="/admin/accueil"
      title="Nos actions"
      description="Titres de la section. Les cartes se gèrent à part."
    >
      <div className="space-y-6">
        <p className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]">
          Cartes d’actions :{" "}
          <Link href="/admin/actions" className="font-semibold text-colibri-teal hover:underline">
            Contenu → Actions
          </Link>
        </p>
        <SectionFieldsForm
          values={settings}
          fields={[
            { key: SETTING_KEYS.actionsEyebrow, label: "Sur-titre" },
            { key: SETTING_KEYS.actionsTitle, label: "Titre" },
            {
              key: SETTING_KEYS.actionsSubtitle,
              label: "Sous-titre",
              type: "textarea",
            },
          ]}
        />
      </div>
    </CmsSectionShell>
  );
}
