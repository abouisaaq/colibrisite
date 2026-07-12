import { fetchUsers } from "@/lib/convex-data";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserForm } from "@/components/admin/user-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteUser } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { requireAdmin } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin");
  }

  const users = await fetchUsers();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Système"
        title="Utilisateurs"
        description="Gérer les comptes administrateurs"
      />
      <UserForm />
      <AdminPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><Badge>{u.role}</Badge></TableCell>
                <TableCell className="text-right">
                  <DeleteButton id={u.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminPanel>
    </div>
  );
}
