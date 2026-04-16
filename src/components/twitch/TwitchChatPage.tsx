"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowDown, 
  Trash2, 
  Settings, 
  Play, 
  Youtube, 
  Loader2, 
  Key, 
  LogOut,
  Zap,
  ArrowLeftRight
} from "lucide-react";
import { useChat } from "@/lib/hooks/useChat";
import { useDemoChat } from "@/lib/hooks/useDemoChat";
import { useCustomization } from "@/lib/hooks/useCustomization";
import { DemoControls } from "@/components/DemoControls";
import { springs } from "@/lib/motion";

interface TwitchChatPageProps {
  onSwitchUI: () => void;
}

interface TwitchMessageProps {
  message: {
    id: string;
    authorName: string;
    authorAvatarUrl: string;
    isVerified: boolean;
    isOwner: boolean;
    isModerator: boolean;
    isSponsor: boolean;
    message: string;
    timestamp: Date;
    badges: string[];
  };
  accentColor: string;
}

/**
 * Twitch-style Chat Message
 * Classic compact chat look matching Twitch UI exactly
 */
function TwitchMessage({ message }: TwitchMessageProps) {
  // Twitch-style username colors
  const getUsernameColor = (name: string) => {
    const colors = [
      "#FF4A4A", // red
      "#FFB12A", // yellow  
      "#FF75E6", // pink
      "#00D6D6", // cyan/teal
      "#00FF00", // green
      "#9D4CFF", // purple
      "#FF6B35", // orange
      "#5D3FD3", // violet
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const usernameColor = getUsernameColor(message.authorName);
  
  // Format timestamp as H:MM (5:18)
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="px-3 py-1 hover:bg-[#1F1F23] transition-colors"
    >
      <div className="flex flex-wrap items-baseline gap-x-1.5 text-[13px] leading-[1.4]">
        {/* Timestamp */}
        <span className="text-[#ADADB8] text-xs shrink-0">
          {formatTime(message.timestamp)}
        </span>
        
        {/* Badges - Twitch style small icons */}
        {message.isOwner && (
          <span 
            className="inline-flex items-center justify-center w-4 h-4 rounded text-[10px] shrink-0"
            style={{ backgroundColor: '#9146FF', color: 'white' }}
            title="Owner"
          >
            ♕
          </span>
        )}
        {message.isModerator && (
          <span 
            className="inline-flex items-center justify-center w-4 h-4 rounded text-[10px] shrink-0"
            style={{ backgroundColor: '#00ADAD', color: 'white' }}
            title="Moderator"
          >
            ⚔️
          </span>
        )}
        {message.isVerified && (
          <span 
            className="inline-flex items-center justify-center w-4 h-4 rounded text-[10px] shrink-0"
            style={{ backgroundColor: '#FACC15', color: 'black' }}
            title="Verified"
          >
            ✓
          </span>
        )}
        {message.isSponsor && (
          <span 
            className="inline-flex items-center justify-center w-4 h-4 rounded text-[10px] shrink-0"
            style={{ backgroundColor: '#00F593', color: 'black' }}
            title="Member"
          >
            ★
          </span>
        )}
        
        {/* Username */}
        <span 
          className="font-bold cursor-pointer hover:underline"
          style={{ color: usernameColor }}
        >
          {message.authorName}
        </span>
        
        <span className="text-[#EFEFF1]/70">:</span>
        
        {/* Message text */}
        <span className="text-[#EFEFF1] break-words">
          {message.message}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Twitch-style Chat Interface
 * Classic 1:1 Twitch chat clone for YouTube Live
 */
export function TwitchChatPage({ onSwitchUI }: TwitchChatPageProps) {
  const [url, setUrl] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { 
    apiKey, 
    updateField, 
    fontSize, 
    accentColor,
    maxLoadedMessages
  } = useCustomization();

  const liveChat = useChat({
    maxMessages: maxLoadedMessages,
    apiKey: apiKey,
  });

  const demoChat = useDemoChat({
    maxMessages: maxLoadedMessages,
  });

  const chat = isDemo ? demoChat : liveChat;
  const { messages, connectionState, streamInfo, disconnect, clearMessages } = chat;

  // Extract demo-specific controls
  const demoControls = isDemo ? {
    speed: demoChat.speed,
    setSpeed: demoChat.setSpeed,
    isPaused: demoChat.isPaused,
    pause: demoChat.pause,
    resume: demoChat.resume,
    progress: demoChat.progress,
    loopCount: demoChat.loopCount,
  } : null;

  const isConnected = connectionState === "connected";
  const isConnecting = connectionState === "connecting";

  const handleStartDemo = async () => {
    liveChat.disconnect();
    setIsDemo(true);
    setUrl("");
    await demoChat.connect();
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      setIsDemo(false);
      demoChat.disconnect();
      await liveChat.connect(url.trim());
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDemo(false);
  };

  // Smooth auto-scroll
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
  }, [messages, isAutoScrollEnabled]);

  // Handle scroll detection for auto-scroll button
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
      setIsAutoScrollEnabled(isNearBottom);
    }
  }, []);

  const scrollToBottom = () => {
    setIsAutoScrollEnabled(true);
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div 
      className="flex flex-col h-screen w-full overflow-hidden"
      style={{ 
        backgroundColor: "#0E0E10",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Twitch-style Header - Centered */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#18181B] border-b border-[#303032] shrink-0">
        <div className="flex items-center gap-3 flex-1">
          {isDemo && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#9146FF]/20 text-[#9146FF] text-[10px] font-bold">
              <Zap className="h-3 w-3" />
              DEMO
            </span>
          )}
        </div>
        
        {/* Center - Stream Chat title */}
        <div className="flex items-center justify-center gap-2">
          <span className="font-semibold text-[#EFEFF1] text-sm">Stream Chat</span>
        </div>
        
        <div className="flex items-center justify-end gap-2 flex-1">
          {/* Actions */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded hover:bg-white/10 text-[#ADADB8] hover:text-[#EFEFF1] transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={clearMessages}
            className="p-1.5 rounded hover:bg-white/10 text-[#ADADB8] hover:text-red-400 transition-colors"
            title="Clear chat"
            disabled={messages.length === 0}
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            onClick={onSwitchUI}
            className="p-1.5 rounded hover:bg-white/10 text-[#ADADB8] hover:text-[#EFEFF1] transition-colors"
            title="Switch UI Mode"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.snappy}
            className="bg-[#1F1F23] border-b border-[#303032] overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* API Key Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#ADADB8] uppercase tracking-wider">
                  <Key className="h-3.5 w-3.5" />
                  YouTube API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => updateField("apiKey", e.target.value)}
                  placeholder="Enter your YouTube Data API v3 key"
                  className="w-full px-3 py-2 bg-[#0E0E10] border border-[#303032] rounded text-sm text-[#EFEFF1] placeholder-[#6B6B6F] focus:outline-none focus:border-[#9146FF] transition-colors"
                />
                <p className="text-[10px] text-[#6B6B6F]">
                  Required only for non-T3 streams. Get one at{" "}
                  <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#9146FF] hover:underline"
                  >
                    Google Cloud Console
                  </a>
                </p>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ADADB8] uppercase tracking-wider">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => updateField("fontSize", parseInt(e.target.value))}
                  className="w-full accent-[#9146FF]"
                />
              </div>

              {/* Max Messages */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ADADB8] uppercase tracking-wider">
                  Max Messages: {maxLoadedMessages}
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={maxLoadedMessages}
                  onChange={(e) => updateField("maxLoadedMessages", parseInt(e.target.value))}
                  className="w-full accent-[#9146FF]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Input */}
      <div className="px-4 py-3 bg-[#18181B] border-b border-[#303032] shrink-0">
        {!isConnected && !isDemo ? (
          <form onSubmit={handleConnect} className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube Live URL..."
              className="flex-1 px-3 py-2 bg-[#0E0E10] border border-[#303032] rounded text-sm text-[#EFEFF1] placeholder-[#6B6B6F] focus:outline-none focus:border-[#9146FF] transition-colors"
            />
            <button
              type="submit"
              disabled={isConnecting || !url.trim()}
              className="px-4 py-2 bg-[#9146FF] hover:bg-[#7C3AED] disabled:bg-[#4A4A4F] disabled:cursor-not-allowed text-white text-sm font-bold rounded transition-colors flex items-center gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Connecting...</span>
                </>
              ) : (
                <>
                  <Youtube className="h-4 w-4" />
                  <span className="hidden sm:inline">Connect</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#ADADB8]">
              {isDemo ? (
                <span className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-[#9146FF]" />
                  Demo Mode Active
                </span>
              ) : streamInfo ? (
                <span className="truncate">{streamInfo.title}</span>
              ) : (
                <span>Connected</span>
              )}
            </div>
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold rounded transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Disconnect</span>
            </button>
          </div>
        )}

        {/* Demo button when not connected */}
        {!isConnected && !isConnecting && (
          <button
            onClick={handleStartDemo}
            className="mt-2 w-full py-2 bg-[#1F1F23] hover:bg-[#2D2D35] text-[#ADADB8] hover:text-[#EFEFF1] text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="h-3.5 w-3.5" />
            Try Demo Mode
          </button>
        )}
      </div>

      {/* Demo Controls */}
      {isDemo && demoControls && (
        <div className="px-4 py-2 bg-[#9146FF]/10 border-b border-[#9146FF]/20 shrink-0">
          <DemoControls
            {...demoControls}
            accentColor="#9146FF"
          />
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative bg-[#18181B]">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#303032] scrollbar-track-transparent"
          style={{ fontSize: `${fontSize}px` }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#ADADB8]">
              <MessageSquarePlaceholder />
              <p className="mt-4 text-sm">Welcome to the chat room!</p>
            </div>
          ) : (
            <div className="py-2">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <TwitchMessage
                    key={msg.id}
                    message={{
                      id: msg.id,
                      authorName: msg.authorName,
                      authorAvatarUrl: msg.authorAvatarUrl,
                      isVerified: msg.badges.includes('verified'),
                      isOwner: msg.badges.includes('owner'),
                      isModerator: msg.badges.includes('moderator'),
                      isSponsor: msg.badges.includes('member'),
                      message: msg.message,
                      timestamp: msg.timestamp,
                      badges: msg.badges,
                    }}
                    accentColor={accentColor}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToBottom}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-[#9146FF] hover:bg-[#7C3AED] text-white text-sm font-semibold rounded-full shadow-lg transition-colors"
            >
              <ArrowDown className="h-4 w-4" />
              New messages
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area - Twitch Style */}
      <div className="px-4 py-3 bg-[#18181B] border-t border-[#303032] shrink-0">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#0E0E10] border border-[#303032] rounded">
          <span className="text-[#6B6B6F] text-sm shrink-0">Chat</span>
          <input
            type="text"
            disabled
            placeholder="Chat is read-only (viewer mode)"
            className="flex-1 bg-transparent text-sm text-[#EFEFF1] placeholder-[#6B6B6F] focus:outline-none disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}

function MessageSquarePlaceholder() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#4A4A4F]"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
