import { PartnerForm } from "@/components/admin/partner-form";
import { createPartner } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default function NewPartnerPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Nouveau partenaire"
        description="Ajoutez un logo partenaire pour l'accueil"
      />
      <AdminPanel padded>
        <PartnerForm action={createPartner} />
      </AdminPanel>
    </div>
  );
}
