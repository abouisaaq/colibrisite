import { SiteFooter } from "@/components/layout/site-footer";
import { PublicShell } from "@/components/layout/public-shell";
import { getPublicSettings } from "@/lib/settings";
import { parseSiteLogoHeight } from "@/lib/logo-size";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettings();
  const logoHeight = parseSiteLogoHeight(settings.site_logo_height);

  return (
    <PublicShell
      logoUrl={settings.site_logo}
      logoHeight={logoHeight}
      footer={<SiteFooter settings={settings} logoUrl={settings.site_logo} />}
    >
      {children}
    </PublicShell>
  );
}
