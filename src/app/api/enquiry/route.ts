import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { contactConfig } from "@/config/contact";

interface EnquiryPayload {
  fullName: string;
  email: string;
  whatsapp: string;
  service: string;
  description: string;
  budget: string;
  attachmentNote?: string;
  honeypot?: string; // spam protection
}

export async function POST(request: Request) {
  try {
    const body: EnquiryPayload = await request.json();

    // Spam honeypot check
    if (body.honeypot && body.honeypot.trim().length > 0) {
      return NextResponse.json({ success: false, message: "Spam detected." }, { status: 400 });
    }

    const errors: Record<string, string> = {};

    if (!body.fullName || body.fullName.trim().length < 2) {
      errors.fullName = "Please provide your full name (minimum 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !emailRegex.test(body.email.trim())) {
      errors.email = "Please provide a valid email address.";
    }

    const cleanPhone = (body.whatsapp || "").replace(/[^0-9+]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.whatsapp = "Please provide a valid WhatsApp number (minimum 10 digits).";
    }

    if (!body.service || body.service.trim().length === 0) {
      errors.service = "Please select a required service.";
    }

    if (!body.description || body.description.trim().length < 10) {
      errors.description = "Please provide a project description of at least 10 characters.";
    }

    if (!body.budget || body.budget.trim().length === 0) {
      errors.budget = "Please select an estimated budget range.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields accurately.",
          errors,
        },
        { status: 422 }
      );
    }

    const enquiryId = `WE-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const timestamp = new Date().toISOString();

    const newEnquiry = {
      enquiryId,
      timestamp,
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      whatsapp: cleanPhone,
      service: body.service.trim(),
      description: body.description.trim(),
      budget: body.budget.trim(),
      attachmentNote: body.attachmentNote?.trim() || null,
      status: "New",
    };

    // Store in data/enquiries.json
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const filePath = path.join(dataDir, "enquiries.json");
      let existing: unknown[] = [];
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, "utf-8");
          existing = JSON.parse(content);
        } catch {
          existing = [];
        }
      }
      existing.unshift(newEnquiry);
      fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8");
    } catch (fsError) {
      console.error("Enquiry storage warning:", fsError);
      // We still return success to the user so their experience is smooth
    }

    // Format WhatsApp continue message
    const waText = encodeURIComponent(
      `Hello Written Expressa team!\n\n` +
      `I just submitted a project enquiry.\n` +
      `*Enquiry ID:* ${enquiryId}\n` +
      `*Name:* ${body.fullName.trim()}\n` +
      `*Service:* ${body.service.trim()}\n` +
      `*Budget:* ${body.budget.trim()}\n` +
      `*Description:* ${body.description.trim()}\n\n` +
      `Looking forward to discussing next steps!`
    );

    const whatsappUrl = `https://wa.me/${contactConfig.whatsappNumberRaw}?text=${waText}`;

    return NextResponse.json({
      success: true,
      message: "Your project enquiry has been received successfully! Our team will review your requirements and reach out promptly.",
      enquiryId,
      whatsappUrl,
    });
  } catch (error) {
    console.error("Error processing enquiry:", error);
    return NextResponse.json(
      { success: false, message: "A server error occurred while submitting your enquiry. Please try again or message us directly on WhatsApp." },
      { status: 500 }
    );
  }
}
