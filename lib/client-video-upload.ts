/**
 * Upload vidéo navigateur → Convex.
 * 1) Prefer HTTP action Convex (CORS explicite, jusqu’à 20 Mo) — corrige Safari « Load failed »
 * 2) Sinon POST sur l’URL de storage (générée côté serveur)
 */

import type { UploadedMediaMeta } from "@/actions/admin";

const MAX_VIDEO_BYTES = 80 * 1024 * 1024;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|mpeg|mpg)$/i;

function isVideoFile(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  return VIDEO_EXT.test(file.name);
}

function guessMimeType(file: File): string {
  if (file.type) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".webm")) return "video/webm";
  if (name.endsWith(".mov")) return "video/quicktime";
  if (name.endsWith(".m4v")) return "video/x-m4v";
  return "video/mp4";
}

function networkErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (/load failed|failed to fetch|networkerror|network request failed/i.test(raw)) {
    return "Connexion impossible vers le stockage (réseau ou CORS). Réessayez, réduisez la taille, ou utilisez YouTube.";
  }
  return raw || "Erreur lors du téléversement";
}

function safeFilename(file: File): string {
  return `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
}

async function postFile(
  url: string,
  file: File,
  mimeType: string,
  extraHeaders?: Record<string, string>
): Promise<{ storageId: string }> {
  const result = await new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", mimeType);
    if (extraHeaders) {
      for (const [key, value] of Object.entries(extraHeaders)) {
        xhr.setRequestHeader(key, value);
      }
    }
    xhr.onload = () => {
      resolve(
        new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
        })
      );
    };
    xhr.onerror = () => reject(new TypeError("Load failed"));
    xhr.ontimeout = () =>
      reject(new Error("Délai dépassé — essayez une vidéo plus légère ou YouTube"));
    xhr.timeout = 120_000;
    xhr.send(file);
  });

  if (!result.ok) {
    let detail = "";
    try {
      const body = (await result.json()) as { error?: string };
      detail = body.error ? ` : ${body.error}` : "";
    } catch {
      /* ignore */
    }
    throw new Error(`Échec du téléversement (${result.status})${detail}`);
  }

  const payload = (await result.json()) as { storageId?: string };
  if (!payload.storageId) {
    throw new Error("Réponse de téléversement invalide");
  }
  return { storageId: payload.storageId };
}

type PreparePayload = {
  ticket: string;
  httpUploadUrl: string;
  storageUploadUrl: string;
  maxHttpBytes: number;
};

async function prepareUpload(): Promise<PreparePayload> {
  const res = await fetch("/api/admin/media/prepare-video-upload", {
    method: "POST",
    credentials: "same-origin",
  });
  if (!res.ok) {
    let message = "Impossible de préparer le téléversement";
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return (await res.json()) as PreparePayload;
}

export async function uploadVideoToConvex(file: File): Promise<UploadedMediaMeta> {
  if (!isVideoFile(file)) {
    throw new Error("Le fichier doit être une vidéo (MP4, WebM…)");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error(
      "La vidéo ne doit pas dépasser 80 Mo — préférez YouTube pour les fichiers lourds"
    );
  }

  const mimeType = guessMimeType(file);
  const filename = safeFilename(file);

  try {
    const prepared = await prepareUpload();

    // Priorité : HTTP Convex (CORS maîtrisé) jusqu’à 20 Mo
    if (file.size <= prepared.maxHttpBytes) {
      try {
        const { storageId } = await postFile(
          prepared.httpUploadUrl,
          file,
          mimeType,
          { "X-Upload-Ticket": prepared.ticket }
        );
        return {
          storageId,
          filename,
          mimeType,
          size: file.size,
        };
      } catch (httpError) {
        // Repli sur l’URL storage Convex
        console.warn("uploadMedia HTTP failed, falling back to storage URL", httpError);
      }
    }

    const { storageId } = await postFile(
      prepared.storageUploadUrl,
      file,
      mimeType
    );
    return {
      storageId,
      filename,
      mimeType,
      size: file.size,
    };
  } catch (error) {
    throw new Error(networkErrorMessage(error));
  }
}
