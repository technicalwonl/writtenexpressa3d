import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { getTableData, initializeDatabase } from "@/lib/db";
import { Calendar, ArrowRight, User, Tag, BookOpen, MessageSquare } from "lucide-react";
import { buildWhatsAppGeneralUrl } from "@/lib/whatsapp";

export const metadata = {
  title: "Academic & Creative Guides | Written Expressa Blog",
  description:
    "Expert articles and guides on academic project documentation, IEEE standards, PowerPoint presentation delivery, and custom commemorative magazines.",
};

export default function BlogListingPage() {
  initializeDatabase();
  const blogs = getTableData<any[]>("blogs", []).filter((b) => b.status === "Published");

  const askWhatsApp = buildWhatsAppGeneralUrl("Consultation from the Written Expressa Blog");

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wider uppercase mb-4">
            Written Expressa Insights
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Academic & Creative <span className="text-[#C8102E]">Knowledge Hub.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
            Practical guides, IEEE documentation frameworks, presentation design masterclasses, and commemorative print inspiration.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.length === 0 ? (
            <div className="col-span-3 py-16 text-center text-zinc-400 text-sm">
              Articles are currently being prepared. Check back shortly.
            </div>
          ) : (
            blogs.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between rounded-3xl bg-zinc-50 border border-zinc-200/90 overflow-hidden hover:bg-white hover:border-[#C8102E]/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C8102E]">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.publishedAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold font-serif text-zinc-900 group-hover:text-[#C8102E] transition-colors line-clamp-2">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h2>

                  <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(article.tags || []).slice(0, 3).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-white text-zinc-600 px-2.5 py-0.5 rounded-md border border-zinc-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-7 pt-0 border-t border-zinc-200/60 mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-medium">By {article.author}</span>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8102E] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>

        {/* WhatsApp Banner */}
        <div className="mt-20 p-8 rounded-3xl bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              Personalized Assistance
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif mt-1">
              Need hands-on assistance with your project or slides?
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Chat directly with our academic and technical specialists on WhatsApp.
            </p>
          </div>
          <a
            href={askWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-all shadow-md shadow-emerald-600/30"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp (+91 9492801206)</span>
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
