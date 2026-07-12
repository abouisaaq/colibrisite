"use client";

import { useEffect, useState } from "react";

function chronometerDuration(value: number): number {
  return Math.min(3200, Math.max(1800, value * 1.1));
}

export function AnimatedCounter({
  value,
  active,
  delay = 0,
}: {
  value: number;
  active: boolean;
  delay?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }

    let frame = 0;
    let startTime: number | null = null;
    const duration = chronometerDuration(value);
    let timeoutId = 0;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    timeoutId = window.setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(frame);
    };
  }, [active, delay, value]);

  return <>{display.toLocaleString("fr-FR")}</>;
}
