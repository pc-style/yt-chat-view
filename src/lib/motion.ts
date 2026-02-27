/**
 * Motion Animation Presets
 * Premium, "Liquid Metal" physics configuration
 * Avoids bouncy springs in favor of heavy, cinematic movements
 */

import type { Transition } from "framer-motion";

/**
 * Spring configurations - tuned for heavy, fluid, premium feel
 */
export const springs = {
  /** Critically damped, high-mass - for cards, menus, and structural elements (no bounce) */
  heavyLiquid: {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 1.5,
  },
  /** Snappy but damped - for buttons, toggles, hover states */
  snappy: {
    type: "spring" as const,
    stiffness: 250,
    damping: 25,
    mass: 0.8,
  },
  /** Smooth flowing - for staggered lists, chat messages entering */
  smooth: {
    type: "spring" as const,
    stiffness: 120,
    damping: 22,
    mass: 1,
  },
  /** Ultra precise tween - for pure opacity fades without spatial movement */
  quick: {
    type: "tween" as const,
    duration: 0.15,
    ease: [0.16, 1, 0.3, 1], // Cinematic cubic-bezier
  },
  /** Gentle tween for ambient background effects */
  gentle: {
    type: "tween" as const,
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1],
  },
} satisfies Record<string, Transition>;
