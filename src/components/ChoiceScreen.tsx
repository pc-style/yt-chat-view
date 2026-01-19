"use client";

import { motion } from "framer-motion";
import { MessageSquare, Sparkles, Monitor, Palette, Zap, Layers } from "lucide-react";
import { springs, fadeUpVariants, scaleFadeVariants } from "@/lib/motion";

interface ChoiceScreenProps {
  onChoice: (variant: "yt_chat" | "yT3_chat") => void;
}

/**
 * Floating particle component for background ambiance
 */
function FloatingParticle({ delay, duration, x, y }: { delay: number; duration: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-white/20"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/**
 * Fullscreen animated choice screen
 * Premium visual experience with spring physics
 */
export function ChoiceScreen({ onChoice }: ChoiceScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-red-500/15 blur-[150px]"
          animate={{ 
            x: [0, 80, 0], 
            y: [0, 60, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-pink-500/15 blur-[150px]"
          animate={{ 
            x: [0, -80, 0], 
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
            rotate: [0, -10, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut",
          }}
        />
        {/* Center subtle glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-purple-500/5 blur-[100px]"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
          }}
        />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <FloatingParticle 
            key={i}
            delay={i * 0.3}
            duration={3 + (i % 3)}
            x={`${10 + (i * 8)}%`}
            y={`${20 + ((i * 17) % 60)}%`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-8">
        {/* Title with staggered reveal */}
        <motion.div
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <motion.h1 
            variants={fadeUpVariants}
            transition={{ ...springs.smooth, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: 0.15 }}
            >
              Which side{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: 0.25 }}
              className="bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
            >
              are you on?
            </motion.span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-white/40 font-medium"
          >
            Choose your viewing experience
          </motion.p>
        </motion.div>

        {/* Choice Cards */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* YT_Chat - Streamer Mode */}
          <motion.button
            initial={{ opacity: 0, x: -60, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ ...springs.smooth, delay: 0.3 }}
            whileHover={{ 
              scale: 1.04, 
              y: -8,
              rotateY: 5,
              transition: springs.snappy 
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChoice("yt_chat")}
            className="group relative w-80 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-xl overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Animated border glow */}
            <motion.div 
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(239,68,68,0.3), transparent 50%)",
              }}
            />
            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              }}
            />
            
            <div className="relative z-10">
              <motion.div 
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 border border-red-500/30"
                whileHover={{ 
                  boxShadow: "0 0 30px rgba(239,68,68,0.4)",
                  scale: 1.05,
                }}
                transition={springs.snappy}
              >
                <Monitor className="h-8 w-8 text-red-400" />
              </motion.div>
              
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                yt_chat
              </h2>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Ultra-smooth streamer display. Clean, minimal, designed for OBS overlays.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <motion.span 
                  className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-bold text-red-400 flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap className="h-3 w-3" />
                  Minimal
                </motion.span>
                <motion.span 
                  className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-bold text-white/60"
                  whileHover={{ scale: 1.05 }}
                >
                  Stream-Ready
                </motion.span>
              </div>
            </div>
          </motion.button>

          {/* Divider with pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springs.bouncy, delay: 0.45 }}
            className="hidden md:flex items-center"
          >
            <motion.span 
              className="text-3xl font-black text-white/15"
              animate={{ 
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              or
            </motion.span>
          </motion.div>

          {/* YT3_Chat - Full Featured */}
          <motion.button
            initial={{ opacity: 0, x: 60, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ ...springs.smooth, delay: 0.35 }}
            whileHover={{ 
              scale: 1.04, 
              y: -8,
              rotateY: -5,
              transition: springs.snappy 
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChoice("yT3_chat")}
            className="group relative w-80 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-xl overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Animated border glow */}
            <motion.div 
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(236,72,153,0.3), transparent 50%)",
              }}
            />
            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              }}
            />
            
            <div className="relative z-10">
              <motion.div 
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500/20 border border-pink-500/30"
                whileHover={{ 
                  boxShadow: "0 0 30px rgba(236,72,153,0.4)",
                  scale: 1.05,
                }}
                transition={springs.snappy}
              >
                <Palette className="h-8 w-8 text-pink-400" />
              </motion.div>
              
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                yT3 chat
              </h2>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Full customization suite. Themes, layouts, and all the controls.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <motion.span 
                  className="rounded-full bg-pink-500/10 border border-pink-500/20 px-3 py-1 text-xs font-bold text-pink-400 flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <Layers className="h-3 w-3" />
                  Customizable
                </motion.span>
                <motion.span 
                  className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-bold text-white/60"
                  whileHover={{ scale: 1.05 }}
                >
                  Feature-Rich
                </motion.span>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Footer hint with fade */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-xs text-white/25 font-medium"
        >
          You can switch anytime from settings
        </motion.p>
      </div>
    </div>
  );
}
