const THEO_LIVE_URL = "https://www.youtube.com/@t3dotgg/live";

/**
 * GET /api/youtube/theo-live
 * Checks if Theo (@t3dotgg) is currently live streaming.
 * Returns the video ID if live, or indicates offline status.
 * Vercel caches results for 60 seconds and serves stale results while refreshing.
 */
export async function GET() {
  try {
    const response = await fetch(THEO_LIVE_URL, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error("Failed to check live status");
    }

    const html = await response.text();
    const videoId = html.match(
      /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})"/,
    )?.[1];

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
