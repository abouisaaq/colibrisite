import { EventTypeForm } from "@/components/admin/event-type-form";
import { createEventType } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default function NewEventTypePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Nouveau type d'événement"
        description="Définissez un type avec une couleur associée"
      />
      <AdminPanel padded>
        <EventTypeForm action={createEventType} />
      </AdminPanel>
    </div>
  );
}
