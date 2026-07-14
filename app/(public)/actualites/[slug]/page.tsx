import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchArticleBySlug } from "@/lib/convex-data";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/layout/page-hero";
import { SiteMain } from "@/components/layout/site-main";
import { ArticleContent } from "@/components/news/article-content";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.metaTitle ?? article.title,
    description: article.metaDesc ?? article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article || !article.published) notFound();

  return (
    <article>
      <PageHero
        eyebrow="ACTUALITÉS"
        title={article.title}
        description={article.excerpt}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Actualités", href: "/actualites" },
          { label: article.title },
        ]}
      />

      <SiteMain>
      <div className="site-container flex max-w-3xl flex-wrap items-center justify-center gap-3 pt-8">
        <Badge className="bg-colibri-teal">{article.category}</Badge>
        <span className="text-sm text-muted-foreground">
          {formatDate(new Date(article.publishedAt ?? article._creationTime))}
        </span>
      </div>

      {article.imageUrl && (
        <div className="site-container max-w-4xl pt-6">
          <div className="relative h-52 overflow-hidden rounded-2xl shadow-xl sm:h-64 md:h-96">
            <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
          </div>
        </div>
      )}

      <section className="site-section bg-white">
        <div className="site-container max-w-3xl min-w-0">
          <ArticleContent html={article.content} />
        </div>
      </section>
      </SiteMain>
    </article>
  );
}
