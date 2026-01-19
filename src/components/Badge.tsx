"use client";

import { Crown, Shield, Star, BadgeCheck } from "lucide-react";
import type { BadgeType } from "@/types/youtube";

interface BadgeProps {
  type: BadgeType;
}

const badgeConfig: Record<BadgeType, { icon: typeof Crown; color: string; label: string }> = {
  owner: {
    icon: Crown,
    color: "text-yellow-400",
    label: "Channel Owner",
  },
  moderator: {
    icon: Shield,
    color: "text-green-400",
    label: "Moderator",
  },
  member: {
    icon: Star,
    color: "text-emerald-400",
    label: "Member",
  },
  verified: {
    icon: BadgeCheck,
    color: "text-blue-400",
    label: "Verified",
  },
};

/**
 * Badge component for displaying user roles/status
 */
export function Badge({ type }: BadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center ${config.color}`}
      title={config.label}
      aria-label={config.label}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </span>
  );
}
