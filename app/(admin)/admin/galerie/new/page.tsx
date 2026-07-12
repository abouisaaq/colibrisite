import { AlbumForm } from "@/components/admin/album-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default function NewAlbumPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Nouvel album"
        description="Créez un album photo pour la galerie"
      />
      <AdminPanel padded>
        <AlbumForm />
      </AdminPanel>
    </div>
  );
}
