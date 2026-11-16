import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const orders = getTableData<any[]>("orders", []);
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const orders = getTableData<any[]>("orders", []);
    const newOrder = {
      id: body.id || `ORD-2026-${Math.floor(Math.random() * 900 + 100)}`,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || "",
      serviceName: body.serviceName,
      projectTitle: body.projectTitle || "Project Deliverables",
      agreedAmount: Number(body.agreedAmount || 0),
      advanceReceived: Number(body.advanceReceived || 0),
      remainingBalance: Number(body.agreedAmount || 0) - Number(body.advanceReceived || 0),
      paymentStatus: body.paymentStatus || "Pending",
      orderStatus: body.orderStatus || "Confirmed",
      assignedTo: body.assignedTo || "Technical Team",
      deliveryDate: body.deliveryDate || "",
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    saveTableData("orders", orders);
    recordActivity("CREATE", "ORDERS", `Created order ${newOrder.id} for ${newOrder.customerName} (₹${newOrder.agreedAmount})`);
    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    let orders = getTableData<any[]>("orders", []);
    const index = orders.findIndex((o) => o.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const agreed = Number(body.agreedAmount ?? orders[index].agreedAmount);
    const advance = Number(body.advanceReceived ?? orders[index].advanceReceived);
    const balance = agreed - advance;

    orders[index] = {
      ...orders[index],
      ...body,
      agreedAmount: agreed,
      advanceReceived: advance,
      remainingBalance: Math.max(0, balance),
      updatedAt: new Date().toISOString()
    };
    saveTableData("orders", orders);
    recordActivity("UPDATE", "ORDERS", `Updated order ${orders[index].id} status to ${orders[index].orderStatus}`);
    return NextResponse.json({ success: true, order: orders[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update order" }, { status: 500 });
  }
}
