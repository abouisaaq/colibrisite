import { getAllSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";
import { SETTING_KEYS } from "@/lib/setting-keys";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { requireAdmin } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin");
  }

  const settings = await getAllSettings();
  const hasPayPalSecret = Boolean(settings[SETTING_KEYS.paypalClientSecret]);
  const hasPayPalWebhook = Boolean(settings[SETTING_KEYS.paypalWebhookId]);
  const {
    [SETTING_KEYS.paypalClientSecret]: _secret,
    [SETTING_KEYS.paypalWebhookId]: _webhookId,
    ...publicSettings
  } = settings;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Système"
        title="Paramètres"
        description="Configuration du site, SEO, statistiques et identifiants PayPal"
      />
      <AdminPanel padded>
        <SettingsForm
          settings={publicSettings}
          hasPayPalSecret={hasPayPalSecret}
          hasPayPalWebhook={hasPayPalWebhook}
        />
      </AdminPanel>
    </div>
  );
}
