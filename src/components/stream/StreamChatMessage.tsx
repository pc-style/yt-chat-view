"use client";

import { useState, memo, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ChatMessage as ChatMessageType } from "@/types/youtube";
import { springs, getStaggerDelay } from "@/lib/motion";
import { useCustomization } from "@/lib/hooks/useCustomization";

interface StreamChatMessageProps {
  message: ChatMessageType;
  index: number;
}

/** Username color palette */
const STREAM_USERNAME_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", 
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
  "#BB8FCE", "#85C1E9", "#F8B500", "#FF8C94"
] as const;

/** Color cache for stream messages */
const streamColorCache = new Map<string, string>();

/**
 * Get username color - YouTube style with vibrant palette (memoized)
 */
function getUsernameColor(channelId: string, badges: ChatMessageType["badges"]): string {
  if (badges.includes("owner")) return "#FFD700";
  if (badges.includes("moderator")) return "#5E84F1";
  if (badges.includes("member")) return "#2BA640";

  // Check cache first
  if (streamColorCache.has(channelId)) {
    return streamColorCache.get(channelId)!;
  }

  let hash = 0;
  for (let i = 0; i < channelId.length; i++) {
    hash = channelId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color = STREAM_USERNAME_COLORS[Math.abs(hash) % STREAM_USERNAME_COLORS.length];
  streamColorCache.set(channelId, color);
  return color;
}

/** Border radius mapping */
const RADIUS_MAP: Record<string, string> = {
  none: '0px',
  small: '8px',
  medium: '12px',
  large: '20px',
  full: '9999px',
};

/**
 * Premium Stream Chat Message
 * Ultra-smooth animations with spring physics
 * 
 * Memoized to prevent unnecessary re-renders during rapid chat updates
 */
export const StreamChatMessage = memo(function StreamChatMessage({ message, index }: StreamChatMessageProps) {
  const [imgError, setImgError] = useState(false);
  const { fontSize, borderRadius } = useCustomization();
  
  // Memoize derived values
  const usernameColor = useMemo(
    () => getUsernameColor(message.authorChannelId, message.badges),
    [message.authorChannelId, message.badges]
  );
  
  const { isOwner, isMod, isMember, isSpecial, isSuperChat } = useMemo(() => {
    const owner = message.badges.includes("owner");
    const mod = message.badges.includes("moderator");
    const member = message.badges.includes("member");
    return {
      isOwner: owner,
      isMod: mod,
      isMember: member,
      isSpecial: owner || mod || member,
      isSuperChat: message.isSuperChat,
    };
  }, [message.badges, message.isSuperChat]);

  const messageStyle = useMemo<React.CSSProperties>(() => ({
    fontSize: `${fontSize}px`,
  }), [fontSize]);

  const itemRadius = RADIUS_MAP[borderRadius] || '12px';

  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={{ 
        ...springs.smooth,
        delay: getStaggerDelay(index, 0.015, 0.2),
      }}
      className={`group flex items-start gap-3 px-4 py-2 hover:bg-white/[0.03] transition-colors ${
        isSuperChat 
          ? "bg-gradient-to-r from-amber-500/15 via-orange-500/5 to-transparent" 
          : ""
      }`}
      style={{
        borderLeft: isSuperChat ? `3px solid ${message.superChatColor}` : undefined,
        borderRadius: itemRadius,
      }}
    >
      {/* Avatar */}
      <div className={`relative shrink-0 ${isSpecial ? "p-0.5" : ""}`}>
        {isSpecial && (
          <div 
            className="absolute inset-0 rounded-full"
            style={{ background: `linear-gradient(135deg, ${usernameColor}, ${usernameColor}80)` }}
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
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Badges */}
          {isOwner && (
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
              OWNER
            </span>
          )}
          {isMod && !isOwner && (
            <span className="text-[9px] font-black uppercase tracking-wider text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
              MOD
            </span>
          )}
          {isMember && !isOwner && !isMod && (
            <span className="text-[9px] font-black uppercase tracking-wider text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
              MEMBER
            </span>
          )}

          {/* Super Chat Amount */}
          {isSuperChat && message.superChatAmount && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-black text-white"
              style={{ 
                background: message.superChatColor,
                boxShadow: `0 2px 8px ${message.superChatColor}40`
              }}
            >
              {message.superChatAmount}
            </span>
          )}

          {/* Username */}
          <span className="font-bold text-sm" style={{ color: usernameColor }}>
            {message.authorName}
          </span>
        </div>

        {/* Message text */}
        <p className="text-white/90 leading-relaxed mt-0.5 font-medium" style={messageStyle}>
          {message.message}
        </p>
      </div>
    </motion.article>
  );
});

// Display name for debugging
StreamChatMessage.displayName = 'StreamChatMessage';
