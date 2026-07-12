import type { Metadata } from "next";
import { fetchArticles } from "@/lib/convex-data";
import { PageHero } from "@/components/layout/page-hero";
import { SiteMain } from "@/components/layout/site-main";
import { NewsArticlesListing } from "@/components/news/news-articles-listing";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Les dernières nouvelles de Les Colibris Porteurs d'Espoir.",
};

export default async function NewsPage() {
  const articles = await fetchArticles(true);

  return (
    <>
      <PageHero
        eyebrow="ACTUALITÉS"
        title="Actualités"
        description="Suivez nos actions, nos projets et les moments forts de l'association."
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Actualités" },
        ]}
      />

      <SiteMain>
        <section className="site-section bg-white">
          <div className="site-container">
            <NewsArticlesListing
              articles={articles.map((article) => ({
                id: article.id,
                title: article.title,
                slug: article.slug,
                excerpt: article.excerpt,
                imageUrl: article.imageUrl ?? null,
                category: article.category,
                createdAt: new Date(article._creationTime).toISOString(),
              }))}
            />
          </div>
        </section>
      </SiteMain>
    </>
  );
}
