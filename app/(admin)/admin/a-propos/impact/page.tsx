import Link from "next/link";
import { getAllSettings } from "@/lib/settings";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { SectionFieldsForm } from "@/components/admin/section-fields-form";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AProposImpactPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="À propos"
      pageHref="/admin/a-propos"
      title="Notre impact"
      description="Chiffres (partagés avec la page d’accueil)."
    >
      <div className="space-y-6">
        <p className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]">
          Aussi modifiables depuis{" "}
          <Link
            href="/admin/accueil/chiffres"
            className="font-semibold text-colibri-teal hover:underline"
          >
            Accueil → Chiffres
          </Link>
        </p>
        <SectionFieldsForm
          values={settings}
          fields={[
            { key: SETTING_KEYS.statFamilies, label: "Familles aidées" },
            { key: SETTING_KEYS.statVolunteers, label: "Bénévoles actifs" },
            { key: SETTING_KEYS.statProjects, label: "Projets réalisés" },
            { key: SETTING_KEYS.statPartners, label: "Partenaires" },
          ]}
        />
      </div>
    </CmsSectionShell>
  );
}
