import { fetchMedia } from "@/lib/convex-data";
import { MediaLibrary } from "@/components/admin/media-library";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import Link from "next/link";

export default async function AdminMediasPage() {
  const mediaRows = await fetchMedia();
  const media = mediaRows.map((m) => ({
    id: m.id,
    filename: m.filename,
    url: m.url,
    mimeType: m.mimeType,
    size: m.size,
    createdAt: new Date(m._creationTime),
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Bibliothèque médias"
        description="Fichiers uploadés. Les sections du site se modifient dans Pages → Accueil / À propos."
      />

      <AdminPanel padded>
        <p className="mb-4 text-sm text-[#64748B]">
          Accueil :{" "}
          <Link href="/admin/accueil" className="font-semibold text-colibri-teal hover:underline">
            Disposition & sections
          </Link>
          {" · "}
          À propos :{" "}
          <Link href="/admin/a-propos" className="font-semibold text-colibri-teal hover:underline">
            Disposition & sections
          </Link>
        </p>
      </AdminPanel>

      <MediaLibrary initialMedia={media} />
    </div>
  );
}
