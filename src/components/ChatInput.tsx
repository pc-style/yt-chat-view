"use client";

import { useState, FormEvent } from "react";
import { X, Play, Loader2 } from "lucide-react";
import { useCustomization } from "@/lib/hooks/useCustomization";

interface ChatInputProps {
  onConnect: (videoUrl: string) => Promise<void>;
  onDisconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
}

/**
 * Premium Pill Input with Accent Glow
 */
export function ChatInput({
  onConnect,
  onDisconnect,
  isConnected,
  isConnecting,
}: ChatInputProps) {
  const [videoUrl, setVideoUrl] = useState("");
  const { accentColor } = useCustomization();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim() && !isConnecting) {
      await onConnect(videoUrl.trim());
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-3xl mx-auto flex items-center gap-3 p-2 pl-4 rounded-full border backdrop-blur-sm transition-all duration-300 group"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: isConnected ? `${accentColor}50` : 'rgba(255, 255, 255, 0.1)',
        boxShadow: isConnected 
          ? `0 0 20px ${accentColor}20, 0 4px 20px rgba(0,0,0,0.3)` 
          : '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      {/* Subtle accent glow on focus */}
      <div 
        className="absolute inset-0 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 30px ${accentColor}30, inset 0 0 20px ${accentColor}10`,
        }}
      />
      
      <div className="flex-1 flex items-center min-w-0 relative z-10">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder={isConnected ? "Connected to chat..." : "Paste YouTube URL to start chatting..."}
          disabled={isConnected || isConnecting}
          className="w-full bg-transparent border-none text-text-v3 placeholder:text-text-v5/60 focus:outline-none focus:ring-0 text-sm py-1.5"
          aria-label="YouTube Video Link"
        />
      </div>

      <div className="flex items-center gap-1.5 relative z-10">
        {isConnected ? (
          <button
            type="button"
            onClick={onDisconnect}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all active:scale-90"
            title="Disconnect"
            aria-label="Disconnect from chat"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!videoUrl.trim() || isConnecting}
            className="flex h-9 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.95] disabled:opacity-50 disabled:grayscale"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 4px 15px ${accentColor}40`,
            }}
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
