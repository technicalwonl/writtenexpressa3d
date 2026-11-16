"use client";

import Image from "next/image";
import { brandConfig } from "@/config/brand";
import { contactConfig } from "@/config/contact";
import {
  Target,
  Compass,
  Award,
  ShieldCheck,
  Lightbulb,
  Zap,
  Users,
  MessageCircle,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const valueIcons = [
  Lightbulb,    // Creativity
  Award,        // Quality
  ShieldCheck,  // Trust
  Zap,          // Innovation
  Target,       // Commitment
  Users,        // Customer Satisfaction
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-20 sm:py-28 bg-zinc-50/60 overflow-hidden border-t border-zinc-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wider uppercase mb-4">
            About Written Expressa
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight">
            More Than a Service. <br />
            <span className="text-red-600">Your Creative Partner.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            {brandConfig.foundingVision}
          </p>
        </div>

        {/* Narrative & Visual Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Left Narrative (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-zinc-700 leading-relaxed text-base sm:text-lg font-normal">
            <p>
              We believe every idea has the potential to become something extraordinary. Whether it is an
              academic presentation, research documentation, a personalized magazine or a technical project,
              our goal is to transform your requirements into meaningful, professional results.
            </p>
            <p>
              We combine creativity, technology and attention to detail to deliver solutions that help
              students, researchers, professionals and businesses express their ideas with confidence.
            </p>

            <div className="p-6 rounded-2xl bg-white border border-red-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600" />
              <p className="font-bold text-zinc-900 text-lg sm:text-xl italic">
                &ldquo;At Written Expressa, your idea is our starting point.&rdquo;
              </p>
              <span className="text-xs font-bold text-red-600 tracking-wider uppercase mt-2 block">
                Brand Creed
              </span>
            </div>
          </div>

          {/* Right Brand Still Mockup (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200/90 shadow-xl bg-white aspect-4/3 group">
              <Image
                src="/images/book-closed.webp"
                alt="Written Expressa Creative Book"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-xs font-bold tracking-widest text-red-400 uppercase">
                    Our Creative Identity
                  </span>
                  <h4 className="text-lg font-extrabold text-white">
                    Every great idea deserves a beautiful expression.
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="rounded-3xl bg-white p-8 sm:p-10 border border-zinc-200/90 shadow-xs relative overflow-hidden">
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">Our Anchor</span>
            <h3 className="mt-1 text-2xl font-bold text-zinc-900 tracking-tight">Mission</h3>
            <p className="mt-3 text-zinc-600 leading-relaxed font-normal text-base">
              {brandConfig.mission}
            </p>
          </div>

          <div className="rounded-3xl bg-zinc-900 text-white p-8 sm:p-10 border border-zinc-800 shadow-xs relative overflow-hidden">
            <div className="h-12 w-12 rounded-2xl bg-zinc-800 text-red-400 flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Our Direction</span>
            <h3 className="mt-1 text-2xl font-bold text-white tracking-tight">Vision</h3>
            <p className="mt-3 text-zinc-300 leading-relaxed font-normal text-base">
              {brandConfig.vision}
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">
              Guiding Principles
            </span>
            <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Our Values
            </h3>
            <p className="mt-2 text-sm text-zinc-600 font-normal">
              The foundational values guiding every project, partnership, and creative endeavor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandConfig.coreValues.map((val, idx) => {
              const Icon = valueIcons[idx] || Sparkles;
              return (
                <div
                  key={val.title}
                  className="rounded-2xl bg-white p-6 border border-zinc-200/80 shadow-xs hover:border-red-500/30 hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 shrink-0 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-zinc-900 tracking-tight">
                      {val.title}
                    </h4>
                    <p className="mt-1 text-xs text-zinc-600 leading-relaxed font-normal">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Universe Showcase Gallery */}
        <div className="mb-20">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">
              Visual Universe
            </span>
            <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              From Imagination to Presentation
            </h3>
            <p className="mt-2 text-sm text-zinc-600 font-normal">
              A glimpse into the 3D studio world created for Written Expressa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative rounded-2xl overflow-hidden aspect-16/10 border border-zinc-200 shadow-xs group">
              <Image
                src="/images/studio-full.webp"
                alt="The World of Ideas"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4 text-white text-xs font-semibold">
                <span>The World of Ideas Podium</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-16/10 border border-zinc-200 shadow-xs group">
              <Image
                src="/images/book-universe.webp"
                alt="Creative Deliverables"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4 text-white text-xs font-semibold">
                <span>Deliverables in Motion</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-16/10 border border-zinc-200 shadow-xs group">
              <Image
                src="/images/brand-wall.webp"
                alt="Written Expressa Brand Identity"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4 text-white text-xs font-semibold">
                <span>Brand Identity Wall</span>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Connect Card */}
        <div className="rounded-3xl bg-zinc-900 text-white p-8 sm:p-12 shadow-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              Get in Touch
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Have an Idea? Let&apos;s Make It Happen.
            </h3>
            <p className="mt-3 text-sm text-zinc-300 font-normal leading-relaxed">
              We&apos;re always excited to collaborate on new presentations, academic reports, commemorative
              magazines, or technical projects. Reach out directly on WhatsApp or email.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumberRaw}?text=${encodeURIComponent(
                "Hello Written Expressa team, I would like to discuss a project with you."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href={`mailto:${contactConfig.officialEmail}`}
              className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-bold px-6 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <Mail className="w-4 h-4 text-red-400" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
