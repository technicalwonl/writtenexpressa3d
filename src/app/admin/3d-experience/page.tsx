"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Save,
  CheckCircle2,
  Sliders,
  Sparkles,
  Smartphone,
  Monitor,
  Eye,
  RefreshCw,
} from "lucide-react";

export default function Admin3DExperiencePage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/3d-experience");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.error("Failed to load 3D settings:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/3d-experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccessMsg("3D canvas physics parameters saved successfully!");
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

  if (loading || !settings) {
    return (
      <div className="py-24 text-center text-xs text-neutral-400">
        Loading 3D parameters...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            3D Hero Canvas & Physics Parameters
          </h2>
          <p className="text-xs text-neutral-500">
            Control the 150-frame scroll-driven creative universe, lerp damping, and mobile behavior
          </p>
        </div>

        <div className="flex items-center gap-2">
          {successMsg && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {successMsg}
            </span>
          )}
          <a
            href="/"
            target="_blank"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </a>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Frame Sequence Architecture */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#C8102E]/10 text-[#C8102E]">
                <Box className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold font-serif text-[#111318]">
                  WebP Canvas Sequence Pipeline
                </h3>
                <p className="text-xs text-neutral-400">
                  Pre-rendered from authentic book opening animation assets
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              150 Frames Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-neutral-50 rounded-xl">
              <div className="text-neutral-400 text-[10px] uppercase font-bold">Start Frame</div>
              <div className="font-mono font-bold text-[#111318] mt-1">/hero-sequence/frame_000.webp</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Closed Expressa Book</div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl">
              <div className="text-neutral-400 text-[10px] uppercase font-bold">Mid Sequence</div>
              <div className="font-mono font-bold text-[#111318] mt-1">frame_075.webp</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Pages Float & Transform into PPT</div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl">
              <div className="text-neutral-400 text-[10px] uppercase font-bold">End Frame</div>
              <div className="font-mono font-bold text-[#111318] mt-1">frame_149.webp</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Expressa Identity Revealed</div>
            </div>
          </div>
        </div>

        {/* Physics & Damping Parameters */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <span className="p-1.5 rounded-lg bg-neutral-100 text-neutral-800">
              <Sliders className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold font-serif text-[#111318]">
              Scroll Physics & Interpolation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-700">
                  Scroll Container Height ({settings.scrollContainerHeight}vh)
                </label>
                <span className="text-[11px] text-neutral-400">Controls scroll journey length</span>
              </div>
              <input
                type="range"
                min="300"
                max="800"
                step="20"
                value={settings.scrollContainerHeight || 520}
                onChange={(e) =>
                  setSettings({ ...settings, scrollContainerHeight: Number(e.target.value) })
                }
                className="w-full accent-[#C8102E]"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>300vh (Faster)</span>
                <span>520vh (Recommended)</span>
                <span>800vh (Cinematic Slow)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-700">
                  Lerp Damping Speed ({settings.lerpSpeed})
                </label>
                <span className="text-[11px] text-neutral-400">Controls inertia & smoothness</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.2"
                step="0.005"
                value={settings.lerpSpeed || 0.065}
                onChange={(e) =>
                  setSettings({ ...settings, lerpSpeed: Number(e.target.value) })
                }
                className="w-full accent-[#C8102E]"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>0.02 (Silky heavy)</span>
                <span>0.065 (Balanced)</span>
                <span>0.2 (Snappy)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-800">
                Interactive Mouse Parallax
              </span>
              <p className="text-[11px] text-neutral-400">
                Subtle cursor tilt and depth displacement while scrolling
              </p>
            </div>
            <input
              type="checkbox"
              checked={Boolean(settings.enableMouseParallax)}
              onChange={(e) =>
                setSettings({ ...settings, enableMouseParallax: e.target.checked })
              }
              className="w-5 h-5 text-[#C8102E] rounded border-neutral-300"
            />
          </div>
        </div>

        {/* Mobile & Performance Optimization */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Smartphone className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold font-serif text-[#111318]">
              Mobile Device Optimization
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Mobile Render Strategy
              </label>
              <select
                value={settings.mobileMode || "OptimizedCanvas"}
                onChange={(e) => setSettings({ ...settings, mobileMode: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
              >
                <option value="OptimizedCanvas">Optimized Canvas (Downsampled Canvas Stream)</option>
                <option value="StaticFallback">High-Res Static Brand Wall Fallback</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Target Frame Rate
              </label>
              <select
                value={settings.desktopFrameRateTarget || 60}
                onChange={(e) =>
                  setSettings({ ...settings, desktopFrameRateTarget: Number(e.target.value) })
                }
                className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
              >
                <option value={60}>60 FPS (Silky Smooth)</option>
                <option value={30}>30 FPS (Battery Saving)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-sm shadow-[#C8102E]/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Updating Physics Engine..." : "Apply 3D Parameters"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
