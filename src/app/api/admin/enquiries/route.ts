import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const enquiries = getTableData<any[]>("enquiries", []);
  return NextResponse.json({ success: true, enquiries });
}

export async function PUT(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    let enquiries = getTableData<any[]>("enquiries", []);
    const index = enquiries.findIndex((e) => e.enquiryId === body.id || e.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 });
    }

    const prevStatus = enquiries[index].status;
    enquiries[index] = {
      ...enquiries[index],
      ...body,
      updatedAt: new Date().toISOString()
    };
    saveTableData("enquiries", enquiries);
    recordActivity("ENQUIRY_UPDATE", "ENQUIRIES", `Updated enquiry ${body.id}: Status changed from ${prevStatus} to ${enquiries[index].status}`);
    return NextResponse.json({ success: true, enquiry: enquiries[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update enquiry" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  initializeDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });

    let enquiries = getTableData<any[]>("enquiries", []);
    enquiries = enquiries.filter((e) => e.enquiryId !== id && e.id !== id);
    saveTableData("enquiries", enquiries);
    recordActivity("DELETE", "ENQUIRIES", `Deleted enquiry record: ${id}`);
    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete enquiry" }, { status: 500 });
  }
}
