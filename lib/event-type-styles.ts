import type { CSSProperties } from "react";

export interface EventTypePresentation {
  label: string;
  color: string;
  dotStyle: CSSProperties;
  badgeStyle: CSSProperties;
  dateBgStyle: CSSProperties;
}

function shadeHexColor(hex: string, amount: number) {
  const normalized = hex.replace("#", "");
  const num = parseInt(normalized, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function getEventTypePresentation(
  name: string,
  color = "#42D7C8"
): EventTypePresentation {
  const safeColor = /^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#42D7C8";

  return {
    label: name,
    color: safeColor,
    dotStyle: { backgroundColor: safeColor },
    badgeStyle: { backgroundColor: `${safeColor}1a`, color: safeColor },
    dateBgStyle: {
      background: `linear-gradient(135deg, ${safeColor}, ${shadeHexColor(safeColor, -24)})`,
    },
  };
}

export const DEFAULT_EVENT_TYPE_PRESENTATION = getEventTypePresentation("Événement");
