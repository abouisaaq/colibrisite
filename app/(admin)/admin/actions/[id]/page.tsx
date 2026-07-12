import { notFound } from "next/navigation";
import { fetchActionById } from "@/lib/convex-data";
import { ActionForm } from "@/components/admin/action-form";
import { createAction, updateAction } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditActionPage({ params }: Props) {
  const { id } = await params;
  const actionData = await fetchActionById(id);
  if (!actionData) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Modifier l'action"
        description="Mettez à jour le titre, l'icône ou l'ordre"
      />
      <AdminPanel padded>
        <ActionForm
          actionData={{
            id: actionData.id,
            title: actionData.title,
            slug: actionData.slug,
            description: actionData.description,
            icon: actionData.icon,
            order: actionData.order,
            imageUrl: actionData.imageUrl ?? null,
          }}
          action={createAction}
          updateAction={updateAction}
        />
      </AdminPanel>
    </div>
  );
}
