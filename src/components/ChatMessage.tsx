"use client";

import Image from "next/image";
import { Badge } from "./Badge";
import type { ChatMessage as ChatMessageType } from "@/types/youtube";
import { useCustomization } from "@/lib/hooks/useCustomization";

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * Get username color based on author info
 */
function getUsernameColor(channelId: string, badges: ChatMessageType["badges"]): string {
  if (badges.includes("owner")) return "text-amber-400";
  if (badges.includes("moderator")) return "text-emerald-400";
  if (badges.includes("member")) return "text-accent";

  const colors = [
    "text-blue-400",
    "text-rose-400",
    "text-violet-400",
    "text-sky-400",
    "text-indigo-400",
    "text-cyan-400",
    "text-fuchsia-400",
    "text-pink-400",
  ];

  let hash = 0;
  for (let i = 0; i < channelId.length; i++) {
    hash = channelId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Chat Message - Supports "Comfy" and "Compact" modes
 * Compact: Single line with inline username and message
 * Comfy: Full layout with stacked username and message
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const { chatStyle, showAvatars, showTimestamps, showBadges, messageAnimations } = useCustomization();
  const usernameColor = getUsernameColor(message.authorChannelId, message.badges);
  const isCompact = chatStyle === "compact";

  // Compact mode: Single line inline layout
  if (isCompact) {
    return (
      <article
        className={`group flex items-center gap-1.5 px-3 py-0 transition-colors hover:bg-surface-muted border-l-2 border-transparent hover:border-accent/40 ${messageAnimations ? "animate-fade-in" : ""}`}
        style={
          message.isSuperChat && message.superChatColor
            ? { 
                backgroundColor: `${message.superChatColor}10`,
                borderColor: message.superChatColor
              }
            : undefined
        }
      >
        {/* Timestamp - always visible in compact */}
        {showTimestamps && (
          <span className="text-[9px] font-mono text-text-v5/50 tabular-nums shrink-0">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}

        {/* Avatar (tiny) */}
        {showAvatars && (
          <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full border border-white/10">
            <Image
              src={message.authorAvatarUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Badges (compact) */}
        {showBadges && message.badges.length > 0 && (
          <div className="flex gap-0.5 shrink-0 scale-75 origin-left">
            {message.badges.map((badge) => (
              <Badge key={badge} type={badge} />
            ))}
          </div>
        )}

        {/* Super Chat Amount */}
        {message.isSuperChat && message.superChatAmount && (
          <span
            className="rounded-full px-1.5 py-0 text-[8px] font-black uppercase text-white shrink-0"
            style={{ backgroundColor: message.superChatColor }}
          >
            {message.superChatAmount}
          </span>
        )}

        {/* Username */}
        <span className={`font-bold text-[11px] shrink-0 ${usernameColor}`}>
          {message.authorName}:
        </span>
        
        {/* Message (inline, truncated) */}
        <span className="text-[12px] text-text-v2 truncate">
          {message.message}
        </span>
      </article>
    );
  }

  // Comfy mode: Full stacked layout
  return (
    <article
      className={`group relative flex gap-3 px-6 py-2.5 transition-all hover:bg-surface-muted border-l-2 border-transparent hover:border-accent/40 ${messageAnimations ? "animate-fade-in" : ""} ${message.isSuperChat ? "my-2" : ""}`}
      style={
        message.isSuperChat && message.superChatColor
          ? { 
              backgroundColor: `${message.superChatColor}10`,
              borderColor: message.superChatColor
            }
          : undefined
      }
    >
      {/* Avatar */}
      {showAvatars && (
        <div className="flex-shrink-0 pt-1">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border group-hover:border-accent/30 transition-colors shadow-lg shadow-black/20">
            <Image
              src={message.authorAvatarUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 flex flex-col gap-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Badges */}
          {showBadges && message.badges.length > 0 && (
            <div className="flex gap-1">
              {message.badges.map((badge) => (
                <Badge key={badge} type={badge} />
              ))}
            </div>
          )}

          {/* Super Chat */}
          {message.isSuperChat && message.superChatAmount && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm"
              style={{ backgroundColor: message.superChatColor }}
            >
              {message.superChatAmount}
            </span>
          )}

          {/* Username */}
          <span className={`font-bold tracking-tight text-sm ${usernameColor}`}>
            {message.authorName}
          </span>
          
          {/* Timestamp */}
          {showTimestamps && (
            <span className="text-[10px] uppercase font-bold text-text-v5/40">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Message Body */}
        <p className="text-[15px] leading-relaxed text-text-v2 font-medium">
          {message.message}
        </p>
      </div>

      {message.isSuperChat && (
        <div 
          className="absolute right-0 top-0 h-full w-1 opacity-20"
          style={{ backgroundColor: message.superChatColor }}
        />
      )}
    </article>
  );
}
