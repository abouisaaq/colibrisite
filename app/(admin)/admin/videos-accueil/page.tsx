import { fetchHomeSpotlightVideos } from "@/lib/convex-data";
import { HomeSpotlightVideosManager } from "@/components/admin/home-spotlight-videos-manager";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminVideosAccueilPage() {
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
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Vidéos Accueil"
        description="Bibliothèque de vidéos pour la section spotlight de la page d’accueil (2 affichées au hasard)"
      />
      <AdminPanel padded>
        <HomeSpotlightVideosManager videos={videos} />
      </AdminPanel>
    </div>
  );
}
