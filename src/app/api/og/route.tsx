import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title") ?? "Boring Template"
  const description = searchParams.get("description")
  const type = searchParams.get("type") ?? "Article"

  // Load Inter font from stable CDN
  const interSemiBold = fetch(
    new URL(
      "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-600-normal.woff"
    )
  ).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch font")
    }
    return res.arrayBuffer()
  })

  const interRegular = fetch(
    new URL(
      "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-400-normal.woff"
    )
  ).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch font")
    }
    return res.arrayBuffer()
  })

  const [fontSemiBold, fontRegular] = await Promise.all([
    interSemiBold,
    interRegular
  ])

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
        padding: "80px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          opacity: 0.5,
          zIndex: 0
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-20%",
          height: "100%",
          width: "100%",
          backgroundImage: "radial-gradient(#da702c14, #0000 70%)",
          zIndex: 0,
          transform: "scale(1.5)"
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 10
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            background: "#0a0a0a",
            borderRadius: "6px"
          }}
        >
          <svg
            aria-hidden="true"
            fill="none"
            height="24"
            stroke="#87d3c3"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            style={{
              fill: "#87d3c3",
              color: "#87d3c3",
              strokeColor: "#87d3c3"
            }}
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m15 18-.722-3.25" />
            <path d="M2 8a10.645 10.645 0 0 0 20 0" />
            <path d="m20 15-1.726-2.05" />
            <path d="m4 15 1.726-2.05" />
            <path d="m9 18 .722-3.25" />
          </svg>
        </div>
        <span
          style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.05em"
          }}
        >
          Boring Template
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          zIndex: 10,
          maxWidth: "900px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 20,
            color: "#a1a1aa", // zinc-400
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 600
          }}
        >
          {type}
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.05em",
            color: "#fafafa",
            textWrap: "balance"
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "#d4d4d8", // zinc-300
              lineHeight: 1.4,
              maxWidth: "800px"
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 10
        }}
      >
        <div style={{ fontSize: 24, color: "#71717a" }}>
          {new URL("https://boring-template.com").hostname}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontSemiBold,
          style: "normal",
          weight: 600
        },
        {
          name: "Inter",
          data: fontRegular,
          style: "normal",
          weight: 400
        }
      ]
    }
  )
}
