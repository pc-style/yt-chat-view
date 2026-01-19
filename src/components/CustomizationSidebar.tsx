"use client";

import { 
  Palette, 
  Layout, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  Monitor,
  Zap,
  Maximize,
  Eye,
  Type
} from "lucide-react";
import { useCustomization, ChatStyle, ThemePreset } from "@/lib/hooks/useCustomization";

/**
 * Advanced Sidebar for UI customization
 * Includes Themes, Performance, and Layout controls
 */
export function CustomizationSidebar() {
  const { 
    accentColor,
    fontSize,
    chatStyle,
    sidebarOpacity,
    themePreset,
    isSidebarCollapsed,
    updateField, 
    maxLoadedMessages,
    focusMode,
    chatWidth,
    showAvatars,
    showTimestamps,
    showBadges,
    messageAnimations
  } = useCustomization();
  
  const colorPresets = ["#CA0377", "#9147ff", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  const themePresets: ThemePreset[] = ["original", "dark", "oled", "light", "creamy"];

  if (isSidebarCollapsed) {
    return (
      <aside className="hidden h-full flex-col items-center border-r border-card-border bg-sidebar py-6 md:flex w-[70px] transition-all duration-300">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 border border-accent/20">
          <MessageSquare className="h-5 w-5 text-accent" />
        </div>
        <div className="mt-auto">
          <button 
            onClick={() => updateField("isSidebarCollapsed", false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-hover text-text-v5 hover:text-text-v1 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className="hidden w-[360px] flex-col border-r border-card-border bg-sidebar h-full md:flex transition-all duration-300 relative" 
      style={{ opacity: sidebarOpacity / 100 }}
    >
      {/* Collapse Trigger */}
      <button 
        onClick={() => updateField("isSidebarCollapsed", true)}
        className="absolute right-4 top-6 p-2 rounded-lg hover:bg-surface-hover text-text-v5 hover:text-text-v1 transition-colors"
        title="Collapse Sidebar"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* App Logo Area */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 px-1 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 border border-accent/20 shadow-lg shadow-accent/10">
            <MessageSquare className="h-5 w-5 text-accent" />
          </div>
          <span className="text-xl font-black tracking-tighter text-text-v1">YT_Chat</span>
        </div>
      </div>

      {/* Main Settings Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-8">
        
        {/* --- THEMES --- */}
        <section className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
            <Palette className="h-4 w-4 text-accent" />
            <h2 className="text-xs font-black uppercase tracking-widest text-text-v3">Theme & Color</h2>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Base Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {themePresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => updateField("themePreset", preset)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold capitalize border transition-all ${
                    themePreset === preset 
                      ? "bg-accent/10 border-accent text-accent shadow-sm" 
                      : "bg-surface-muted border-border text-text-v5 hover:bg-surface-hover hover:text-text-v3"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Accent</label>
            <div className="flex flex-wrap gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => updateField("accentColor", color)}
                  className={`h-6 w-6 rounded-full transition-all ${accentColor === color ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-60 hover:opacity-100"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                 type="color"
                 value={accentColor}
                 onChange={(e) => updateField("accentColor", e.target.value)}
                 className="h-6 w-6 rounded-full overflow-hidden border-0 p-0 cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* --- LAYOUT --- */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
            <Layout className="h-4 w-4 text-accent" />
            <h2 className="text-xs font-black uppercase tracking-widest text-text-v3">Layout & Size</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Chat Density</label>
            </div>
            <div className="flex p-1 bg-surface-muted rounded-lg border border-border">
              {(["comfy", "compact"] as ChatStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => updateField("chatStyle", style)}
                  className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition-all ${chatStyle === style ? "bg-surface-hover text-text-v1 shadow-sm" : "text-text-v5 hover:text-text-v3"}`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Font Size</label>
              <span className="text-[10px] font-mono text-accent">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => updateField("fontSize", parseInt(e.target.value))}
              className="w-full accent-accent h-1 bg-surface-hover rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Chat Width</label>
              <span className="text-[10px] font-mono text-accent">{chatWidth}%</span>
            </div>
            <input
              type="range"
              min="25"
              max="100"
              step="5"
              value={chatWidth}
              onChange={(e) => updateField("chatWidth", parseInt(e.target.value))}
              className="w-full accent-accent h-1 bg-surface-hover rounded-full appearance-none cursor-pointer"
            />
          </div>
        </section>

        {/* --- DISPLAY --- */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
            <Eye className="h-4 w-4 text-accent" />
            <h2 className="text-xs font-black uppercase tracking-widest text-text-v3">Display</h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Show Avatars Toggle */}
            <button 
              onClick={() => updateField("showAvatars", !showAvatars)}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${showAvatars ? "bg-accent/10 border-accent/30 text-text-v1" : "bg-surface-muted border-border text-text-v5 hover:bg-surface-hover"}`}
            >
              <span className="text-[10px] font-bold uppercase">Avatars</span>
              <div className={`w-6 h-3 rounded-full p-0.5 transition-colors ${showAvatars ? "bg-accent" : "bg-surface-hover"}`}>
                <div className={`h-2 w-2 rounded-full bg-white shadow-sm transition-transform ${showAvatars ? "translate-x-3" : "translate-x-0"}`} />
              </div>
            </button>

            {/* Show Timestamps Toggle */}
            <button 
              onClick={() => updateField("showTimestamps", !showTimestamps)}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${showTimestamps ? "bg-accent/10 border-accent/30 text-text-v1" : "bg-surface-muted border-border text-text-v5 hover:bg-surface-hover"}`}
            >
              <span className="text-[10px] font-bold uppercase">Time</span>
              <div className={`w-6 h-3 rounded-full p-0.5 transition-colors ${showTimestamps ? "bg-accent" : "bg-surface-hover"}`}>
                <div className={`h-2 w-2 rounded-full bg-white shadow-sm transition-transform ${showTimestamps ? "translate-x-3" : "translate-x-0"}`} />
              </div>
            </button>

            {/* Show Badges Toggle */}
            <button 
              onClick={() => updateField("showBadges", !showBadges)}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${showBadges ? "bg-accent/10 border-accent/30 text-text-v1" : "bg-surface-muted border-border text-text-v5 hover:bg-surface-hover"}`}
            >
              <span className="text-[10px] font-bold uppercase">Badges</span>
              <div className={`w-6 h-3 rounded-full p-0.5 transition-colors ${showBadges ? "bg-accent" : "bg-surface-hover"}`}>
                <div className={`h-2 w-2 rounded-full bg-white shadow-sm transition-transform ${showBadges ? "translate-x-3" : "translate-x-0"}`} />
              </div>
            </button>

            {/* Animations Toggle */}
            <button 
              onClick={() => updateField("messageAnimations", !messageAnimations)}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${messageAnimations ? "bg-accent/10 border-accent/30 text-text-v1" : "bg-surface-muted border-border text-text-v5 hover:bg-surface-hover"}`}
            >
              <span className="text-[10px] font-bold uppercase">Anims</span>
              <div className={`w-6 h-3 rounded-full p-0.5 transition-colors ${messageAnimations ? "bg-accent" : "bg-surface-hover"}`}>
                <div className={`h-2 w-2 rounded-full bg-white shadow-sm transition-transform ${messageAnimations ? "translate-x-3" : "translate-x-0"}`} />
              </div>
            </button>
          </div>
        </section>

        {/* --- PERFORMANCE --- */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
            <Zap className="h-4 w-4 text-accent" />
            <h2 className="text-xs font-black uppercase tracking-widest text-text-v3">Performance</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Max Loaded Messages</label>
              <span className="text-[10px] font-mono text-accent">{maxLoadedMessages}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={maxLoadedMessages}
              onChange={(e) => updateField("maxLoadedMessages", parseInt(e.target.value))}
              className="w-full accent-accent h-1 bg-surface-hover rounded-full appearance-none cursor-pointer"
            />
            <p className="text-[10px] text-text-v5">Lower this if you experience lag.</p>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => updateField("focusMode", !focusMode)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${focusMode ? "bg-accent/20 border-accent/50 text-text-v1" : "bg-surface-muted border-border text-text-v3 hover:bg-surface-hover"}`}
            >
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4" />
                <div className="text-xs font-bold">Focus Mode</div>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${focusMode ? "bg-accent" : "bg-surface-hover"}`}>
                <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${focusMode ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </button>
          </div>
        </section>

      </div>
    </aside>
  );
}
