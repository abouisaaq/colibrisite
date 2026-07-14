import { fetchMedia } from "@/lib/convex-data";
import { getAllSettings } from "@/lib/settings";
import { parseSiteLogoHeight } from "@/lib/logo-size";
import { parseAboutTeamMembers } from "@/lib/about-content";
import { LogoUpload } from "@/components/admin/logo-upload";
import { HeroImageUpload } from "@/components/admin/hero-image-upload";
import { MissionImagesUpload } from "@/components/admin/mission-images-upload";
import { DonationImageUpload } from "@/components/admin/donation-image-upload";
import { AboutImagesUpload } from "@/components/admin/about-images-upload";
import { StorySeismeMediaUpload } from "@/components/admin/story-seisme-media-upload";
import { StoryPremieresMediaUpload } from "@/components/admin/story-premieres-media-upload";
import { StoryConfortMediaUpload } from "@/components/admin/story-confort-media-upload";
import { StoryTerrainMediaUpload } from "@/components/admin/story-terrain-media-upload";
import { StoryCreationMediaUpload } from "@/components/admin/story-creation-media-upload";
import { VolunteerImageUpload } from "@/components/admin/volunteer-image-upload";
import { AboutTeamEditor } from "@/components/admin/about-team-editor";
import { MediaLibrary } from "@/components/admin/media-library";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { STORY_SEISME_SETTING_KEYS } from "@/lib/about-story-media";
import { STORY_PREMIERES_SETTING_KEYS } from "@/lib/about-story-premieres";
import { STORY_CONFORT_SETTING_KEYS } from "@/lib/about-story-confort";
import { STORY_TERRAIN_SETTING_KEYS } from "@/lib/about-story-terrain";
import { STORY_CREATION_SETTING_KEYS } from "@/lib/about-story-creation";

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
        description="Gérez le logo, les images d’accueil, les dons, l’équipe et la bibliothèque. Les vidéos Accueil sont dans le menu « Vidéos Accueil »."
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
        <div className="space-y-4">
          <StorySeismeMediaUpload
            photoUrls={{
              photo1: settings[STORY_SEISME_SETTING_KEYS.photo1] ?? "",
              photo2: settings[STORY_SEISME_SETTING_KEYS.photo2] ?? "",
              photo3: settings[STORY_SEISME_SETTING_KEYS.photo3] ?? "",
            }}
            videoUrl={settings[STORY_SEISME_SETTING_KEYS.videoFile]}
            videoPosterUrl={settings[STORY_SEISME_SETTING_KEYS.videoPoster]}
            youtubeUrl={settings[STORY_SEISME_SETTING_KEYS.youtubeUrl]}
          />
          <StoryPremieresMediaUpload
            photoUrls={{
              left1: settings[STORY_PREMIERES_SETTING_KEYS.left1] ?? "",
              left2: settings[STORY_PREMIERES_SETTING_KEYS.left2] ?? "",
              left3: settings[STORY_PREMIERES_SETTING_KEYS.left3] ?? "",
              right1: settings[STORY_PREMIERES_SETTING_KEYS.right1] ?? "",
              right2: settings[STORY_PREMIERES_SETTING_KEYS.right2] ?? "",
              right3: settings[STORY_PREMIERES_SETTING_KEYS.right3] ?? "",
            }}
          />
          <StoryConfortMediaUpload
            photoUrls={{
              left1: settings[STORY_CONFORT_SETTING_KEYS.left1] ?? "",
              left2: settings[STORY_CONFORT_SETTING_KEYS.left2] ?? "",
              left3: settings[STORY_CONFORT_SETTING_KEYS.left3] ?? "",
              right1: settings[STORY_CONFORT_SETTING_KEYS.right1] ?? "",
              right2: settings[STORY_CONFORT_SETTING_KEYS.right2] ?? "",
              right3: settings[STORY_CONFORT_SETTING_KEYS.right3] ?? "",
            }}
          />
          <StoryTerrainMediaUpload
            photoUrls={{
              photo1: settings[STORY_TERRAIN_SETTING_KEYS.photo1] ?? "",
              photo2: settings[STORY_TERRAIN_SETTING_KEYS.photo2] ?? "",
              photo3: settings[STORY_TERRAIN_SETTING_KEYS.photo3] ?? "",
            }}
            videoUrl={settings[STORY_TERRAIN_SETTING_KEYS.videoFile]}
            videoPosterUrl={settings[STORY_TERRAIN_SETTING_KEYS.videoPoster]}
            youtubeUrl={settings[STORY_TERRAIN_SETTING_KEYS.youtubeUrl]}
          />
          <StoryCreationMediaUpload
            imageUrl={settings[STORY_CREATION_SETTING_KEYS.image]}
          />
          <AboutImagesUpload
            storyUrl={settings.about_image_story}
            colibriUrl={settings.about_image_colibri}
          />
        </div>
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
