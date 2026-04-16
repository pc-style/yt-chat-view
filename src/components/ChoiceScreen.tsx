"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Monitor, Palette, Play, Sparkles } from "lucide-react";
import { springs } from "@/lib/motion";

interface ChoiceScreenProps {
  onChoice: (variant: "yt_chat" | "yT3_chat") => void;
  onDismiss: () => void;
}

const TITLE_WORDS = ["Choose", "your"];
const TITLE_ACCENT = "view";

const springTransition = { type: "spring" as const, stiffness: 250, damping: 24 };

/**
 * Premium choice screen with orchestrated entry, 3D tilt cards, and cinematic exit
 */
export function ChoiceScreen({ onChoice, onDismiss }: ChoiceScreenProps) {
  const [exiting, setExiting] = useState<"yt_chat" | "yT3_chat" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cursor spotlight
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const smoothX = useSpring(cursorX, { stiffness: 80, damping: 30 });
  const smoothY = useSpring(cursorY, { stiffness: 80, damping: 30 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [cursorX, cursorY]);

  const handleChoice = useCallback(
    (variant: "yt_chat" | "yT3_chat") => {
      setExiting(variant);
      setTimeout(() => onChoice(variant), 700);
    },
    [onChoice],
  );

  return (
    <AnimatePresence>
      {!exiting || true ? (
        <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          {/* ── Background Layer ── */}
          <motion.div
            className="absolute inset-0 bg-[#050505]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Cursor spotlight - follows mouse */}
            <motion.div
              className="pointer-events-none absolute h-[600px] w-[600px] rounded-full"
              style={{
                x: smoothX,
                y: smoothY,
                translateX: "-50%",
                translateY: "-50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 30%, transparent 60%)",
              }}
            />

            {/* Intro light sweep - plays once */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div
                className="absolute top-0 h-full w-[200px]"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), rgba(255,255,255,0.02), transparent)",
                }}
                initial={{ x: "-200px" }}
                animate={{ x: "calc(100vw + 200px)" }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </motion.div>
            {/* Primary gradient orb */}
            <motion.div
              className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(220,38,38,0.10) 0%, rgba(220,38,38,0.04) 40%, transparent 70%)",
              }}
              animate={{
                x: [0, 80, 20, 0],
                y: [0, 50, -20, 0],
                scale: [1, 1.12, 0.95, 1],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Secondary gradient orb */}
            <motion.div
              className="absolute -bottom-40 -right-40 h-[700px] w-[700px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(236,72,153,0.08) 0%, rgba(236,72,153,0.03) 40%, transparent 70%)",
              }}
              animate={{
                x: [0, -70, -10, 0],
                y: [0, -60, 10, 0],
                scale: [1, 1.15, 0.98, 1],
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Tertiary orb - center-right, very subtle */}
            <motion.div
              className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 60%)",
              }}
              animate={{
                x: [0, -40, 20, 0],
                y: [0, 30, -30, 0],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Animated grid/mesh pattern */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.025 }}
              transition={{ duration: 1.5, delay: 0.1 }}
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: "60px 60px",
                }}
                animate={{
                  backgroundPosition: ["0px 0px", "30px 30px"],
                }}
                transition={{
                  duration: 120,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>

            {/* Noise texture */}
            <div
              className="absolute inset-0 opacity-[0.012]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Center glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 60%)",
              }}
            />
          </motion.div>

          {/* ── Content ── */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-14 px-6 max-w-4xl mx-auto"
            animate={exiting ? { opacity: 0, scale: 0.97 } : {}}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]"
            >
              <Play className="h-3 w-3 text-red-400 fill-red-400" />
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">
                YouTube Live Chat Viewer
              </span>
            </motion.div>

            {/* Title */}
            <div className="text-center -mt-4">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4">
                {TITLE_WORDS.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...springTransition,
                      delay: 0.3 + i * 0.08,
                    }}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...springTransition,
                    delay: 0.3 + TITLE_WORDS.length * 0.08,
                  }}
                  className="block bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 bg-clip-text text-transparent"
                >
                  {TITLE_ACCENT}
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-base text-white/30 font-medium max-w-md mx-auto"
              >
                Overlay for OBS, or dashboard for full control. Switch anytime.
              </motion.p>
            </div>

            {/* Cards */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
              <TiltCard
                variant="yt_chat"
                delay={0.7}
                exiting={exiting}
                onClick={handleChoice}
                accentColor="red"
                icon={<Monitor className="h-6 w-6 text-red-400" />}
                title="YT"
                subtitle="Minimal Overlay"
                description="Transparent, lightweight chat overlay. Built for OBS and stream scenes."
                tags={[
                  { label: "Minimal", accent: true },
                  { label: "OBS Ready" },
                ]}
              />
              <TiltCard
                variant="yT3_chat"
                delay={0.85}
                exiting={exiting}
                onClick={handleChoice}
                accentColor="pink"
                icon={<Palette className="h-6 w-6 text-pink-400" />}
                title="T3"
                subtitle="Full Dashboard"
                description="Themes, layouts, effects, and complete chat customization."
                tags={[
                  {
                    label: "Full",
                    accent: true,
                    icon: <Sparkles className="h-3 w-3" />,
                  },
                  { label: "Themes" },
                ]}
                recommended
              />
            </div>

            {/* Dismiss */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.5 }}
              onClick={onDismiss}
              className="text-xs text-white/25 hover:text-white/60 transition-all cursor-pointer"
            >
              Don&apos;t show this again
            </motion.button>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-col gap-1 text-center -mt-6"
            >
              <p className="text-[11px] text-white/20 font-medium">
                Switch modes anytime from the top bar
              </p>
              <p className="text-[10px] text-white/15">
                Questions or bugs?{" "}
                <a
                  href="https://x.com/pcstyle53"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  @pcstyle53 on X
                </a>
                {" "}&middot;{" "}
                <a
                  href="https://github.com/pc-style/yt-chat-view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  GitHub
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

/* ─── Tilt Card ─── */

interface CardTag {
  label: string;
  accent?: boolean;
  icon?: React.ReactNode;
}

interface TiltCardProps {
  variant: "yt_chat" | "yT3_chat";
  delay: number;
  exiting: "yt_chat" | "yT3_chat" | null;
  onClick: (variant: "yt_chat" | "yT3_chat") => void;
  accentColor: "red" | "pink";
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  tags: CardTag[];
  recommended?: boolean;
}

function TiltCard({
  variant,
  delay,
  exiting,
  onClick,
  accentColor,
  icon,
  title,
  subtitle,
  description,
  tags,
  recommended,
}: TiltCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const isRed = accentColor === "red";
  const isSelected = exiting === variant;
  const isOther = exiting !== null && !isSelected;

  const glowColor = isRed
    ? "rgba(239,68,68,0.10)"
    : "rgba(236,72,153,0.10)";
  const glowColorStrong = isRed
    ? "rgba(239,68,68,0.25)"
    : "rgba(236,72,153,0.25)";
  const borderGradient = isRed
    ? "linear-gradient(135deg, rgba(239,68,68,0.3), rgba(239,68,68,0.05), rgba(239,68,68,0.15))"
    : "linear-gradient(135deg, rgba(236,72,153,0.3), rgba(236,72,153,0.05), rgba(236,72,153,0.15))";

  return (
    <motion.button
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateZ: variant === "yt_chat" ? -1.5 : 1.5 }}
      animate={
        isSelected
          ? { opacity: 1, scale: 1.04, y: 0, rotateZ: 0 }
          : isOther
            ? { opacity: 0, y: 10, scale: 0.96, rotateZ: 0 }
            : { opacity: 1, y: 0, rotateZ: 0 }
      }
      transition={
        isSelected
          ? { duration: 0.3, ease: "easeOut" }
          : isOther
            ? { duration: 0.25, ease: "easeIn" }
            : { ...springTransition, delay }
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (!exiting) onClick(variant);
      }}
      className="group relative flex-1 text-left"
      style={{ perspective: 800 }}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Animated gradient border */}
        <motion.div
          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: borderGradient }}
        />

        {/* Card surface */}
        <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.025] p-8 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white/[0.045] group-hover:border-white/[0.12]">
          {/* Hover inner glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${glowColor} 0%, transparent 60%)`,
            }}
          />

          {/* Selected glow */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${glowColorStrong} 0%, transparent 70%)`,
                }}
              />
            )}
          </AnimatePresence>

          <div className="relative z-10">
            {/* Recommended badge */}
            {recommended && (
              <div className="absolute -top-2 -right-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/25 text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                  <Sparkles className="h-2.5 w-2.5" />
                  Recommended
                </span>
              </div>
            )}

            {/* Icon */}
            <motion.div
              className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl border transition-shadow duration-300 ${
                isRed
                  ? "bg-red-500/10 border-red-500/20 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]"
                  : "bg-pink-500/10 border-pink-500/20 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]"
              }`}
              whileHover={{ scale: 1.05, y: -3 }}
              transition={springs.snappy}
            >
              {icon}
            </motion.div>

            {/* Title & subtitle */}
            <h2 className="text-3xl font-black text-white tracking-tight">
              {title}
            </h2>
            <p
              className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                isRed ? "text-red-400/60" : "text-pink-400/60"
              }`}
            >
              {subtitle}
            </p>

            {/* Description */}
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.label}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    tag.accent
                      ? isRed
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "bg-pink-500/10 border border-pink-500/20 text-pink-400"
                      : "bg-white/[0.04] border border-white/[0.08] text-white/40"
                  }`}
                >
                  {tag.icon}
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}
