import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image storage not configured (BLOB_READ_WRITE_TOKEN missing)" },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  // Client-declared type is a first cheap filter; the real check is sharp decode.
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  // Decode + re-encode through sharp. This validates the bytes are a real raster
  // image (rejects spoofed SVG/HTML/scripts) and strips any embedded metadata or
  // payload by producing a fresh WebP. SVG is intentionally not decoded as-is.
  const input = Buffer.from(await file.arrayBuffer());
  let output: Buffer;
  try {
    output = await sharp(input, { failOn: "error" })
      .rotate()
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "Invalid or unreadable image" },
      { status: 400 }
    );
  }

  const key = `products/${Date.now()}-${randomBytes(8).toString("hex")}.webp`;
  const blob = await put(key, output, {
    access: "public",
    contentType: "image/webp",
  });

  return NextResponse.json({ url: blob.url });
}
