import { getAllSettings } from "@/lib/settings";
import { parseAboutTeamMembers } from "@/lib/about-content";
import { AboutTeamEditor } from "@/components/admin/about-team-editor";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AProposEquipePage() {
  const settings = await getAllSettings();
  const teamMembers = parseAboutTeamMembers(settings.about_team_members);

  return (
    <CmsSectionShell
      pageLabel="À propos"
      pageHref="/admin/a-propos"
      title="Notre équipe"
      description="Intro et membres affichés sur la page À propos."
    >
      <AboutTeamEditor intro={settings.about_team} members={teamMembers} />
    </CmsSectionShell>
  );
}
