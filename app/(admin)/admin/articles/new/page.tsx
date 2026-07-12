import { ArticleForm } from "@/components/admin/article-form";
import { createArticle } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Nouvel article"
        description="Rédigez et publiez une actualité"
      />
      <AdminPanel padded>
        <ArticleForm action={createArticle} />
      </AdminPanel>
    </div>
  );
}
