import type { NextRequest } from "next/server";
import { 
  getCacheKey, 
  hashApiKey, 
  getOrFetch 
} from "@/lib/cache";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const ALLOWED_CHANNEL_ID = "UCbRP3c757lWg9M-U7TyEkXA";

// Cache TTL for video details (60 seconds)
const VIDEO_CACHE_TTL_MS = 60 * 1000;

interface VideoItem {
  snippet?: {
    channelId?: string;
    channelTitle?: string;
    title?: string;
    thumbnails?: {
      high?: { url: string };
    };
  };
  liveStreamingDetails?: {
    activeLiveChatId?: string;
    concurrentViewers?: string;
    actualStartTime?: string;
  };
}

interface VideoDetailsResponse {
  items?: VideoItem[];
}

interface ConnectData {
  liveChatId: string;
  videoId: string;
  channelId: string;
  channelTitle?: string;
  title?: string;
  thumbnailUrl?: string;
  concurrentViewers?: string;
  actualStartTime?: string;
}

/**
 * POST /api/youtube/connect
 * Validates video belongs to allowed channel and returns live chat ID
 * Now with server-side caching to reduce API quota usage
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    return Response.json(
      { status: "error", code: "MISSING_API_KEY", message: "YouTube API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { videoId, apiKey: clientApiKey } = body;

    const activeApiKey = clientApiKey || apiKey;
    const apiKeyId = hashApiKey(clientApiKey);

    if (!videoId || typeof videoId !== "string") {
      return Response.json(
        { status: "error", code: "INVALID_VIDEO_ID", message: "Video ID is required" },
        { status: 400 }
      );
    }

    // Generate cache key
    const cacheKey = getCacheKey("connect", videoId, apiKeyId);

    // Try to get from cache or fetch fresh
    const result = await getOrFetch<ConnectData>(
      cacheKey,
      async () => {
        // Fetch video details from YouTube
        const params = new URLSearchParams({
          part: "snippet,liveStreamingDetails",
          id: videoId,
          key: activeApiKey,
        });

        const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || "Failed to fetch video");
        }

        const data: VideoDetailsResponse = await response.json();

        if (!data.items || data.items.length === 0) {
          throw new Error("VIDEO_NOT_FOUND");
        }

        const video = data.items[0];
        const channelId = video.snippet?.channelId;

        // Validate channel ONLY if no client API key is provided
        if (!clientApiKey && channelId !== ALLOWED_CHANNEL_ID) {
          throw new Error("CHANNEL_NOT_ALLOWED");
        }

        const liveChatId = video.liveStreamingDetails?.activeLiveChatId;

        if (!liveChatId) {
          throw new Error("NO_LIVE_CHAT");
        }

        return {
          data: {
            liveChatId,
            videoId,
            channelId: channelId || "",
            channelTitle: video.snippet?.channelTitle,
            title: video.snippet?.title,
            thumbnailUrl: video.snippet?.thumbnails?.high?.url,
            concurrentViewers: video.liveStreamingDetails?.concurrentViewers,
            actualStartTime: video.liveStreamingDetails?.actualStartTime,
          },
          ttlMs: VIDEO_CACHE_TTL_MS,
        };
      },
      { staleWhileRevalidate: true }
    );

    // Return stream info with cache metadata
    return Response.json({
      status: "success",
      data: result.data,
      meta: {
        fromCache: result.fromCache,
        fetchedAt: result.fetchedAt,
      },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    
    // Map known errors to appropriate responses
    if (message === "VIDEO_NOT_FOUND") {
      return Response.json(
        { status: "error", code: "VIDEO_NOT_FOUND", message: "Video not found" },
        { status: 404 }
      );
    }
    
    if (message === "CHANNEL_NOT_ALLOWED") {
      return Response.json(
        { 
          status: "error", 
          code: "CHANNEL_NOT_ALLOWED", 
          message: "Only streams from @t3dotgg are allowed unless you use your own API Key (BYOK)" 
        },
        { status: 403 }
      );
    }
    
    if (message === "NO_LIVE_CHAT") {
      return Response.json(
        { status: "error", code: "NO_LIVE_CHAT", message: "This video does not have an active live chat" },
        { status: 400 }
      );
    }

    // Check for quota exceeded
    if (message.includes("quota") || message.includes("Quota")) {
      return Response.json(
        { 
          status: "error", 
          code: "QUOTA_EXCEEDED", 
          message: "API quota exceeded. Try using your own API key (BYOK) or wait until midnight Pacific time." 
        },
        { status: 429 }
      );
    }

    return Response.json(
      { status: "error", code: "INTERNAL_ERROR", message },
      { status: 500 }
    );
  }
}
