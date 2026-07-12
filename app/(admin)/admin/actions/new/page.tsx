import { ActionForm } from "@/components/admin/action-form";
import { createAction } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default function NewActionPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Nouvelle action"
        description="Ajoutez une initiative mise en avant sur le site"
      />
      <AdminPanel padded>
        <ActionForm action={createAction} />
      </AdminPanel>
    </div>
  );
}
