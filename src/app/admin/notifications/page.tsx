"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Inbox,
  ShoppingBag,
  Star,
  Trash2,
  ExternalLink,
  Sparkles,
  Smartphone,
  Globe,
  Tag,
  AlertCircle,
  Radio,
  History,
} from "lucide-react";

export default function AdminNotificationsPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [internalAlerts, setInternalAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"broadcast" | "subscribers" | "history" | "internal">("broadcast");

  // Broadcast Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Academic Alert");
  const [actionUrl, setActionUrl] = useState("/services/project-documentation");
  const [actionText, setActionText] = useState("View Details");
  const [targetAudience, setTargetAudience] = useState("All Subscribed Users");
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers || []);
        setBroadcasts(data.broadcasts || []);
        setInternalAlerts(data.internalAlerts || []);
      }
    } catch (err) {
      console.error("Failed to load notifications data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSending(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          category,
          actionUrl: actionUrl.trim(),
          actionText: actionText.trim(),
          targetAudience,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Notification "${data.broadcast?.title}" successfully broadcasted to all ${subscribers.length} subscribers!`);
        setTitle("");
        setMessage("");
        fetchData();
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        alert(data.message || "Failed to send notification");
      }
    } catch (err) {
      alert("Error sending notification");
    } finally {
      setSending(false);
    }
  }

  async function handleDeleteItem(id: string, type: "subscriber" | "broadcast") {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const res = await fetch(`/api/admin/notifications?id=${id}&type=${type}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (type === "subscriber") {
          setSubscribers((prev) => prev.filter((s) => s.id !== id));
        } else {
          setBroadcasts((prev) => prev.filter((b) => b.id !== id));
        }
      }
    } catch (err) {
      alert("Failed to delete");
    }
  }

  function markAllAlertsAsRead() {
    setInternalAlerts((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function dismissAlert(id: string) {
    setInternalAlerts((prev) => prev.filter((n) => n.id !== id));
  }

  const activeSubscribers = subscribers.filter((s) => s.status === "Active").length;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318] flex items-center gap-2">
            <span>Subscriber Notifications & Broadcast Center</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </h2>
          <p className="text-xs text-neutral-500">
            Dispatch custom announcements and alerts to subscribed users, manage subscriber records, and monitor internal cues
          </p>
        </div>

        {successMsg && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {successMsg}
          </span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Subscribed Users
            </span>
            <div className="text-2xl font-bold text-[#111318] mt-1">{subscribers.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {activeSubscribers} Active Subscribers
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Custom Broadcasts Sent
            </span>
            <div className="text-2xl font-bold text-[#111318] mt-1">{broadcasts.length}</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-0.5">
              Delivered across all devices
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Operational Actions
            </span>
            <div className="text-2xl font-bold text-[#111318] mt-1">{internalAlerts.length}</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-0.5">
              Enquiries & Pending Reviews
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3">
        {[
          { id: "broadcast", label: "Send Custom Broadcast", icon: Send },
          { id: "subscribers", label: `Subscribed Users (${subscribers.length})`, icon: Users },
          { id: "history", label: `Broadcast History (${broadcasts.length})`, icon: History },
          { id: "internal", label: `Internal Alerts (${internalAlerts.length})`, icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-[#111318] text-white shadow-xs"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SEND CUSTOM BROADCAST */}
      {activeTab === "broadcast" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dispatch Form (7 Cols) */}
          <form onSubmit={handleSendBroadcast} className="lg:col-span-7 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-neutral-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8102E]">
                Target Audience: {subscribers.length} Subscribers
              </span>
              <h3 className="text-base font-bold text-[#111318] mt-0.5">
                Compose Custom Broadcast Notification
              </h3>
              <p className="text-xs text-neutral-500">
                This custom alert will be immediately pushed to all subscribed website visitors and mobile users.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                Notification Headline / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Special Offer: 20% Off on Major Project IEEE Documentation"
                style={{ color: "#09090b" }}
                className="w-full rounded-xl bg-white border border-neutral-300 p-2.5 text-xs text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                  Notification Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ color: "#09090b" }}
                  className="w-full rounded-xl bg-white border border-neutral-300 p-2.5 text-xs text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E]"
                >
                  <option value="Academic Alert">Academic Alert</option>
                  <option value="Seasonal Discount & Offer">Seasonal Discount & Offer</option>
                  <option value="New Service Announcement">New Service Announcement</option>
                  <option value="PowerPoint Template Drop">PowerPoint Template Drop</option>
                  <option value="Urgent Deadline Notice">Urgent Deadline Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                  Target Group
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  style={{ color: "#09090b" }}
                  className="w-full rounded-xl bg-white border border-neutral-300 p-2.5 text-xs text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E]"
                >
                  <option value="All Subscribed Users">All Subscribed Users ({subscribers.length})</option>
                  <option value="Academic Students">Academic Students Only</option>
                  <option value="Creative & Magazine Clients">Creative & Magazine Clients</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                Detailed Notification Message *
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Preparing your final year B.Tech major project? Get professional Turnitin-checked IEEE documentation and clean PPT decks with fast turnaround."
                style={{ color: "#09090b" }}
                className="w-full rounded-xl bg-white border border-neutral-300 p-2.5 text-xs text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                  Action Link / Target URL
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="e.g. /services/project-documentation or WhatsApp URL"
                  style={{ color: "#09090b" }}
                  className="w-full rounded-xl bg-white border border-neutral-300 p-2.5 text-xs text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                  Action Button Label
                </label>
                <input
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="e.g. Claim Offer / View Details"
                  style={{ color: "#09090b" }}
                  className="w-full rounded-xl bg-white border border-neutral-300 p-2.5 text-xs text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-medium">
                Broadcast recipient count: <strong>{subscribers.length} subscribers</strong>
              </span>

              <button
                type="submit"
                disabled={sending}
                className="px-6 py-3 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 inline-flex items-center gap-2 shadow-sm shadow-[#C8102E]/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sending ? "Broadcasting to Subscribers..." : "Send Custom Notification"}</span>
              </button>
            </div>
          </form>

          {/* Real-time Notification Preview Simulator (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                Live Visitor Toast Preview
              </span>

              <div className="p-4 rounded-2xl bg-zinc-900 text-white shadow-xl border border-zinc-800 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                      W
                    </div>
                    <span className="text-xs font-bold tracking-tight">Written Expressa</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                    {category}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-2">
                    {title || "Special Project Submission Announcement"}
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 line-clamp-3 leading-relaxed">
                    {message || "Compose your announcement on the left to see exactly how it appears to your subscribed users."}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-zinc-500">Just now • Broadcast</span>
                  <span className="text-xs font-bold text-red-400 hover:underline">
                    {actionText || "View Details"} →
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <h4 className="text-xs font-bold text-zinc-900">How Subscription Works</h4>
              <ul className="space-y-1.5 text-xs text-zinc-600">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Visitors subscribe via the Bell widget or subscription modal on the homepage.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Each broadcast triggers in-app notification toasts and records to the user's notification center.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Subscribers with browser permissions receive native desktop & mobile push alerts.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIBED USERS */}
      {activeTab === "subscribers" && (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-bold text-[#111318]">Subscribed Users Directory</h3>
              <p className="text-xs text-neutral-500">
                All users who subscribed to Written Expressa custom alerts and project updates
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              {subscribers.length} Registered Subscribers
            </span>
          </div>

          {subscribers.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No subscribers yet. Users can subscribe using the notification bell on the public website.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">Subscriber Name</th>
                    <th className="pb-3 font-bold">Contact / Endpoint</th>
                    <th className="pb-3 font-bold">Channel Type</th>
                    <th className="pb-3 font-bold">Date Subscribed</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-neutral-50/60">
                      <td className="py-3 font-bold text-zinc-900">{sub.name}</td>
                      <td className="py-3 font-mono text-[11px] text-zinc-600">{sub.contact}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                          {sub.type || "Web Push Notification"}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-500 text-[11px]">
                        {new Date(sub.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          {sub.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteItem(sub.id, "subscriber")}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove Subscriber"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BROADCAST HISTORY */}
      {activeTab === "history" && (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-bold text-[#111318]">Sent Broadcast Notifications Log</h3>
              <p className="text-xs text-neutral-500">
                Log of all custom notifications broadcasted to subscribed clients
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              {broadcasts.length} Sent Broadcasts
            </span>
          </div>

          {broadcasts.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No broadcast notifications have been sent yet.
            </div>
          ) : (
            <div className="space-y-3">
              {broadcasts.map((bc) => (
                <div
                  key={bc.id}
                  className="p-4 rounded-xl border border-neutral-200 flex items-start justify-between gap-4 hover:border-neutral-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-950">{bc.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        {bc.category}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {bc.status || "Delivered"}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600">{bc.message}</p>

                    <div className="flex items-center gap-4 text-[11px] text-zinc-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(bc.sentAt).toLocaleString()}
                      </span>
                      <span>Target: {bc.targetAudience || "All Subscribers"}</span>
                      <span>Reached: {bc.recipientCount} subscribers</span>
                      {bc.actionUrl && (
                        <Link href={bc.actionUrl} target="_blank" className="text-blue-600 font-semibold hover:underline flex items-center gap-0.5">
                          <span>{bc.actionText || "Action Link"}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(bc.id, "broadcast")}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INTERNAL OPERATIONAL ALERTS */}
      {activeTab === "internal" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111318]">Internal Operations Queue</h3>
              <p className="text-xs text-neutral-500">
                Actionable enquiries, pending order balances, and testimonial moderation
              </p>
            </div>
            <button
              onClick={markAllAlertsAsRead}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
            >
              Mark all as resolved
            </button>
          </div>

          <div className="space-y-3">
            {internalAlerts.length === 0 ? (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-[#111318]">All operational queues cleared!</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  No pending enquiries, unread reviews, or alerts requiring immediate action.
                </p>
              </div>
            ) : (
              internalAlerts.map((notif) => (
                <div
                  key={notif.id}
                  className={`bg-white border rounded-2xl p-4 shadow-xs flex items-start justify-between gap-4 transition-all ${
                    notif.read ? "border-neutral-200/60 opacity-75" : "border-[#C8102E]/30 bg-red-50/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl flex-shrink-0 ${
                        notif.type === "enquiry"
                          ? "bg-[#C8102E]/10 text-[#C8102E]"
                          : notif.type === "order"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {notif.type === "enquiry" ? (
                        <Inbox className="w-4 h-4" />
                      ) : notif.type === "order" ? (
                        <ShoppingBag className="w-4 h-4" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-[#111318]">{notif.title}</h3>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                        {notif.description}
                      </p>
                      <div className="text-[10px] text-neutral-400 mt-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(notif.time).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={notif.href}
                      className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 transition-colors flex items-center gap-1"
                    >
                      <span>Resolve</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => dismissAlert(notif.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600"
                      title="Dismiss"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
