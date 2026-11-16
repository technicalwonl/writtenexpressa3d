"use client";

import React, { useState } from "react";
import { MessageSquare, Copy, Check, ExternalLink, X } from "lucide-react";
import { WhatsAppOrderParams, generateWhatsAppMessage, buildWhatsAppOrderUrl, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderParams: WhatsAppOrderParams;
}

export function WhatsAppOrderModal({ isOpen, onClose, orderParams }: WhatsAppOrderModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawMessage = generateWhatsAppMessage(orderParams);
  const waUrl = buildWhatsAppOrderUrl(orderParams);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenWhatsApp = () => {
    // Track order-intent event
    try {
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "whatsapp_click",
          service: orderParams.serviceName,
          package: orderParams.packageName,
          price: orderParams.price,
        }),
      }).catch(() => {});
    } catch {}

    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-zinc-200 text-zinc-900 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Instant WhatsApp Order
            </span>
            <h3 className="text-lg font-bold font-serif text-zinc-900 mt-0.5">
              Confirm Your Order
            </h3>
          </div>
        </div>

        {/* Order Summary Strip */}
        <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 mb-4 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-zinc-500">Service:</span>
            <span className="font-bold text-zinc-900">{orderParams.serviceName}</span>
          </div>
          {orderParams.packageName && (
            <div className="flex justify-between">
              <span className="text-zinc-500">Package:</span>
              <span className="font-semibold text-zinc-800">{orderParams.packageName}</span>
            </div>
          )}
          {orderParams.price && (
            <div className="flex justify-between">
              <span className="text-zinc-500">Pricing:</span>
              <span className="font-extrabold text-[#C8102E]">{orderParams.price}</span>
            </div>
          )}
          <div className="flex justify-between pt-1 border-t border-zinc-200/60 text-[11px] text-zinc-400">
            <span>Official Number:</span>
            <span className="font-mono text-zinc-700">{WHATSAPP_DISPLAY}</span>
          </div>
        </div>

        {/* Pre-filled Message Preview */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Pre-filled Message Preview:
          </label>
          <div className="p-3 bg-zinc-100/80 rounded-xl text-xs font-mono text-zinc-700 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed border border-zinc-200/60">
            {rawMessage}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open in WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Message Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span>Copy Message Manually</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[10px] text-center text-zinc-400 mt-3 leading-tight">
          Note: WhatsApp opens with this message ready. You can review and adjust any requirements before sending.
        </p>
      </div>
    </div>
  );
}
