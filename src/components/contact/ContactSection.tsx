"use client";

import { useState } from "react";
import { contactConfig } from "@/config/contact";
import {
  MessageSquare,
  Mail,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";
import { buildWhatsAppOrderUrl, buildWhatsAppGeneralUrl, WHATSAPP_DISPLAY, WHATSAPP_BASE_URL } from "@/lib/whatsapp";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function LinkedinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

export function ContactSection() {
  const [selectedService, setSelectedService] = useState(contactConfig.serviceOptions[0]);
  const [clientNotes, setClientNotes] = useState("");
  const [clientName, setClientName] = useState("");

  const handleQuickWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildWhatsAppOrderUrl({
      serviceName: selectedService,
      notes: clientNotes,
      options: clientName ? `Client: ${clientName}` : undefined,
    });

    try {
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "whatsapp_click",
          service: selectedService,
          context: "quick_contact_section",
        }),
      }).catch(() => {});
    } catch {}

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const directWhatsAppUrl = buildWhatsAppGeneralUrl("Starting a new project with Written Expressa");
  const businessEmailMailto = `mailto:writtenexpressa@gmail.com?subject=Project%20Enquiry%20-%20Written%20Expressa&body=Hello%20Written%20Expressa%20Team%2C%0A%0AI%20would%20like%20to%20discuss%20a%20project%3A%0A%0AService%3A%20${encodeURIComponent(selectedService)}%0ARequirements%3A%20%0ATimeline%3A%20%0A%0AThank%20you!`;
  const supportEmailMailto = `mailto:support@writtenexpressa.in?subject=Support%20Request%20-%20Written%20Expressa&body=Hello%20Support%20Team%2C%0A%0AI%20need%20assistance%20regarding%20my%20order%2Fservice%3A%0A%0AOrder%20ID%20(if%20any)%3A%20%0ADetails%3A%20%0A%0AThank%20you!`;

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-white border-t border-zinc-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wider uppercase mb-4">
            08 • Direct Contact & Ordering
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Have an Idea? <br />
            <span className="text-[#C8102E]">Let's Make It Happen.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            No complicated forms or waiting queues. Connect directly with our team on WhatsApp for an instant consultation, transparent quotation, and clear delivery timeline.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span>START YOUR PROJECT ON WHATSAPP</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </a>

            <a
              href={businessEmailMailto}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all"
            >
              <Mail className="w-5 h-5 text-red-500" />
              <span>EMAIL OUR TEAM</span>
            </a>
          </div>
        </div>

        {/* Contact Information & Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Business Channels (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 sm:p-7 rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                Fastest Response
              </span>
              <h3 className="text-xl font-bold font-serif text-zinc-900 mt-3">
                Official WhatsApp Ordering Desk
              </h3>
              <p className="text-xs text-zinc-600 mt-1">
                Chat directly with our project leads. Share project briefs, slide references, and record formats in seconds.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-200/60">
                <div>
                  <div className="text-lg font-mono font-bold text-zinc-900">{WHATSAPP_DISPLAY}</div>
                  <div className="text-[11px] text-zinc-500">Typical response time: Under 15 minutes</div>
                </div>
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors self-start sm:self-auto shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>

            {/* Email Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Business Inquiries */}
              <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-[#C8102E] flex items-center justify-center mb-3">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Official Business Email
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 mt-0.5">
                    writtenexpressa@gmail.com
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    For project briefs, formal RFPs, seminar decks, and custom inquiries.
                  </p>
                </div>
                <a
                  href={businessEmailMailto}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8102E] hover:underline"
                >
                  <span>Compose Business Email</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              {/* Support & Deliveries */}
              <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Order Support & Status
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 mt-0.5">
                    support@writtenexpressa.in
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    For order revision requests, file delivery checks, and technical support.
                  </p>
                </div>
                <a
                  href={supportEmailMailto}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline"
                >
                  <span>Contact Support Desk</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Social, Hours & Location */}
            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#C8102E]" />
                  <span>Business Hours</span>
                </div>
                <p className="text-[11px] text-zinc-600">
                  Monday – Saturday<br />9:00 AM – 9:00 PM IST
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C8102E]" />
                  <span>Service Area</span>
                </div>
                <p className="text-[11px] text-zinc-600">
                  India — Serving Students & Scholars Pan-India.
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-zinc-900 mb-1.5">
                  Social Channels
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={contactConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white border border-zinc-200 text-pink-600 hover:bg-pink-50 transition-colors"
                    title="Instagram @written_expressa"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={contactConfig.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white border border-zinc-200 text-blue-700 hover:bg-blue-50 transition-colors"
                    title="LinkedIn Written Expressa"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={contactConfig.whatsappChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white border border-zinc-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
                    title="Official WhatsApp Channel"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant WhatsApp Message Builder (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 mb-4">
              <span className="p-1.5 rounded-lg bg-[#C8102E]/10 text-[#C8102E]">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold font-serif text-zinc-900">
                  Quick WhatsApp Order Builder
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Choose your requirement & pre-generate your WhatsApp order instantly
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickWhatsApp} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-900 mb-1.5 text-xs sm:text-xs">
                  Select Desired Service *
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full p-3 sm:p-3.5 rounded-xl border-2 border-zinc-200 bg-white text-zinc-950 font-bold text-base sm:text-xs focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/10 cursor-pointer shadow-xs transition-colors"
                  style={{ color: "#09090b" }}
                >
                  {contactConfig.serviceOptions.map((opt) => (
                    <option key={opt} value={opt} className="text-zinc-950 bg-white font-semibold py-1.5" style={{ color: "#09090b" }}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1.5 text-xs sm:text-xs">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-3 sm:p-3.5 rounded-xl border-2 border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-500 font-bold text-base sm:text-xs focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/10 shadow-xs transition-colors"
                  style={{ color: "#09090b" }}
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-900 mb-1.5 text-xs sm:text-xs">
                  Brief Project Notes or Deadline (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Need 25 slides by Friday, biomedical topic"
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full p-3 sm:p-3.5 rounded-xl border-2 border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-500 font-bold text-base sm:text-xs focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/10 shadow-xs transition-colors"
                  style={{ color: "#09090b" }}
                />
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/60 text-[11px] text-zinc-500">
                Clicking below will open WhatsApp with your pre-formatted order text directly addressed to <strong>+91 9492801206</strong>.
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Launch WhatsApp Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
