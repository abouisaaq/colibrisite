import Link from "next/link";
import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AccueilTemoignagesPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="Accueil"
      pageHref="/admin/accueil"
      title="Témoignages"
      description="Titres de la section. Les cartes se gèrent à part."
    >
      <div className="space-y-6">
        <p className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]">
          Cartes :{" "}
          <Link
            href="/admin/temoignages"
            className="font-semibold text-colibri-teal hover:underline"
          >
            Contenu → Témoignages
          </Link>
        </p>
        <SectionFieldsForm
          values={settings}
          fields={[
            { key: SETTING_KEYS.testimonialsEyebrow, label: "Sur-titre" },
            { key: SETTING_KEYS.testimonialsTitle, label: "Titre" },
            {
              key: SETTING_KEYS.testimonialsSubtitle,
              label: "Sous-titre",
              type: "textarea",
            },
          ]}
        />
      </div>
    </CmsSectionShell>
  );
}
