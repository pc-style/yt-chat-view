/**
 * Extract video ID from various YouTube URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/live/
 */
export function extractVideoId(input: string): string | null {
  // If it's already just a video ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
    return input.trim();
  }

  try {
    const url = new URL(input);

    // Handle youtu.be short links
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1) || null;
    }

    // Handle youtube.com URLs
    if (url.hostname.includes("youtube.com")) {
      // /watch?v=VIDEO_ID
      const vParam = url.searchParams.get("v");
      if (vParam) return vParam;

      // /live/VIDEO_ID
      const liveMatch = url.pathname.match(/\/live\/([a-zA-Z0-9_-]{11})/);
      if (liveMatch) return liveMatch[1];

      // /embed/VIDEO_ID
      const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) return embedMatch[1];
    }
  } catch {
    // Not a valid URL, return null
    return null;
  }

  return null;
}




