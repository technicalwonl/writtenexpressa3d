import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const subscribers = getTableData<any[]>("notification_subscribers", []);

    const name = (body.name || "Student / Visitor").trim();
    const contact = (body.contact || "").trim();
    const browserEnabled = Boolean(body.browserEnabled);

    // If contact is provided, check if already exists
    if (contact) {
      const existing = subscribers.find(
        (s) => s.contact && s.contact.toLowerCase() === contact.toLowerCase()
      );
      if (existing) {
        existing.status = "Active";
        existing.browserEnabled = browserEnabled;
        existing.updatedAt = new Date().toISOString();
        saveTableData("notification_subscribers", subscribers);
        return NextResponse.json({
          success: true,
          message: "You are already subscribed to Written Expressa updates!",
          subscriber: existing,
        });
      }
    }

    const newSubscriber = {
      id: `sub_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: name || "Website Visitor",
      contact: contact || "Browser Web Push Subscriber",
      type: contact.includes("@")
        ? "Email & Browser"
        : contact.match(/\d/)
        ? "WhatsApp & Browser"
        : "Web Push Notification",
      browserEnabled: browserEnabled,
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    subscribers.unshift(newSubscriber);
    saveTableData("notification_subscribers", subscribers);

    recordActivity(
      "SUBSCRIBE",
      "NOTIFICATIONS",
      `New user notification subscription: ${newSubscriber.name} (${newSubscriber.type})`
    );

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to Written Expressa notifications!",
      subscriber: newSubscriber,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Subscription failed" },
      { status: 500 }
    );
  }
}
