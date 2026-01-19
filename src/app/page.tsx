"use client";

import { useState, useEffect } from "react";
import { 
  Maximize,
  MessageSquare,
  Users,
  Clock,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CustomizationSidebar } from "@/components/CustomizationSidebar";
import { ChoiceScreen } from "@/components/ChoiceScreen";
import { StreamPage } from "@/components/stream/StreamPage";
import { useChat } from "@/lib/hooks/useChat";
import { useTheme } from "@/lib/hooks/useTheme";
import { useCustomization } from "@/lib/hooks/useCustomization";

/**
 * Premium Welcome Hero Component
 * Enhanced with motion.dev spring physics
 */
function WelcomeHero({ onQuickStart }: { onQuickStart: (url: string) => void }) {
  const { accentColor } = useCustomization();
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full px-8"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 25,
      }}
    >
      {/* Glassmorphism Card */}
      <motion.div 
        className="relative p-8 rounded-3xl border backdrop-blur-xl max-w-md w-full text-center overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 80px ${accentColor}08`,
        }}
        whileHover={{ 
          boxShadow: `0 12px 48px rgba(0, 0, 0, 0.4), 0 0 100px ${accentColor}15`,
          y: -2,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "linear" }}
        />
        
        {/* Accent glow orb */}
        <motion.div 
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl"
          style={{ backgroundColor: accentColor }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Icon */}
        <motion.div 
          className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border"
          style={{
            background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}05)`,
            borderColor: `${accentColor}30`,
          }}
          animate={{ 
            boxShadow: [
              `0 0 20px ${accentColor}20`,
              `0 0 40px ${accentColor}35`,
              `0 0 20px ${accentColor}20`,
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <MessageSquare className="h-8 w-8" style={{ color: accentColor }} />
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-black text-text-v1 mb-2 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Welcome to YT_Chat
        </motion.h1>
        <motion.p 
          className="text-sm text-text-v5 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Connect to authorized YouTube live streams and view the chat in real-time with custom styling.
        </motion.p>
        
        {/* Quick Start Section removed */}
        <p className="text-[10px] text-text-v5/60 mt-4">
          Paste any authorized live stream URL below to start
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * Stream Info Bar Component
 */
function StreamInfoBar({ streamInfo }: { streamInfo: { channelTitle: string; title: string; concurrentViewers?: string; actualStartTime?: string } }) {
  const formatDuration = (startTime?: string) => {
    if (!startTime) return null;
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flex items-center gap-4 text-xs text-text-v5">
      <span className="font-semibold text-text-v3">{streamInfo.channelTitle}</span>
      <span className="hidden sm:inline truncate max-w-[200px]">{streamInfo.title}</span>
      {streamInfo.concurrentViewers && (
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {parseInt(streamInfo.concurrentViewers).toLocaleString()}
        </span>
      )}
      {streamInfo.actualStartTime && (
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDuration(streamInfo.actualStartTime)}
        </span>
      )}
    </div>
  );
}

/**
 * Main application layout
 */
export default function Home() {
  const [uiVariant, setUiVariant] = useState<"yt_chat" | "yT3_chat" | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("yt-chat-ui-variant");
    if (stored === "yt_chat" || stored === "yT3_chat") {
      setUiVariant(stored);
    }
    setIsLoaded(true);
  }, []);

  // Handle choice selection
  const handleChoice = (variant: "yt_chat" | "yT3_chat") => {
    localStorage.setItem("yt-chat-ui-variant", variant);
    setUiVariant(variant);
  };

  // Reset to choice screen
  const handleSwitchUI = () => {
    localStorage.removeItem("yt-chat-ui-variant");
    setUiVariant(null);
  };

  // Prevent flash of content before loading
  if (!isLoaded) {
    return (
      <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Show choice screen if no preference
  if (uiVariant === null) {
    return <ChoiceScreen onChoice={handleChoice} />;
  }

  // Show minimal stream UI
  if (uiVariant === "yt_chat") {
    return <StreamPage onSwitchUI={handleSwitchUI} />;
  }

  // Show full yT3_chat UI (current implementation)
  return <YT3ChatUI onSwitchUI={handleSwitchUI} />;
}

/**
 * Full-featured yT3_chat UI (original implementation)
 */
function YT3ChatUI({ onSwitchUI }: { onSwitchUI: () => void }) {
  const { theme, toggleTheme } = useTheme();
  
  const { 
    focusMode,
    chatWidth,
    maxLoadedMessages,
    updateField,
    accentColor,
    apiKey
  } = useCustomization();

  // Pass API key if configured (BYOK)
  const { messages, connectionState, error, streamInfo, connect, disconnect, clearMessages } = useChat({
    maxMessages: maxLoadedMessages,
    apiKey,
  });

  const handleQuickStart = async (url: string) => {
    await connect(url);
  };

  const isConnected = connectionState === "connected";
  const isConnecting = connectionState === "connecting";
  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen bg-background text-text-v3 selection:bg-accent/30 overflow-hidden">
      {/* Side Customization Panel - Hidden in Focus Mode */}
      {!focusMode && <CustomizationSidebar />}

      {/* --- Main Content Area --- */}
      <main className="flex flex-1 flex-col overflow-hidden relative transition-all duration-300">
        
        {/* Floating Exit Focus Mode Button */}
        {focusMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => updateField("focusMode", false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/50 hover:text-white backdrop-blur-md transition-all"
            title="Exit Focus Mode"
            aria-label="Exit Focus Mode"
          >
            <Maximize className="h-5 w-5 rotate-180" />
          </motion.button>
        )}

        {/* Transparent App Header - Hidden in Focus Mode */}
        {!focusMode && (
          <header className="flex h-16 items-center justify-between border-b border-card-border bg-background/50 px-8 backdrop-blur-md z-10 shrink-0 transition-colors duration-300">
            <div className="flex items-center gap-6">
              {streamInfo ? (
                <StreamInfoBar streamInfo={streamInfo} />
              ) : (
                <>
                  <span className="text-sm font-bold text-text-v1 tracking-tight">yT3 Chat</span>
                  <div className="h-4 w-px bg-card-border" />
                  <span className="text-xs font-medium text-text-v5 px-2 py-1 rounded bg-white/5">
                    {messages.length} messages
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <ConnectionStatus state={connectionState} error={error} />
              <div className="h-4 w-px bg-card-border mx-2" />
              
              <button 
                onClick={onSwitchUI}
                className="rounded-xl p-2.5 text-text-v5 hover:bg-accent/10 hover:text-accent transition-all active:scale-90"
                title="Switch UI Mode"
                aria-label="Switch to different UI"
              >
                <RefreshCw className="h-4.5 w-4.5" />
              </button>
            </div>
          </header>
        )}

        {/* Chat Viewing Area */}
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full flex flex-col items-center">
            {/* Dynamic Width Container */}
            <div 
              className="h-full flex flex-col transition-all duration-300 ease-out border-x border-transparent"
              style={{ 
                width: `${chatWidth}%`,
                borderLeftColor: chatWidth < 100 ? 'var(--card-border)' : 'transparent',
                borderRightColor: chatWidth < 100 ? 'var(--card-border)' : 'transparent',
                backgroundColor: chatWidth < 100 ? 'var(--background)' : 'transparent'
              }}
            >
              {/* Show Welcome Hero or Chat */}
              <div className="flex-1 overflow-hidden py-0">
                {!hasMessages && !isConnected ? (
                  <WelcomeHero onQuickStart={handleQuickStart} />
                ) : (
                  <ChatContainer messages={messages} />
                )}
              </div>
              
              {/* Premium Anchored Input Bar */}
              <div 
                className={`w-full px-8 border-t border-card-border backdrop-blur-xl transition-all duration-300 ${focusMode ? "py-4 opacity-0 hover:opacity-100" : "py-8"}`}
                style={{ backgroundColor: 'rgba(var(--background), 0.95)' }}
              >
                <div className="max-w-3xl mx-auto flex flex-col gap-4">
                  <ChatInput
                    onConnect={connect}
                    onDisconnect={disconnect}
                    isConnected={isConnected}
                    isConnecting={isConnecting}
                  />
                  {!focusMode && (
                    <p className="text-[11px] text-center text-text-v5/50 font-medium">
                      All channels supported with BYOK. Default: @t3dotgg. Accent: <span style={{ color: accentColor }}>{accentColor}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
