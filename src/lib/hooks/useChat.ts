"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatMessage, ConnectionState, BadgeType } from "@/types/youtube";
import { extractVideoId } from "@/lib/youtube";

interface UseChatOptions {
  maxMessages?: number;
}

interface UseChatReturn {
  messages: ChatMessage[];
  connectionState: ConnectionState;
  error: string | null;
  streamInfo: StreamInfo | null;
  connect: (videoUrl: string) => Promise<void>;
  disconnect: () => void;
  clearMessages: () => void;
}

interface StreamInfo {
  videoId: string;
  channelId: string;
  channelTitle: string;
  title: string;
  thumbnailUrl?: string;
  concurrentViewers?: string;
  actualStartTime?: string;
}

interface ApiMessage {
  id: string;
  snippet: {
    type: string;
    publishedAt: string;
    displayMessage?: string;
    textMessageDetails?: { messageText: string };
    superChatDetails?: {
      userComment?: string;
      amountDisplayString?: string;
      tier?: number;
    };
    superStickerDetails?: {
      amountDisplayString?: string;
      tier?: number;
      superStickerMetadata?: { altText?: string };
    };
  };
  authorDetails: {
    channelId: string;
    displayName: string;
    profileImageUrl: string;
    isChatOwner: boolean;
    isChatModerator: boolean;
    isChatSponsor: boolean;
    isVerified: boolean;
  };
}

/**
 * Get SuperChat tier color based on amount
 */
function getSuperChatColor(tier: number): string {
  const colors: Record<number, string> = {
    1: "#1565c0",
    2: "#00bfa5",
    3: "#ffca28",
    4: "#f57c00",
    5: "#e91e63",
    6: "#e62117",
    7: "#e62117",
  };
  return colors[tier] || colors[1];
}

/**
 * Get badges for a user
 */
function getBadges(author: ApiMessage["authorDetails"]): BadgeType[] {
  const badges: BadgeType[] = [];
  if (author.isChatOwner) badges.push("owner");
  if (author.isChatModerator) badges.push("moderator");
  if (author.isChatSponsor) badges.push("member");
  if (author.isVerified) badges.push("verified");
  return badges;
}

/**
 * Transform API message to ChatMessage
 */
function transformMessage(msg: ApiMessage): ChatMessage {
  const { snippet, authorDetails } = msg;

  let message = "";
  let isSuperChat = false;
  let superChatAmount: string | undefined;
  let superChatColor: string | undefined;

  switch (snippet.type) {
    case "textMessageEvent":
      message = snippet.textMessageDetails?.messageText || "";
      break;
    case "superChatEvent":
      message = snippet.superChatDetails?.userComment || "";
      isSuperChat = true;
      superChatAmount = snippet.superChatDetails?.amountDisplayString;
      superChatColor = getSuperChatColor(snippet.superChatDetails?.tier || 1);
      break;
    case "superStickerEvent":
      message = `[Super Sticker: ${snippet.superStickerDetails?.superStickerMetadata?.altText || "Sticker"}]`;
      isSuperChat = true;
      superChatAmount = snippet.superStickerDetails?.amountDisplayString;
      superChatColor = getSuperChatColor(snippet.superStickerDetails?.tier || 1);
      break;
    default:
      message = snippet.displayMessage || "";
  }

  return {
    id: msg.id,
    authorName: authorDetails.displayName,
    authorAvatarUrl: authorDetails.profileImageUrl,
    authorChannelId: authorDetails.channelId,
    message,
    timestamp: new Date(snippet.publishedAt),
    badges: getBadges(authorDetails),
    isSuperChat,
    superChatAmount,
    superChatColor,
    messageType: snippet.type,
  };
}

/**
 * Hook for managing YouTube Live Chat polling via server API
 */
export function useChat({ maxMessages = 500 }: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const liveChatIdRef = useRef<string | null>(null);
  const pageTokenRef = useRef<string | undefined>(undefined);
  const seenIdsRef = useRef<Set<string>>(new Set());

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    stopPolling();
    liveChatIdRef.current = null;
    pageTokenRef.current = undefined;
    setConnectionState("disconnected");
    setStreamInfo(null);
    setError(null);
  }, [stopPolling]);

  const pollMessages = useCallback(async () => {
    if (!liveChatIdRef.current) return;

    try {
      const response = await fetch("/api/youtube/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          liveChatId: liveChatIdRef.current,
          pageToken: pageTokenRef.current,
        }),
      });

      const result = await response.json();

      if (result.status === "error") {
        throw new Error(result.message);
      }

      const data = result.data;

      // Check if stream went offline
      if (data.offlineAt) {
        setConnectionState("offline");
        stopPolling();
        return;
      }

      // Transform and deduplicate messages
      const newMessages = data.items
        .map(transformMessage)
        .filter((msg: ChatMessage) => !seenIdsRef.current.has(msg.id));

      // Track seen message IDs
      newMessages.forEach((msg: ChatMessage) => seenIdsRef.current.add(msg.id));

      if (newMessages.length > 0) {
        setMessages((prev) => {
          const combined = [...prev, ...newMessages];
          return combined.slice(-maxMessages);
        });
      }

      pageTokenRef.current = data.nextPageToken;

      const pollInterval = Math.max(data.pollingIntervalMillis, 1000);
      pollingRef.current = setTimeout(pollMessages, pollInterval);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch messages";
      setError(message);
      setConnectionState("error");
      pollingRef.current = setTimeout(pollMessages, 5000);
    }
  }, [maxMessages, stopPolling]);

  const connect = useCallback(
    async (videoUrl: string) => {
      disconnect();
      setError(null);
      setConnectionState("connecting");
      seenIdsRef.current.clear();
      setMessages([]);

      try {
        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
          throw new Error("Invalid YouTube URL or video ID");
        }

        // Call server API to validate and get live chat ID
        const response = await fetch("/api/youtube/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId }),
        });

        const result = await response.json();

        if (result.status === "error") {
          throw new Error(result.message);
        }

        const data = result.data;
        liveChatIdRef.current = data.liveChatId;

        setStreamInfo({
          videoId: data.videoId,
          channelId: data.channelId,
          channelTitle: data.channelTitle,
          title: data.title,
          thumbnailUrl: data.thumbnailUrl,
          concurrentViewers: data.concurrentViewers,
          actualStartTime: data.actualStartTime,
        });

        setConnectionState("connected");
        pollMessages();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to connect";
        setError(message);
        setConnectionState("error");
      }
    },
    [disconnect, pollMessages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    seenIdsRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    messages,
    connectionState,
    error,
    streamInfo,
    connect,
    disconnect,
    clearMessages,
  };
}
