"use server";

import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import {
  isBotSubmission,
  isContactSpam,
  isVolunteerSpam,
} from "@/lib/form-spam-guard";
import { contactSchema, volunteerSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

/** Les bots ne doivent pas savoir que la soumission a été refusée. */
function silentSuccess() {
  return { success: true as const };
}

export async function submitContact(formData: FormData) {
  if (isBotSubmission(formData)) {
    return silentSuccess();
  }

  const data = contactSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  });

  if (isContactSpam(data)) {
    return silentSuccess();
  }

  const client = getConvexClient();
  await client.mutation(api.publicForms.submitContact, data);
  revalidatePath("/admin/messages");
  return silentSuccess();
}

export async function submitVolunteer(formData: FormData) {
  if (isBotSubmission(formData)) {
    return silentSuccess();
  }

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

  if (
    isVolunteerSpam({
      ...data,
      availabilityCount: availability.length,
      domainsCount: domains.length,
    })
  ) {
    return silentSuccess();
  }

  const client = getConvexClient();
  await client.mutation(api.publicForms.submitVolunteer, data);
  revalidatePath("/admin/benevoles");
  return silentSuccess();
}
