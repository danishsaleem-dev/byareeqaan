import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded default share card used for the homepage and any route without its own.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #2a163a 0%, #4c1d95 55%, #6d28d9 100%)",
          color: "#faf6f1",
          position: "relative",
        }}
      >
        {/* ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: "rgba(139,92,246,0.45)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            right: -100,
            width: 460,
            height: 460,
            borderRadius: 460,
            background: "rgba(192,160,106,0.35)",
            filter: "blur(40px)",
          }}
        />

        <div
          style={{
            fontSize: 30,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "#d8c39a",
            display: "flex",
          }}
        >
          Fashion Accessories
        </div>
        <div
          style={{
            fontSize: 132,
            fontWeight: 600,
            marginTop: 18,
            display: "flex",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            fontSize: 40,
            marginTop: 8,
            color: "rgba(250,246,241,0.85)",
            display: "flex",
          }}
        >
          {site.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
