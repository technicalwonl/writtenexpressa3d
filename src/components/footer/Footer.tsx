"use client";

import Link from "next/link";
import { contactConfig } from "@/config/contact";
import { ArrowUp, ArrowRight, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0d0f12] text-white border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-zinc-800">
          {/* Brand Column (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-white p-0.5 shadow-md border border-zinc-700">
                  <img
                    src="/images/logo.png"
                    alt="Written Expressa"
                    className="h-full w-full object-contain rounded-lg"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold tracking-tight text-xl text-white">
                    WRITTEN EXPRESSA
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-red-400">
                    Your Creative & Academic Partner
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-sm">
                We transform ideas into professional creative, academic and technical solutions.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
                aria-label="Back to top"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* COMPANY Column (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-5">
              COMPANY
            </h4>
            <ul className="space-y-3 text-xs font-medium">
              <li>
                <Link href="/#about" className="text-zinc-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-zinc-400 hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-zinc-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-zinc-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* SERVICES Column (3 Cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-5">
              SERVICES
            </h4>
            <ul className="space-y-3 text-xs font-medium">
              <li>
                <Link href="/#services" className="text-zinc-400 hover:text-white transition-colors">
                  PPT Design
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-zinc-400 hover:text-white transition-colors">
                  Notes & Records
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-zinc-400 hover:text-white transition-colors">
                  Project Documentation
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-zinc-400 hover:text-white transition-colors">
                  Custom Magazines
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-zinc-400 hover:text-white transition-colors">
                  Academic Projects
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-zinc-400 hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
            </ul>
          </div>

          {/* CONNECT & LEGAL (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-5">
                CONNECT
              </h4>
              <ul className="space-y-3 text-xs font-medium mb-6">
                <li>
                  <a
                    href={`https://wa.me/${contactConfig.whatsappNumberRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>WhatsApp Order Desk</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600" />
                  </a>
                </li>
                <li>
                  <a
                    href={contactConfig.whatsappChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>WhatsApp Channel</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600" />
                  </a>
                </li>
                <li>
                  <a
                    href={contactConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-pink-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>Instagram (@written_expressa)</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600" />
                  </a>
                </li>
                <li>
                  <a
                    href={contactConfig.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>LinkedIn</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600" />
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contactConfig.officialEmail}`}
                    className="text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>Email</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                LEGAL
              </h4>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-400 font-medium">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-white transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 Written Expressa. All Rights Reserved.</p>
          <p className="text-[11px] text-zinc-500 font-medium">
            Your Creative & Academic Partner • From imagination to presentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
