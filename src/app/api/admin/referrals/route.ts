import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const referrals = getTableData<any[]>("referrals", []);
  return NextResponse.json({ success: true, referrals });
}

export async function POST(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    const referrals = getTableData<any[]>("referrals", []);
    const newRef = {
      id: `ref_${Date.now()}`,
      code: body.code.toUpperCase(),
      referrerName: body.referrerName,
      email: body.email,
      visits: 0,
      enquiries: 0,
      converted: 0,
      rewardEarned: 0,
      status: "Active",
      createdAt: new Date().toISOString()
    };
    referrals.push(newRef);
    saveTableData("referrals", referrals);
    recordActivity("CREATE", "REFERRALS", `Created referral code ${newRef.code} for ${newRef.referrerName}`);
    return NextResponse.json({ success: true, referral: newRef });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create referral" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  initializeDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });

    let referrals = getTableData<any[]>("referrals", []);
    referrals = referrals.filter((r) => r.id !== id);
    saveTableData("referrals", referrals);
    recordActivity("DELETE", "REFERRALS", `Deleted referral code: ${id}`);
    return NextResponse.json({ success: true, message: "Referral deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete referral" }, { status: 500 });
  }
}
