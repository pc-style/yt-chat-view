const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const THEO_CHANNEL_ID = "UCbRP3c757lWg9M-U7TyEkXA";

interface SearchResponse {
  items?: Array<{
    id?: {
      videoId?: string;
    };
  }>;
}

/**
 * GET /api/youtube/theo-live
 * Checks if Theo (@t3dotgg) is currently live streaming.
 * Returns the video ID if live, or indicates offline status.
 * Vercel caches results for 60 seconds and serves stale results while refreshing.
 */
export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return Response.json(
      { status: "error", code: "MISSING_API_KEY", message: "YouTube API key not configured" },
      { status: 500 },
    );
  }

  try {
    const params = new URLSearchParams({
      part: "snippet",
      channelId: THEO_CHANNEL_ID,
      eventType: "live",
      type: "video",
      key: apiKey,
    });
    const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error("Failed to check live status");
    }

    const data: SearchResponse = await response.json();
    const videoId = data.items?.[0]?.id?.videoId;

    return Response.json({
      status: "success",
      data: {
        isLive: Boolean(videoId),
        videoId,
      },
      meta: {
        fromCache: false,
        fetchedAt: Date.now(),
      },
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    
    return Response.json(
      { status: "error", code: "INTERNAL_ERROR", message },
      { status: 500 }
    );
  }
}
