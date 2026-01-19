import type { NextRequest } from "next/server";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

interface LiveChatMessage {
  id: string;
  snippet: {
    type: string;
    publishedAt: string;
    displayMessage?: string;
    textMessageDetails?: { messageText: string };
    superChatDetails?: {
      userComment?: string;
      amountDisplayString?: string;
      tier?: number;
    };
    superStickerDetails?: {
      amountDisplayString?: string;
      tier?: number;
      superStickerMetadata?: { altText?: string };
    };
  };
  authorDetails: {
    channelId: string;
    displayName: string;
    profileImageUrl: string;
    isChatOwner: boolean;
    isChatModerator: boolean;
    isChatSponsor: boolean;
    isVerified: boolean;
  };
}

interface LiveChatResponse {
  nextPageToken?: string;
  pollingIntervalMillis: number;
  offlineAt?: string;
  items: LiveChatMessage[];
}

/**
 * POST /api/youtube/messages
 * Fetches chat messages for a live chat ID
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
    const { liveChatId, pageToken } = body;

    if (!liveChatId || typeof liveChatId !== "string") {
      return Response.json(
        { status: "error", code: "INVALID_CHAT_ID", message: "Live chat ID is required" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      part: "snippet,authorDetails",
      liveChatId,
      maxResults: "200",
      key: apiKey,
    });

    if (pageToken) {
      params.set("pageToken", pageToken);
    }

    const response = await fetch(`${YOUTUBE_API_BASE}/liveChat/messages?${params}`);

    if (!response.ok) {
      const error = await response.json();
      return Response.json(
        { status: "error", code: "YOUTUBE_API_ERROR", message: error.error?.message || "Failed to fetch messages" },
        { status: response.status }
      );
    }

    const data: LiveChatResponse = await response.json();

    return Response.json({
      status: "success",
      data: {
        items: data.items,
        nextPageToken: data.nextPageToken,
        pollingIntervalMillis: data.pollingIntervalMillis,
        offlineAt: data.offlineAt,
      }
    });

  } catch (error) {
    return Response.json(
      { status: "error", code: "INTERNAL_ERROR", message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
