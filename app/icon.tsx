import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  const buffer = readFileSync(join(process.cwd(), "app/icon-source.png"));
  // Convert Buffer to ArrayBuffer to satisfy Next.js/Response requirements
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px", // Rounded corners
          overflow: "hidden",
        }}
      >
        {/* @ts-ignore */}
        <img src={arrayBuffer} width="100%" height="100%" />
      </div>
    ),
    {
      ...size,
    }
  );
}
