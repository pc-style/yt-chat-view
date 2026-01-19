import type { NextRequest } from "next/server";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const ALLOWED_CHANNEL_ID = "UCbRP3c757lWg9M-U7TyEkXA";

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

/**
 * POST /api/youtube/connect
 * Validates video belongs to allowed channel and returns live chat ID
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
    const { videoId } = body;

    if (!videoId || typeof videoId !== "string") {
      return Response.json(
        { status: "error", code: "INVALID_VIDEO_ID", message: "Video ID is required" },
        { status: 400 }
      );
    }

    // Fetch video details including channel info
    const params = new URLSearchParams({
      part: "snippet,liveStreamingDetails",
      id: videoId,
      key: apiKey,
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);

    if (!response.ok) {
      const error = await response.json();
      return Response.json(
        { status: "error", code: "YOUTUBE_API_ERROR", message: error.error?.message || "Failed to fetch video" },
        { status: response.status }
      );
    }

    const data: VideoDetailsResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return Response.json(
        { status: "error", code: "VIDEO_NOT_FOUND", message: "Video not found" },
        { status: 404 }
      );
    }

    const video = data.items[0];
    const channelId = video.snippet?.channelId;

    // Validate channel
    if (channelId !== ALLOWED_CHANNEL_ID) {
      return Response.json(
        { 
          status: "error", 
          code: "CHANNEL_NOT_ALLOWED", 
          message: "Only streams from the authorized channel are allowed" 
        },
        { status: 403 }
      );
    }

    const liveChatId = video.liveStreamingDetails?.activeLiveChatId;

    if (!liveChatId) {
      return Response.json(
        { status: "error", code: "NO_LIVE_CHAT", message: "This video does not have an active live chat" },
        { status: 400 }
      );
    }

    // Return stream info
    return Response.json({
      status: "success",
      data: {
        liveChatId,
        videoId,
        channelId,
        channelTitle: video.snippet?.channelTitle,
        title: video.snippet?.title,
        thumbnailUrl: video.snippet?.thumbnails?.high?.url,
        concurrentViewers: video.liveStreamingDetails?.concurrentViewers,
        actualStartTime: video.liveStreamingDetails?.actualStartTime,
      }
    });

  } catch (error) {
    return Response.json(
      { status: "error", code: "INTERNAL_ERROR", message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
