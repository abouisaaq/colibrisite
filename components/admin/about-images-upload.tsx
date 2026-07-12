"use client";

import { SiteImageUpload } from "@/components/admin/site-image-upload";
import { DEFAULT_SITE_PAGE_IMAGES } from "@/lib/site-images";

interface AboutImagesUploadProps {
  storyUrl?: string;
  colibriUrl?: string;
}

export function AboutImagesUpload({
  storyUrl,
  colibriUrl,
}: AboutImagesUploadProps) {
  return (
    <div className="space-y-4">
      <SiteImageUpload
        slot="about_story"
        title="À propos — Notre histoire"
        description="Image principale de la section « Notre histoire » sur la page À propos."
        currentUrl={storyUrl}
        defaultUrl={DEFAULT_SITE_PAGE_IMAGES.about_story}
        aspectClass="aspect-[4/3] h-auto sm:w-64"
      />
      <SiteImageUpload
        slot="about_colibri"
        title="À propos — Faire sa part"
        description="Image de la section fable du colibri (« Faire sa part, ensemble »)."
        currentUrl={colibriUrl}
        defaultUrl={DEFAULT_SITE_PAGE_IMAGES.about_colibri}
        aspectClass="aspect-[4/3] h-auto sm:w-64"
      />
    </div>
  );
}
