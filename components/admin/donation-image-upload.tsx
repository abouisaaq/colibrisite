"use client";

import { SiteImageUpload } from "@/components/admin/site-image-upload";
import { DEFAULT_SITE_PAGE_IMAGES } from "@/lib/site-images";

interface DonationImageUploadProps {
  currentUrl?: string;
}

export function DonationImageUpload({ currentUrl }: DonationImageUploadProps) {
  return (
    <SiteImageUpload
      slot="donation"
      title="Image dons (accueil + page Faire un don)"
      description="Photo affichée dans le bloc « Faire un don » de l’accueil et sur la page Faire un don. Format portrait ou carré recommandé."
      currentUrl={currentUrl}
      defaultUrl={DEFAULT_SITE_PAGE_IMAGES.donation}
      aspectClass="aspect-[4/5] h-auto sm:w-52"
    />
  );
}
