import { notFound } from "next/navigation";
import { fetchGalleryAlbumById } from "@/lib/convex-data";
import { AlbumForm } from "@/components/admin/album-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAlbumPage({ params }: Props) {
  const { id } = await params;
  const album = await fetchGalleryAlbumById(id);
  if (!album) notFound();

  const images = [...album.images]
    .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
    .map(
      (image: {
        _id: string;
        url: string;
        alt?: string;
        kind?: "photo" | "video";
        mimeType?: string;
        posterUrl?: string;
      }) => ({
        id: image._id,
        url: image.url,
        alt: image.alt ?? null,
        kind: image.kind ?? null,
        mimeType: image.mimeType ?? null,
        posterUrl: image.posterUrl ?? null,
      })
    );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Modifier l'album"
        description="Mettez à jour le titre, les photos et les vidéos"
      />
      <AdminPanel padded>
        <AlbumForm
          album={{
            id: album.id,
            title: album.title,
            slug: album.slug,
            description: album.description ?? null,
            coverUrl: album.coverUrl ?? null,
            images,
          }}
        />
      </AdminPanel>
    </div>
  );
}
