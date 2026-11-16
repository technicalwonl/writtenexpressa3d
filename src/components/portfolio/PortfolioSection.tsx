"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  ArrowRight,
  ArrowUpRight,
  X,
  Search,
  FileText,
  Video,
  Presentation,
  Download,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  UploadCloud,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { buildWhatsAppOrderUrl, buildWhatsAppGeneralUrl } from "@/lib/whatsapp";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  mediaType?: "video" | "image" | "presentation" | "document" | "pdf" | "spreadsheet" | string;
  mediaUrl?: string;
  previewImage?: string;
  shortDescription: string;
  fullDescription?: string;
  deliverables?: string[];
  toolsUsed?: string[];
  clientType?: string;
  status?: string;
  featured?: boolean;
  slides?: string[];
  createdAt?: string;
}

const categories = [
  "All Projects",
  "Academic Projects",
  "PowerPoint Presentations",
  "Notes & Documentation",
  "Technical Projects",
  "Custom Magazines",
  "Creative Designs",
  "Websites & Applications",
  "IoT & Embedded Projects",
  "AI & Machine Learning",
];

export function PortfolioSection() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch("/api/admin/portfolio");
        const data = await res.json();
        if (data.success && Array.isArray(data.portfolio)) {
          // Filter to strictly authentic uploaded files
          const authenticProjects = data.portfolio.filter((p: any) => {
            const hasRealFile = Boolean(
              p.mediaUrl &&
              !p.mediaUrl.includes("/hero-sequence/") &&
              p.status !== "Draft"
            );
            return hasRealFile;
          });
          setProjects(authenticProjects);
        }
      } catch (e) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  const filtered = projects.filter((item) => {
    const matchesCat =
      activeCategory === "All Projects" ||
      item.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      activeCategory.toLowerCase().includes(item.category.toLowerCase());
    const matchesSearch =
      (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.shortDescription || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartProjectWhatsApp = () => {
    const url = buildWhatsAppGeneralUrl("Portfolio project inquiry");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleOrderProject = (project: PortfolioItem) => {
    const url = buildWhatsAppOrderUrl({
      serviceName: project.category,
      packageName: project.title,
      notes: `Referencing portfolio deliverable: "${project.title}"`,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="portfolio" className="relative py-20 sm:py-28 bg-white border-t border-zinc-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Hero Banner */}
        <div className="mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wider uppercase mb-3.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OUR WORK • AUTHENTIC DELIVERABLES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight max-w-4xl">
            Explore Our Creative Portfolio.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed">
            Discover our verified work across academic presentations, technical projects, professional
            documentation, creative designs, and digital solutions. Reflecting only real, client-approved deliverables.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("portfolio-grid");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8102E] hover:bg-[#A50D25] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 transition-all hover:scale-[1.02]"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleStartProjectWhatsApp}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs uppercase tracking-wider border border-zinc-300 shadow-xs transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>Start Your Project</span>
            </button>
          </div>
        </div>

        {/* Selected Work Search & Filter Section */}
        <div id="portfolio-grid" className="pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C8102E] block mb-1">
                SELECTED WORK
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                Projects made with purpose
              </h2>
            </div>
            <p className="text-xs text-zinc-500 max-w-xs">
              Live library reflecting verified uploaded deliverables from the Written Expressa database.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mb-6">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verified projects..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-zinc-300 text-xs text-zinc-950 font-semibold placeholder:text-zinc-500 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 bg-white shadow-xs"
              style={{ color: "#09090b" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#C8102E] text-white shadow-sm font-bold"
                    : "bg-white text-zinc-700 border border-zinc-200/90 hover:bg-zinc-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid or Clean Empty State */}
          {loading ? (
            <div className="py-20 text-center text-zinc-400 text-xs">
              Loading verified portfolio...
            </div>
          ) : projects.length === 0 ? (
            /* Clean Empty State: Reflects Only Uploaded Files */
            <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-[#C8102E] flex items-center justify-center mb-5 border border-red-200/60 shadow-xs">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8102E] bg-red-100/70 px-3 py-1 rounded-full">
                Verified Deliverables Only
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-4 tracking-tight">
                Reflecting Authentic Uploaded Files
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-lg mx-auto">
                Written Expressa displays only verified client deliverables and genuine technical files.
                All generic demo videos and synthetic placeholders have been removed. Any deliverable file
                (PDF, PPTX, MP4, Docs, ZIP) uploaded via the Admin Control Center will automatically appear here.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/admin/portfolio"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  <UploadCloud className="w-4 h-4 text-red-400" />
                  <span>Upload Files in Admin</span>
                </Link>

                <button
                  onClick={handleStartProjectWhatsApp}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C8102E] hover:bg-[#A50D25] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Order on WhatsApp (+91 9492801206)</span>
                </button>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 text-xs">
              No uploaded projects match &quot;{searchQuery || activeCategory}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => {
                const isVideo = item.mediaType === "video" || item.mediaUrl?.endsWith(".mp4") || item.mediaUrl?.endsWith(".webm");
                const isImage = item.mediaType === "image" || item.mediaUrl?.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i);
                const isPdf = item.mediaType === "pdf" || item.mediaUrl?.endsWith(".pdf");
                const isPresentation = item.mediaType === "presentation" || item.mediaUrl?.match(/\.(ppt|pptx)$/i);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProject(item)}
                    className="group relative rounded-3xl bg-zinc-50/80 border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#C8102E]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    {/* Top Thumbnail Canvas with Native Media Rendering */}
                    <div className="relative aspect-16/11 w-full bg-zinc-950 overflow-hidden flex items-center justify-center">
                      {isVideo && item.mediaUrl ? (
                        <div className="relative w-full h-full bg-black flex items-center justify-center">
                          <video
                            src={item.mediaUrl}
                            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                            muted
                            playsInline
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-[#C8102E] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 ml-0.5 fill-white" />
                            </div>
                          </div>
                        </div>
                      ) : isImage && (item.mediaUrl || item.previewImage) ? (
                        <img
                          src={item.mediaUrl || item.previewImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : isPdf ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-red-50/70 p-6 text-center border-b border-red-100">
                          <FileText className="w-12 h-12 text-[#C8102E] mb-2" />
                          <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                            PDF Document Deliverable
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-1 font-mono truncate max-w-[200px]">
                            {item.mediaUrl?.split("/").pop()}
                          </span>
                        </div>
                      ) : isPresentation ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-amber-500/10 p-6 text-center border-b border-amber-200">
                          <Presentation className="w-12 h-12 text-amber-600 mb-2" />
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                            PowerPoint Presentation Deck
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-1 font-mono truncate max-w-[200px]">
                            {item.mediaUrl?.split("/").pop()}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white p-6 text-center">
                          <FileText className="w-12 h-12 text-[#C8102E] mb-2" />
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                            {item.mediaType || "Verified Deliverable"}
                          </span>
                          <span className="text-[10px] text-zinc-400 mt-1 font-mono truncate max-w-[200px]">
                            {item.mediaUrl?.split("/").pop()}
                          </span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#C8102E] px-2.5 py-1 rounded-full shadow-xs">
                          {item.category}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-zinc-700 group-hover:text-[#C8102E] transition-colors shadow-xs">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Content Info */}
                    <div className="p-5 bg-white flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#C8102E] transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed">
                          {item.shortDescription}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="capitalize font-medium text-zinc-600">
                          {item.mediaType || "Deliverable"} • {item.createdAt ? item.createdAt.slice(0, 10) : "Verified"}
                        </span>
                        <span className="text-[#C8102E] font-semibold flex items-center gap-0.5">
                          <span>Preview File</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Multi-Format Interactive Modal Viewer */}
      {selectedProject && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/90">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8102E] bg-red-50 px-2.5 py-1 rounded-md">
                  {selectedProject.category}
                </span>
                <span className="text-xs text-zinc-400">•</span>
                <span className="text-xs font-semibold text-zinc-700 capitalize">
                  {selectedProject.mediaType || "Verified Deliverable"}
                </span>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-zinc-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Media Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* REAL VIDEO VIEWER */}
              {(selectedProject.mediaType === "video" || selectedProject.mediaUrl?.match(/\.(mp4|webm|mov)$/i)) && selectedProject.mediaUrl && (
                <div className="relative aspect-16/9 w-full bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                  <video
                    src={selectedProject.mediaUrl}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    className="w-full h-full object-contain"
                  >
                    <source src={selectedProject.mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* REAL IMAGE VIEWER */}
              {(selectedProject.mediaType === "image" || selectedProject.mediaUrl?.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i)) && selectedProject.mediaUrl && (
                <div className="relative w-full max-h-[65vh] bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 flex items-center justify-center p-2">
                  <img
                    src={selectedProject.mediaUrl}
                    alt={selectedProject.title}
                    className="max-h-[60vh] w-auto mx-auto object-contain rounded-xl shadow-xs"
                  />
                </div>
              )}

              {/* REAL PDF EMBED */}
              {(selectedProject.mediaType === "pdf" || selectedProject.mediaUrl?.endsWith(".pdf")) && selectedProject.mediaUrl && (
                <div className="w-full h-[65vh] bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 relative flex flex-col">
                  <iframe
                    src={`${selectedProject.mediaUrl}#toolbar=1&navpanes=0`}
                    className="w-full h-full border-0"
                    title={selectedProject.title}
                  />
                </div>
              )}

              {/* PRESENTATION / DOCUMENT / OTHER FILE TYPES */}
              {!selectedProject.mediaUrl?.match(/\.(mp4|webm|mov|jpg|jpeg|png|webp|svg|gif|pdf)$/i) && (
                <div className="p-8 bg-zinc-50/80 rounded-2xl border border-zinc-200 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#C8102E] flex items-center justify-center mb-3 shadow-xs">
                    {selectedProject.mediaType === "presentation" ? (
                      <Presentation className="w-8 h-8" />
                    ) : (
                      <FileText className="w-8 h-8" />
                    )}
                  </div>
                  <h4 className="text-base font-bold text-zinc-900">{selectedProject.title}</h4>
                  <p className="text-xs text-zinc-500 mt-1.5 max-w-sm">
                    Verified deliverable ({selectedProject.mediaType?.toUpperCase() || "DOCUMENT"}). Click below to download or view the file directly.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    {selectedProject.mediaUrl && (
                      <a
                        href={selectedProject.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                      >
                        <Download className="w-4 h-4 text-red-400" />
                        <span>Download {selectedProject.mediaType?.toUpperCase() || "File"}</span>
                      </a>
                    )}
                    {selectedProject.mediaUrl && (
                      <a
                        href={selectedProject.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        <ExternalLink className="w-4 h-4 text-zinc-600" />
                        <span>Open Raw File</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Project Meta and Details */}
              <div>
                <h2 className="text-2xl font-bold font-serif text-zinc-900">
                  {selectedProject.title}
                </h2>
                <p className="mt-3 text-sm text-zinc-600 leading-relaxed font-normal">
                  {selectedProject.fullDescription || selectedProject.shortDescription}
                </p>

                {/* Deliverables and Tools */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                      Verified Deliverables:
                    </span>
                    <ul className="space-y-1 text-xs text-zinc-700 font-medium">
                      {(selectedProject.deliverables || ["Final Deliverable", "Quality Checked"]).map(
                        (d, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
                            <span>{d}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                      Tools & Standards:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedProject.toolsUsed || ["Institutional Standard"]).map((t, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-white text-zinc-700 px-2.5 py-1 rounded-md border border-zinc-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="p-5 border-t border-zinc-100 bg-zinc-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-zinc-500 font-medium text-center sm:text-left">
                Want a custom deliverable with similar specifications?
              </span>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                {selectedProject.mediaUrl && (
                  <a
                    href={selectedProject.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <Download className="w-4 h-4 text-zinc-600" />
                    <span>Download File</span>
                  </a>
                )}

                <button
                  onClick={() => handleOrderProject(selectedProject)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ORDER SIMILAR ON WHATSAPP (+91 9492801206)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
