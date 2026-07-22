import { ImageResponse } from "next/og";
import { APP_CONFIG } from "@/lib/config/app";

export const runtime = "edge";
export const alt = `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050816",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(109,91,255,0.12)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(6,182,212,0.08)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {APP_CONFIG.name}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.45)",
            marginTop: 20,
            letterSpacing: "-0.01em",
          }}
        >
          {APP_CONFIG.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
