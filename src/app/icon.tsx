import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

/**
 * Dynamic favicon for yT3 Chat
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #CA0377 0%, #9147FF 100%)",
          borderRadius: "6px",
        }}
      >
        {/* Play triangle */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          style={{ marginLeft: "2px" }}
        >
          <path
            d="M8 5v14l11-7L8 5z"
            fill="white"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
