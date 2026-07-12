import Link from "next/link";
import Image from "next/image";
import { fetchPartners } from "@/lib/convex-data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePartner } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminPartnersPage() {
  const partners = await fetchPartners();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Partenaires"
        description="Gérez les logos affichés dans la section partenaires, juste avant le footer."
        actions={
          <Button asChild className="rounded-full admin-btn-primary hover:opacity-95">
            <Link href="/admin/partenaires/new">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un logo
            </Link>
          </Button>
        }
      />

      <div className="rounded-xl border border-[#42D7C8]/20 bg-[#F0FDFA]/50 px-4 py-3 text-sm text-[#0F766E]">
        Les logos publiés apparaissent automatiquement sur la page d&apos;accueil. Le titre de la
        section se modifie dans{" "}
        <Link href="/admin/parametres" className="font-semibold underline">
          Paramètres → Partenaires
        </Link>
        .
      </div>

      <AdminPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Site web</TableHead>
              <TableHead>Ordre</TableHead>
              <TableHead>Publié</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Aucun partenaire pour le moment. Cliquez sur « Ajouter un logo » pour commencer.
                </TableCell>
              </TableRow>
            ) : (
              partners.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="relative h-10 w-24 rounded-md border bg-[#F8FAFC] p-1">
                      <Image
                        src={item.logoUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="max-w-[180px] truncate text-muted-foreground">
                    {item.websiteUrl ?? "—"}
                  </TableCell>
                  <TableCell>{item.order}</TableCell>
                  <TableCell>{item.published ? "Oui" : "Non"}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/partenaires/${item.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteButton id={item.id} action={deletePartner} />
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
