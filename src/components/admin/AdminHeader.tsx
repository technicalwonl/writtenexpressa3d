"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Map route to clean title
  const pageTitles: Record<string, string> = {
    "/admin": "Overview Dashboard",
    "/admin/dashboard": "Operations Overview",
    "/admin/enquiries": "Client Enquiries & CRM Pipeline",
    "/admin/orders": "Orders & Production Execution",
    "/admin/services": "Services Catalog & Offerings",
    "/admin/pricing": "Centralized Pricing Matrix",
    "/admin/portfolio": "Project Portfolio & Case Studies",
    "/admin/blog": "Articles & Knowledge Base CMS",
    "/admin/faqs": "Frequently Asked Questions CMS",
    "/admin/content": "Website Copy & CMS Editor",
    "/admin/3d-experience": "3D Hero Canvas & Physics Parameters",
    "/admin/testimonials": "Client Reviews & Social Proof",
    "/admin/referrals": "Affiliate & Campus Ambassador Referrals",
    "/admin/newsletter": "Newsletter & Email Subscribers",
    "/admin/analytics": "Financial & Traffic Analytics",
    "/admin/integrations": "External APIs & Cloud Services",
    "/admin/activity-logs": "Audit Trail & Activity Log",
    "/admin/notifications": "System & Lead Notifications",
    "/admin/team": "Team Members & Permissions",
    "/admin/seo": "SEO & Social Sharing Tags",
    "/admin/settings": "Global Platform Settings",
    "/admin/security": "Security & Credential Management",
    "/admin/profile": "Admin Profile & Preferences",
  };

  const currentTitle = pageTitles[pathname] || "Admin Control Center";

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        const res = await fetch("/api/admin/activity-logs");
        const data = await res.json();
        if (data.logs) {
          setRecentLogs(data.logs.slice(0, 5));
        }
      } catch (e) {
        // ignore
      }
    }
    fetchRecentActivity();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between">
      {/* Page Title & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-4 pl-12 md:pl-0 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-medium text-neutral-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#C8102E] font-semibold capitalize truncate">
              {pathname.replace("/admin/", "").replace("-", " ") || "Dashboard"}
            </span>
          </div>
          <h1 className="text-sm sm:text-lg font-bold font-serif text-[#111318] tracking-tight truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Middle Search & Status */}
      <div className="hidden lg:flex items-center gap-3 max-w-md w-full">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, clients, services, or enquiries..."
            className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-xs pl-9 pr-4 py-2 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all placeholder:text-neutral-400 text-[#111318]"
          />
        </div>
      </div>

      {/* Actions & Utilities */}
      <div className="flex items-center gap-2.5">
        {/* Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Database Synced
        </div>

        {/* Quick Add Dropdown or Action */}
        <Link
          href="/admin/orders"
          className="hidden sm:inline-flex items-center gap-1.5 bg-[#C8102E] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#a00d24] transition-colors shadow-xs shadow-[#C8102E]/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Order</span>
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-neutral-600 hover:text-[#111318] hover:bg-neutral-100 relative transition-colors"
            title="Recent Activity Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#C8102E] absolute top-1.5 right-1.5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white border border-neutral-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 mb-2">
                <span className="text-xs font-bold text-[#111318] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C8102E]" />
                  Recent System Activity
                </span>
                <Link
                  href="/admin/activity-logs"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-[#C8102E] font-medium hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {recentLogs.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-3 text-center">No recent logs recorded.</p>
                ) : (
                  recentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100/70 text-xs transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-0.5">
                        <span className="font-bold text-[#111318]">{log.entity}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <div className="text-neutral-700 leading-snug">{log.details}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* View Live Website Button */}
        <Link
          href="/"
          target="_blank"
          title="Open live website"
          className="p-2 rounded-lg text-neutral-600 hover:text-[#111318] hover:bg-neutral-100 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
