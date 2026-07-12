import Link from "next/link";
import { fetchTestimonials } from "@/lib/convex-data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTestimonial } from "@/actions/admin";
import { TESTIMONIAL_TYPE_CONFIG, resolveTestimonialType } from "@/lib/testimonial-types";
import { getIconEntry } from "@/lib/testimonial-icons";
import { ImageIcon } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminTestimonialsPage() {
  const testimonials = await fetchTestimonials();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Témoignages"
        description="Gérer les témoignages affichés sur l'accueil"
        actions={
          <Button asChild className="rounded-full admin-btn-primary hover:opacity-95">
            <Link href="/admin/temoignages/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau témoignage
            </Link>
          </Button>
        }
      />
      <AdminPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Ordre</TableHead>
              <TableHead>Publié</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((item) => {
              const typeKey = resolveTestimonialType(item.type, item.role);
              const iconEntry = getIconEntry(item.iconKey);
              return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{TESTIMONIAL_TYPE_CONFIG[typeKey].label}</TableCell>
                <TableCell>
                  {item.usePhoto && item.imageUrl ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Photo
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {iconEntry?.label ?? "Icône par défaut"}
                    </span>
                  )}
                </TableCell>
                <TableCell>{item.role ?? "—"}</TableCell>
                <TableCell>{item.order}</TableCell>
                <TableCell>{item.published ? "Oui" : "Non"}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/temoignages/${item.id}`}><Pencil className="h-4 w-4" /></Link>
                  </Button>
                  <DeleteButton id={item.id} action={deleteTestimonial} />
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </AdminPanel>
    </div>
  );
}
