import { NextResponse } from "next/server";
import { getTableData, saveTableData, initializeDatabase } from "@/lib/db";

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const events = getTableData<any[]>("analytics_events", []);

    const newEvent = {
      id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      eventType: body.eventType || "page_view",
      service: body.service || null,
      package: body.package || null,
      price: body.price || null,
      path: body.path || null,
      referrer: body.referrer || null,
    };

    events.unshift(newEvent);
    // Retain recent 2,000 events
    saveTableData("analytics_events", events.slice(0, 2000));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  initializeDatabase();
  const events = getTableData<any[]>("analytics_events", []);
  return NextResponse.json({ success: true, count: events.length, events: events.slice(0, 100) });
}
