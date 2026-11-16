"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Database,
  Download,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.siteSettings) {
          setSettings(data.siteSettings);
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "site", data: settings }),
      });
      if (res.ok) {
        setSuccessMsg("Global platform settings updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        alert("Failed to save settings");
      }
    } catch (err) {
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  }

  function downloadBackup() {
    window.open("/api/admin/services", "_blank");
  }

  if (loading || !settings) {
    return (
      <div className="py-24 text-center text-xs text-neutral-400">Loading settings...</div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Global Platform Settings
          </h2>
          <p className="text-xs text-neutral-500">
            Control business operation switches, currencies, contact routing, and maintenance modes
          </p>
        </div>

        {successMsg && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {successMsg}
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Core Identity */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold font-serif text-[#111318] pb-2 border-b border-neutral-100">
            Platform Brand Identity
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.siteName || ""}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currencySymbol || "₹"}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Tagline</label>
            <input
              type="text"
              value={settings.tagline || ""}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
            />
          </div>
        </div>

        {/* Operational Toggles */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold font-serif text-[#111318] pb-2 border-b border-neutral-100">
            Business Operational Controls
          </h3>

          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
            <div>
              <div className="font-semibold text-neutral-800">Public Enquiries Active</div>
              <div className="text-[11px] text-neutral-500">
                Allow prospective clients to submit orders and consultation requests
              </div>
            </div>
            <input
              type="checkbox"
              checked={Boolean(settings.allowEnquiries)}
              onChange={(e) => setSettings({ ...settings, allowEnquiries: e.target.checked })}
              className="w-5 h-5 text-[#C8102E] rounded border-neutral-300"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
            <div>
              <div className="font-semibold text-neutral-800">Maintenance Mode</div>
              <div className="text-[11px] text-neutral-500">
                Display temporary scheduled maintenance banner on public pages
              </div>
            </div>
            <input
              type="checkbox"
              checked={Boolean(settings.maintenanceMode)}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-5 h-5 text-[#C8102E] rounded border-neutral-300"
            />
          </div>
        </div>

        {/* Contact Support Routing */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold font-serif text-[#111318] pb-2 border-b border-neutral-100">
            Support Routing
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Official Support Email</label>
              <input
                type="email"
                value={settings.supportEmail || ""}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Support Phone</label>
              <input
                type="text"
                value={settings.supportPhone || ""}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
