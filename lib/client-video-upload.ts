/**
 * Upload vidéo depuis le navigateur → Convex Storage (pas via Server Action FormData).
 * Évite l’erreur Next « An unexpected response was received from the server »
 * due aux limites de taille / timeout du proxy (Vercel, etc.).
 */

import {
  createMediaUploadUrl,
  type UploadedMediaMeta,
} from "@/actions/admin";

const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

export async function uploadVideoToConvex(file: File): Promise<UploadedMediaMeta> {
  if (!file.type.startsWith("video/")) {
    throw new Error("Le fichier doit être une vidéo (MP4, WebM…)");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error(
      "La vidéo ne doit pas dépasser 80 Mo — préférez YouTube pour les fichiers lourds"
    );
  }

  const uploadUrl = await createMediaUploadUrl();
  const result = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });

  if (!result.ok) {
    throw new Error(
      "Échec du téléversement vers le stockage. Réessayez ou utilisez un lien YouTube."
    );
  }

  const payload = (await result.json()) as { storageId?: string };
  if (!payload.storageId) {
    throw new Error("Réponse de téléversement invalide");
  }

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  return {
    storageId: payload.storageId,
    filename,
    mimeType: file.type || "video/mp4",
    size: file.size,
  };
}
