import { contactConfig } from "@/config/contact";

export interface WhatsAppOrderParams {
  serviceName: string;
  packageName?: string;
  price?: string | number;
  quantity?: number | string;
  notes?: string;
  options?: string;
  sourceUrl?: string;
}

export const WHATSAPP_NUMBER_RAW = "919492801206";
export const WHATSAPP_DISPLAY = "+91 9492801206";
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER_RAW}`;

/**
 * Builds a clean, professional, personalized WhatsApp order text.
 */
export function generateWhatsAppMessage(params: WhatsAppOrderParams): string {
  const parts: string[] = ["Hello Written Expressa! 👋\nI would like to place an order."];

  parts.push(`Service: ${params.serviceName}`);

  if (params.packageName) {
    parts.push(`Package: ${params.packageName}`);
  }

  if (params.price !== undefined && params.price !== null && params.price !== "") {
    parts.push(`Price: ${typeof params.price === "number" ? `₹${params.price}` : params.price}`);
  }

  if (params.quantity) {
    parts.push(`Quantity: ${params.quantity}`);
  }

  if (params.options) {
    parts.push(`Options: ${params.options}`);
  }

  if (params.notes && params.notes.trim().length > 0) {
    parts.push(`Requirements: ${params.notes.trim()}`);
  }

  parts.push("\nPlease share the next steps and requirements.\nThank you!");

  return parts.join("\n");
}

/**
 * Generates the full WhatsApp URL with encoded message.
 */
export function buildWhatsAppOrderUrl(params: WhatsAppOrderParams): string {
  const message = generateWhatsAppMessage(params);
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

/**
 * Quick consultation / general enquiry message
 */
export function buildWhatsAppGeneralUrl(context?: string): string {
  const msg = context
    ? `Hello Written Expressa! 👋\nI am reaching out regarding: ${context}.\nPlease share more information.\nThank you!`
    : "Hello Written Expressa! 👋\nI would like to enquire about your creative and academic services.\nPlease guide me regarding the consultation process.\nThank you!";
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(msg)}`;
}
