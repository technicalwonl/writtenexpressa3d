"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare, Sparkles } from "lucide-react";
import { buildWhatsAppGeneralUrl } from "@/lib/whatsapp";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const defaultFAQs: FAQItem[] = [
  {
    id: "faq_1",
    question: "What services does Written Expressa provide?",
    answer: "We provide six core service verticals: Academic Notes & Lab Records, PowerPoint Presentation Design, Capstone Project Assistance, IEEE Documentation, Custom Commemorative Magazines, and Web & Technical Development.",
    category: "Services",
  },
  {
    id: "faq_2",
    question: "How can I place an order directly through WhatsApp?",
    answer: "Browse our services, pick your preferred tier or package, and click 'ORDER NOW'. Your WhatsApp will automatically launch with a pre-filled order draft addressed to our official business number +91 9492801206.",
    category: "WhatsApp Ordering",
  },
  {
    id: "faq_3",
    question: "What is your pricing model for PPTs and documentation?",
    answer: "Our pricing is transparent and centralized: Simple PPTs start from ₹49–₹249, Creative PPTs from ₹99–₹400, Softcopy IEEE documentation is ₹499, Deluxe hardcopy thesis is ₹999, and Academic Project guidance starts from ₹500.",
    category: "Pricing",
  },
  {
    id: "faq_4",
    question: "Do you serve students outside Hyderabad?",
    answer: "Yes! Written Expressa operates pan-India. All digital deliverables (presentations, softcopy reports, web solutions) are delivered electronically, and printed hardcopy thesis or magazines are safely shipped via speed courier nationwide.",
    category: "General Information",
  },
  {
    id: "faq_5",
    question: "What payment methods are supported?",
    answer: "We accept all standard Indian payment options including UPI (PhonePe, Google Pay, Paytm), Bank IMPS/NEFT, and Net Banking. Typically, an advance is received to initiate the project and the remaining balance is paid upon final draft approval.",
    category: "Payment",
  },
  {
    id: "faq_6",
    question: "How does the project delivery and revision process work?",
    answer: "Once you share your requirements, we prepare an initial milestone draft for your inspection. You can suggest modifications directly on WhatsApp or email, and our specialists refine the work until you are 100% satisfied.",
    category: "Revisions",
  },
];

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFAQs);
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>("faq_1");

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch("/api/admin/faqs");
        const data = await res.json();
        if (data.success && data.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs);
        }
      } catch (e) {
        // Fallback to defaultFAQs
      }
    }
    loadFaqs();
  }, []);

  const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filtered = activeCategory === "All" ? faqs : faqs.filter((f) => f.category === activeCategory);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const askOnWhatsApp = buildWhatsAppGeneralUrl("Asking a question about Written Expressa services");

  return (
    <section id="faqs" className="py-24 sm:py-32 bg-zinc-50/60 border-t border-zinc-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wider uppercase mb-4">
            07 • Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Clear Answers to <span className="text-[#C8102E]">Common Questions.</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
            Everything you need to know about our ordering process, pricing tiers, delivery standards, and revision guarantees.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filtered.map((faq) => {
            const isOpen = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-zinc-900 hover:text-[#C8102E] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#C8102E] shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-zinc-900">Have a specific or urgent requirement?</h4>
            <p className="text-xs text-zinc-500 mt-0.5">
              Chat directly with our specialists on WhatsApp for personalized consultation.
            </p>
          </div>
          <a
            href={askOnWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask on WhatsApp (+91 9492801206)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
