import Link from "next/link";
import { fetchEvents, fetchEventTypes } from "@/lib/convex-data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteEventType } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminEventTypesPage() {
  const [eventTypes, events] = await Promise.all([
    fetchEventTypes(),
    fetchEvents(),
  ]);

  const counts = new Map<string, number>();
  for (const event of events) {
    const typeId = event.eventTypeId as string | undefined;
    if (!typeId) continue;
    counts.set(typeId, (counts.get(typeId) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Types d'événements"
        description="Créez vos propres types (Distribution, Atelier, Collecte…) avec une couleur associée."
        actions={
          <Button asChild className="rounded-full admin-btn-primary hover:opacity-95">
            <Link href="/admin/types-evenements/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau type
            </Link>
          </Button>
        }
      />

      <AdminPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Couleur</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Événements</TableHead>
              <TableHead>Ordre</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Aucun type créé. Ajoutez votre premier type pour classer les événements.
                </TableCell>
              </TableRow>
            ) : (
              eventTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>
                    <span
                      className="inline-block h-6 w-6 rounded-full border"
                      style={{ backgroundColor: type.color }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{counts.get(type.id) ?? 0}</TableCell>
                  <TableCell>{type.order}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/types-evenements/${type.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteButton id={type.id} action={deleteEventType} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminPanel>
    </div>
  );
}
