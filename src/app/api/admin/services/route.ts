import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const services = getTableData<any[]>("services", []);
  return NextResponse.json({ success: true, services });
}

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const services = getTableData<any[]>("services", []);
    const newService = {
      id: body.id || `srv_${Date.now()}`,
      title: body.title,
      category: body.category || "Academic Solutions",
      status: body.status || "Published",
      featured: Boolean(body.featured),
      description: body.description,
      ctaText: body.ctaText || "GET STARTED",
      ctaActionId: body.ctaActionId || "contact",
      threeDObject: body.threeDObject || "Academic Project",
      highlights: body.highlights || [],
      pricingModel: body.pricingModel || "Fixed Tier Pricing",
      packages: body.packages || [],
      updatedAt: new Date().toISOString()
    };
    services.push(newService);
    saveTableData("services", services);
    recordActivity("CREATE", "SERVICES", `Added new service: ${newService.title}`);
    return NextResponse.json({ success: true, service: newService });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    let services = getTableData<any[]>("services", []);
    const index = services.findIndex((s) => s.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
    }
    const oldTitle = services[index].title;
    services[index] = {
      ...services[index],
      ...body,
      updatedAt: new Date().toISOString()
    };
    saveTableData("services", services);
    recordActivity("UPDATE", "SERVICES", `Updated service: ${oldTitle} -> ${services[index].title}`);
    return NextResponse.json({ success: true, service: services[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  initializeDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing service ID" }, { status: 400 });

    let services = getTableData<any[]>("services", []);
    const target = services.find((s) => s.id === id);
    services = services.filter((s) => s.id !== id);
    saveTableData("services", services);
    recordActivity("DELETE", "SERVICES", `Deleted service: ${target?.title || id}`);
    return NextResponse.json({ success: true, message: "Service deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete service" }, { status: 500 });
  }
}
