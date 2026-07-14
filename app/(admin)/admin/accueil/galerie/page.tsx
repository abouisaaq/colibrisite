import Link from "next/link";
import { fetchHomeSpotlightVideos } from "@/lib/convex-data";
import { HomeSpotlightVideosManager } from "@/components/admin/home-spotlight-videos-manager";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AccueilGaleriePage() {
  const rows = await fetchHomeSpotlightVideos();
  const videos = rows.map(
    (row: {
      id?: string;
      _id?: string;
      title?: string | null;
      url?: string | null;
      posterUrl?: string | null;
      youtubeUrl?: string | null;
    }) => ({
      id: String(row.id ?? row._id),
      title: row.title ?? null,
      url: row.url ?? null,
      posterUrl: row.posterUrl ?? null,
      youtubeUrl: row.youtubeUrl ?? null,
    })
  );

  return (
    <CmsSectionShell
      pageLabel="Accueil"
      pageHref="/admin/accueil"
      title="Galerie spotlight"
      description="Vidéos de l’accueil (2 aléatoires + carrousel). Les photos viennent de la galerie."
    >
      <div className="space-y-6">
        <p className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]">
          Albums photos :{" "}
          <Link href="/admin/galerie" className="font-semibold text-colibri-teal hover:underline">
            Contenu → Galerie
          </Link>
        </p>
        <HomeSpotlightVideosManager videos={videos} />
      </div>
    </CmsSectionShell>
  );
}
