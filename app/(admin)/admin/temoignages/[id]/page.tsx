import { notFound } from "next/navigation";
import { fetchTestimonialById } from "@/lib/convex-data";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { createTestimonial, updateTestimonial } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await fetchTestimonialById(id);
  if (!testimonial) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Modifier le témoignage"
        description="Mettez à jour le contenu et l'affichage"
      />
      <AdminPanel padded>
        <TestimonialForm
          testimonial={{
            id: testimonial.id,
            name: testimonial.name,
            role: testimonial.role ?? null,
            quote: testimonial.quote,
            type: testimonial.type,
            iconKey: testimonial.iconKey ?? null,
            usePhoto: testimonial.usePhoto,
            imageUrl: testimonial.imageUrl ?? null,
            order: testimonial.order,
            published: testimonial.published,
          }}
          action={createTestimonial}
          updateAction={updateTestimonial}
        />
      </AdminPanel>
    </div>
  );
}
