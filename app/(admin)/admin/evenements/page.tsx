import Link from "next/link";
import { fetchEvents } from "@/lib/convex-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Tags } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteEvent } from "@/actions/admin";
import { formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminEventsPage() {
  const events = await fetchEvents();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Événements"
        description="Gérer les événements"
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/admin/types-evenements">
                <Tags className="mr-2 h-4 w-4" />
                Types d&apos;événements
              </Link>
            </Button>
            <Button asChild className="rounded-full admin-btn-primary hover:opacity-95">
              <Link href="/admin/evenements/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouvel événement
              </Link>
            </Button>
          </>
        }
      />
      <AdminPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...events]
              .sort(
                (a: { startDate: number }, b: { startDate: number }) =>
                  b.startDate - a.startDate
              )
              .map(
                (event: {
                  id: string;
                  title: string;
                  location: string;
                  startDate: number;
                  status: string;
                  eventType: { name: string; color: string } | null;
                }) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  {event.eventType ? (
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: event.eventType.color }}
                      />
                      {event.eventType.name}
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{formatDate(new Date(event.startDate))}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell><Badge variant="secondary">{event.status}</Badge></TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/evenements/${event.id}`}><Pencil className="h-4 w-4" /></Link>
                  </Button>
                  <DeleteButton id={event.id} action={deleteEvent} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminPanel>
    </div>
  );
}
