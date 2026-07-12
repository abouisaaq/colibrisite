import { notFound } from "next/navigation";
import { fetchEventTypes } from "@/lib/convex-data";
import { EventTypeForm } from "@/components/admin/event-type-form";
import { createEventType, updateEventType } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventTypePage({ params }: Props) {
  const { id } = await params;
  const eventTypes = await fetchEventTypes();
  const eventType = eventTypes.find((t) => t.id === id);
  if (!eventType) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Modifier le type"
        description="Mettez à jour le nom, la couleur ou l'ordre"
      />
      <AdminPanel padded>
        <EventTypeForm
          eventType={{
            id: eventType.id,
            name: eventType.name,
            color: eventType.color,
            order: eventType.order,
          }}
          action={createEventType}
          updateAction={updateEventType}
        />
      </AdminPanel>
    </div>
  );
}
