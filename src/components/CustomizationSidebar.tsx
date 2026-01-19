"use client";

import { 
  Palette, 
  Layout, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Maximize,
  Eye,
  Check,
  MessageSquare,
  Type,
  Sparkles,
  AlignLeft,
  AlignCenter,
  PanelLeft,
  PanelRight,
  Circle,
  Square,
  RectangleHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  useCustomization, 
  ChatStyle, 
  ThemePreset, 
  FontFamily, 
  BorderRadius,
  MessageAlign,
  SidebarPosition
} from "@/lib/hooks/useCustomization";

/**
 * Advanced Sidebar for UI customization
 * Premium polish with Framer Motion animations
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
    messageAnimations,
    // New customization options
    fontFamily,
    borderRadius,
    blurIntensity,
    glowEffects,
    messageAlign,
    sidebarPosition
  } = useCustomization();
  
  const colorPresets = ["#CA0377", "#9147ff", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"];
  const themePresets: ThemePreset[] = ["original", "dark", "oled", "light", "creamy"];
  const fontPresets: { value: FontFamily; label: string }[] = [
    { value: "system", label: "System" },
    { value: "inter", label: "Inter" },
    { value: "mono", label: "Mono" },
    { value: "serif", label: "Serif" },
  ];
  const radiusPresets: { value: BorderRadius; label: string; icon: typeof Circle }[] = [
    { value: "none", label: "Sharp", icon: Square },
    { value: "small", label: "Subtle", icon: RectangleHorizontal },
    { value: "medium", label: "Rounded", icon: RectangleHorizontal },
    { value: "large", label: "Soft", icon: Circle },
    { value: "full", label: "Pill", icon: Circle },
  ];

  if (isSidebarCollapsed) {
    return (
      <aside className={`hidden h-full flex-col items-center border-card-border bg-sidebar py-6 md:flex w-[70px] transition-all duration-300 ${sidebarPosition === 'left' ? 'border-r order-first' : 'border-l order-last'}`}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 border border-accent/20">
          <MessageSquare className="h-5 w-5 text-accent" />
        </div>
        <div className="mt-auto">
          <button 
            onClick={() => updateField("isSidebarCollapsed", false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-hover text-text-v5 hover:text-text-v1 transition-colors"
            aria-label="Expand Sidebar"
          >
            {sidebarPosition === 'left' ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className={`hidden w-[360px] flex-col border-card-border bg-sidebar h-full md:flex transition-all duration-300 relative ${sidebarPosition === 'left' ? 'border-r order-first' : 'border-l order-last'}`}
      style={{ opacity: sidebarOpacity / 100 }}
    >
      {/* Collapse Trigger */}
      <button 
        onClick={() => updateField("isSidebarCollapsed", true)}
        className={`absolute top-6 p-2 rounded-lg hover:bg-surface-hover text-text-v5 hover:text-text-v1 transition-colors ${sidebarPosition === 'left' ? 'right-4' : 'left-4'}`}
        title="Collapse Sidebar"
        aria-label="Collapse Sidebar"
      >
        {sidebarPosition === 'left' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {/* App Logo Area */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 px-1 py-4">
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 border border-accent/20 shadow-lg"
            style={{ boxShadow: glowEffects ? `0 0 20px var(--accent-soft)` : 'none' }}
          >
            <MessageSquare className="h-5 w-5 text-accent" />
          </div>
          <span className="text-xl font-black tracking-tighter text-text-v1">YT_Chat</span>
        </div>
      </div>

      {/* Main Settings Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-8">
        
        {/* --- THEMES --- */}
        <section className="space-y-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Palette className="h-4 w-4 text-accent" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-v3">Theme & Color</h2>
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

          {/* Accent Colors */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Accent</label>
            <div className="flex flex-wrap gap-2.5">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => updateField("accentColor", color)}
                  className="relative h-7 w-7 rounded-full transition-all"
                  style={{ 
                    backgroundColor: color,
                    boxShadow: accentColor === color ? `0 0 12px ${color}, 0 0 4px ${color}` : 'none',
                    transform: accentColor === color ? 'scale(1.15)' : 'scale(1)',
                  }}
                  aria-label={`Select color ${color}`}
                >
                  {accentColor === color && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                  )}
                </button>
              ))}
              <input
                 type="color"
                 value={accentColor}
                 onChange={(e) => updateField("accentColor", e.target.value)}
                 className="h-7 w-7 rounded-full overflow-hidden border-2 border-dashed border-border p-0 cursor-pointer"
                 aria-label="Custom color picker"
              />
            </div>
          </div>
        </section>

        {/* --- TYPOGRAPHY --- */}
        <section className="space-y-5 animate-fade-in" style={{ animationDelay: "50ms" }}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Type className="h-4 w-4 text-accent" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-v3">Typography</h2>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Font Family</label>
            <div className="grid grid-cols-2 gap-2">
              {fontPresets.map((font) => (
                <button
                  key={font.value}
                  onClick={() => updateField("fontFamily", font.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                    fontFamily === font.value 
                      ? "bg-accent/10 border-accent text-accent" 
                      : "bg-surface-muted border-border text-text-v5 hover:bg-surface-hover"
                  }`}
                  style={{ fontFamily: font.value === 'mono' ? 'monospace' : font.value === 'serif' ? 'serif' : 'inherit' }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Font Size</label>
              <span className="text-[11px] font-mono font-semibold text-accent tabular-nums bg-accent/10 px-2 py-0.5 rounded">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => updateField("fontSize", parseInt(e.target.value))}
              className="w-full accent-accent h-1.5 bg-surface-hover rounded-full appearance-none cursor-pointer"
              aria-label="Font size slider"
            />
          </div>
        </section>

        {/* --- EFFECTS --- */}
        <section className="space-y-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Sparkles className="h-4 w-4 text-accent" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-v3">Effects</h2>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Border Radius</label>
            <div className="grid grid-cols-5 gap-1.5">
              {radiusPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => updateField("borderRadius", preset.value)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                    borderRadius === preset.value 
                      ? "bg-accent/10 border-accent text-accent" 
                      : "bg-surface-muted border-border text-text-v5 hover:bg-surface-hover"
                  }`}
                  title={preset.label}
                >
                  <preset.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Blur Intensity</label>
              <span className="text-[11px] font-mono font-semibold text-accent tabular-nums bg-accent/10 px-2 py-0.5 rounded">{blurIntensity}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              value={blurIntensity}
              onChange={(e) => updateField("blurIntensity", parseInt(e.target.value))}
              className="w-full accent-accent h-1.5 bg-surface-hover rounded-full appearance-none cursor-pointer"
              aria-label="Blur intensity slider"
            />
          </div>

          <ToggleButton 
            label="Glow Effects" 
            active={glowEffects} 
            onToggle={() => updateField("glowEffects", !glowEffects)} 
          />
        </section>

        {/* --- LAYOUT --- */}
        <section className="space-y-5 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Layout className="h-4 w-4 text-accent" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-v3">Layout</h2>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Sidebar Position</label>
            <div className="flex p-1 bg-surface-muted rounded-lg border border-border">
              <button
                onClick={() => updateField("sidebarPosition", "left")}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${sidebarPosition === "left" ? "bg-surface-hover text-text-v1 shadow-sm" : "text-text-v5 hover:text-text-v3"}`}
              >
                <PanelLeft className="h-3.5 w-3.5" />
                Left
              </button>
              <button
                onClick={() => updateField("sidebarPosition", "right")}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${sidebarPosition === "right" ? "bg-surface-hover text-text-v1 shadow-sm" : "text-text-v5 hover:text-text-v3"}`}
              >
                <PanelRight className="h-3.5 w-3.5" />
                Right
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Chat Density</label>
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
              <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Chat Width</label>
              <span className="text-[11px] font-mono font-semibold text-accent tabular-nums bg-accent/10 px-2 py-0.5 rounded">{chatWidth}%</span>
            </div>
            <input
              type="range"
              min="25"
              max="100"
              step="5"
              value={chatWidth}
              onChange={(e) => updateField("chatWidth", parseInt(e.target.value))}
              className="w-full accent-accent h-1.5 bg-surface-hover rounded-full appearance-none cursor-pointer"
              aria-label="Chat width slider"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Message Align</label>
            <div className="flex p-1 bg-surface-muted rounded-lg border border-border">
              <button
                onClick={() => updateField("messageAlign", "left")}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${messageAlign === "left" ? "bg-surface-hover text-text-v1 shadow-sm" : "text-text-v5 hover:text-text-v3"}`}
              >
                <AlignLeft className="h-3.5 w-3.5" />
                Left
              </button>
              <button
                onClick={() => updateField("messageAlign", "center")}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${messageAlign === "center" ? "bg-surface-hover text-text-v1 shadow-sm" : "text-text-v5 hover:text-text-v3"}`}
              >
                <AlignCenter className="h-3.5 w-3.5" />
                Center
              </button>
            </div>
          </div>
        </section>

        {/* --- DISPLAY --- */}
        <section className="space-y-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Eye className="h-4 w-4 text-accent" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-v3">Display</h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ToggleButton 
              label="Avatars" 
              active={showAvatars} 
              onToggle={() => updateField("showAvatars", !showAvatars)} 
            />
            <ToggleButton 
              label="Time" 
              active={showTimestamps} 
              onToggle={() => updateField("showTimestamps", !showTimestamps)} 
            />
            <ToggleButton 
              label="Badges" 
              active={showBadges} 
              onToggle={() => updateField("showBadges", !showBadges)} 
            />
            <ToggleButton 
              label="Anims" 
              active={messageAnimations} 
              onToggle={() => updateField("messageAnimations", !messageAnimations)} 
            />
          </div>
        </section>

        {/* --- PERFORMANCE --- */}
        <section className="space-y-5 animate-fade-in" style={{ animationDelay: "250ms" }}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Zap className="h-4 w-4 text-accent" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-v3">Performance</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Max Messages</label>
              <span className="text-[11px] font-mono font-semibold text-accent tabular-nums bg-accent/10 px-2 py-0.5 rounded">{maxLoadedMessages}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={maxLoadedMessages}
              onChange={(e) => updateField("maxLoadedMessages", parseInt(e.target.value))}
              className="w-full accent-accent h-1.5 bg-surface-hover rounded-full appearance-none cursor-pointer"
              aria-label="Max loaded messages slider"
            />
            <p className="text-[10px] text-text-v5">Lower this if you experience lag.</p>
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-text-v5 uppercase tracking-wide">Sidebar Opacity</label>
              <span className="text-[11px] font-mono font-semibold text-accent tabular-nums bg-accent/10 px-2 py-0.5 rounded">{sidebarOpacity}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={sidebarOpacity}
              onChange={(e) => updateField("sidebarOpacity", parseInt(e.target.value))}
              className="w-full accent-accent h-1.5 bg-surface-hover rounded-full appearance-none cursor-pointer"
              aria-label="Sidebar opacity slider"
            />
          </div>

          <div className="pt-2">
            <button 
              onClick={() => updateField("focusMode", !focusMode)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${focusMode ? "bg-accent/20 border-accent/50 text-text-v1" : "bg-surface-muted border-border text-text-v3 hover:bg-surface-hover"}`}
              aria-label="Toggle Focus Mode"
            >
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4" />
                <div className="text-xs font-bold">Focus Mode</div>
              </div>
              <motion.div 
                className={`w-8 h-4 rounded-full p-0.5 transition-colors ${focusMode ? "bg-accent" : "bg-surface-hover"}`}
              >
                <motion.div 
                  className="h-3 w-3 rounded-full bg-white shadow-sm"
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{ x: focusMode ? 16 : 0 }}
                />
              </motion.div>
            </button>
          </div>
        </section>

      </div>
    </aside>
  );
}

/**
 * Reusable Toggle Button with spring animation
 */
function ToggleButton({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <button 
      onClick={onToggle}
      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${active ? "bg-accent/10 border-accent/30 text-text-v1" : "bg-surface-muted border-border text-text-v5 hover:bg-surface-hover"}`}
      aria-label={`Toggle ${label}`}
      aria-pressed={active}
    >
      <span className="text-[10px] font-bold uppercase">{label}</span>
      <motion.div className={`w-6 h-3 rounded-full p-0.5 transition-colors ${active ? "bg-accent" : "bg-surface-hover"}`}>
        <motion.div 
          className="h-2 w-2 rounded-full bg-white shadow-sm"
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ x: active ? 12 : 0 }}
        />
      </motion.div>
    </button>
  );
}
