"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatMessage, ConnectionState } from "@/types/youtube";
import {
  extractVideoId,
  getLiveChatId,
  fetchChatMessages,
  transformMessage,
} from "@/lib/youtube";

interface UseChatOptions {
  apiKey: string;
  maxMessages?: number;
}

interface UseChatReturn {
  messages: ChatMessage[];
  connectionState: ConnectionState;
  error: string | null;
  connect: (videoUrl: string) => Promise<void>;
  disconnect: () => void;
  clearMessages: () => void;
}

/**
 * Hook for managing YouTube Live Chat polling
 */
export function useChat({ apiKey, maxMessages = 500 }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
  }, [stopPolling]);

  const pollMessages = useCallback(async () => {
    if (!liveChatIdRef.current) return;

    try {
      const response = await fetchChatMessages(
        liveChatIdRef.current,
        apiKey,
        pageTokenRef.current
      );

      // Check if stream went offline
      if (response.offlineAt) {
        setConnectionState("offline");
        stopPolling();
        return;
      }

      // Transform and deduplicate messages
      const newMessages = response.items
        .map(transformMessage)
        .filter((msg) => !seenIdsRef.current.has(msg.id));

      // Track seen message IDs
      newMessages.forEach((msg) => seenIdsRef.current.add(msg.id));

      if (newMessages.length > 0) {
        setMessages((prev) => {
          const combined = [...prev, ...newMessages];
          // Keep only the last maxMessages
          return combined.slice(-maxMessages);
        });
      }

      // Update page token for next poll
      pageTokenRef.current = response.nextPageToken;

      // Schedule next poll based on API-recommended interval
      const pollInterval = Math.max(response.pollingIntervalMillis, 1000);
      pollingRef.current = setTimeout(pollMessages, pollInterval);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch messages";
      setError(message);
      setConnectionState("error");

      // Retry after 5 seconds on error
      pollingRef.current = setTimeout(pollMessages, 5000);
    }
  }, [apiKey, maxMessages, stopPolling]);

  const connect = useCallback(
    async (videoUrl: string) => {
      // Clean up any existing connection
      disconnect();
      setError(null);
      setConnectionState("connecting");
      seenIdsRef.current.clear();
      setMessages([]);

      try {
        // Extract video ID
        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
          throw new Error("Invalid YouTube URL or video ID");
        }

        // Get live chat ID
        const liveChatId = await getLiveChatId(videoId, apiKey);
        if (!liveChatId) {
          throw new Error("Could not find active live chat for this video");
        }

        liveChatIdRef.current = liveChatId;
        setConnectionState("connected");

        // Start polling
        pollMessages();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to connect";
        setError(message);
        setConnectionState("error");
      }
    },
    [apiKey, disconnect, pollMessages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    seenIdsRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    messages,
    connectionState,
    error,
    connect,
    disconnect,
    clearMessages,
  };
}
