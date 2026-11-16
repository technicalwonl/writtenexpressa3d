"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  ExternalLink,
  Eye,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const [form, setForm] = useState({
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Academic Solutions",
    tags: "Documentation, IEEE, Engineering",
    author: "Written Expressa Editorial",
    status: "Published",
    coverImage: "/hero-sequence/frame_075.webp",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (e) {
      console.error("Failed to load blogs:", e);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingBlog(null);
    setForm({
      id: `blog_${Date.now()}`,
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Academic Solutions",
      tags: "Academic, Presentation, Guide",
      author: "Sai Sheshank",
      status: "Published",
      coverImage: "/hero-sequence/frame_075.webp",
    });
    setIsModalOpen(true);
  }

  function openEdit(item: any) {
    setEditingBlog(item);
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || "",
      content: item.content || "",
      category: item.category || "Academic Solutions",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
      author: item.author || "Editorial Team",
      status: item.status || "Published",
      coverImage: item.coverImage || "/hero-sequence/frame_075.webp",
    });
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    try {
      const method = editingBlog ? "PUT" : "POST";
      const res = await fetch("/api/admin/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        alert("Failed to save article");
      }
    } catch (e) {
      alert("Error saving article");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog article?")) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (e) {
      alert("Failed to delete article");
    }
  }

  const filtered = blogs.filter(
    (b) =>
      (b.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Articles & Academic Blog CMS
          </h2>
          <p className="text-xs text-neutral-500">
            Publish guides on project documentation, presentation tips, and college farewell magazines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            target="_blank"
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Public Blog</span>
          </Link>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#a00d24] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search articles by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
          />
        </div>
        <span className="text-xs text-neutral-400 font-medium">Total Published: {blogs.length}</span>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs text-neutral-400">Loading articles...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-xs text-neutral-400">
            No articles match your search.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#C8102E]/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8102E] bg-red-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold font-serif text-zinc-900 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-3 leading-relaxed">
                  {item.excerpt || item.content}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Draft"}
                  </span>
                  <span>• By {item.author}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <Link
                  href={`/blog/${item.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-[#C8102E] hover:underline flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-bold font-serif text-[#111318]">
                {editingBlog ? "Edit Article" : "Write New Article"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. How to Structure an Engineering Project Report According to IEEE Standards"
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="leave blank for auto-generation"
                    className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-200"
                  >
                    <option value="Academic Solutions">Academic Solutions</option>
                    <option value="Creative Design">Creative Design</option>
                    <option value="Technical Solutions">Technical Solutions</option>
                    <option value="Digital Services">Digital Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Short 2-sentence teaser for search engines and cards..."
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Article Content *</label>
                <textarea
                  rows={6}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write complete guide, headings, and recommendations..."
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Author Name</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] font-semibold"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
