"use client";

import { Wifi, WifiOff, Loader2, AlertCircle, Moon } from "lucide-react";
import type { ConnectionState } from "@/types/youtube";

interface ConnectionStatusProps {
  state: ConnectionState;
  error?: string | null;
}

const stateConfig: Record<
  ConnectionState,
  { icon: typeof Wifi; color: string; label: string }
> = {
  disconnected: {
    icon: WifiOff,
    color: "text-muted",
    label: "Disconnected",
  },
  connecting: {
    icon: Loader2,
    color: "text-blue-400",
    label: "Connecting...",
  },
  connected: {
    icon: Wifi,
    color: "text-green-400",
    label: "Connected",
  },
  error: {
    icon: AlertCircle,
    color: "text-red-400",
    label: "Error",
  },
  offline: {
    icon: Moon,
    color: "text-amber-400",
    label: "Stream Offline",
  },
};

/**
 * Connection status indicator
 */
export function ConnectionStatus({ state, error }: ConnectionStatusProps) {
  const config = stateConfig[state];
  const Icon = config.icon;
  const isSpinning = state === "connecting";

  return (
    <div
      className={`flex items-center gap-1.5 text-sm ${config.color}`}
      role="status"
      aria-live="polite"
    >
      <Icon
        className={`h-4 w-4 ${isSpinning ? "animate-spin" : ""}`}
        aria-hidden="true"
      />
      <span>{error && state === "error" ? error : config.label}</span>
    </div>
  );
}
