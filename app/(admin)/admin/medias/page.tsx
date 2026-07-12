import { fetchMedia } from "@/lib/convex-data";
import { getAllSettings } from "@/lib/settings";
import { parseSiteLogoHeight } from "@/lib/logo-size";
import { parseAboutTeamMembers } from "@/lib/about-content";
import { LogoUpload } from "@/components/admin/logo-upload";
import { HeroImageUpload } from "@/components/admin/hero-image-upload";
import { MissionImagesUpload } from "@/components/admin/mission-images-upload";
import { DonationImageUpload } from "@/components/admin/donation-image-upload";
import { AboutImagesUpload } from "@/components/admin/about-images-upload";
import { VolunteerImageUpload } from "@/components/admin/volunteer-image-upload";
import { AboutTeamEditor } from "@/components/admin/about-team-editor";
import { MediaLibrary } from "@/components/admin/media-library";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminMediasPage() {
  const [settings, mediaRows] = await Promise.all([
    getAllSettings(),
    fetchMedia(),
  ]);

  const teamMembers = parseAboutTeamMembers(settings.about_team_members);
  const media = mediaRows.map((m) => ({
    id: m.id,
    filename: m.filename,
    url: m.url,
    mimeType: m.mimeType,
    size: m.size,
    createdAt: new Date(m._creationTime),
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Médias"
        description="Gérez le logo, les images d'accueil, les dons, l'équipe et la bibliothèque"
      />

      <AdminPanel title="Identité visuelle" padded>
        <div className="space-y-4">
          <LogoUpload
            currentUrl={settings.site_logo}
            currentHeight={parseSiteLogoHeight(settings.site_logo_height)}
          />
          <HeroImageUpload currentUrl={settings.hero_image} />
          <MissionImagesUpload
            currentUrls={{
              main: settings.mission_image_main ?? "",
              left: settings.mission_image_left ?? "",
              right: settings.mission_image_right ?? "",
            }}
          />
        </div>
      </AdminPanel>

      <AdminPanel title="Dons" padded>
        <DonationImageUpload currentUrl={settings.donation_image} />
      </AdminPanel>

      <AdminPanel title="Devenir bénévole" padded>
        <VolunteerImageUpload currentUrl={settings.volunteer_image} />
      </AdminPanel>

      <AdminPanel title="Page À propos" padded>
        <AboutImagesUpload
          storyUrl={settings.about_image_story}
          colibriUrl={settings.about_image_colibri}
        />
      </AdminPanel>

      <AdminPanel
        title="Notre équipe"
        description="Modifiez les membres affichés sur la page À propos (photo, nom, rôle, description)"
        padded
      >
        <AboutTeamEditor intro={settings.about_team} members={teamMembers} />
      </AdminPanel>

      <MediaLibrary initialMedia={media} />
    </div>
  );
}
