"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

import { buildWhatsAppGeneralUrl } from "@/lib/whatsapp";

const navLinks = [
  { name: "Home", href: "/#hero", sectionId: "hero" },
  { name: "About", href: "/#about", sectionId: "about" },
  { name: "Services", href: "/#services", sectionId: "services" },
  { name: "Portfolio", href: "/portfolio", sectionId: "portfolio" },
  { name: "Blog", href: "/blog", sectionId: "blog" },
  { name: "FAQs", href: "/#faqs", sectionId: "faqs" },
  { name: "Contact", href: "/#contact", sectionId: "contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      if (pathname === "/") {
        const sections = navLinks.map((link) => document.getElementById(link.sectionId));
        const scrollPosition = window.scrollY + 250;

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section && section.offsetTop <= scrollPosition) {
            setActiveSection(navLinks[i].sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleGetStartedWhatsApp = () => {
    setMobileMenuOpen(false);
    const url = buildWhatsAppGeneralUrl("Getting started with Written Expressa");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-zinc-200/80 py-3.5"
            : "bg-transparent py-5 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-hidden rounded-md"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-white border border-zinc-200/90 shadow-xs group-hover:scale-105 transition-transform p-0.5">
              <img
                src="/images/logo.png"
                alt="Written Expressa"
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg text-zinc-900 group-hover:text-red-600 transition-colors">
                WRITTEN EXPRESSA
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                Creative & Academic
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((item) => {
              const isActive = activeSection === item.sectionId && pathname === "/";
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-colors relative ${
                    isActive
                      ? "text-red-600 font-bold"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-red-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Prominent CTA & Notification Bell */}
          <div className="flex items-center gap-3">
            <NotificationCenter />

            <div className="hidden sm:flex items-center">
              <MagneticButton
                onClick={handleGetStartedWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-2 uppercase tracking-wider"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/98 backdrop-blur-xl lg:hidden pt-20 px-6 flex flex-col justify-between pb-8 overflow-y-auto max-h-screen">
          <nav className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-zinc-900 hover:text-red-600 py-2.5 border-b border-zinc-100 flex items-center justify-between"
              >
                <span>{item.name}</span>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </Link>
            ))}
          </nav>

          <div className="pt-6">
            <button
              onClick={handleGetStartedWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md text-center flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              <span>GET STARTED ON WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
