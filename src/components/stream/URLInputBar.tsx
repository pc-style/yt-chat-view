"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { springs } from "@/lib/motion";

interface URLInputBarProps {
  url: string;
  onUrlChange: (value: string) => void;
  isConnected: boolean;
  isConnecting: boolean;
  isDemo: boolean;
  onConnect: (e: React.FormEvent) => void;
  onDisconnect: () => void;
}

/**
 * URL input bar with connect/disconnect controls and footer
 */
export function URLInputBar({
  url,
  onUrlChange,
  isConnected,
  isConnecting,
  isDemo,
  onConnect,
  onDisconnect,
}: URLInputBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.smooth, delay: 0.2 }}
      className="relative px-6 py-4 border-t border-white/5 bg-[#0a0a0a]"
    >
      <form onSubmit={onConnect} className="flex gap-3 max-w-2xl mx-auto">
        <div className="flex-1 relative">
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder={
              isDemo
                ? "Demo mode active - paste URL to switch to live"
                : "Paste YouTube Live URL..."
            }
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
              onClick={onDisconnect}
              className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isDemo ? "Stop Demo" : "Disconnect"}
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

      {/* Footer Links */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-[10px] text-white/30 text-center mt-3"
      >
        Questions or bugs?{" "}
        <a
          href="https://x.com/pcstyle53"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white transition-colors"
        >
          @pcstyle53 on X
        </a>
        {" "}&middot;{" "}
        <a
          href="https://github.com/pc-style/yt-chat-view"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white transition-colors"
        >
          GitHub
        </a>
      </motion.p>
    </motion.div>
  );
}
