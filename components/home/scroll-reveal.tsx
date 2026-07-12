"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const HOME_EASE = [0.22, 1, 0.36, 1] as const;

export const CARD_ENTRY_OFFSETS = [
  { x: -64, y: -48 },
  { x: 64, y: -48 },
  { x: -64, y: 48 },
  { x: 64, y: 48 },
  { x: 0, y: 56 },
  { x: 0, y: -56 },
] as const;

const MOBILE_CARD_ENTRY_OFFSETS = [
  { x: 0, y: 28 },
  { x: 0, y: 28 },
  { x: 0, y: 28 },
  { x: 0, y: 28 },
  { x: 0, y: 28 },
  { x: 0, y: 28 },
] as const;

function subscribeNarrow(onStoreChange: () => void) {
  const media = window.matchMedia("(max-width: 639px)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getNarrowSnapshot() {
  return window.matchMedia("(max-width: 639px)").matches;
}

function getNarrowServerSnapshot() {
  return false;
}

function useIsNarrow() {
  return useSyncExternalStore(subscribeNarrow, getNarrowSnapshot, getNarrowServerSnapshot);
}

/** Prefer this when mapping CARD_ENTRY_OFFSETS so mobile doesn't slide horizontally. */
export function cardEntryOffset(index: number, narrow?: boolean) {
  const isNarrow =
    narrow ??
    (typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches);
  const list = isNarrow ? MOBILE_CARD_ENTRY_OFFSETS : CARD_ENTRY_OFFSETS;
  return list[index % list.length]!;
}

export function useSectionInView(amount = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

type RevealDirection = "up" | "down" | "left" | "right" | "none";

const DIRECTION_OFFSET: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: -56, y: 0 },
  right: { x: 56, y: 0 },
  none: { x: 0, y: 0 },
};

const MOBILE_DIRECTION_OFFSET: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 0, y: 24 },
  right: { x: 0, y: 24 },
  none: { x: 0, y: 0 },
};

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  inView?: boolean;
  amount?: number;
}

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 1.1,
  inView: inViewProp,
  amount = 0.24,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const localInView = useInView(ref, { once: true, amount });
  const inView = inViewProp ?? localInView;
  const narrow = useIsNarrow();
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion
    ? { x: 0, y: 0 }
    : narrow
      ? MOBILE_DIRECTION_OFFSET[direction]
      : DIRECTION_OFFSET[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: HOME_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  index: number;
  inView: boolean;
  direction?: RevealDirection;
  customOffset?: { x: number; y: number };
  delayStep?: number;
  baseDelay?: number;
  duration?: number;
  onSettled?: () => void;
}

export function StaggerReveal({
  children,
  className,
  index,
  inView,
  direction = "up",
  customOffset,
  delayStep = 0.16,
  baseDelay = 0,
  duration = 1.05,
  onSettled,
}: StaggerRevealProps) {
  const narrow = useIsNarrow();
  const reduceMotion = useReducedMotion();
  const raw =
    customOffset ??
    (narrow ? MOBILE_DIRECTION_OFFSET[direction] : DIRECTION_OFFSET[direction]);
  const offset = reduceMotion
    ? { x: 0, y: 0 }
    : narrow && customOffset
      ? { x: 0, y: Math.min(28, Math.abs(customOffset.y) || 28) }
      : raw;
  const inViewRef = useRef(inView);
  inViewRef.current = inView;

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, x: offset.x, y: offset.y, scale: reduceMotion ? 1 : 0.94 }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : { opacity: 0, x: offset.x, y: offset.y, scale: reduceMotion ? 1 : 0.94 }
      }
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : baseDelay + index * delayStep,
        ease: HOME_EASE,
      }}
      onAnimationComplete={() => {
        if (inViewRef.current) onSettled?.();
      }}
    >
      {children}
    </motion.div>
  );
}
