import { getAllSettings } from "@/lib/settings";
import { parseSiteLogoHeight } from "@/lib/logo-size";
import { LogoUpload } from "@/components/admin/logo-upload";
import { CmsSectionShell } from "@/components/admin/cms-section-shell";

export default async function AccueilHeaderPage() {
  const settings = await getAllSettings();

  return (
    <CmsSectionShell
      pageLabel="Accueil"
      pageHref="/admin/accueil"
      title="Identité / Header"
      description="Logo affiché dans le menu et le hero."
    >
      <LogoUpload
        currentUrl={settings.site_logo}
        currentHeight={parseSiteLogoHeight(settings.site_logo_height)}
      />
    </CmsSectionShell>
  );
}
