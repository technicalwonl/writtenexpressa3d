"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Save,
  CheckCircle2,
  RefreshCw,
  Globe,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react";

export default function AdminContentPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (data.success && data.content) {
        setContent(data.content);
      }
    } catch (e) {
      console.error("Failed to load content:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSuccessMsg("Website content updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        alert("Failed to update website content");
      }
    } catch (err) {
      alert("Error saving website content");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !content) {
    return (
      <div className="py-24 text-center text-xs text-neutral-400">
        Loading CMS editor...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Website Copy & CMS Editor
          </h2>
          <p className="text-xs text-neutral-500">
            Edit public-facing brand copy, mission statements, hero headlines, and contact details
          </p>
        </div>

        <div className="flex items-center gap-2">
          {successMsg && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {successMsg}
            </span>
          )}
          <button
            onClick={fetchContent}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* HERO SECTION */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <span className="p-1.5 rounded-lg bg-[#C8102E]/10 text-[#C8102E]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold font-serif text-[#111318]">
              01 — Hero Section Copy
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Headline
            </label>
            <input
              type="text"
              value={content.hero?.headline || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, headline: e.target.value },
                })
              }
              className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Supporting Description
            </label>
            <textarea
              rows={3}
              value={content.hero?.supportingDescription || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, supportingDescription: e.target.value },
                })
              }
              className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Brand Philosophy Tagline
            </label>
            <input
              type="text"
              value={content.hero?.philosophy || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, philosophy: e.target.value },
                })
              }
              className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#C8102E]"
            />
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <span className="p-1.5 rounded-lg bg-neutral-100 text-neutral-800">
              <Globe className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold font-serif text-[#111318]">
              02 — About Written Expressa
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Section Heading
            </label>
            <input
              type="text"
              value={content.about?.heading || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, heading: e.target.value },
                })
              }
              className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Founding Vision & Story
            </label>
            <textarea
              rows={3}
              value={content.about?.foundingVision || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, foundingVision: e.target.value },
                })
              }
              className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Mission Statement
              </label>
              <textarea
                rows={3}
                value={content.about?.mission || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...content.about, mission: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#C8102E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Vision Statement
              </label>
              <textarea
                rows={3}
                value={content.about?.vision || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...content.about, vision: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>
        </div>

        {/* CONTACT & CHANNELS */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Phone className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold font-serif text-[#111318]">
              03 — Contact & Communication Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Official Support Email
              </label>
              <input
                type="email"
                value={content.contact?.officialEmail || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, officialEmail: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                WhatsApp Direct Number
              </label>
              <input
                type="text"
                value={content.contact?.whatsappNumber || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, whatsappNumber: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="text"
                value={content.contact?.instagramUrl || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, instagramUrl: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Pan-India Delivery Note
              </label>
              <input
                type="text"
                value={content.contact?.location || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, location: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-sm shadow-[#C8102E]/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Publishing Changes..." : "Publish Website Copy"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
