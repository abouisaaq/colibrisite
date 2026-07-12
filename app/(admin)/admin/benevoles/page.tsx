import { fetchVolunteers } from "@/lib/convex-data";
import { VolunteerApplicationsList } from "@/components/admin/volunteer-applications-list";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function AdminVolunteersPage() {
  const rows = await fetchVolunteers();
  const volunteers = rows.map((v) => ({
    id: v.id,
    firstName: v.firstName,
    lastName: v.lastName,
    email: v.email,
    phone: v.phone ?? null,
    skills: v.skills ?? null,
    availability: v.availability ?? null,
    domains: v.domains ?? null,
    message: v.message ?? null,
    status: v.status as "NEW" | "REVIEWING" | "ACCEPTED" | "REJECTED",
    createdAt: new Date(v._creationTime),
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Engagement"
        title="Bénévoles"
        description="Toutes les coordonnées et informations des candidatures bénévoles"
      />

      <VolunteerApplicationsList volunteers={volunteers} />
    </div>
  );
}
