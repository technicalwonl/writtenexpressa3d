"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  X,
  CheckCircle2,
  Send,
  ExternalLink,
  Sparkles,
  Radio,
  Clock,
  ShieldCheck,
  ChevronRight,
  Volume2,
} from "lucide-react";

interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  actionUrl: string;
  actionText: string;
  sentAt: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [broadcasts, setBroadcasts] = useState<BroadcastNotification[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // Floating live toast for new broadcasts
  const [activeToast, setActiveToast] = useState<BroadcastNotification | null>(null);

  useEffect(() => {
    // Register background service worker for notifications when tab is closed
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          // If already granted, check for active sync
          if ("Notification" in window && Notification.permission === "granted") {
            setIsSubscribed(true);
          }
        })
        .catch((e) => console.log("ServiceWorker registration skipped", e));
    }

    // Check local storage subscription state
    const savedSub = localStorage.getItem("we_notifications_subscribed");
    if (savedSub === "true") {
      setIsSubscribed(true);
    }

    fetchBroadcasts();

    // Background interval check for new broadcasts
    const interval = setInterval(fetchBroadcasts, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchBroadcasts() {
    try {
      const res = await fetch("/api/notifications/public");
      const data = await res.json();
      if (data.success && Array.isArray(data.broadcasts)) {
        setBroadcasts(data.broadcasts);

        const lastSeen = localStorage.getItem("we_last_seen_broadcast_id");
        if (data.broadcasts.length > 0) {
          const latest = data.broadcasts[0];
          if (latest.id !== lastSeen) {
            setUnreadCount(1);
            // Trigger floating live toast
            setActiveToast(latest);
            // If browser push permitted, trigger background service worker notification
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              if ("serviceWorker" in navigator) {
                navigator.serviceWorker.ready.then((reg) => {
                  reg.showNotification(latest.title, {
                    body: latest.message,
                    icon: "/images/logo.png",
                    badge: "/images/logo.png",
                    tag: latest.id,
                    data: { url: latest.actionUrl || "/services" },
                  });
                });
              } else {
                try {
                  new Notification(latest.title, {
                    body: latest.message,
                    icon: "/images/logo.png",
                  });
                } catch (e) {}
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to load public notifications:", err);
    }
  }

  function handleOpenCenter() {
    setIsOpen(!isOpen);
    if (!isOpen && broadcasts.length > 0) {
      localStorage.setItem("we_last_seen_broadcast_id", broadcasts[0].id);
      setUnreadCount(0);
      setActiveToast(null);
    }
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubscribing(true);
    setSuccessMessage("");

    let browserGranted = false;
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        browserGranted = perm === "granted";
        if (browserGranted && "serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification("Written Expressa Alerts Enabled! 🔔", {
            body: "You will now receive custom project deadlines and offers even when you are not on the website.",
            icon: "/images/logo.png",
            badge: "/images/logo.png",
            tag: "we-welcome",
            data: { url: "/services" },
          });
        }
      } catch (err) {}
    }

    try {
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Student Visitor",
          contact: contact.trim() || (browserGranted ? "Web Push Browser" : "Direct Alerts"),
          browserEnabled: browserGranted,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubscribed(true);
        localStorage.setItem("we_notifications_subscribed", "true");
        setSuccessMessage("You are subscribed to Written Expressa custom alerts!");
        setName("");
        setContact("");
        setTimeout(() => setSuccessMessage(""), 4500);
      }
    } catch (err) {
      alert("Subscription failed. Please try again.");
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <>
      {/* 1. Header Notification Bell Button */}
      <div className="relative">
        <button
          onClick={handleOpenCenter}
          className="relative p-2 rounded-full text-zinc-700 hover:text-red-600 hover:bg-zinc-100 transition-colors cursor-pointer flex items-center justify-center"
          title="Notifications & Custom Announcements"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
          )}
        </button>

        {/* 2. Flyout Notifications Center Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-3 w-84 sm:w-96 rounded-3xl bg-white shadow-2xl border border-zinc-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-red-600/30 text-red-400 flex items-center justify-center">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight">Written Expressa Alerts</h3>
                  <p className="text-[10px] text-zinc-400">Custom announcements & academic notices</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subscribe Box */}
            <div className="p-4 bg-red-50/60 border-b border-red-100/80">
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold bg-white p-3 rounded-2xl border border-emerald-200/80 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div>Subscribed to Notifications</div>
                    <div className="text-[10px] text-zinc-500 font-normal">
                      You will receive all custom broadcast announcements.
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-red-600" />
                      <span>Subscribe to Custom Alerts</span>
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium">Free 1-Click</span>
                  </div>

                  <p className="text-[11px] text-zinc-600 leading-snug">
                    Receive instant alerts for IEEE submission deadlines, PowerPoint offers, and project templates.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name (e.g. Rahul)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ color: "#09090b" }}
                      className="w-full p-2 rounded-xl bg-white border border-zinc-200 text-[11px] text-zinc-950 font-bold placeholder-zinc-400 focus:outline-hidden focus:border-red-600"
                    />
                    <input
                      type="text"
                      placeholder="Email or WhatsApp"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      style={{ color: "#09090b" }}
                      className="w-full p-2 rounded-xl bg-white border border-zinc-200 text-[11px] text-zinc-950 font-bold placeholder-zinc-400 focus:outline-hidden focus:border-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={subscribing}
                    className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>{subscribing ? "Subscribing..." : "Enable Instant Notifications"}</span>
                    <Bell className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {successMessage && (
                <div className="mt-2 text-[11px] text-emerald-700 font-bold text-center">
                  {successMessage}
                </div>
              )}
            </div>

            {/* Broadcast Feed */}
            <div className="max-h-80 overflow-y-auto p-4 space-y-3 divide-y divide-zinc-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block pb-1">
                Recent Broadcasts
              </span>

              {broadcasts.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  No active broadcasts right now. Stay subscribed for upcoming announcements!
                </div>
              ) : (
                broadcasts.map((bc) => (
                  <div key={bc.id} className="pt-3 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        {bc.category}
                      </span>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(bc.sentAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-zinc-900 leading-snug">
                      {bc.title}
                    </h4>

                    <p className="text-[11px] text-zinc-600 leading-relaxed font-normal">
                      {bc.message}
                    </p>

                    {bc.actionUrl && (
                      <div className="pt-1">
                        <Link
                          href={bc.actionUrl}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline"
                        >
                          <span>{bc.actionText || "Learn More"}</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Floating Live Notification Toast (When new broadcast exists) */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-zinc-950 text-white rounded-3xl p-4 shadow-2xl border border-zinc-800 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    {activeToast.category}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[10px] text-zinc-400">Just now</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  {activeToast.title}
                </h4>
                <p className="text-[11px] text-zinc-300 mt-1 leading-snug line-clamp-2">
                  {activeToast.message}
                </p>

                {activeToast.actionUrl && (
                  <Link
                    href={activeToast.actionUrl}
                    onClick={() => setActiveToast(null)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 mt-2"
                  >
                    <span>{activeToast.actionText || "View Details"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

            <button
              onClick={() => setActiveToast(null)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
