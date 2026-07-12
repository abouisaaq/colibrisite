import { fetchNewsletter } from "@/lib/convex-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteNewsletterSubscriber } from "@/actions/admin";
import { formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminNewsletterPage() {
  const subscribers = await fetchNewsletter();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Engagement"
        title="Alertes WhatsApp"
        description={`${subscribers.length} numéro${subscribers.length > 1 ? "s" : ""} inscrit${subscribers.length > 1 ? "s" : ""} aux actualités WhatsApp`}
      />
      <AdminPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Numéro WhatsApp</TableHead>
              <TableHead>Date d&apos;inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  Aucun inscrit pour le moment
                </TableCell>
              </TableRow>
            ) : (
              subscribers.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.name || "—"}</TableCell>
                  <TableCell>{sub.phone}</TableCell>
                  <TableCell>{formatDate(new Date(sub._creationTime))}</TableCell>
                  <TableCell className="text-right">
                    <DeleteButton id={sub.id} action={deleteNewsletterSubscriber} />
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
