import { notFound } from "next/navigation";
import { fetchPartnerById } from "@/lib/convex-data";
import { PartnerForm } from "@/components/admin/partner-form";
import { createPartner, updatePartner } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPartnerPage({ params }: Props) {
  const { id } = await params;
  const partner = await fetchPartnerById(id);
  if (!partner) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Modifier le partenaire"
        description="Mettez à jour le logo, le nom ou le lien"
      />
      <AdminPanel padded>
        <PartnerForm
          partner={{
            id: partner.id,
            name: partner.name,
            logoUrl: partner.logoUrl,
            websiteUrl: partner.websiteUrl ?? null,
            order: partner.order,
            published: partner.published,
          }}
          action={createPartner}
          updateAction={updatePartner}
        />
      </AdminPanel>
    </div>
  );
}
