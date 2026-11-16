import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { getTableData, initializeDatabase } from "@/lib/db";
import { Calendar, User, ArrowLeft, MessageSquare, Share2 } from "lucide-react";
import { buildWhatsAppGeneralUrl } from "@/lib/whatsapp";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  initializeDatabase();
  const { slug } = await params;
  const blogs = getTableData<any[]>("blogs", []);
  const article = blogs.find((b) => b.slug === slug);

  if (!article) return { title: "Article Not Found | Written Expressa" };

  return {
    title: `${article.title} | Written Expressa`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  initializeDatabase();
  const { slug } = await params;
  const blogs = getTableData<any[]>("blogs", []);
  const article = blogs.find((b) => b.slug === slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Person",
      name: article.author || "Written Expressa Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Written Expressa",
      logo: {
        "@type": "ImageObject",
        url: "https://www.writtenexpressa.in/images/book-closed.webp",
      },
    },
    datePublished: article.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.writtenexpressa.in/blog/${article.slug}`,
    },
  };

  const consultWhatsApp = buildWhatsAppGeneralUrl(`Article: ${article.title}`);

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />

      <article className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <div className="mb-10 pb-8 border-b border-zinc-200">
          <div className="flex items-center gap-3 text-xs mb-3">
            <span className="font-bold uppercase tracking-wider text-[#C8102E] bg-red-50 px-2.5 py-0.5 rounded-md">
              {article.category}
            </span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.publishedAt).toLocaleDateString([], {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-zinc-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          <div className="mt-6 flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center">
                {article.author?.[0] || "W"}
              </div>
              <span className="font-semibold text-zinc-800">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-400">Written Expressa Editorial</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed text-base space-y-5">
          <p className="whitespace-pre-wrap">{article.content}</p>
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-zinc-200 flex flex-wrap gap-2">
          {(article.tags || []).map((tag: string, idx: number) => (
            <span
              key={idx}
              className="px-3 py-1 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Dedicated Service Order Callout */}
        <div className="mt-14 p-8 rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C8102E]">
              Direct Expert Service
            </span>
            <h3 className="text-xl font-bold font-serif text-zinc-900 mt-1">
              Have a project or presentation due?
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-lg">
              Let Written Expressa handle the research, formatting, slides, or technical schematics. Direct WhatsApp communication with zero hassle.
            </p>
          </div>

          <a
            href={consultWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-all shadow-md shadow-emerald-600/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Order on WhatsApp (+91 9492801206)</span>
          </a>
        </div>
      </article>

      <Footer />
    </main>
  );
}
