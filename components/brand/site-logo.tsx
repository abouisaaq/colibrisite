import Image from "next/image";
import { cn } from "@/lib/utils";

/** Logo packagé avec le site — utilisé si aucun upload CMS. */
export const DEFAULT_SITE_LOGO = "/brand/logo-bird.png";

interface SiteLogoProps {
  logoUrl?: string | null;
  size?: number;
  height?: number;
  maxWidth?: number;
  className?: string;
  alt?: string;
}

function isRemote(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function SiteLogo({
  logoUrl,
  size = 40,
  height,
  maxWidth = 220,
  className,
  alt = "Les Colibris Porteurs d'Espoir",
}: SiteLogoProps) {
  const src = logoUrl?.trim() || DEFAULT_SITE_LOGO;
  const remote = isRemote(src);

  if (height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={maxWidth}
        height={height}
        className={cn("w-auto object-contain", className)}
        style={{ height, maxWidth, width: "auto" }}
        priority
        unoptimized={remote}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("object-contain", className)}
      style={{ width: size, height: "auto", maxHeight: size }}
      priority
      unoptimized={remote}
    />
  );
}
