"use client";

import { useState, FormEvent } from "react";
import { Send, X, Play, Loader2 } from "lucide-react";

interface ChatInputProps {
  onConnect: (videoUrl: string) => Promise<void>;
  onDisconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  onSettingsClick: () => void;
}

/**
 * Centered Pill Input - Comfy Style
 */
export function ChatInput({
  onConnect,
  onDisconnect,
  isConnected,
  isConnecting,
}: ChatInputProps) {
  const [videoUrl, setVideoUrl] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim() && !isConnecting) {
      await onConnect(videoUrl.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto flex items-center gap-3 glass-pill p-2 pl-4 shadow-xl shadow-black/20 group focus-within:border-accent/40 focus-within:bg-white/10 transition-all">
      <div className="flex-1 flex items-center min-w-0">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder={isConnected ? "Connected to chat..." : "Paste YouTube URL to start chatting..."}
          disabled={isConnected || isConnecting}
          className="w-full bg-transparent border-none text-text-v3 placeholder:text-text-v5/50 focus:outline-none focus:ring-0 text-sm py-1.5"
          aria-label="YouTube Video Link"
        />
      </div>

      <div className="flex items-center gap-1.5">
        {isConnected ? (
          <button
            type="button"
            onClick={onDisconnect}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-danger/10 text-danger hover:bg-danger/20 transition-all active:scale-90"
            title="Disconnect"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!videoUrl.trim() || isConnecting}
            className="flex h-9 items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.95] disabled:opacity-50 disabled:grayscale"
          >
            {isConnecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span className="hidden sm:inline">Connect</span>
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
