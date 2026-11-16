import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const subscribers = getTableData<any[]>("newsletter", []);
  return NextResponse.json({ success: true, subscribers });
}

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const subscribers = getTableData<any[]>("newsletter", []);
    if (subscribers.some((s) => s.email.toLowerCase() === body.email.toLowerCase())) {
      return NextResponse.json({ success: false, message: "Email already subscribed" }, { status: 400 });
    }
    const newSub = {
      id: `sub_${Date.now()}`,
      email: body.email.toLowerCase(),
      status: "Subscribed",
      source: body.source || "Website Footer",
      subscribedAt: new Date().toISOString()
    };
    subscribers.unshift(newSub);
    saveTableData("newsletter", subscribers);
    recordActivity("SUBSCRIBE", "NEWSLETTER", `New newsletter subscriber: ${newSub.email}`);
    return NextResponse.json({ success: true, subscriber: newSub });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to subscribe" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  initializeDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    let subscribers = getTableData<any[]>("newsletter", []);
    subscribers = subscribers.filter((s) => s.id !== id && s.email !== id);
    saveTableData("newsletter", subscribers);
    recordActivity("UNSUBSCRIBE", "NEWSLETTER", `Removed subscriber ${id}`);
    return NextResponse.json({ success: true, message: "Subscriber removed" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to remove subscriber" }, { status: 500 });
  }
}
