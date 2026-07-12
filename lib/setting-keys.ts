export const SETTING_KEYS = {
  heroTitle: "hero_title",
  heroSubtitle: "hero_subtitle",
  heroImage: "hero_image",
  missionTitle: "mission_title",
  missionText: "mission_text",
  missionQuote: "mission_quote",
  missionImageMain: "mission_image_main",
  missionImageLeft: "mission_image_left",
  missionImageRight: "mission_image_right",
  statFamilies: "stat_families",
  statVolunteers: "stat_volunteers",
  statProjects: "stat_projects",
  statPartners: "stat_partners",
  ctaTitle: "cta_title",
  ctaSubtitle: "cta_subtitle",
  aboutMission: "about_mission",
  aboutTeam: "about_team",
  aboutTeamMembers: "about_team_members",
  aboutValues: "about_values",
  aboutHeroDescription: "about_hero_description",
  aboutStoryTitle: "about_story_title",
  aboutStoryQuote: "about_story_quote",
  aboutValuesTitle: "about_values_title",
  aboutColibriTitle: "about_colibri_title",
  aboutColibriText: "about_colibri_text",
  aboutCommitmentsTitle: "about_commitments_title",
  aboutCommitments: "about_commitments",
  aboutCtaTitle: "about_cta_title",
  aboutCtaSubtitle: "about_cta_subtitle",
  contactEmail: "contact_email",
  contactPhone: "contact_phone",
  contactPhoneFr: "contact_phone_fr",
  contactPhoneMa: "contact_phone_ma",
  contactAddress: "contact_address",
  contactHeroDescription: "contact_hero_description",
  donationHeroDescription: "donation_hero_description",
  volunteerHeroDescription: "volunteer_hero_description",
  footerTagline: "footer_tagline",
  seoTitle: "seo_title",
  seoDescription: "seo_description",
  facebookUrl: "facebook_url",
  instagramUrl: "instagram_url",
  youtubeUrl: "youtube_url",
  siteLogo: "site_logo",
  siteLogoHeight: "site_logo_height",
  donationImage: "donation_image",
  aboutImageStory: "about_image_story",
  aboutImageColibri: "about_image_colibri",
  volunteerImage: "volunteer_image",
  newsletterTitle: "newsletter_title",
  newsletterSubtitle: "newsletter_subtitle",
  partnersTitle: "partners_title",
  partnersSubtitle: "partners_subtitle",
  actionsEyebrow: "actions_eyebrow",
  actionsTitle: "actions_title",
  actionsSubtitle: "actions_subtitle",
  testimonialsEyebrow: "testimonials_eyebrow",
  testimonialsTitle: "testimonials_title",
  testimonialsSubtitle: "testimonials_subtitle",
  paypalMode: "paypal_mode",
  paypalClientId: "paypal_client_id",
  paypalClientSecret: "paypal_client_secret",
  paypalWebhookId: "paypal_webhook_id",
} as const;

/** Jamais renvoyer ces clés aux pages publiques / au navigateur. */
export const SECRET_SETTING_KEYS = [
  SETTING_KEYS.paypalClientSecret,
  SETTING_KEYS.paypalWebhookId,
] as const;

export function stripSecretSettings(
  settings: Record<string, string>
): Record<string, string> {
  const next = { ...settings };
  for (const key of SECRET_SETTING_KEYS) {
    delete next[key];
  }
  return next;
}
