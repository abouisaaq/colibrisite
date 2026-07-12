import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchArticleBySlug } from "@/lib/convex-data";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/layout/page-hero";
import { SiteMain } from "@/components/layout/site-main";
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
      <div className="site-container flex max-w-3xl items-center justify-center gap-3 pt-8">
        <Badge className="bg-colibri-teal">{article.category}</Badge>
        <span className="text-sm text-muted-foreground">
          {formatDate(new Date(article._creationTime))}
        </span>
      </div>

      {article.imageUrl && (
        <div className="site-container max-w-4xl pt-6">
          <div className="relative h-64 overflow-hidden rounded-2xl shadow-xl md:h-96">
            <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
          </div>
        </div>
      )}

      <section className="site-section bg-white">
        <div className="site-container max-w-3xl">
          <div
            className="article-content prose prose-lg max-w-none leading-relaxed text-[#475569]
              prose-headings:font-heading prose-headings:text-[#0F172A] prose-headings:font-bold
              prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl
              prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl
              prose-p:mb-4 prose-a:text-colibri-teal prose-a:no-underline hover:prose-a:underline
              prose-img:my-8 prose-img:rounded-2xl prose-img:shadow-md
              prose-blockquote:border-l-colibri-teal prose-blockquote:text-[#64748B]
              prose-ul:my-4 prose-ol:my-4
              [&_img]:h-auto [&_img]:max-w-full"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </section>
      </SiteMain>
    </article>
  );
}
