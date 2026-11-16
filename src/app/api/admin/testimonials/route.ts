import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const testimonials = getTableData<any[]>("testimonials", []);
  return NextResponse.json({ success: true, testimonials });
}

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const testimonials = getTableData<any[]>("testimonials", []);
    const newTestimonial = {
      id: body.id || `tst_${Date.now()}`,
      customerName: body.customerName,
      servicePurchased: body.servicePurchased || "PowerPoint Presentations",
      rating: Number(body.rating || 5),
      reviewText: body.reviewText,
      status: body.status || "Pending",
      featured: Boolean(body.featured),
      consentVerified: Boolean(body.consentVerified),
      createdAt: new Date().toISOString()
    };
    testimonials.unshift(newTestimonial);
    saveTableData("testimonials", testimonials);
    recordActivity("CREATE", "TESTIMONIALS", `Added review submission from ${newTestimonial.customerName}`);
    return NextResponse.json({ success: true, testimonial: newTestimonial });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create testimonial" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    let testimonials = getTableData<any[]>("testimonials", []);
    const index = testimonials.findIndex((t) => t.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
    }

    const prevStatus = testimonials[index].status;
    testimonials[index] = {
      ...testimonials[index],
      ...body,
      updatedAt: new Date().toISOString()
    };
    saveTableData("testimonials", testimonials);
    recordActivity("TESTIMONIAL_UPDATE", "TESTIMONIALS", `Review ${body.id} status changed from ${prevStatus} to ${testimonials[index].status}`);
    return NextResponse.json({ success: true, testimonial: testimonials[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  initializeDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });

    let testimonials = getTableData<any[]>("testimonials", []);
    testimonials = testimonials.filter((t) => t.id !== id);
    saveTableData("testimonials", testimonials);
    recordActivity("DELETE", "TESTIMONIALS", `Deleted review ${id}`);
    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete testimonial" }, { status: 500 });
  }
}
