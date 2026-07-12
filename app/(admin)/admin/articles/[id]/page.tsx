import { notFound } from "next/navigation";
import { fetchArticleById } from "@/lib/convex-data";
import { ArticleForm } from "@/components/admin/article-form";
import { createArticle, updateArticle } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await fetchArticleById(id);
  if (!article) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Modifier l'article"
        description="Mettez à jour le contenu et le statut de publication"
      />
      <AdminPanel padded>
        <ArticleForm
          article={{
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            imageUrl: article.imageUrl ?? null,
            category: article.category,
            published: article.published,
            publishedAt: article.publishedAt ?? article._creationTime,
            metaTitle: article.metaTitle ?? null,
            metaDesc: article.metaDesc ?? null,
          }}
          action={createArticle}
          updateAction={updateArticle}
        />
      </AdminPanel>
    </div>
  );
}
