import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const portfolio = getTableData<any[]>("portfolio", []);
  return NextResponse.json({ success: true, portfolio });
}

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const portfolio = getTableData<any[]>("portfolio", []);
    const newProject = {
      id: body.id || `proj_${Date.now()}`,
      title: body.title,
      category: body.category || "Academic Projects",
      mediaType: body.mediaType || "image",
      mediaUrl: body.mediaUrl || "",
      previewImage: body.previewImage || (body.mediaType === "image" ? body.mediaUrl : ""),
      shortDescription: body.shortDescription || "",
      fullDescription: body.fullDescription || body.shortDescription || "",
      deliverables: body.deliverables || ["Final Deliverable"],
      toolsUsed: body.toolsUsed || ["Standard Suite"],
      clientType: body.clientType || "Academic Project",
      status: body.status || "Published",
      featured: Boolean(body.featured),
      slides: body.slides || [],
      files: body.files || [],
      createdAt: new Date().toISOString()
    };
    portfolio.unshift(newProject);
    saveTableData("portfolio", portfolio);
    recordActivity("CREATE", "PORTFOLIO", `Added portfolio sample: ${newProject.title}`);
    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to add portfolio project" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    let portfolio = getTableData<any[]>("portfolio", []);
    const index = portfolio.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }
    portfolio[index] = { ...portfolio[index], ...body, updatedAt: new Date().toISOString() };
    saveTableData("portfolio", portfolio);
    recordActivity("UPDATE", "PORTFOLIO", `Updated portfolio project: ${portfolio[index].title}`);
    return NextResponse.json({ success: true, project: portfolio[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  initializeDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });

    let portfolio = getTableData<any[]>("portfolio", []);
    portfolio = portfolio.filter((p) => p.id !== id);
    saveTableData("portfolio", portfolio);
    recordActivity("DELETE", "PORTFOLIO", `Deleted portfolio project: ${id}`);
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete project" }, { status: 500 });
  }
}
