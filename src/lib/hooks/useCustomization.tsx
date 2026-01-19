"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const CUSTOMIZATION_STORAGE = "yt-chat-customization-v3";

export type ChatStyle = "compact" | "comfy";
export type ThemePreset = "original" | "dark" | "oled" | "light" | "creamy";

interface CustomizationState {
  // Visuals
  accentColor: string;
  themePreset: ThemePreset;
  chatStyle: ChatStyle;
  fontSize: number;
  sidebarOpacity: number;
  
  // Layout & Focus
  isSidebarCollapsed: boolean;
  focusMode: boolean;
  chatWidth: number; // 25-100%
  
  // Message Display
  showAvatars: boolean;
  showTimestamps: boolean;
  showBadges: boolean;
  messageAnimations: boolean;
  
  // Performance
  maxLoadedMessages: number;
  smoothScrollIntensity: "off" | "low" | "high";
}

const DEFAULT_STATE: CustomizationState = {
  accentColor: "#CA0377",
  themePreset: "original",
  chatStyle: "comfy",
  fontSize: 16,
  sidebarOpacity: 95,
  
  isSidebarCollapsed: false,
  focusMode: false,
  chatWidth: 100,
  
  showAvatars: true,
  showTimestamps: false,
  showBadges: true,
  messageAnimations: true,
  
  maxLoadedMessages: 500,
  smoothScrollIntensity: "high",
};

const THEMES: Record<ThemePreset, { 
  bg: string; 
  sidebar: string; 
  card: string; 
  cardBorder: string;
  text1: string; 
  text2: string;
  text3: string;
  text4: string;
  text5: string;
  // UI surface colors
  surfaceMuted: string;  // For subtle backgrounds
  surfaceHover: string;  // For hover states
  border: string;        // For borders
}> = {
  original: {
    bg: "rgb(33, 20, 30)",
    sidebar: "rgba(28, 17, 26, 0.95)",
    card: "rgba(45, 27, 41, 0.4)",
    cardBorder: "rgba(251, 208, 232, 0.08)",
    text1: "rgb(244, 244, 245)",
    text2: "rgb(231, 208, 221)",
    text3: "rgb(249, 248, 251)",
    text4: "rgb(251, 208, 232)",
    text5: "rgb(196, 96, 149)",
    surfaceMuted: "rgba(255, 255, 255, 0.05)",
    surfaceHover: "rgba(255, 255, 255, 0.1)",
    border: "rgba(255, 255, 255, 0.1)",
  },
  dark: {
    bg: "#09090b",
    sidebar: "#18181b",
    card: "rgba(39, 39, 42, 0.4)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    text1: "#fafafa",
    text2: "#a1a1aa",
    text3: "#e4e4e7",
    text4: "#71717a",
    text5: "#52525b",
    surfaceMuted: "rgba(255, 255, 255, 0.05)",
    surfaceHover: "rgba(255, 255, 255, 0.1)",
    border: "rgba(255, 255, 255, 0.1)",
  },
  oled: {
    bg: "#000000",
    sidebar: "#000000",
    card: "rgba(20, 20, 20, 0.6)",
    cardBorder: "rgba(255, 255, 255, 0.05)",
    text1: "#ffffff",
    text2: "#888888",
    text3: "#cccccc",
    text4: "#666666",
    text5: "#444444",
    surfaceMuted: "rgba(255, 255, 255, 0.03)",
    surfaceHover: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.08)",
  },
  light: {
    bg: "#ffffff",
    sidebar: "#f4f4f5",
    card: "rgba(244, 244, 245, 0.6)",
    cardBorder: "rgba(0, 0, 0, 0.08)",
    text1: "#09090b",
    text2: "#3f3f46",
    text3: "#18181b",
    text4: "#52525b",
    text5: "#71717a",
    surfaceMuted: "rgba(0, 0, 0, 0.03)",
    surfaceHover: "rgba(0, 0, 0, 0.06)",
    border: "rgba(0, 0, 0, 0.1)",
  },
  creamy: {
    bg: "#fdfbf7",
    sidebar: "#f5f0e6",
    card: "rgba(231, 229, 220, 0.5)",
    cardBorder: "rgba(0, 0, 0, 0.06)",
    text1: "#44403c",
    text2: "#57534e",
    text3: "#292524",
    text4: "#78716c",
    text5: "#a8a29e",
    surfaceMuted: "rgba(0, 0, 0, 0.03)",
    surfaceHover: "rgba(0, 0, 0, 0.06)",
    border: "rgba(0, 0, 0, 0.08)",
  },
};

const CustomizationContext = createContext<CustomizationState & { updateField: <K extends keyof CustomizationState>(field: K, value: CustomizationState[K]) => void } | null>(null);

export function CustomizationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CustomizationState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CUSTOMIZATION_STORAGE);
    if (stored) {
      try {
        setState({ ...DEFAULT_STATE, ...JSON.parse(stored) });
      } catch (e) {
        console.error("Failed to parse customization state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sync to localStorage and apply CSS variables
  useEffect(() => {
    if (!isLoaded) return;
    
    localStorage.setItem(CUSTOMIZATION_STORAGE, JSON.stringify(state));
    
    const root = document.documentElement;
    const theme = THEMES[state.themePreset];
    
    // Apply Theme Colors
    root.style.setProperty("--background", theme.bg);
    root.style.setProperty("--sidebar-bg", theme.sidebar);
    root.style.setProperty("--card-bg", theme.card);
    root.style.setProperty("--card-border", theme.cardBorder);
    root.style.setProperty("--text-1", theme.text1);
    root.style.setProperty("--text-2", theme.text2);
    root.style.setProperty("--text-3", theme.text3);
    root.style.setProperty("--text-4", theme.text4);
    root.style.setProperty("--text-5", theme.text5);
    root.style.setProperty("--surface-muted", theme.surfaceMuted);
    root.style.setProperty("--surface-hover", theme.surfaceHover);
    root.style.setProperty("--border", theme.border);
    
    // Apply Visual Settings
    root.style.setProperty("--accent", state.accentColor);
    root.style.setProperty("--font-size-base", `${state.fontSize}px`);
    root.style.setProperty("--line-height-base", `${state.fontSize * 1.5}px`);
    
    // Calculate and apply accent variants
    const r = parseInt(state.accentColor.slice(1, 3), 16);
    const g = parseInt(state.accentColor.slice(3, 5), 16);
    const b = parseInt(state.accentColor.slice(5, 7), 16);
    root.style.setProperty("--accent-muted", `rgba(${r}, ${g}, ${b}, 0.15)`);
    root.style.setProperty("--accent-soft", `rgba(${r}, ${g}, ${b}, 0.1)`);
    
  }, [state, isLoaded]);

  const updateField = <K extends keyof CustomizationState>(field: K, value: CustomizationState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <CustomizationContext.Provider value={{ ...state, updateField }}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error("useCustomization must be used within a CustomizationProvider");
  }
  return context;
}
