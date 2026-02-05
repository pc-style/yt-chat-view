"use client";

import { motion } from "framer-motion";
import { Pause, Play, FastForward, RotateCcw } from "lucide-react";
import type { PlaybackSpeed } from "@/lib/hooks/useDemoChat";
import { springs } from "@/lib/motion";

interface DemoControlsProps {
  speed: PlaybackSpeed;
  setSpeed: (speed: PlaybackSpeed) => void;
  isPaused: boolean;
  pause: () => void;
  resume: () => void;
  progress: number;
  loopCount: number;
  accentColor: string;
  /** Compact mode for smaller spaces */
  compact?: boolean;
}

const SPEED_OPTIONS: PlaybackSpeed[] = [1, 2, 5];

/**
 * Demo playback controls with speed selection, play/pause, and progress indicator
 */
export function DemoControls({
  speed,
  setSpeed,
  isPaused,
  pause,
  resume,
  progress,
  loopCount,
  accentColor,
  compact = false,
}: DemoControlsProps) {
  const progressPercent = Math.round(progress * 100);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Play/Pause */}
        <motion.button
          onClick={isPaused ? resume : pause}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={springs.snappy}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          aria-label={isPaused ? "Resume demo" : "Pause demo"}
        >
          {isPaused ? (
            <Play className="h-3.5 w-3.5 text-white/60 fill-current" />
          ) : (
            <Pause className="h-3.5 w-3.5 text-white/60" />
          )}
        </motion.button>

        {/* Speed indicator */}
        <button
          onClick={() => {
            const currentIndex = SPEED_OPTIONS.indexOf(speed);
            const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
            setSpeed(SPEED_OPTIONS[nextIndex]);
          }}
          className="text-[10px] font-bold text-white/40 hover:text-white/60 transition-colors min-w-[28px]"
          aria-label={`Change speed (current: ${speed}x)`}
        >
          {speed}x
        </button>

        {/* Mini progress bar */}
        <div className="relative w-12 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ 
              backgroundColor: accentColor,
              width: `${progressPercent}%`,
            }}
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Loop indicator */}
        {loopCount > 1 && (
          <span className="flex items-center gap-0.5 text-[10px] text-white/30">
            <RotateCcw className="h-2.5 w-2.5" />
            {loopCount}
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
          Demo Controls
        </span>
        {loopCount > 1 && (
          <motion.span 
            key={loopCount}
            initial={{ scale: 1.2, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 text-[10px] text-white/40"
          >
            <RotateCcw className="h-3 w-3" />
            Loop {loopCount}
          </motion.span>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: accentColor }}
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.1 }}
          />
          {/* Animated shimmer on progress */}
          <motion.div
            className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ 
              x: ["-32px", "100%"],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear",
              repeatDelay: 1,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/30">
          <span>{progressPercent}%</span>
          <span>{isPaused ? "Paused" : "Playing"}</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* Play/Pause button */}
        <motion.button
          onClick={isPaused ? resume : pause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={springs.snappy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: isPaused ? `${accentColor}20` : "rgba(255,255,255,0.05)",
            border: `1px solid ${isPaused ? `${accentColor}40` : "rgba(255,255,255,0.1)"}`,
          }}
          aria-label={isPaused ? "Resume demo playback" : "Pause demo playback"}
        >
          {isPaused ? (
            <>
              <Play className="h-4 w-4 fill-current" style={{ color: accentColor }} />
              <span className="text-sm font-medium" style={{ color: accentColor }}>Resume</span>
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 text-white/60" />
              <span className="text-sm font-medium text-white/60">Pause</span>
            </>
          )}
        </motion.button>

        {/* Speed selector */}
        <div className="flex items-center gap-1">
          <FastForward className="h-3.5 w-3.5 text-white/30 mr-1" />
          {SPEED_OPTIONS.map((s) => (
            <motion.button
              key={s}
              onClick={() => setSpeed(s)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={springs.snappy}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                backgroundColor: speed === s ? `${accentColor}25` : "transparent",
                border: `1px solid ${speed === s ? `${accentColor}50` : "rgba(255,255,255,0.1)"}`,
                color: speed === s ? accentColor : "rgba(255,255,255,0.4)",
              }}
              aria-label={`Set playback speed to ${s}x`}
              aria-pressed={speed === s}
            >
              {s}x
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
