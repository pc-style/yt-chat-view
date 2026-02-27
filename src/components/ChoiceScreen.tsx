"use client";

import { LazyMotion, m } from "framer-motion";
import { domAnimation } from "framer-motion";
import { Monitor, Palette, Play, Sparkles, Wand2 } from "lucide-react";
import { springs } from "@/lib/motion";
import { useState } from "react";

interface ChoiceScreenProps {
  onChoice: (variant: "yt_chat" | "yT3_chat") => void;
}

/**
 * Premium choice screen with refined aesthetics
 * "Pick your style" - YT (minimal) vs T3 (full-featured)
 */
export function ChoiceScreen({ onChoice }: ChoiceScreenProps) {
  const [bgMode, setBgMode] = useState<"orbs" | "mesh">("mesh");

  return (
    <LazyMotion features={domAnimation}>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
        {/* Sophisticated gradient background */}
        <div className="absolute inset-0 bg-[#050505] transition-colors duration-1000">
          
          {/* ---- OPTION 1: FLUID MESH GRADIENT (Premium) ---- */}
          {bgMode === "mesh" && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 overflow-hidden mix-blend-screen"
            >
              <m.div
                className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px]"
                style={{
                  background: "radial-gradient(circle at center, rgba(168,85,247,0.15) 0%, transparent 60%)",
                }}
                animate={{
                  x: [0, 50, -30, 0],
                  y: [0, -50, 40, 0],
                  scale: [1, 1.2, 0.9, 1],
                  rotate: [0, 90, 180, 360],
                  borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "50% 50% 40% 60%", "40% 60% 70% 30%"],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
              <m.div
                className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px]"
                style={{
                  background: "radial-gradient(circle at center, rgba(236,72,153,0.15) 0%, transparent 60%)",
                }}
                animate={{
                  x: [0, -40, 20, 0],
                  y: [0, 60, -30, 0],
                  scale: [1, 1.1, 1.3, 1],
                  rotate: [360, 180, 90, 0],
                  borderRadius: ["60% 40% 30% 70%", "40% 60% 70% 30%", "50% 50% 60% 40%", "60% 40% 30% 70%"],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <m.div
                className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px]"
                style={{
                  background: "radial-gradient(circle at center, rgba(6,182,212,0.1) 0%, transparent 60%)",
                }}
                animate={{
                  x: [0, 30, -40, 0],
                  y: [0, 40, 20, 0],
                  scale: [1, 0.8, 1.1, 1],
                  rotate: [0, -90, -180, -360],
                  borderRadius: ["50% 50% 40% 60%", "30% 70% 60% 40%", "60% 40% 50% 50%", "50% 50% 40% 60%"],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
            </m.div>
          )}

          {/* ---- OPTION 2: SIMPLE ORBS (Original) ---- */}
          {bgMode === "orbs" && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <m.div
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
              <m.div
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
            </m.div>
          )}

        {/* Subtle center glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 60%)",
          }}
        />

        {/* Global Noise texture overlay is applied in globals.css now, but we can add a stronger local one if needed */}
        <div 
          className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 md:gap-16 px-6 w-full max-w-4xl mx-auto">
        
        {/* Vibe Toggle (Dev Tool / Easter Egg) */}
        <m.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.heavyLiquid, delay: 0.8 }}
          onClick={() => setBgMode(m => m === "mesh" ? "orbs" : "mesh")}
          className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-2 px-3 py-1.5 rounded-btn bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-colors text-white/40 hover:text-white/80"
          title="Toggle Background Style"
        >
          <Wand2 className="h-3.5 w-3.5" />
          <span className="text-[10px] font-mono tracking-wider uppercase">
            {bgMode === "mesh" ? "Fluid Mesh" : "Classic Orbs"}
          </span>
        </m.button>

        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.heavyLiquid, delay: 0.1 }}
          className="text-center"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springs.snappy, delay: 0.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-white/[0.03] border border-white/[0.06] mb-8"
          >
            <Play className="h-3 w-3 text-red-400 fill-red-400" />
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
              YouTube Live Chat Viewer
            </span>
          </m.div>
          
          <h1 
            className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <m.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.heavyLiquid, delay: 0.15 }}
              className="block"
            >
              Pick your
            </m.span>
            <m.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.heavyLiquid, delay: 0.25 }}
              className="block bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 bg-clip-text text-transparent drop-shadow-2xl"
            >
              style
            </m.span>
          </h1>
          
          <m.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base text-white/30 font-medium max-w-md mx-auto"
          >
            Two ways to experience live chat. Choose what fits you.
          </m.p>
        </m.div>

        {/* Choice Cards */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
          {/* YT - Minimal Mode */}
          <m.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.heavyLiquid, delay: 0.35 }}
            whileHover={{ 
              y: -4,
              boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)",
              transition: { ...springs.snappy }
            }}
            whileTap={{ scale: 0.98, y: 0 }}
            onClick={() => onChoice("yt_chat")}
            className="card-base group relative flex-1 p-8 text-left transition-all hover:bg-white/[0.04] hover:border-white/[0.1] overflow-hidden"
          >
            {/* Hover glow */}
            <m.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(239,68,68,0.05) 0%, transparent 60%)",
              }}
            />
            
            <div className="relative z-10">
              {/* Icon */}
              <m.div 
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(239,68,68,0.2)",
                }}
                transition={springs.snappy}
              >
                <Monitor className="h-6 w-6 text-red-400" />
              </m.div>
              
              {/* Title */}
              <h2 
                className="text-3xl font-black text-white mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                YT
              </h2>
              
              {/* Description */}
              <p className="text-sm text-white/40 leading-relaxed mb-6">
                Clean and minimal. Perfect for OBS overlays and stream displays.
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-btn bg-red-500/10 border border-red-500/20 px-3 py-1 text-[11px] font-mono text-red-400 uppercase tracking-wider">
                  Minimal
                </span>
                <span className="rounded-btn bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-[11px] font-mono text-white/40 uppercase tracking-wider">
                  OBS Ready
                </span>
              </div>
            </div>
          </m.button>

          {/* T3 - Full Featured */}
          <m.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.heavyLiquid, delay: 0.45 }}
            whileHover={{ 
              y: -4,
              boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)",
              transition: { ...springs.snappy }
            }}
            whileTap={{ scale: 0.98, y: 0 }}
            onClick={() => onChoice("yT3_chat")}
            className="card-base group relative flex-1 p-8 text-left transition-all hover:bg-white/[0.04] hover:border-white/[0.1] overflow-hidden"
          >
            {/* Hover glow */}
            <m.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(236,72,153,0.05) 0%, transparent 60%)",
              }}
            />
            
            <div className="relative z-10">
              {/* Icon */}
              <m.div 
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-pink-500/10 border border-pink-500/20"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(236,72,153,0.2)",
                }}
                transition={springs.snappy}
              >
                <Palette className="h-6 w-6 text-pink-400" />
              </m.div>
              
              {/* Title */}
              <h2 
                className="text-3xl font-black text-white mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                T3
              </h2>
              
              {/* Description */}
              <p className="text-sm text-white/40 leading-relaxed mb-6">
                Full customization. Themes, layouts, effects, and complete control.
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-btn bg-pink-500/10 border border-pink-500/20 px-3 py-1 text-[11px] font-mono text-pink-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Full
                </span>
                <span className="rounded-btn bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-[11px] font-mono text-white/40 uppercase tracking-wider">
                  Themes
                </span>
              </div>
            </div>
          </m.button>
        </div>

        {/* Footer */}
        <m.div
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
        </m.div>
      </div>
      </div>
    </LazyMotion>
  );
}
