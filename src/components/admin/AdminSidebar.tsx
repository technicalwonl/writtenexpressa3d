"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  ShoppingBag,
  Layers,
  DollarSign,
  Briefcase,
  FileText,
  Box,
  Star,
  Share2,
  Mail,
  BarChart3,
  Webhook,
  History,
  Bell,
  Users,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  ExternalLink,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [counts, setCounts] = useState({
    enquiries: 0,
    orders: 0,
    testimonials: 0,
  });

  const [currentUser, setCurrentUser] = useState({
    name: "WE Founder",
    role: "Super Admin",
    initials: "WF",
  });

  useEffect(() => {
    // Fetch live session
    async function fetchSession() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (data.success && data.user) {
          const name = data.user.name || "WE Founder";
          const role = data.user.role || "Super Admin";
          const initials = name
            .split(" ")
            .map((p: string) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "WE";
          setCurrentUser({ name, role, initials });
        }
      } catch (err) {}
    }
    fetchSession();
  }, []);

  useEffect(() => {
    // Fetch live counts for sidebar badges
    async function fetchCounts() {
      try {
        const [enqRes, ordRes, tstRes] = await Promise.all([
          fetch("/api/admin/enquiries"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/testimonials"),
        ]);
        const [enqData, ordData, tstData] = await Promise.all([
          enqRes.json(),
          ordRes.json(),
          tstRes.json(),
        ]);

        const newEnq = (enqData.enquiries || []).filter(
          (e: any) => e.status === "New" || e.status === "Pending Review"
        ).length;
        const activeOrd = (ordData.orders || []).filter(
          (o: any) => o.orderStatus === "In Progress" || o.orderStatus === "Draft"
        ).length;
        const pendingTst = (tstData.testimonials || []).filter(
          (t: any) => t.status === "Pending"
        ).length;

        setCounts({
          enquiries: newEnq,
          orders: activeOrd,
          testimonials: pendingTst,
        });
      } catch (e) {
        // Fallback default numbers if initial load
      }
    }
    fetchCounts();
  }, [pathname]);

  const navGroups: NavGroup[] = [
    {
      group: "MAIN OPERATIONS",
      items: [
        { name: "Overview Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        {
          name: "Enquiries & Leads",
          href: "/admin/enquiries",
          icon: Inbox,
          badge: counts.enquiries > 0 ? counts.enquiries : undefined,
          badgeColor: "bg-[#C8102E] text-white",
        },
        {
          name: "Orders & Production",
          href: "/admin/orders",
          icon: ShoppingBag,
          badge: counts.orders > 0 ? counts.orders : undefined,
          badgeColor: "bg-blue-600 text-white",
        },
      ],
    },
    {
      group: "CATALOG & CONTENT",
      items: [
        { name: "Services Manager", href: "/admin/services", icon: Layers },
        { name: "Pricing Central", href: "/admin/pricing", icon: DollarSign },
        { name: "Portfolio & Gallery", href: "/admin/portfolio", icon: Briefcase },
        { name: "Articles & Blog", href: "/admin/blog", icon: FileText },
        { name: "FAQs & Answers", href: "/admin/faqs", icon: Sparkles },
        { name: "Website Copy CMS", href: "/admin/content", icon: FileText },
        { name: "3D Universe & Canvas", href: "/admin/3d-experience", icon: Box },
      ],
    },
    {
      group: "CUSTOMERS & REVIEWS",
      items: [
        {
          name: "Testimonials Moderation",
          href: "/admin/testimonials",
          icon: Star,
          badge: counts.testimonials > 0 ? counts.testimonials : undefined,
          badgeColor: "bg-amber-500 text-white",
        },
        { name: "Referral Program", href: "/admin/referrals", icon: Share2 },
        { name: "Newsletter Subscribers", href: "/admin/newsletter", icon: Mail },
      ],
    },
    {
      group: "METRICS & CHANNELS",
      items: [
        { name: "Analytics & Revenue", href: "/admin/analytics", icon: BarChart3 },
        { name: "API & Integrations", href: "/admin/integrations", icon: Webhook },
        { name: "Activity Audit Logs", href: "/admin/activity-logs", icon: History },
        { name: "Notifications Center", href: "/admin/notifications", icon: Bell },
      ],
    },
    {
      group: "SYSTEM CONFIG",
      items: [
        { name: "Team & Role Access", href: "/admin/team", icon: Users },
        { name: "SEO & Social Meta", href: "/admin/seo", icon: Search },
        { name: "Global Settings", href: "/admin/settings", icon: Settings },
        { name: "Security & Passwords", href: "/admin/security", icon: ShieldCheck },
        { name: "My Profile", href: "/admin/profile", icon: UserCheck },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-[#111318] border-r border-neutral-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-neutral-200 bg-white p-0.5 shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <img src="/images/logo.png" alt="Written Expressa" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div>
            <div className="font-serif font-bold text-base tracking-tight text-[#111318] flex items-center gap-1.5">
              Written Expressa
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              Admin Control Center
            </div>
          </div>
        </Link>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {group.group}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-[#C8102E] text-white shadow-sm shadow-[#C8102E]/20 font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100/80 hover:text-[#111318]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform ${
                        isActive ? "text-white" : "text-neutral-400 group-hover:text-[#C8102E]"
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ml-1.5 ${
                        item.badgeColor || "bg-neutral-200 text-neutral-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-neutral-100 bg-neutral-50/50 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-700 hover:bg-white hover:shadow-xs border border-transparent hover:border-neutral-200 transition-all"
        >
          <span className="flex items-center gap-2 text-neutral-600">
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            View Live Website
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
            Live
          </span>
        </Link>

        <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-neutral-200/80">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${
                currentUser.role === "Super Admin"
                  ? "bg-purple-700"
                  : currentUser.role === "Admin"
                  ? "bg-blue-600"
                  : "bg-emerald-600"
              }`}
            >
              {currentUser.initials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#111318] truncate">{currentUser.name}</div>
              <div className="text-[10px] text-neutral-500 font-medium truncate">{currentUser.role}</div>
            </div>
          </div>
          <button
            onClick={async () => {
              try {
                await fetch("/api/admin/auth", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "logout" }),
                });
              } catch (e) {}
              window.location.href = "/admin/login";
            }}
            title="Sign out"
            className="p-1.5 text-neutral-400 hover:text-[#C8102E] hover:bg-neutral-50 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger Button */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white border border-neutral-200 rounded-xl shadow-md text-neutral-800 hover:bg-neutral-50"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 flex-shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
