"use client";

import { useState, useEffect } from "react";
import { detailedServices } from "@/config/services";
import { pricingConfig, ServicePricingConfig } from "@/config/pricing";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { buildWhatsAppOrderUrl, buildWhatsAppGeneralUrl } from "@/lib/whatsapp";
import { WhatsAppOrderModal } from "@/components/ui/WhatsAppOrderModal";

export function ServicesSection() {
  const [servicesList, setServicesList] = useState<any[]>(detailedServices);
  const [livePricing, setLivePricing] = useState<Record<string, ServicePricingConfig>>(pricingConfig);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<Record<string, { label: string; price: string }>>({});
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [activeOrderParams, setActiveOrderParams] = useState<any>({
    serviceName: "Notes & Academic Records",
  });

  useEffect(() => {
    async function syncFromDb() {
      try {
        const [srvRes, prcRes] = await Promise.all([
          fetch("/api/admin/services"),
          fetch("/api/admin/pricing"),
        ]);
        const [srvData, prcData] = await Promise.all([
          srvRes.json(),
          prcRes.json(),
        ]);

        if (srvData.success && srvData.services && srvData.services.length > 0) {
          // Merge dynamic database services
          const merged = srvData.services.filter((s: any) => s.status !== "Draft");
          if (merged.length > 0) {
            setServicesList(merged);
          }
        }

        if (prcData.success && prcData.pricing) {
          const updatedPricing = { ...pricingConfig };
          prcData.pricing.forEach((p: any) => {
            if (p.serviceId === "srv_notes_records" || p.id === "prc_notes") {
              if (updatedPricing.notesAndRecords) {
                updatedPricing.notesAndRecords.summary = p.details || updatedPricing.notesAndRecords.summary;
              }
            }
            if (p.serviceId === "srv_ppt" || p.id === "prc_ppt") {
              if (updatedPricing.powerpointPresentations) {
                updatedPricing.powerpointPresentations.summary = p.details || updatedPricing.powerpointPresentations.summary;
              }
            }
            if (p.serviceId === "srv_academic_project" || p.id === "prc_projects") {
              if (updatedPricing.academicProjectAssistance) {
                updatedPricing.academicProjectAssistance.summary = p.details || updatedPricing.academicProjectAssistance.summary;
              }
            }
            if (p.serviceId === "srv_documentation" || p.id === "prc_doc") {
              if (updatedPricing.projectDocumentation) {
                updatedPricing.projectDocumentation.summary = p.details || updatedPricing.projectDocumentation.summary;
              }
            }
          });
          setLivePricing(updatedPricing);
        }
      } catch (e) {
        // Fallback to static config
      }
    }
    syncFromDb();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const selectTier = (serviceId: string, label: string, price: string) => {
    setSelectedPackages((prev) => ({
      ...prev,
      [serviceId]: { label, price },
    }));
  };

  const handleOrderNow = (service: any) => {
    const pricing = livePricing[service.pricingKey] || pricingConfig[service.pricingKey];
    const defaultTier = pricing?.tiers?.[0] || service.packages?.[0];
    const selected = selectedPackages[service.id] || {
      label: defaultTier?.label || defaultTier?.name || "Standard Package",
      price: defaultTier?.price || "Custom Quotation",
    };

    const params = {
      serviceName: service.title,
      packageName: selected.label,
      price: selected.price,
    };

    // Track order-intent click
    try {
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "whatsapp_click",
          service: service.title,
          package: selected.label,
          price: selected.price,
        }),
      }).catch(() => {});
    } catch {}

    const waUrl = buildWhatsAppOrderUrl(params);
    const opened = window.open(waUrl, "_blank", "noopener,noreferrer");

    // If popup was blocked or mobile web, open modal
    if (!opened || opened.closed || typeof opened.closed === "undefined") {
      setActiveOrderParams(params);
      setOrderModalOpen(true);
    }
  };

  return (
    <section id="services" className="relative py-24 sm:py-32 bg-white border-t border-zinc-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wider uppercase mb-4">
              01 • Our Services & Instant Ordering
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight">
              Transparent, Professional & <br />
              <span className="text-[#C8102E]">Tailored to Your Ambitions.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
              Every deliverable is crafted with institutional rigor and transparent pricing. Select your package and order directly through WhatsApp in seconds.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Official WhatsApp Ordering Desk: +91 9492801206</span>
          </div>
        </div>

        {/* 6 Detailed Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => {
            const pricing = livePricing[service.pricingKey] || pricingConfig[service.pricingKey];
            const isExpanded = expandedId === service.id;

            // Get tiers from pricing config or service packages
            const tiers =
              pricing?.tiers?.map((t) => ({ label: t.label, price: t.price })) ||
              (service.packages || []).map((p: any) => ({ label: p.name, price: p.price }));

            const currentSelected = selectedPackages[service.id] || tiers[0] || {
              label: "Standard Scope",
              price: "Custom Quotation",
            };

            return (
              <div
                key={service.id}
                id={service.id}
                className="group flex flex-col justify-between rounded-3xl bg-zinc-50/70 border border-zinc-200/90 p-7 sm:p-8 hover:bg-white hover:border-[#C8102E]/40 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold tracking-wider uppercase text-[#C8102E]">
                      {service.category}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-600 tracking-widest uppercase">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-zinc-900 tracking-tight group-hover:text-[#C8102E] transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed font-normal">
                    {service.description}
                  </p>

                  {/* Interactive Package Selector */}
                  <div className="mt-6 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                        Select Package:
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">Click to select</span>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      {tiers.map((tier: any, tIdx: number) => {
                        const isSelected = currentSelected.label === tier.label;
                        return (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={() => selectTier(service.id, tier.label, tier.price)}
                            className={`flex items-center justify-between text-xs p-2 rounded-xl transition-all text-left border ${
                              isSelected
                                ? "bg-red-50/70 border-[#C8102E] text-zinc-900 font-semibold"
                                : "bg-zinc-50/60 border-zinc-200/70 text-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isSelected ? "bg-[#C8102E]" : "bg-zinc-300"
                                }`}
                              />
                              <span>{tier.label}</span>
                            </span>
                            <span className="font-extrabold text-[#C8102E] text-xs">
                              {tier.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {(pricing?.summary || service.pricingModel) && (
                      <p className="mt-3 text-[10px] text-zinc-500 border-t border-zinc-100 pt-2 leading-relaxed">
                        {pricing?.summary || service.pricingModel}
                      </p>
                    )}
                  </div>

                  {/* Expandable Specifications Toggle */}
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => toggleExpand(service.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-[#C8102E] transition-colors"
                    >
                      <span>{isExpanded ? "Hide deliverable features" : "View deliverable features"}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-zinc-200/60 transition-all">
                        {(service.features || service.highlights || []).map((feat: string, fIdx: number) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-zinc-600">
                            <Check className="w-3.5 h-3.5 text-[#C8102E] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary WhatsApp Order Button matching Section 1 */}
                <div className="mt-8 pt-4 border-t border-zinc-200/60 space-y-2">
                  <button
                    onClick={() => handleOrderNow(service)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-emerald-600/20 text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>ORDER NOW ON WHATSAPP</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </button>

                  <div className="text-[10px] text-center text-zinc-400">
                    Pre-populates order for: <strong>{currentSelected.label} ({currentSelected.price})</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WhatsApp Fallback Modal */}
      <WhatsAppOrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        orderParams={activeOrderParams}
      />
    </section>
  );
}
