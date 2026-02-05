import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "yT3 Chat - YouTube Live Chat Viewer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Dynamic OG Image for yT3 Chat
 * Generates a sleek preview image for social media sharing
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(202,3,119,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(145,71,255,0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            zIndex: 10,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #CA0377 0%, #9147FF 100%)",
              boxShadow: "0 20px 60px rgba(202,3,119,0.4)",
            }}
          >
            {/* YouTube-style play triangle */}
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginLeft: "4px" }}
            >
              <path
                d="M8 5v14l11-7L8 5z"
                fill="white"
              />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "72px",
                fontWeight: 900,
                color: "white",
                letterSpacing: "-2px",
              }}
            >
              yT3
            </span>
            <span
              style={{
                fontSize: "72px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "-2px",
              }}
            >
              Chat
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.6)",
              fontWeight: 500,
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            YouTube Live Chat Viewer for Streamers
          </div>

          {/* Feature pills */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {["OBS Overlay", "Customizable", "Zero API Cost Demo"].map((feature) => (
              <div
                key={feature}
                style={{
                  padding: "12px 24px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom attribution */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "rgba(255,255,255,0.4)",
            fontSize: "16px",
          }}
        >
          <span>Built for</span>
          <span style={{ color: "#CA0377", fontWeight: 700 }}>@t3dotgg</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
