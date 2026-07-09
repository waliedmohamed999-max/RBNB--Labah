import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

const publicRoot = path.resolve(process.cwd(), "..", "public_html", "public");

const contentTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

type LegacyMediaRouteProps = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(_request: NextRequest, { params }: LegacyMediaRouteProps) {
  const resolvedParams = await params;
  const cleanSegments = resolvedParams.path.filter(Boolean);
  const filePath = path.resolve(publicRoot, ...cleanSegments);

  if (!filePath.startsWith(publicRoot + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(filePath);
    const contentType = contentTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "cache-control": "public, max-age=86400",
        "content-type": contentType,
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
