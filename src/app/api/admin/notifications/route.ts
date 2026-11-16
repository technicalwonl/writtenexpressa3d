import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  try {
    const subscribers = getTableData<any[]>("notification_subscribers", []);
    const broadcasts = getTableData<any[]>("broadcast_notifications", []);
    const enquiries = getTableData<any[]>("enquiries", []);
    const orders = getTableData<any[]>("orders", []);
    const testimonials = getTableData<any[]>("testimonials", []);

    const internalAlerts: any[] = [];

    enquiries.forEach((e: any) => {
      if (e.status === "New" || e.status === "Pending Review") {
        internalAlerts.push({
          id: `notif_enq_${e.id || e.enquiryId}`,
          type: "enquiry",
          title: `New Client Enquiry: ${e.fullName}`,
          description: `Interest in ${e.serviceInterest || "academic services"}`,
          time: e.createdAt || new Date().toISOString(),
          href: "/admin/enquiries",
          read: false,
        });
      }
    });

    orders.forEach((o: any) => {
      if (Number(o.remainingBalance || 0) > 0) {
        internalAlerts.push({
          id: `notif_ord_${o.id}`,
          type: "order",
          title: `Pending Balance for Order ${o.id}`,
          description: `${o.customerName} has an outstanding balance of ₹${o.remainingBalance}`,
          time: o.createdAt || new Date().toISOString(),
          href: "/admin/orders",
          read: false,
        });
      }
    });

    testimonials.forEach((t: any) => {
      if (t.status === "Pending") {
        internalAlerts.push({
          id: `notif_tst_${t.id}`,
          type: "testimonial",
          title: `New Review Pending Moderation`,
          description: `${t.customerName} submitted a review for ${t.servicePurchased}`,
          time: t.createdAt || new Date().toISOString(),
          href: "/admin/testimonials",
          read: false,
        });
      }
    });

    return NextResponse.json({
      success: true,
      subscribers,
      broadcasts,
      internalAlerts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const broadcasts = getTableData<any[]>("broadcast_notifications", []);
    const subscribers = getTableData<any[]>("notification_subscribers", []);

    const activeSubscribers = subscribers.filter((s) => s.status === "Active");

    const newBroadcast = {
      id: `bc_${Date.now()}`,
      title: body.title,
      message: body.message,
      category: body.category || "Announcement",
      actionUrl: body.actionUrl || "/services",
      actionText: body.actionText || "View Details",
      targetAudience: body.targetAudience || "All Subscribed Users",
      sentAt: new Date().toISOString(),
      recipientCount: Math.max(activeSubscribers.length, 1),
      status: "Delivered",
    };

    broadcasts.unshift(newBroadcast);
    saveTableData("broadcast_notifications", broadcasts);

    recordActivity(
      "BROADCAST",
      "NOTIFICATIONS",
      `Sent broadcast notification: "${newBroadcast.title}" to ${newBroadcast.recipientCount} subscriber(s)`
    );

    return NextResponse.json({
      success: true,
      message: "Custom broadcast sent to subscribed users successfully!",
      broadcast: newBroadcast,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to send broadcast notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  initializeDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") || "broadcast";

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });
    }

    if (type === "subscriber") {
      let subscribers = getTableData<any[]>("notification_subscribers", []);
      subscribers = subscribers.filter((s) => s.id !== id);
      saveTableData("notification_subscribers", subscribers);
      recordActivity("DELETE", "NOTIFICATIONS", `Removed notification subscriber ${id}`);
      return NextResponse.json({ success: true, message: "Subscriber removed" });
    } else {
      let broadcasts = getTableData<any[]>("broadcast_notifications", []);
      broadcasts = broadcasts.filter((b) => b.id !== id);
      saveTableData("broadcast_notifications", broadcasts);
      recordActivity("DELETE", "NOTIFICATIONS", `Deleted broadcast notification ${id}`);
      return NextResponse.json({ success: true, message: "Broadcast deleted" });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete item" },
      { status: 500 }
    );
  }
}
