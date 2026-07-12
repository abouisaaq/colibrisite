import { fetchMessages } from "@/lib/convex-data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageActions } from "@/components/admin/message-actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminMessagesPage() {
  const messages = await fetchMessages();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Engagement"
        title="Messages"
        description="Messages de contact reçus"
      />
      <AdminPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Lu</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>{m.email}</TableCell>
                <TableCell className="max-w-[200px] truncate">{m.subject ?? m.message}</TableCell>
                <TableCell>
                  <Badge variant={m.read ? "secondary" : "default"}>
                    {m.read ? "Lu" : "Nouveau"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(new Date(m._creationTime))}</TableCell>
                <TableCell><MessageActions id={m.id} read={m.read} message={m.message} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminPanel>
    </div>
  );
}
