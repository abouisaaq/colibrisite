/**
 * Extrait une frame du début d’une vidéo pour servir de poster (miniature).
 * Navigateur uniquement.
 */

export async function extractVideoPosterFrame(
  file: File,
  options?: { seekSeconds?: number; quality?: number }
): Promise<File | null> {
  if (typeof document === "undefined") return null;

  const seekSeconds = options?.seekSeconds ?? 0.35;
  const quality = options?.quality ?? 0.85;
  const objectUrl = URL.createObjectURL(file);

  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      const onError = () => reject(new Error("Impossible de lire la vidéo pour la miniature"));
      video.addEventListener("loadeddata", () => resolve(), { once: true });
      video.addEventListener("error", onError, { once: true });
    });

    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const target =
      duration > 0 ? Math.min(seekSeconds, Math.max(duration * 0.05, 0.05)) : seekSeconds;

    await new Promise<void>((resolve, reject) => {
      const onSeeked = () => resolve();
      const onError = () => reject(new Error("Seek miniature impossible"));
      video.addEventListener("seeked", onSeeked, { once: true });
      video.addEventListener("error", onError, { once: true });
      try {
        video.currentTime = target;
      } catch {
        reject(new Error("Seek miniature impossible"));
      }
    });

    const width = video.videoWidth || 720;
    const height = video.videoHeight || 1280;
    if (width < 2 || height < 2) return null;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
    );
    if (!blob) return null;

    const base = file.name.replace(/\.[^.]+$/, "") || "video";
    return new File([blob], `${base}-poster.jpg`, { type: "image/jpeg" });
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
