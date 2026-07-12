import Link from "next/link";
import { fetchGalleryAlbums } from "@/lib/convex-data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAlbum } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminGalleryPage() {
  const albums = await fetchGalleryAlbums();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Galerie"
        description="Gérer les albums photos"
        actions={
          <Button asChild className="rounded-full admin-btn-primary hover:opacity-95">
            <Link href="/admin/galerie/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel album
            </Link>
          </Button>
        }
      />
      <AdminPanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Photos</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {albums.map(
              (album: { id: string; title: string; images: unknown[] }) => (
              <TableRow key={album.id}>
                <TableCell className="font-medium">{album.title}</TableCell>
                <TableCell>{album.images.length}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/galerie/${album.id}`}><Pencil className="h-4 w-4" /></Link>
                  </Button>
                  <DeleteButton id={album.id} action={deleteAlbum} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminPanel>
    </div>
  );
}
