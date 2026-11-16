"use client";

import { MessageSquareShare, MessageCircleCheck, Cpu, PackageCheck, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const steps = [
  {
    step: "01",
    title: "SHARE YOUR IDEA",
    description: "Tell us about your requirements.",
    detail: "Fill out our quick project enquiry form or message us directly on WhatsApp with your topic, guidelines, page count, or technical requirements.",
    icon: MessageSquareShare,
  },
  {
    step: "02",
    title: "DISCUSS & CONFIRM",
    description: "Our team understands your needs and provides a quotation.",
    detail: "We review your syllabus, references, or design assets, confirm the timeline, and provide a clear quotation based on our centralized pricing.",
    icon: MessageCircleCheck,
  },
  {
    step: "03",
    title: "CREATE & DEVELOP",
    description: "Our team works on your project with attention to detail.",
    detail: "Our creative designers and technical specialists engineer your presentation, notes, magazine, or project code with meticulous quality control.",
    icon: Cpu,
  },
  {
    step: "04",
    title: "REVIEW & DELIVER",
    description: "Review the work and receive your completed deliverables according to the agreed terms.",
    detail: "Inspect drafts, provide feedback for adjustments, and receive high-resolution print files, source code, or bound documentation ready for submission.",
    icon: PackageCheck,
  },
];

export function HowItWorksSection() {
  const scrollToContact = () => {
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 bg-zinc-900 text-white overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-bold tracking-wider uppercase mb-4">
            05 • How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            From Initial Concept to <br />
            <span className="text-red-500">Flawless Delivery in 4 Steps.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            A frictionless, transparent workflow engineered to ensure high fidelity execution with zero guesswork.
          </p>
        </div>

        {/* 4 Steps with Connected Progress Line */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-12 right-12 h-[2px] bg-gradient-to-r from-red-600/20 via-red-600/80 to-red-600/20 -z-0" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative z-10 flex flex-col justify-between rounded-3xl bg-zinc-800/80 border border-zinc-700/80 p-7 hover:border-red-500/60 hover:bg-zinc-800 transition-all duration-300 shadow-lg"
              >
                <div>
                  {/* Step Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-black tracking-widest text-red-400 uppercase">
                      STEP {item.step}
                    </span>
                    <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-700 group-hover:border-red-500/80 text-red-400 group-hover:text-white group-hover:bg-red-600 transition-colors flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Core Description */}
                  <h3 className="text-lg font-extrabold tracking-tight text-white group-hover:text-red-400 transition-colors uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-zinc-300">
                    {item.description}
                  </p>

                  <p className="mt-3 text-xs text-zinc-400 leading-relaxed font-normal">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-700/50 flex items-center justify-between text-[11px] font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  <span>Phase {index + 1} of 4</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Prompt */}
        <div className="mt-16 text-center">
          <MagneticButton
            onClick={scrollToContact}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-8 py-4 rounded-full shadow-lg hover:shadow-red-900/30 transition-all inline-flex items-center gap-2"
          >
            <span>START YOUR STEP 01 NOW</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
