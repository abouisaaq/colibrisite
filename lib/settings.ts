import "server-only";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { stripSecretSettings } from "@/lib/setting-keys";

export { SETTING_KEYS, SECRET_SETTING_KEYS, stripSecretSettings } from "@/lib/setting-keys";

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const client = getConvexClient();
  const value = await client.query(api.settings.get, { key });
  return value ?? fallback;
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const all = await getAllSettings();
  const map: Record<string, string> = {};
  for (const key of keys) {
    if (all[key] !== undefined) map[key] = all[key]!;
  }
  return map;
}

/** Tous les settings (serveur) — inclut secrets PayPal pour le backend. */
export async function getAllSettings(): Promise<Record<string, string>> {
  const client = getConvexClient();
  return await client.query(api.settings.getAll, {});
}

/** Settings sûrs pour pages / props publiques (sans secrets). */
export async function getPublicSettings(): Promise<Record<string, string>> {
  return stripSecretSettings(await getAllSettings());
}
