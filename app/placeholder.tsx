import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        fontSize: 40,
        color: "white",
        background: "#1e40af",
        width: "100%",
        height: "100%",
        padding: 20,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L3 9l9 7 9-7-9-7z"></path>
        <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"></path>
        <path d="M12 18v-7"></path>
      </svg>
    </div>,
    {
      width: 64,
      height: 64,
    },
  )
}
