"use server";

import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { contactSchema, volunteerSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function submitContact(formData: FormData) {
  const data = contactSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  });

  const client = getConvexClient();
  await client.mutation(api.publicForms.submitContact, data);
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function submitVolunteer(formData: FormData) {
  const availability = formData.getAll("availability").map(String).filter(Boolean);
  const domains = formData.getAll("domains").map(String).filter(Boolean);

  const data = volunteerSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    skills: formData.get("skills") || undefined,
    availability: availability.length > 0 ? availability.join(",") : undefined,
    domains: domains.length > 0 ? domains.join(",") : undefined,
    message: formData.get("message") || undefined,
  });

  const client = getConvexClient();
  await client.mutation(api.publicForms.submitVolunteer, data);
  revalidatePath("/admin/benevoles");
  return { success: true };
}
