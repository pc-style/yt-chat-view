/**
 * Motion Animation Presets
 * Centralized animation configuration using motion.dev best practices
 * See: https://motion.dev/docs/react
 */

import type { Transition, Variants } from "framer-motion";

/**
 * Spring configurations for different use cases
 */
export const springs = {
  /**
   * Snappy spring for UI interactions (buttons, toggles)
   * Fast response with subtle bounce
   */
  snappy: {
    type: "spring" as const,
    stiffness: 500,
    damping: 30,
    mass: 1,
  },
  /**
   * Smooth spring for content transitions
   * Elegant, flowing motion
   */
  smooth: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
  },
  /**
   * Bouncy spring for playful elements
   * Noticeable overshoot
   */
  bouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 15,
    mass: 1,
  },
  /**
   * Gentle spring for large content blocks
   * Slow and smooth
   */
  gentle: {
    type: "spring" as const,
    stiffness: 150,
    damping: 25,
    mass: 1,
  },
  /**
   * Wobbly spring for attention-grabbing animations
   */
  wobbly: {
    type: "spring" as const,
    stiffness: 200,
    damping: 10,
    mass: 1,
  },
} satisfies Record<string, Transition>;

/**
 * Stagger configuration for list animations
 */
export const staggerConfig = {
  fast: 0.03,
  normal: 0.05,
  slow: 0.08,
  verySlow: 0.12,
};

/**
 * Chat message animation variants
 * Slide in from left with blur effect
 */
export const chatMessageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -30,
    filter: "blur(8px)",
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: 30,
    filter: "blur(4px)",
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Container variants for staggered children
 */
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerConfig.fast,
    },
  },
  exit: {
    transition: {
      staggerChildren: staggerConfig.fast,
      staggerDirection: -1,
    },
  },
};

/**
 * Fade up animation for content blocks
 */
export const fadeUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};

/**
 * Scale fade for modals and overlays
 */
export const scaleFadeVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(5px)",
  },
};

/**
 * Slide variants for drawers/sidebars
 */
export const slideVariants = {
  left: {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  right: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  up: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  down: {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
} satisfies Record<string, Variants>;

/**
 * Glow pulse animation for icons/indicators
 */
export const glowPulseVariants: Variants = {
  initial: {
    boxShadow: "0 0 0px currentColor",
  },
  animate: {
    boxShadow: [
      "0 0 10px currentColor",
      "0 0 30px currentColor",
      "0 0 10px currentColor",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Button hover/tap animation preset
 */
export const buttonInteraction = {
  whileHover: {
    scale: 1.02,
    transition: springs.snappy,
  },
  whileTap: {
    scale: 0.98,
    transition: springs.snappy,
  },
};

/**
 * Card hover animation preset
 */
export const cardInteraction = {
  whileHover: {
    scale: 1.01,
    y: -2,
    transition: springs.smooth,
  },
  whileTap: {
    scale: 0.99,
    transition: springs.snappy,
  },
};

/**
 * Create a spring transition with custom parameters
 */
export function createSpring(
  stiffness = 300,
  damping = 25,
  mass = 1,
): Transition {
  return {
    type: "spring",
    stiffness,
    damping,
    mass,
  };
}

/**
 * Create staggered delay based on index
 */
export function getStaggerDelay(
  index: number,
  staggerAmount = staggerConfig.fast,
  maxDelay = 0.5,
): number {
  return Math.min(index * staggerAmount, maxDelay);
}
