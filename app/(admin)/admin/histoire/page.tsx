import { getAllSettings } from "@/lib/settings";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { StoryChaptersEditor } from "@/components/admin/story-chapters-editor";
import {
  parseStoryChaptersCms,
  getDefaultStoryChaptersCms,
  STORY_CHAPTERS_CMS_KEY,
} from "@/lib/about-story-cms";
import { STORY_SEISME_SETTING_KEYS } from "@/lib/about-story-media";
import { STORY_PREMIERES_SETTING_KEYS } from "@/lib/about-story-premieres";
import { STORY_CONFORT_SETTING_KEYS } from "@/lib/about-story-confort";
import { STORY_TERRAIN_SETTING_KEYS } from "@/lib/about-story-terrain";
import { STORY_CREATION_SETTING_KEYS } from "@/lib/about-story-creation";

export default async function AdminHistoirePage() {
  const settings = await getAllSettings();
  const rawCms = settings[STORY_CHAPTERS_CMS_KEY];
  const initialCms = rawCms
    ? parseStoryChaptersCms(rawCms)
    : getDefaultStoryChaptersCms();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contenu"
        title="Notre histoire"
        description="Modifiez les textes, photos et vidéos des chapitres. Les images des cercles de la frise restent fixes."
      />

      <AdminPanel title="Chapitres" padded>
        <StoryChaptersEditor
          initialCms={initialCms}
          media={{
            seisme: {
              photos: {
                photo1: settings[STORY_SEISME_SETTING_KEYS.photo1] ?? "",
                photo2: settings[STORY_SEISME_SETTING_KEYS.photo2] ?? "",
                photo3: settings[STORY_SEISME_SETTING_KEYS.photo3] ?? "",
              },
              videoUrl: settings[STORY_SEISME_SETTING_KEYS.videoFile],
              videoPosterUrl: settings[STORY_SEISME_SETTING_KEYS.videoPoster],
              youtubeUrl: settings[STORY_SEISME_SETTING_KEYS.youtubeUrl],
            },
            premieres: {
              left1: settings[STORY_PREMIERES_SETTING_KEYS.left1] ?? "",
              left2: settings[STORY_PREMIERES_SETTING_KEYS.left2] ?? "",
              left3: settings[STORY_PREMIERES_SETTING_KEYS.left3] ?? "",
              right1: settings[STORY_PREMIERES_SETTING_KEYS.right1] ?? "",
              right2: settings[STORY_PREMIERES_SETTING_KEYS.right2] ?? "",
              right3: settings[STORY_PREMIERES_SETTING_KEYS.right3] ?? "",
            },
            confort: {
              left1: settings[STORY_CONFORT_SETTING_KEYS.left1] ?? "",
              left2: settings[STORY_CONFORT_SETTING_KEYS.left2] ?? "",
              left3: settings[STORY_CONFORT_SETTING_KEYS.left3] ?? "",
              right1: settings[STORY_CONFORT_SETTING_KEYS.right1] ?? "",
              right2: settings[STORY_CONFORT_SETTING_KEYS.right2] ?? "",
              right3: settings[STORY_CONFORT_SETTING_KEYS.right3] ?? "",
            },
            terrain: {
              photos: {
                photo1: settings[STORY_TERRAIN_SETTING_KEYS.photo1] ?? "",
                photo2: settings[STORY_TERRAIN_SETTING_KEYS.photo2] ?? "",
                photo3: settings[STORY_TERRAIN_SETTING_KEYS.photo3] ?? "",
              },
              videoUrl: settings[STORY_TERRAIN_SETTING_KEYS.videoFile],
              videoPosterUrl: settings[STORY_TERRAIN_SETTING_KEYS.videoPoster],
              youtubeUrl: settings[STORY_TERRAIN_SETTING_KEYS.youtubeUrl],
            },
            creationImageUrl: settings[STORY_CREATION_SETTING_KEYS.image],
          }}
        />
      </AdminPanel>
    </div>
  );
}
