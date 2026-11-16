import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const blogs = getTableData<any[]>("blogs", []);
  return NextResponse.json({ success: true, blogs });
}

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const blogs = getTableData<any[]>("blogs", []);

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newBlog = {
      id: body.id || `blog_${Date.now()}`,
      slug,
      title: body.title,
      excerpt: body.excerpt || "",
      content: body.content || "",
      coverImage: body.coverImage || "/hero-sequence/frame_075.webp",
      category: body.category || "Academic Solutions",
      tags: body.tags || ["Academic", "Guide"],
      author: body.author || "Written Expressa Editorial",
      status: body.status || "Published",
      publishedAt: body.publishedAt || new Date().toISOString(),
      seoTitle: body.seoTitle || `${body.title} | Written Expressa`,
      metaDescription: body.metaDescription || body.excerpt || "",
    };

    blogs.unshift(newBlog);
    saveTableData("blogs", blogs);
    recordActivity("CREATE", "BLOG", `Published article: ${newBlog.title}`);
    return NextResponse.json({ success: true, blog: newBlog });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to publish article" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    let blogs = getTableData<any[]>("blogs", []);
    const idx = blogs.findIndex((b) => b.id === body.id || b.slug === body.slug);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
    }
    blogs[idx] = { ...blogs[idx], ...body, updatedAt: new Date().toISOString() };
    saveTableData("blogs", blogs);
    recordActivity("UPDATE", "BLOG", `Updated article: ${blogs[idx].title}`);
    return NextResponse.json({ success: true, blog: blogs[idx] });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  initializeDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

  let blogs = getTableData<any[]>("blogs", []);
  const initialLen = blogs.length;
  blogs = blogs.filter((b) => b.id !== id);
  if (blogs.length === initialLen) {
    return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
  }
  saveTableData("blogs", blogs);
  recordActivity("DELETE", "BLOG", `Deleted article ID: ${id}`);
  return NextResponse.json({ success: true });
}
