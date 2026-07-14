import Link from "next/link";
import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AccueilPartenairesPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="Accueil"
      pageHref="/admin/accueil"
      title="Partenaires"
      description="Titres de la section. Les logos se gèrent à part."
    >
      <div className="space-y-6">
        <p className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]">
          Logos partenaires :{" "}
          <Link
            href="/admin/partenaires"
            className="font-semibold text-colibri-teal hover:underline"
          >
            Contenu → Partenaires
          </Link>
        </p>
        <SectionFieldsForm
          values={settings}
          fields={[
            { key: SETTING_KEYS.partnersTitle, label: "Titre" },
            {
              key: SETTING_KEYS.partnersSubtitle,
              label: "Sous-titre",
              type: "textarea",
            },
          ]}
        />
      </div>
    </CmsSectionShell>
  );
}
