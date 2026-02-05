"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ChatMessage as ChatMessageType } from "@/types/youtube";
import { springs, getStaggerDelay } from "@/lib/motion";
import { useCustomization } from "@/lib/hooks/useCustomization";

interface StreamChatMessageProps {
  message: ChatMessageType;
  index: number;
}

/**
 * Get username color - YouTube style with vibrant palette
 */
function getUsernameColor(channelId: string, badges: ChatMessageType["badges"]): string {
  if (badges.includes("owner")) return "#FFD700";
  if (badges.includes("moderator")) return "#5E84F1";
  if (badges.includes("member")) return "#2BA640";

  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", 
    "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
    "#BB8FCE", "#85C1E9", "#F8B500", "#FF8C94"
  ];

  let hash = 0;
  for (let i = 0; i < channelId.length; i++) {
    hash = channelId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Premium Stream Chat Message
 * Ultra-smooth animations with spring physics
 */
export function StreamChatMessage({ message, index }: StreamChatMessageProps) {
  const [imgError, setImgError] = useState(false);
  const usernameColor = getUsernameColor(message.authorChannelId, message.badges);
  const isOwner = message.badges.includes("owner");
  const isMod = message.badges.includes("moderator");
  const isMember = message.badges.includes("member");
  const isSpecial = isOwner || isMod || isMember;
  const isSuperChat = message.isSuperChat;
  
  const { fontSize, borderRadius } = useCustomization();

  const messageStyle: React.CSSProperties = {
    fontFamily: 'var(--font-family)',
    fontSize: `${fontSize}px`,
  };

  const radiusMap: Record<string, string> = {
    none: '0px',
    small: '8px',
    medium: '12px',
    large: '20px',
    full: '9999px',
  };
  const itemRadius = radiusMap[borderRadius] || '12px';

  return (
    <motion.article
      layout
      initial={{ 
        opacity: 0, 
        x: -40, 
        scale: 0.9,
        filter: "blur(10px)" 
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1,
        filter: "blur(0px)" 
      }}
      exit={{ 
        opacity: 0, 
        x: 40, 
        scale: 0.95,
        filter: "blur(5px)",
        transition: { duration: 0.2 }
      }}
      transition={{ 
        ...springs.smooth,
        delay: getStaggerDelay(index, 0.02, 0.3),
      }}
      whileHover={{ 
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        transition: { duration: 0.15 }
      }}
      className={`group flex items-start gap-3 px-4 py-2.5 ${
        isSuperChat 
          ? "bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent" 
          : ""
      }`}
      style={{
        borderLeft: isSuperChat ? `3px solid ${message.superChatColor}` : undefined,
        borderRadius: itemRadius,
      }}
    >
      {/* Avatar with animated ring for special users */}
      <motion.div 
        className={`relative shrink-0 ${isSpecial ? "p-0.5" : ""}`}
        whileHover={{ scale: 1.1 }}
        transition={springs.snappy}
      >
        {isSpecial && (
          <motion.div 
            className="absolute inset-0 rounded-full"
            style={{ 
              background: `linear-gradient(135deg, ${usernameColor}, ${usernameColor}99)`,
            }}
            animate={{
              boxShadow: [
                `0 0 0px ${usernameColor}00`,
                `0 0 12px ${usernameColor}60`,
                `0 0 0px ${usernameColor}00`,
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        <div 
          className={`relative h-8 w-8 overflow-hidden rounded-full flex items-center justify-center ${isSpecial ? "border-2 border-[#0f0f0f]" : ""}`}
          style={{ backgroundColor: imgError ? usernameColor : 'rgba(255,255,255,0.05)' }}
        >
          {imgError ? (
            <span className="text-white font-black text-xs uppercase">
              {message.authorName.charAt(0)}
            </span>
          ) : (
            <Image
              src={message.authorAvatarUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
              onError={() => setImgError(true)}
            />
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Badges with entrance animation */}
          {isOwner && (
            <motion.span 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...springs.bouncy, delay: 0.1 }}
              className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded"
            >
              OWNER
            </motion.span>
          )}
          {isMod && !isOwner && (
            <motion.span 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...springs.bouncy, delay: 0.1 }}
              className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded"
            >
              MOD
            </motion.span>
          )}
          {isMember && !isOwner && !isMod && (
            <motion.span 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...springs.bouncy, delay: 0.1 }}
              className="text-[10px] font-black uppercase tracking-wider text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded"
            >
              MEMBER
            </motion.span>
          )}

          {/* Super Chat Amount with shimmer */}
          {isSuperChat && message.superChatAmount && (
            <motion.span
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={springs.bouncy}
              whileHover={{ scale: 1.1 }}
              className="rounded-full px-2 py-0.5 text-[10px] font-black text-white shadow-lg relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${message.superChatColor}, ${message.superChatColor}dd)`,
                boxShadow: `0 4px 12px ${message.superChatColor}50`
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />
              <span className="relative z-10">{message.superChatAmount}</span>
            </motion.span>
          )}

          {/* Username with subtle hover */}
          <motion.span 
            className="font-bold text-sm cursor-default"
            style={{ color: usernameColor }}
            whileHover={{ 
              textShadow: `0 0 8px ${usernameColor}60`,
              transition: { duration: 0.2 }
            }}
          >
            {message.authorName}
          </motion.span>
        </div>

        {/* Message text with fade-in */}
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.2 }}
          className="text-white/90 leading-relaxed mt-0.5 font-medium"
          style={messageStyle}
        >
          {message.message}
        </motion.p>
      </div>
    </motion.article>
  );
}
