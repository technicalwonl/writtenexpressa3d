import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const faqs = getTableData<any[]>("faqs", []);
  return NextResponse.json({ success: true, faqs });
}

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const faqs = getTableData<any[]>("faqs", []);
    const newFaq = {
      id: body.id || `faq_${Date.now()}`,
      question: body.question,
      answer: body.answer,
      category: body.category || "General Information",
      order: body.order || faqs.length + 1,
      published: body.published ?? true,
    };
    faqs.push(newFaq);
    saveTableData("faqs", faqs);
    recordActivity("CREATE", "FAQS", `Added FAQ: ${newFaq.question}`);
    return NextResponse.json({ success: true, faq: newFaq });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to add FAQ" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    let faqs = getTableData<any[]>("faqs", []);
    const idx = faqs.findIndex((f) => f.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 });
    }
    faqs[idx] = { ...faqs[idx], ...body };
    saveTableData("faqs", faqs);
    recordActivity("UPDATE", "FAQS", `Updated FAQ: ${faqs[idx].question}`);
    return NextResponse.json({ success: true, faq: faqs[idx] });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  initializeDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

  let faqs = getTableData<any[]>("faqs", []);
  const initialLen = faqs.length;
  faqs = faqs.filter((f) => f.id !== id);
  if (faqs.length === initialLen) {
    return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 });
  }
  saveTableData("faqs", faqs);
  recordActivity("DELETE", "FAQS", `Deleted FAQ ID: ${id}`);
  return NextResponse.json({ success: true });
}
