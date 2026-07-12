import type { Metadata } from "next";
import { fetchGalleryAlbums } from "@/lib/convex-data";
import { PageHero } from "@/components/layout/page-hero";
import { SiteMain } from "@/components/layout/site-main";
import { GalleryAlbumGrid } from "@/components/gallery/gallery-album-grid";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Photos de nos actions et événements sur le terrain.",
};

export default async function GalleryPage() {
  const albums = await fetchGalleryAlbums();

  return (
    <>
      <PageHero
        eyebrow="GALERIE"
        title="Galerie"
        description="Retour en images sur nos actions, nos événements et nos moments de partage."
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Galerie" },
        ]}
      />

      <SiteMain>
        <section className="site-section bg-white">
          <div className="site-container">
            <GalleryAlbumGrid
              albums={albums.map(
                (album: {
                  id: string;
                  slug: string;
                  title: string;
                  description?: string;
                  coverUrl?: string;
                  images: unknown[];
                }) => ({
                  id: album.id,
                  slug: album.slug,
                  title: album.title,
                  description: album.description ?? null,
                  coverUrl: album.coverUrl ?? null,
                  _count: { images: album.images.length },
                })
              )}
            />
          </div>
        </section>
      </SiteMain>
    </>
  );
}
