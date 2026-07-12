"use client";

import { SiteImageUpload } from "@/components/admin/site-image-upload";
import { DEFAULT_SITE_PAGE_IMAGES } from "@/lib/site-images";

interface VolunteerImageUploadProps {
  currentUrl?: string;
}

export function VolunteerImageUpload({ currentUrl }: VolunteerImageUploadProps) {
  return (
    <SiteImageUpload
      slot="volunteer"
      title="Image — Devenir bénévole"
      description="Photo affichée à côté du formulaire sur la page Devenir bénévole. Format paysage recommandé."
      currentUrl={currentUrl}
      defaultUrl={DEFAULT_SITE_PAGE_IMAGES.volunteer}
      aspectClass="aspect-[4/3] h-auto sm:w-64"
    />
  );
}
