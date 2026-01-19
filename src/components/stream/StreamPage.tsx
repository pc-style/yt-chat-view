"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  ArrowDown, 
  Wifi, 
  WifiOff, 
  Trash2, 
  Settings, 
  Play, 
  Youtube, 
  Loader2, 
  Key, 
  RefreshCw,
  LogOut
} from "lucide-react";
import { StreamChatMessage } from "./StreamChatMessage";
import type { ChatMessage as ChatMessageType } from "@/types/youtube";
import { useChat } from "@/lib/hooks/useChat";
import { useCustomization } from "@/lib/hooks/useCustomization";
import { springs, fadeUpVariants, scaleFadeVariants } from "@/lib/motion";

interface StreamPageProps {
  onSwitchUI: () => void;
}

/**
 * Ultra-minimal Streamer Chat Display
 * Designed for OBS overlays and stream displays
 * Enhanced with Motion spring physics
 */
export function StreamPage({ onSwitchUI }: StreamPageProps) {
  const [url, setUrl] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const { 
    apiKey, 
    updateField, 
    fontSize, 
    accentColor, 
    borderRadius,
    maxLoadedMessages
  } = useCustomization();

  const { messages, connectionState, error, streamInfo, connect, disconnect, clearMessages } = useChat({
    maxMessages: maxLoadedMessages,
    apiKey: apiKey,
  });

  const isConnected = connectionState === "connected";
  const isConnecting = connectionState === "connecting";

  // Smooth auto-scroll with slight delay for animation
  useEffect(() => {
    if (isAutoScrollEnabled && scrollRef.current) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth"
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages.length, isAutoScrollEnabled]);

  // Detect manual scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
    setIsAutoScrollEnabled(isNearBottom);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      await connect(url.trim());
    }
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col overflow-hidden relative">
      {/* Subtle animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-[150px]"
          style={{ backgroundColor: `${accentColor}10` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Settings Overlay */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
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
                <h3 className="text-sm font-black uppercase tracking-widest text-white/50">Settings</h3>
                <motion.button 
                  onClick={() => setShowSettings(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.button>
              </div>

              {/* BYOK Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">YouTube API Key (BYOK)</label>
                <div className="relative group">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => updateField("apiKey", e.target.value)}
                    placeholder="Paste API Key..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all"
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-red-500 transition-colors" />
                </div>
                <p className="text-[10px] text-white/20 leading-relaxed italic">
                  Default restricted to @t3dotgg. Add your own key to support any channel.
                </p>
              </div>

              {/* Visuals */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    <span>Font Size</span>
                    <span className="text-white/60">{fontSize}px</span>
                  </div>
                  <input 
                    type="range" min="12" max="24" value={fontSize}
                    onChange={(e) => updateField("fontSize", parseInt(e.target.value))}
                    className="w-full accent-red-500 bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none">Accent Color</label>
                  <div className="flex flex-wrap gap-2">
                    {["#CA0377", "#EF4444", "#9147FF", "#3B82F6", "#10B981"].map(c => (
                      <button 
                        key={c}
                        onClick={() => updateField("accentColor", c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${accentColor === c ? 'border-white scale-110 shadow-lg shadow-white/10' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                <p className="text-[10px] text-white/40 text-center">yt_chat streamer-mode v1.0</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Minimal Header with animations */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.smooth}
        className="relative flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl shrink-0 z-10"
      >
        <div className="flex items-center gap-4">
          {/* Logo with pulse */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={springs.snappy}
          >
            <motion.div 
              className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: accentColor }}
              animate={isConnected ? {
                boxShadow: [
                  `0 0 0px ${accentColor}00`,
                  `0 0 20px ${accentColor}80`,
                  `0 0 0px ${accentColor}00`,
                ],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Youtube className="h-4 w-4 text-white" />
            </motion.div>
            <span className="text-lg font-black text-white tracking-tight">yt_chat</span>
          </motion.div>

          {/* Connection Status with animated transitions */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={connectionState}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={springs.snappy}
              className="flex items-center gap-2 text-sm"
            >
              {isConnected ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Wifi className="h-4 w-4 text-green-400" />
                  </motion.div>
                  <span className="text-green-400 font-medium">Live</span>
                  {streamInfo && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white/40 hidden sm:inline"
                    >
                      {streamInfo.channelTitle}
                    </motion.span>
                  )}
                </>
              ) : isConnecting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-4 w-4 text-white/60" />
                  </motion.div>
                  <span className="text-white/50 font-medium">Connecting...</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-white/30" />
                  <span className="text-white/30 font-medium">Offline</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <motion.span 
            className="text-xs font-mono text-white/20 hidden sm:inline"
            key={messages.length}
            initial={{ scale: 1.2, color: "rgba(255,255,255,0.5)" }}
            animate={{ scale: 1, color: "rgba(255,255,255,0.2)" }}
            transition={{ duration: 0.3 }}
          >
            {messages.length} msgs
          </motion.span>
          <motion.button
            onClick={clearMessages}
            className="p-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Clear Chat"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={springs.snappy}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
            title="Open Settings"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={springs.snappy}
          >
            <Settings className="h-4 w-4" />
          </motion.button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <motion.button
            onClick={onSwitchUI}
            className="p-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
            title="Switch to yT3 chat"
            whileHover={{ scale: 1.1, rotate: -90 }}
            whileTap={{ scale: 0.9 }}
            transition={springs.snappy}
          >
            <LogOut className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto scroll-smooth px-2"
          onScroll={handleScroll}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Messages with layout animations */}
          <LayoutGroup>
            <div className="py-4 space-y-1">
              <AnimatePresence mode="popLayout" initial={false}>
                {messages.map((msg, idx) => (
                  <StreamChatMessage 
                    key={msg.id} 
                    message={msg} 
                    index={idx}
                  />
                ))}
              </AnimatePresence>
            </div>
          </LayoutGroup>

          {/* Empty State with enhanced animation */}
          <AnimatePresence>
            {messages.length === 0 && !isConnected && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={springs.gentle}
                className="flex flex-col items-center justify-center h-full text-center py-20"
              >
                <motion.div
                  className="mb-6 h-24 w-24 rounded-3xl bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/20 flex items-center justify-center relative overflow-hidden"
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(239,68,68,0)",
                      "0 0 40px rgba(239,68,68,0.2)",
                      "0 0 0px rgba(239,68,68,0)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <Youtube className="h-12 w-12 text-red-400/60 relative z-10" />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-white/80 mb-2"
                >
                  Ready to stream
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-white/40 max-w-xs"
                >
                  Paste a YouTube Live URL below to start displaying chat
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {!isAutoScrollEnabled && messages.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.8 }}
              transition={springs.bouncy}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
              }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-red-500/30 hover:bg-red-600 transition-colors"
            >
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowDown className="h-4 w-4" />
              </motion.div>
              New messages
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* URL Input Bar with animations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.smooth, delay: 0.2 }}
        className="relative px-6 py-4 border-t border-white/5 bg-[#0a0a0a]"
      >
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube Live URL..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 focus:scale-[1.01] transition-all"
            />
          </div>
          <AnimatePresence mode="wait">
            {isConnected ? (
              <motion.button
                key="disconnect"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={springs.snappy}
                type="button"
                onClick={disconnect}
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Disconnect
              </motion.button>
            ) : (
              <motion.button
                key="connect"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={springs.snappy}
                type="submit"
                disabled={isConnecting || !url.trim()}
                className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isConnecting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
                {isConnecting ? "..." : "Connect"}
              </motion.button>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}
