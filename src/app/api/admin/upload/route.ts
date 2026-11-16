import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ALLOWED_EXTENSIONS = [
  "pdf", "doc", "docx", "ppt", "pptx", "pptm", "ppsx", "xls", "xlsx", "txt",
  "jpg", "jpeg", "png", "webp", "gif", "heic", "heif", "svg",
  "mp4", "webm", "mov", "zip"
];

function getMediaType(ext: string): "image" | "video" | "pdf" | "presentation" | "document" | "spreadsheet" | "archive" | "other" {
  const e = ext.toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "gif", "heic", "heif", "svg"].includes(e)) return "image";
  if (["mp4", "webm", "mov"].includes(e)) return "video";
  if (["pdf"].includes(e)) return "pdf";
  if (["ppt", "pptx", "pptm", "ppsx"].includes(e)) return "presentation";
  if (["doc", "docx", "txt"].includes(e)) return "document";
  if (["xls", "xlsx"].includes(e)) return "spreadsheet";
  if (["zip"].includes(e)) return "archive";
  return "other";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const filename = file.name;
    const ext = filename.split(".").pop()?.toLowerCase() || "";

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({
        success: false,
        message: `File type .${ext} is not supported. Supported: PDF, DOCX, PPTX, XLSX, JPG, PNG, WebP, MP4, ZIP, etc.`,
      }, { status: 400 });
    }

    // Limit to 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({
        success: false,
        message: "File exceeds 50MB size limit.",
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeBaseName = filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const uniqueName = `${safeBaseName}_${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;
    const mediaType = getMediaType(ext);

    return NextResponse.json({
      success: true,
      file: {
        url: fileUrl,
        filename: uniqueName,
        originalName: filename,
        mediaType,
        size: file.size,
        ext,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
