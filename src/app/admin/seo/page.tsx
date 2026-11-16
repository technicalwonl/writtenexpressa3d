"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Save,
  CheckCircle2,
  Globe,
  Share2,
  Sparkles,
  Bot,
  FileCode,
  ShieldCheck,
  ExternalLink,
  Activity,
  Layers,
} from "lucide-react";

export default function AdminSEOPage() {
  const [seo, setSeo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadSEO() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.seoSettings) {
          setSeo(data.seoSettings);
        }
      } catch (e) {
        console.error("Failed to load SEO settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSEO();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "seo", data: seo }),
      });
      if (res.ok) {
        setSuccessMsg("SEO and metadata updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        alert("Failed to save SEO settings");
      }
    } catch (err) {
      alert("Error saving SEO settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !seo) {
    return (
      <div className="py-24 text-center text-xs text-neutral-400">Loading SEO settings...</div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            SEO, AEO & AI Discoverability Center
          </h2>
          <p className="text-xs text-neutral-500">
            Configure search engine indexing, ChatGPT Search (OAI-SearchBot) permissions, LLM index, and verification tags
          </p>
        </div>

        {successMsg && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {successMsg}
          </span>
        )}
      </div>

      {/* AI Crawlers & Search Engines Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              ChatGPT Search
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-sm font-bold text-[#111318]">OAI-SearchBot</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Status: Allowed in robots.txt</p>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              OpenAI Training
            </span>
            <span className="w-2 h-2 rounded-full bg-neutral-400" />
          </div>
          <div className="text-sm font-bold text-[#111318]">GPTBot</div>
          <p className="text-[11px] text-neutral-500 font-medium mt-1">Status: Disallowed (Search-only)</p>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Google & Bing
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-sm font-bold text-[#111318]">Googlebot / Bingbot</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Status: 100% Crawlable</p>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              LLM Knowledge File
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-sm font-bold text-[#111318]">/llms.txt Standard</div>
          <a
            href="/llms.txt"
            target="_blank"
            className="text-[11px] text-blue-600 font-semibold hover:underline mt-1 inline-flex items-center gap-1"
          >
            <span>View llms.txt</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Inputs (2 Cols) */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-4 text-xs">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-neutral-100 pb-2">
              Metadata & Search Engine Snippets
            </h3>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Website Meta Title (Recommended 50–60 characters)
              </label>
              <input
                type="text"
                value={seo.siteTitle || ""}
                onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                style={{ color: "#09090b" }}
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Meta Description (Recommended 140–160 characters)
              </label>
              <textarea
                rows={3}
                value={seo.metaDescription || ""}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                style={{ color: "#09090b" }}
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Target SEO Keywords (Comma separated)
              </label>
              <textarea
                rows={2}
                value={seo.keywords || ""}
                onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                style={{ color: "#09090b" }}
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Canonical Base URL</label>
                <input
                  type="text"
                  value={seo.canonicalUrl || ""}
                  onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  style={{ color: "#09090b" }}
                  className="w-full p-2 rounded-xl border border-neutral-200 text-zinc-950 font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Open Graph Image</label>
                <input
                  type="text"
                  value={seo.ogImage || ""}
                  onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                  style={{ color: "#09090b" }}
                  className="w-full p-2 rounded-xl border border-neutral-200 text-zinc-950 font-bold font-mono text-[11px]"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-zinc-900 border-b border-neutral-100 pt-3 pb-2">
              Webmaster Verification & Search Console
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Google Search Console Verification Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. google-site-verification=XYZ..."
                  value={seo.googleVerification || ""}
                  onChange={(e) => setSeo({ ...seo, googleVerification: e.target.value })}
                  style={{ color: "#09090b" }}
                  className="w-full p-2 rounded-xl border border-neutral-200 text-zinc-950 font-bold placeholder:text-neutral-400"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Bing Webmaster Verification Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. msvalidate.01=ABC..."
                  value={seo.bingVerification || ""}
                  onChange={(e) => setSeo({ ...seo, bingVerification: e.target.value })}
                  style={{ color: "#09090b" }}
                  className="w-full p-2 rounded-xl border border-neutral-200 text-zinc-950 font-bold placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save SEO & Verification"}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Live Search Snippet Simulator & Crawl Links (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
              Google & AI Answer Preview
            </span>
            <div className="p-4 bg-neutral-50 rounded-xl space-y-1">
              <div className="text-[11px] text-neutral-500 truncate flex items-center gap-1 font-mono">
                <span>{seo.canonicalUrl || "https://www.writtenexpressa.in"}</span>
              </div>
              <div className="text-sm font-semibold text-[#1a0dab] line-clamp-1">
                {seo.siteTitle || "Written Expressa"}
              </div>
              <div className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                {seo.metaDescription || "From academic presentations to technical solutions..."}
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              Direct Technical File Validation
            </span>
            <div className="space-y-2 text-xs">
              <a
                href="/robots.txt"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors border border-neutral-200"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-neutral-600" />
                  <span className="font-semibold text-neutral-800">robots.txt</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold">OAI-SearchBot Allowed</span>
              </a>

              <a
                href="/sitemap.xml"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors border border-neutral-200"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neutral-600" />
                  <span className="font-semibold text-neutral-800">sitemap.xml</span>
                </div>
                <span className="text-[11px] text-blue-600 font-bold">All 12 Services + Blogs</span>
              </a>

              <a
                href="/llms.txt"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors border border-neutral-200"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-neutral-600" />
                  <span className="font-semibold text-neutral-800">llms.txt</span>
                </div>
                <span className="text-[11px] text-purple-600 font-bold">AI Knowledge Guide</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
