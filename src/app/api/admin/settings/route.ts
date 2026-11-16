import { NextResponse } from "next/server";
import { getTableData, saveTableData, recordActivity, initializeDatabase } from "@/lib/db";

export async function GET() {
  initializeDatabase();
  const siteSettings = getTableData<any>("site_settings", {});
  const seoSettings = getTableData<any>("seo_settings", {});
  return NextResponse.json({ success: true, siteSettings, seoSettings });
}

export async function PUT(req: Request) {
  initializeDatabase();
  try {
    const body = await req.json();
    if (body.type === "seo") {
      const current = getTableData<any>("seo_settings", {});
      const updated = { ...current, ...body.data, updatedAt: new Date().toISOString() };
      saveTableData("seo_settings", updated);
      recordActivity("UPDATE", "SETTINGS", "Updated SEO and meta tag configurations");
      return NextResponse.json({ success: true, seoSettings: updated });
    } else {
      const current = getTableData<any>("site_settings", {});
      const updated = { ...current, ...body.data, updatedAt: new Date().toISOString() };
      saveTableData("site_settings", updated);
      recordActivity("UPDATE", "SETTINGS", "Updated global site settings");
      return NextResponse.json({ success: true, siteSettings: updated });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update settings" }, { status: 500 });
  }
}
