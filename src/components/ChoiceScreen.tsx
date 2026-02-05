"use client";

import { motion } from "framer-motion";
import { Monitor, Palette, Play, Sparkles } from "lucide-react";
import { springs } from "@/lib/motion";

interface ChoiceScreenProps {
  onChoice: (variant: "yt_chat" | "yT3_chat") => void;
}

/**
 * Premium choice screen with refined aesthetics
 * "Pick your style" - YT (minimal) vs T3 (full-featured)
 */
export function ChoiceScreen({ onChoice }: ChoiceScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Sophisticated gradient background */}
      <div className="absolute inset-0 bg-[#050505]">
        {/* Primary gradient orb - top left */}
        <motion.div
          className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)",
          }}
          animate={{ 
            x: [0, 60, 0], 
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut",
          }}
        />
        
        {/* Secondary gradient orb - bottom right */}
        <motion.div
          className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
          }}
          animate={{ 
            x: [0, -60, 0], 
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut",
          }}
        />

        {/* Subtle center glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 60%)",
          }}
        />

        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-16 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.smooth, delay: 0.1 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springs.snappy, delay: 0.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8"
          >
            <Play className="h-3 w-3 text-red-400 fill-red-400" />
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">
              YouTube Live Chat Viewer
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: 0.15 }}
              className="block"
            >
              Pick your
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: 0.25 }}
              className="block bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 bg-clip-text text-transparent"
            >
              style
            </motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base text-white/30 font-medium max-w-md mx-auto"
          >
            Two ways to experience live chat. Choose what fits you.
          </motion.p>
        </motion.div>

        {/* Choice Cards */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
          {/* YT - Minimal Mode */}
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.smooth, delay: 0.35 }}
            whileHover={{ 
              y: -6,
              transition: { ...springs.snappy }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChoice("yt_chat")}
            className="group relative flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm overflow-hidden text-left transition-colors hover:bg-white/[0.04] hover:border-white/[0.1]"
          >
            {/* Hover glow */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(239,68,68,0.08) 0%, transparent 60%)",
              }}
            />
            
            <div className="relative z-10">
              {/* Icon */}
              <motion.div 
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(239,68,68,0.2)",
                }}
                transition={springs.snappy}
              >
                <Monitor className="h-6 w-6 text-red-400" />
              </motion.div>
              
              {/* Title */}
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                YT
              </h2>
              
              {/* Description */}
              <p className="text-sm text-white/40 leading-relaxed mb-6">
                Clean and minimal. Perfect for OBS overlays and stream displays.
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-[11px] font-bold text-red-400 uppercase tracking-wider">
                  Minimal
                </span>
                <span className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                  OBS Ready
                </span>
              </div>
            </div>
          </motion.button>

          {/* T3 - Full Featured */}
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.smooth, delay: 0.45 }}
            whileHover={{ 
              y: -6,
              transition: { ...springs.snappy }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChoice("yT3_chat")}
            className="group relative flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm overflow-hidden text-left transition-colors hover:bg-white/[0.04] hover:border-white/[0.1]"
          >
            {/* Hover glow */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(236,72,153,0.08) 0%, transparent 60%)",
              }}
            />
            
            <div className="relative z-10">
              {/* Icon */}
              <motion.div 
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-pink-500/10 border border-pink-500/20"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(236,72,153,0.2)",
                }}
                transition={springs.snappy}
              >
                <Palette className="h-6 w-6 text-pink-400" />
              </motion.div>
              
              {/* Title */}
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                T3
              </h2>
              
              {/* Description */}
              <p className="text-sm text-white/40 leading-relaxed mb-6">
                Full customization. Themes, layouts, effects, and complete control.
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 text-[11px] font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Full
                </span>
                <span className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                  Themes
                </span>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col gap-1 text-center"
        >
          <p className="text-[11px] text-white/20 font-medium">
            Switch anytime from settings
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
      </div>
    </div>
  );
}
