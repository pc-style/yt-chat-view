"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatMessage, ConnectionState } from "@/types/youtube";
import { 
  getDemoMessagesWithDelays, 
  DEMO_STREAM_INFO, 
  DEMO_DURATION_MS 
} from "@/lib/demo-data";

export type PlaybackSpeed = 1 | 2 | 5;

interface UseDemoChatOptions {
  maxMessages?: number;
  speed?: PlaybackSpeed;
  loop?: boolean;
}

interface UseDemoChatReturn {
  messages: ChatMessage[];
  connectionState: ConnectionState;
  error: string | null;
  streamInfo: typeof DEMO_STREAM_INFO | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  clearMessages: () => void;
  isDemo: true;
  speed: PlaybackSpeed;
  setSpeed: (speed: PlaybackSpeed) => void;
  isPaused: boolean;
  pause: () => void;
  resume: () => void;
}

/**
 * Demo chat hook - simulates live chat with pre-recorded data
 * Zero API calls, purely client-side playback
 */
export function useDemoChat({
  maxMessages = 500,
  speed: initialSpeed = 1,
  loop = true,
}: UseDemoChatOptions = {}): UseDemoChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [error] = useState<string | null>(null);
  const [streamInfo, setStreamInfo] = useState<typeof DEMO_STREAM_INFO | null>(null);
  const [speed, setSpeed] = useState<PlaybackSpeed>(initialSpeed);
  const [isPaused, setIsPaused] = useState(false);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const disconnect = useCallback(() => {
    clearTimeouts();
    setConnectionState("disconnected");
    setStreamInfo(null);
    startTimeRef.current = 0;
    pausedAtRef.current = 0;
    setIsPaused(false);
  }, [clearTimeouts]);

  const scheduleMessages = useCallback((fromOffset = 0) => {
    clearTimeouts();
    
    const demoMessages = getDemoMessagesWithDelays();
    const now = Date.now();
    startTimeRef.current = now - fromOffset;

    demoMessages.forEach(({ message, delay }) => {
      const adjustedDelay = delay / speed;
      const targetTime = adjustedDelay - fromOffset;
      
      if (targetTime > 0) {
        const timeout = setTimeout(() => {
          // Generate fresh ID for each playback
          const freshMessage: ChatMessage = {
            ...message,
            id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            timestamp: new Date(),
          };
          
          setMessages((prev) => {
            const combined = [...prev, freshMessage];
            return combined.slice(-maxMessages);
          });
        }, targetTime);
        
        timeoutsRef.current.push(timeout);
      }
    });

    // Schedule loop restart if enabled
    if (loop) {
      const loopDelay = (DEMO_DURATION_MS / speed) - fromOffset + 1000;
      if (loopDelay > 0) {
        const loopTimeout = setTimeout(() => {
          setMessages([]); // Clear for fresh loop
          scheduleMessages(0);
        }, loopDelay);
        timeoutsRef.current.push(loopTimeout);
      }
    }
  }, [speed, maxMessages, loop, clearTimeouts]);

  const connect = useCallback(async () => {
    disconnect();
    setConnectionState("connecting");
    
    // Simulate brief connection delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setStreamInfo(DEMO_STREAM_INFO);
    setConnectionState("connected");
    setMessages([]);
    scheduleMessages(0);
  }, [disconnect, scheduleMessages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const pause = useCallback(() => {
    if (connectionState !== "connected" || isPaused) return;
    
    clearTimeouts();
    pausedAtRef.current = Date.now() - startTimeRef.current;
    setIsPaused(true);
  }, [connectionState, isPaused, clearTimeouts]);

  const resume = useCallback(() => {
    if (connectionState !== "connected" || !isPaused) return;
    
    setIsPaused(false);
    scheduleMessages(pausedAtRef.current * speed); // Adjust for speed
  }, [connectionState, isPaused, scheduleMessages, speed]);

  // Restart scheduling when speed changes
  useEffect(() => {
    if (connectionState === "connected" && !isPaused) {
      const elapsed = Date.now() - startTimeRef.current;
      scheduleMessages(elapsed / speed); // Convert to base time
    }
  }, [speed, connectionState, isPaused, scheduleMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  return {
    messages,
    connectionState,
    error,
    streamInfo,
    connect,
    disconnect,
    clearMessages,
    isDemo: true,
    speed,
    setSpeed,
    isPaused,
    pause,
    resume,
  };
}
