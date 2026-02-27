"use client";

import { motion } from "framer-motion";
import { RefreshCw, Key } from "lucide-react";
import { springs } from "@/lib/motion";
import { DemoControls } from "@/components/DemoControls";
import type { PlaybackSpeed } from "@/lib/hooks/useDemoChat";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  fontSize: number;
  onFontSizeChange: (value: number) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  isDemo: boolean;
  demoControls: {
    speed: PlaybackSpeed;
    setSpeed: (speed: PlaybackSpeed) => void;
    isPaused: boolean;
    pause: () => void;
    resume: () => void;
    progress: number;
    loopCount: number;
  } | null;
}

/**
 * Settings panel component for BYOK, customization, and demo controls
 */
export function SettingsPanel({
  isOpen,
  onClose,
  apiKey,
  onApiKeyChange,
  fontSize,
  onFontSizeChange,
  accentColor,
  onAccentColorChange,
  isDemo,
  demoControls,
}: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={springs.smooth}
        className="absolute top-0 right-0 h-full w-80 bg-[#111] border-l border-white/10 z-50 p-6 flex flex-col gap-8 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/50">
            Settings
          </h3>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </motion.button>
        </div>

        {/* BYOK Section */}
        <div className="space-y-3">
          <label
            htmlFor="api-key-input"
            className="text-[10px] font-bold text-white/30 uppercase tracking-widest"
          >
            YouTube API Key (BYOK)
          </label>
          <div className="relative group">
            <input
              id="api-key-input"
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="Paste API Key..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all"
            />
            <Key className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-red-500 transition-colors" />
          </div>
          <p className="text-[10px] text-white/20 leading-relaxed italic">
            Default restricted to @t3dotgg. Add your own key to support any
            channel.
          </p>
        </div>

        {/* Visuals */}
        <div className="space-y-6">
          {/* Demo Controls - only shown when in demo mode */}
          {isDemo && demoControls && (
            <DemoControls {...demoControls} accentColor={accentColor} />
          )}

          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <span>Font Size</span>
              <span className="text-white/60">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
              className="w-full accent-red-500 bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="accent-color-select"
              className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none block"
            >
              Accent Color
            </label>
            <div className="flex flex-wrap gap-2">
              {["#CA0377", "#EF4444", "#9147FF", "#3B82F6", "#10B981"].map(
                (c) => (
                  <button
                    key={c}
                    id={c === accentColor ? "accent-color-select" : undefined}
                    onClick={() => onAccentColorChange(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      accentColor === c
                        ? "border-white scale-110 shadow-lg shadow-white/10"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Select accent color ${c}`}
                    aria-pressed={accentColor === c}
                  />
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
          <p className="text-[10px] text-white/40 text-center">
            yt_chat streamer-mode v1.0
          </p>
        </div>
      </motion.div>
    </>
  );
}
