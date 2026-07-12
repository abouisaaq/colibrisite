import { TestimonialForm } from "@/components/admin/testimonial-form";
import { createTestimonial } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Nouveau témoignage"
        description="Ajoutez un témoignage affiché sur l'accueil"
      />
      <AdminPanel padded>
        <TestimonialForm action={createTestimonial} />
      </AdminPanel>
    </div>
  );
}
