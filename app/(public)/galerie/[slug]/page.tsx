import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchGalleryAlbumBySlug } from "@/lib/convex-data";
import { PageHero } from "@/components/layout/page-hero";
import { SiteMain } from "@/components/layout/site-main";
import { AlbumGallery } from "@/components/gallery/album-gallery";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await fetchGalleryAlbumBySlug(slug);
  if (!album) return { title: "Album introuvable" };
  return { title: album.title, description: album.description ?? undefined };
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = await fetchGalleryAlbumBySlug(slug);

  if (!album) notFound();

  const images = [...album.images].sort(
    (a: { order: number }, b: { order: number }) => a.order - b.order
  );

  return (
    <>
      <PageHero
        eyebrow="GALERIE"
        title={album.title}
        description={album.description ?? "Découvrez les photos et vidéos de cet album."}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Galerie", href: "/galerie" },
          { label: album.title },
        ]}
      />

      <SiteMain>
        <AlbumGallery
          album={{
            title: album.title,
            description: album.description ?? null,
            createdAt: new Date(album._creationTime).toISOString(),
            images: images.map(
              (image: {
                _id: string;
                url: string;
                alt?: string;
                order: number;
                _creationTime: number;
                kind?: "photo" | "video";
                mimeType?: string;
                posterUrl?: string;
              }) => ({
                id: image._id,
                url: image.url,
                alt: image.alt ?? null,
                order: image.order,
                createdAt: new Date(image._creationTime).toISOString(),
                kind: image.kind ?? null,
                mimeType: image.mimeType ?? null,
                posterUrl: image.posterUrl ?? null,
              })
            ),
          }}
        />
      </SiteMain>
    </>
  );
}
