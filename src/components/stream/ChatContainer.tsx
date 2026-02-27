"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowDown, Youtube, Zap } from "lucide-react";
import { StreamChatMessage } from "./StreamChatMessage";
import { springs } from "@/lib/motion";
import type { ChatMessage } from "@/types/youtube";

interface ChatContainerProps {
  messages: ChatMessage[];
  isConnected: boolean;
  accentColor: string;
  onStartDemo: () => void;
}

/**
 * Chat container with auto-scroll, empty state, and scroll-to-bottom button
 */
export function ChatContainer({
  messages,
  isConnected,
  accentColor,
  onStartDemo,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  // Smooth auto-scroll with slight delay for animation
  useEffect(() => {
    if (isAutoScrollEnabled && scrollRef.current) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
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

  return (
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
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Messages with layout animations */}
        <LayoutGroup>
          <div className="py-4 space-y-0">
            <AnimatePresence mode="popLayout" initial={false}>
              {messages.map((msg) => (
                <StreamChatMessage key={msg.id} message={msg} />
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
              <motion.div className="mb-6 h-24 w-24 rounded-3xl bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/20 flex items-center justify-center">
                <Youtube className="h-12 w-12 text-red-400/60" />
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
                className="text-sm text-white/40 max-w-xs mb-6"
              >
                Paste a YouTube Live URL below to start displaying chat
              </motion.p>

              {/* Demo Button */}
              <motion.button
                onClick={onStartDemo}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
                  border: `1px solid ${accentColor}50`,
                  color: accentColor,
                }}
              >
                <Zap className="h-4 w-4" />
                Try Demo Mode
              </motion.button>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[10px] text-white/30 mt-3"
              >
                No API quota used
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
            transition={springs.snappy}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
              });
            }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-red-500/30 hover:bg-red-600 transition-colors"
          >
            <ArrowDown className="h-4 w-4" />
            New messages
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
