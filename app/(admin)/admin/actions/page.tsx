import Link from "next/link";
import { fetchActions } from "@/lib/convex-data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAction } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminActionsPage() {
  const actions = await fetchActions();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Actions"
        description="Gérer les initiatives"
        actions={
          <Button asChild className="rounded-full admin-btn-primary hover:opacity-95">
            <Link href="/admin/actions/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle action
            </Link>
          </Button>
        }
      />
      <AdminPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Icône</TableHead>
              <TableHead>Ordre</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="font-medium">{action.title}</TableCell>
                <TableCell>{action.icon}</TableCell>
                <TableCell>{action.order}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/actions/${action.id}`}><Pencil className="h-4 w-4" /></Link>
                  </Button>
                  <DeleteButton id={action.id} action={deleteAction} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminPanel>
    </div>
  );
}
