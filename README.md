# yT3 Chat

yT3 Chat makes public YouTube Live chat easier to follow and present outside YouTube's standard watch page. It provides a customizable dashboard plus compact, streamer-oriented layouts suitable for browser-source capture, with a synthetic demo that works without connecting to YouTube.

**Project status:** Experimental personal project. The interface and integration behavior may change, and there is no uptime or support commitment. This is not an official YouTube or Google product.

[Open the live demo](https://yt.pcstyle.dev) · [Report an issue](https://github.com/pc-style/yt-chat-view/issues)

## What it does

- Reads public chat from an active YouTube Live stream.
- Offers dashboard, minimal overlay, and Twitch-inspired layouts.
- Customizes themes, type, message density, badges, timestamps, and effects.
- Includes synthetic demo chat for evaluating the interface without API quota or live-chat data.
- Uses a server-side InnerTube connection first and can fall back to the YouTube Data API v3.
- Virtualizes message rendering for long chat sessions.

The public demo is an existing deployment of this repository. It is provided for evaluation, not as a guaranteed service. You can also self-host the app.

## Install locally

### Prerequisites

- [Bun](https://bun.sh/)
- A YouTube Data API v3 key only if you want to configure the official-API fallback

```bash
git clone https://github.com/pc-style/yt-chat-view.git
cd yt-chat-view
bun install
bun run dev
```

Then open `http://localhost:3000`.

For the official-API fallback, create `.env.local`:

```dotenv
YOUTUBE_API_KEY=your_youtube_api_key

# Optional shared cache and rate-limit storage
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

`KV_REST_API_URL` and `KV_REST_API_TOKEN` are also accepted for Redis-compatible Vercel KV configuration. Without Redis, the server uses process-local memory.

## Use

1. Choose a layout or start Demo Mode.
2. To view live chat, paste a public YouTube video, live, or short URL.
3. Customize the layout for viewing or capture it as a browser source in streaming software.

Supported inputs include full `youtube.com/watch`, `youtube.com/live`, and `youtu.be` URLs, or an 11-character video ID.

The app attempts its server-side InnerTube integration first. If that cannot connect, the official YouTube Data API fallback needs either the deployment's server key or a key entered in the UI. Demo Mode uses bundled fictional messages and does not contact YouTube for chat data.

## Trust, privacy, and data boundaries

Review these boundaries before entering a stream URL or API key, especially on a deployment you do not operate:

- Live-chat connections run through this app's server. The server sends the video ID to YouTube and returns public stream metadata and chat messages to the browser.
- A YouTube API key entered in the UI is stored in that browser's `localStorage`. On official-API fallback requests, it is sent to this app's server and then to Google's YouTube Data API. Do not enter a key into a deployment you do not trust; restrict keys in Google Cloud and rotate any key you believe was exposed.
- Official-API responses and pagination state are cached briefly in server memory and, when configured, Upstash Redis. Cache keys use a short non-cryptographic identifier derived from a BYOK key rather than the full key.
- Connect and message endpoints rate-limit by client IP. When Redis is configured, rate-limit counters containing the IP in their key can be stored there for the rate-limit window; otherwise they remain in server memory.
- UI preferences, including a UI-entered API key, are persisted in browser `localStorage`. The repository does not include analytics or advertising code.
- Public chat can contain names, avatars, messages, and payment-related display text supplied by YouTube. Treat captured overlays, screenshots, and recordings according to your own obligations and YouTube's terms.

Hosting providers, Google/YouTube, and an optional Upstash account have their own logging and privacy practices. This repository does not make guarantees about an operator's deployment configuration.

## Quality checks

```bash
bun run lint
bun run typecheck
bun run build
```

There is currently no automated test suite in the repository.

## Technology

[Next.js 16](https://nextjs.org/) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · TanStack Virtual · youtubei.js

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). This project is experimental, so opening an issue before a large change is recommended.

## Provenance

This repository and its Git history are the source of record for yT3 Chat. The project is maintained under the `pc-style` GitHub account and is independently developed; YouTube and Google do not sponsor or endorse it. YouTube is a trademark of Google LLC.

## License

Released under the [MIT License](LICENSE).
