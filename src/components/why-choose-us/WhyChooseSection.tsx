"use client";

import { useState } from "react";
import { TiltCard } from "@/components/ui/TiltCard";
import { Sparkles, DollarSign, Sliders, Layers, UserCheck, MessageSquareCheck, Award, ArrowRight } from "lucide-react";

const reasons = [
  {
    id: "creative-execution",
    title: "Creative and professional execution.",
    subtitle: "Aesthetic refinement meets academic rigor",
    description:
      "We reject generic templates and rushed drafts. Every document, slide, and magazine is designed with typography hierarchy, balanced contrast, and institutional formatting.",
    icon: Sparkles,
  },
  {
    id: "affordable-packages",
    title: "Affordable service packages.",
    subtitle: "Transparent pricing without unexpected fees",
    description:
      "Accessible rates starting as low as ₹40 for notes and ₹49 for presentations. We believe high quality academic solutions should remain within reach of every student and researcher.",
    icon: DollarSign,
  },
  {
    id: "customized-solutions",
    title: "Customized solutions.",
    subtitle: "Engineered around your exact syllabus and vision",
    description:
      "No two projects are identical. Whether you follow IEEE documentation standards, university thesis norms, or bespoke event themes, we tailor every parameter to your criteria.",
    icon: Sliders,
  },
  {
    id: "multiple-services",
    title: "Multiple services under one platform.",
    subtitle: "One trusted creative & academic partner",
    description:
      "Eliminate the hassle of coordinating between separate printers, content writers, presentation designers, and technical developers. We handle the entire lifecycle under one unified studio.",
    icon: Layers,
  },
  {
    id: "personal-attention",
    title: "Personal attention to requirements.",
    subtitle: "Direct communication with assigned specialists",
    description:
      "We listen closely to your guidelines, viva requirements, or personal stories to ensure the final deliverable authentically conveys your vision.",
    icon: UserCheck,
  },
  {
    id: "clear-communication",
    title: "Clear communication.",
    subtitle: "Fast WhatsApp updates and transparent milestones",
    description:
      "Real-time status updates on WhatsApp and email. Review intermediate drafts, request revisions, and enjoy continuous peace of mind throughout the project lifecycle.",
    icon: MessageSquareCheck,
  },
  {
    id: "quality-focused",
    title: "Quality-focused delivery.",
    subtitle: "Double-checked formatting and print readiness",
    description:
      "Multi-point quality checks ensure grammar, citations, circuit pinouts, code formatting, and print-ready resolutions meet strict professional benchmarks prior to handoff.",
    icon: Award,
  },
];

export function WhyChooseSection() {
  const [activeReason, setActiveReason] = useState(reasons[0]);

  return (
    <section className="relative py-24 sm:py-32 bg-white border-t border-zinc-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wider uppercase mb-4">
            06 • Why Choose Us
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Your Vision Deserves <br />
            <span className="text-red-600">the Right Team.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            Discover why students, researchers, event committees, and professionals across India choose
            Written Expressa as their trusted partner.
          </p>
        </div>

        {/* Elegant Interactive Showcase Split: Feature Selector (Left) + Highlight Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Feature List (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {reasons.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = activeReason.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveReason(item)}
                  className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex items-start gap-4 ${
                    isSelected
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-md"
                      : "bg-zinc-50/70 text-zinc-800 border-zinc-200/80 hover:bg-white hover:border-red-500/40 hover:shadow-xs"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-red-600 text-white"
                        : "bg-white text-red-600 border border-zinc-200 group-hover:border-red-500/40"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm sm:text-base tracking-tight">
                        {item.title}
                      </h3>
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? "text-red-400" : "text-zinc-600"
                        }`}
                      >
                        0{idx + 1}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isSelected ? "text-zinc-300" : "text-zinc-600"
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep Dive Focus Stage (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-radial from-zinc-50 to-zinc-100/90 border border-zinc-200/90 p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-6">
                Core Standard
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-snug">
                {activeReason.title}
              </h3>

              <p className="mt-2 text-sm font-semibold text-red-600">
                {activeReason.subtitle}
              </p>

              <p className="mt-6 text-zinc-600 text-sm sm:text-base leading-relaxed font-normal">
                {activeReason.description}
              </p>

              <div className="mt-8 p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Our Guarantee
                </span>
                <p className="text-xs font-medium text-zinc-700">
                  Direct human accountability, zero automated nonsense, and milestone verification prior to final handover.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200/80 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                WRITTEN EXPRESSA
              </span>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider"
              >
                <span>Discuss Your Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
