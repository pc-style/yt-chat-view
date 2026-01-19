"use client";

import { useState, useEffect } from "react";
import { 
  Trash2, 
  Maximize,
} from "lucide-react";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { SettingsModal } from "@/components/SettingsModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CustomizationSidebar } from "@/components/CustomizationSidebar";
import { useChat } from "@/lib/hooks/useChat";
import { useTheme } from "@/lib/hooks/useTheme";
import { useCustomization } from "@/lib/hooks/useCustomization";

const API_KEY_STORAGE = "yt-chat-api-key";

/**
 * Main application layout - Focus on customization and chat
 */
export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  // Customization State
  const { 
    focusMode,
    chatWidth,
    maxLoadedMessages,
    updateField
  } = useCustomization();

  // Load API key from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE);
    if (stored) {
      setApiKey(stored);
    } else {
      setIsSettingsOpen(true);
    }
  }, []);

  const { messages, connectionState, error, connect, disconnect, clearMessages } = useChat({
    apiKey,
    maxMessages: maxLoadedMessages, // Use dynamic limit
  });

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem(API_KEY_STORAGE, key);
  };

  const isConnected = connectionState === "connected";
  const isConnecting = connectionState === "connecting";

  return (
    <div className="flex h-screen bg-background text-text-v3 selection:bg-accent/30 overflow-hidden">
      {/* Side Customization Panel - Hidden in Focus Mode unless hovered? No, keep focus strict */}
      {!focusMode && <CustomizationSidebar />}

      {/* --- Main Content Area --- */}
      <main className="flex flex-1 flex-col overflow-hidden relative transition-all duration-300">
        
        {/* Floating Exit Focus Mode Button */}
        {focusMode && (
          <button
            onClick={() => updateField("focusMode", false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/50 hover:text-white backdrop-blur-md transition-all animate-fade-in"
            title="Exit Focus Mode"
            aria-label="Exit Focus Mode"
          >
            <Maximize className="h-5 w-5 rotate-180" />
          </button>
        )}

        {/* Transparent App Header - Hidden in Focus Mode */}
        {!focusMode && (
          <header className="flex h-16 items-center justify-between border-b border-card-border bg-background/50 px-8 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-text-v1 tracking-tight">Active Session</span>
              <div className="h-4 w-px bg-card-border" />
              <div className="flex gap-2">
                 {/* History/Stats removed as requested */}
                 <span className="text-xs font-medium text-text-v5 px-2 py-1 rounded bg-white/5">
                   {messages.length} messages
                 </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ConnectionStatus state={connectionState} error={error} />
              <div className="h-4 w-px bg-card-border mx-2" />
              
              <button 
                onClick={clearMessages}
                className="rounded-xl p-2.5 text-text-v5 hover:bg-danger/10 hover:text-danger transition-all active:scale-90"
                title="Clear Chat"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
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
                backgroundColor: chatWidth < 100 ? 'var(--background)' : 'transparent' // Ensure contrast against empty space
              }}
            >
              <div className="flex-1 overflow-hidden py-0">
                <ChatContainer messages={messages} />
              </div>
              
              {/* Premium Anchored Input Bar */}
              <div className={`w-full px-8 border-t border-card-border bg-background/95 backdrop-blur-xl transition-all duration-300 ${focusMode ? "py-4 opacity-0 hover:opacity-100" : "py-8"}`}>
                <div className="max-w-3xl mx-auto flex flex-col gap-4">
                  <ChatInput
                    onConnect={connect}
                    onDisconnect={disconnect}
                    isConnected={isConnected}
                    isConnecting={isConnecting}
                    onSettingsClick={() => setIsSettingsOpen(true)}
                  />
                  {!focusMode && (
                    <p className="text-[11px] text-center text-text-v5/50 font-medium">
                      YT_Chat connected. Theme: Default
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />
    </div>
  );
}
