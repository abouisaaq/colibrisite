import { getAllSettings } from "@/lib/settings";
import {
  HOME_SECTIONS,
  resolveHomeLayout,
} from "@/lib/page-sections";
import { SectionLayoutManager } from "@/components/admin/section-layout-manager";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import Link from "next/link";

export default async function AdminAccueilPage() {
  const settings = await getAllSettings();
  const layout = resolveHomeLayout(settings);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Pages"
        title="Accueil"
        description="Ordre et visibilité des sections, puis modifiez chaque bloc séparément."
      />
      <AdminPanel
        title="Disposition des sections"
        description="Ce qui apparaît en haut ou en bas sur la page d’accueil publique."
        padded
      >
        <SectionLayoutManager
          page="accueil"
          defs={HOME_SECTIONS}
          initialLayout={layout}
        />
      </AdminPanel>

      <AdminPanel title="Raccourcis" padded>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_SECTIONS.map((section) => (
            <Link
              key={section.id}
              href={section.href}
              className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#111827] transition-colors hover:border-colibri-teal/40 hover:bg-white"
            >
              {section.label}
            </Link>
          ))}
        </div>
      </AdminPanel>
    </div>
  );
}
