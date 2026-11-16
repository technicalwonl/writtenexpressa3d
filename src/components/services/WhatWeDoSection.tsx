"use client";

import { serviceCategories } from "@/config/services";
import { TiltCard } from "@/components/ui/TiltCard";
import { GraduationCap, Palette, Cpu, Monitor, ArrowUpRight } from "lucide-react";

const iconMap = {
  GraduationCap,
  Palette,
  Cpu,
  Monitor,
};

export function WhatWeDoSection() {
  const scrollToService = (serviceId: string) => {
    const el = document.getElementById(serviceId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      const parent = document.getElementById("services");
      if (parent) parent.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="what-we-do" className="relative py-24 sm:py-32 bg-zinc-50/70 border-t border-zinc-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100/80 border border-red-200 text-red-700 text-xs font-bold tracking-wider uppercase mb-4">
            What We Do
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Creative thinking meets <br />
            <span className="text-red-600">professional execution.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            Four specialized divisions engineered to handle your academic milestones, design initiatives,
            engineering prototypes, and digital presence under one unified roof.
          </p>
        </div>

        {/* 4 Interactive 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {serviceCategories.map((cat, idx) => {
            const Icon = iconMap[cat.iconName as keyof typeof iconMap] || GraduationCap;
            return (
              <TiltCard
                key={cat.id}
                maxTilt={6}
                scale={1.02}
                className="group relative flex flex-col justify-between rounded-3xl bg-white p-7 sm:p-8 border border-zinc-200/80 shadow-xs hover:shadow-xl hover:border-red-500/40 transition-all duration-300"
              >
                <div>
                  {/* Category Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold tracking-widest text-zinc-600 uppercase">
                      0{idx + 1}
                    </span>
                    <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center shadow-xs">
                      <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight group-hover:text-red-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-zinc-600 uppercase tracking-wide">
                    {cat.tagline}
                  </p>

                  <p className="mt-4 text-sm text-zinc-600 leading-relaxed font-normal">
                    {cat.description}
                  </p>

                  {/* Bullet services */}
                  <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-col gap-2">
                    {cat.services.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600/70" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={() => scrollToService("services")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 group-hover:text-red-600 transition-colors uppercase tracking-wider"
                  >
                    <span>Explore Solutions</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
