import { getCacheKey, getOrFetch } from "@/lib/cache";

const THEO_CHANNEL_ID = "UCbRP3c757lWg9M-U7TyEkXA";
const THEO_LIVE_URL = "https://www.youtube.com/@t3dotgg/live";

// Cache for 120 seconds so most visits avoid a YouTube request entirely.
const LIVE_STATUS_CACHE_TTL_MS = 120 * 1000;

interface TheoLiveData {
  isLive: boolean;
  videoId?: string;
}

/**
 * GET /api/youtube/theo-live
 * Checks if Theo (@t3dotgg) is currently live streaming.
 * Returns the video ID if live, or indicates offline status.
 * Results are cached for 120 seconds.
 */
export async function GET() {
  try {
    const cacheKey = getCacheKey("connect", `theo-live:${THEO_CHANNEL_ID}`, "server");

    const result = await getOrFetch<TheoLiveData>(
      cacheKey,
      async () => {
        const response = await fetch(THEO_LIVE_URL, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; yt-chat-view/1.0)",
          },
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
          throw new Error("Failed to check live status");
        }

        const html = await response.text();
        const videoId = html.match(
          /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})"/,
        )?.[1];

        return {
          data: {
            isLive: Boolean(videoId),
            videoId,
          },
          ttlMs: LIVE_STATUS_CACHE_TTL_MS,
        };
      },
      { staleWhileRevalidate: true }
    );

    return Response.json({
      status: "success",
      data: result.data,
      meta: {
        fromCache: result.fromCache,
        fetchedAt: result.fetchedAt,
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
