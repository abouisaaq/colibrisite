import Link from "next/link";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default function AccueilActualitesPage() {
  return (
    <CmsSectionShell
      pageLabel="Accueil"
      pageHref="/admin/accueil"
      title="Actualités & événements"
      description="Cette section affiche automatiquement les derniers articles et les prochains événements."
    >
      <div className="space-y-3 text-sm text-[#64748B]">
        <p>
          Articles :{" "}
          <Link href="/admin/articles" className="font-semibold text-colibri-teal hover:underline">
            Contenu → Articles
          </Link>
        </p>
        <p>
          Événements :{" "}
          <Link href="/admin/evenements" className="font-semibold text-colibri-teal hover:underline">
            Contenu → Événements
          </Link>
        </p>
        <p className="pt-2 text-xs text-[#94A3B8]">
          Utilisez la page Accueil → Disposition pour masquer toute la section si besoin.
        </p>
      </div>
    </CmsSectionShell>
  );
}
