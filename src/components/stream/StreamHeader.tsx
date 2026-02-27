"use client";

import { motion } from "framer-motion";
import {
  Wifi,
  WifiOff,
  Trash2,
  Settings,
  LogOut,
} from "lucide-react";
import { Youtube } from "lucide-react";
import { springs } from "@/lib/motion";

interface StreamHeaderProps {
  isConnected: boolean;
  isConnecting: boolean;
  accentColor: string;
  messageCount: number;
  onClearMessages: () => void;
  onOpenSettings: () => void;
  onSwitchUI: () => void;
}

/**
 * Header component with connection status, message count, and action buttons
 */
export function StreamHeader({
  isConnected,
  isConnecting,
  accentColor,
  messageCount,
  onClearMessages,
  onOpenSettings,
  onSwitchUI,
}: StreamHeaderProps) {
  return (
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
            className="h-8 w-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              backgroundColor: accentColor,
              boxShadow: isConnected ? `0 0 16px ${accentColor}60` : "none",
            }}
          >
            <Youtube className="h-4 w-4 text-white" />
          </motion.div>
          <span className="text-lg font-black text-white tracking-tight">
            yt_chat
          </span>
        </motion.div>
      </div>

      {/* Status and Actions */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
          style={{
            borderColor: isConnected ? `${accentColor}40` : "rgba(255,255,255,0.1)",
            backgroundColor: isConnected ? `${accentColor}10` : "rgba(255,255,255,0.02)",
          }}
        >
          {isConnected ? (
            <Wifi className="h-3.5 w-3.5" style={{ color: accentColor }} />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-white/30" />
          )}
          <span
            className="text-xs font-mono"
            style={{
              color: isConnected ? accentColor : "rgba(255,255,255,0.3)",
            }}
          >
            {isConnecting ? "connecting..." : isConnected ? "live" : "offline"}
          </span>
        </div>

        <motion.span
          className="text-xs font-mono text-white/20 hidden sm:inline"
          key={messageCount}
          initial={{ scale: 1.2, color: "rgba(255,255,255,0.5)" }}
          animate={{ scale: 1, color: "rgba(255,255,255,0.2)" }}
          transition={{ duration: 0.3 }}
        >
          {messageCount} msgs
        </motion.span>
        <motion.button
          onClick={onClearMessages}
          className="p-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Clear Chat"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={springs.snappy}
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
        <motion.button
          onClick={onOpenSettings}
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
  );
}
