"use client";

import { useState, useEffect } from "react";
import {
  MessageSquareHeart,
  Star,
  Send,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Quote,
} from "lucide-react";
import { contactConfig } from "@/config/contact";

interface Testimonial {
  id: string;
  customerName: string;
  servicePurchased: string;
  rating: number;
  reviewText: string;
  status: "Approved" | "Pending" | "Rejected" | string;
  featured: boolean;
  consentVerified: boolean;
  createdAt?: string;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Form submission state
  const [authorName, setAuthorName] = useState("");
  const [serviceUsed, setServiceUsed] = useState("PowerPoint Presentations");
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (data.success && Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
      }
    } catch (e) {
      console.error("Failed to load testimonials:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !feedbackText.trim()) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: authorName.trim(),
          servicePurchased: serviceUsed,
          rating: Number(rating),
          reviewText: feedbackText.trim(),
          status: "Pending", // All user feedback goes to admin moderation first
          featured: false,  // Admin explicitly toggles featured flag
          consentVerified: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackSent(true);
        setAuthorName("");
        setFeedbackText("");
        setRating(5);
      } else {
        setErrorMessage(data.message || "Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Network error while submitting. Please contact us directly via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  // Only approved and admin-featured testimonials appear on the homepage
  const featuredReviews = testimonials.filter(
    (t) => t.status?.toLowerCase() === "approved" && Boolean(t.featured)
  );

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 bg-zinc-50/70 border-t border-zinc-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wider uppercase mb-4">
            07 • Client Feedback & Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Experiences That <br />
            <span className="text-red-600">Inspire Us.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            At Written Expressa, integrity is our cornerstone. We do not display fabricated reviews or
            inflated ratings. Every review displayed here is an authentic student or client experience
            moderated and curated by our admin team.
          </p>
        </div>

        {/* Admin-Moderated Featured Testimonials Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800">
                Featured Client Stories
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-medium">
              Verified & Approved Reviews
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-3xl bg-white p-7 border border-zinc-200 animate-pulse">
                  <div className="h-4 bg-zinc-200 rounded-full w-24 mb-4"></div>
                  <div className="h-3 bg-zinc-100 rounded-full w-full mb-2"></div>
                  <div className="h-3 bg-zinc-100 rounded-full w-5/6 mb-6"></div>
                  <div className="h-8 bg-zinc-200 rounded-xl w-32"></div>
                </div>
              ))}
            </div>
          ) : featuredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredReviews.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-white p-7 border border-zinc-200/90 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-red-600/30 transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-12 h-12 text-red-600" />
                  </div>

                  <div>
                    {/* Rating stars & verified badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-zinc-700 text-sm leading-relaxed italic mb-6 relative z-10 font-medium">
                      "{item.reviewText}"
                    </p>
                  </div>

                  {/* Client details */}
                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs uppercase border border-red-200/60">
                        {item.customerName ? item.customerName.charAt(0) : "W"}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-950">{item.customerName}</h4>
                        <p className="text-[11px] text-red-600 font-semibold">{item.servicePurchased}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-white border border-zinc-200 text-center max-w-xl mx-auto shadow-xs">
              <MessageSquareHeart className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-zinc-900">Curating Authentic Reviews</h4>
              <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                Client submissions are actively reviewed by our admin moderation panel before being published here.
                Be the first to share your project experience below!
              </p>
            </div>
          )}
        </div>

        {/* Feedback Collection Hub & Invitation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Invitation Banner (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-white p-8 sm:p-10 border border-zinc-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <MessageSquareHeart className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Community Transparency
              </span>
              <h3 className="mt-1 text-2xl font-bold text-zinc-900 tracking-tight">
                Have you worked with Written Expressa?
              </h3>

              <p className="mt-3 text-sm text-zinc-600 leading-relaxed font-normal">
                Whether we formatted your college farewell magazine, engineered your project presentation,
                or prepared comprehensive academic notes, your candid review directly guides fellow students
                and helps our team elevate our execution.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>Submissions are forwarded to the Admin Control Panel for verification.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Approved reviews can be chosen by the admin to feature on this homepage.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
                  <HeartHandshake className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>100% genuine student satisfaction is our only benchmark.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500">
                Direct WhatsApp Feedback:
              </span>
              <a
                href={`https://wa.me/${contactConfig.whatsappNumberRaw}?text=${encodeURIComponent(
                  "Hello Written Expressa team, I would like to share feedback regarding my recent project."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider flex items-center gap-1"
              >
                <span>WhatsApp Us</span> →
              </a>
            </div>
          </div>

          {/* Right Direct Submission Form (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white p-8 sm:p-10 border border-zinc-200/90 shadow-sm">
            {feedbackSent ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4 border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-zinc-950">Thank You for Your Feedback!</h4>
                <p className="mt-2 text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                  Your review has been sent directly to the <strong className="text-zinc-900">Written Expressa Admin Control Panel</strong>.
                  Once verified and approved by our team, it may be selected to feature on our official homepage!
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setFeedbackSent(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Submit Another Review
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="pb-3 border-b border-zinc-100">
                  <span className="text-xs font-bold uppercase tracking-widest text-red-600">
                    Client Voice Portal
                  </span>
                  <h4 className="text-xl font-bold text-zinc-950 tracking-tight mt-1">
                    Share Your Project Experience
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Your submission will be transmitted to our admin moderation center for verification.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                      Your Name & College / Role *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Rahul Sharma, Final Year ECE"
                      style={{ color: "#09090b" }}
                      className="w-full rounded-xl bg-white border border-zinc-300 px-3.5 sm:px-4 py-3 sm:py-2.5 text-base sm:text-xs text-zinc-950 font-bold placeholder-zinc-400 focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                      Overall Rating *
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      style={{ color: "#09090b" }}
                      className="w-full rounded-xl bg-white border border-zinc-300 px-3.5 sm:px-4 py-3 sm:py-2.5 text-base sm:text-xs text-zinc-950 font-bold focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                    >
                      <option value={5} style={{ color: "#09090b" }} className="text-zinc-950 font-bold">
                        ★★★★★ 5 Stars (Exceptional)
                      </option>
                      <option value={4} style={{ color: "#09090b" }} className="text-zinc-950 font-bold">
                        ★★★★☆ 4 Stars (Very Good)
                      </option>
                      <option value={3} style={{ color: "#09090b" }} className="text-zinc-950 font-bold">
                        ★★★☆☆ 3 Stars (Satisfactory)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    Service Purchased *
                  </label>
                  <select
                    value={serviceUsed}
                    onChange={(e) => setServiceUsed(e.target.value)}
                    style={{ color: "#09090b" }}
                    className="w-full rounded-xl bg-white border border-zinc-300 px-3.5 sm:px-4 py-3 sm:py-2.5 text-base sm:text-xs text-zinc-950 font-bold focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                  >
                    <option value="PowerPoint Presentations" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">
                      PowerPoint Presentations
                    </option>
                    <option value="Notes & Academic Records" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">
                      Notes & Academic Records
                    </option>
                    <option value="Project Documentation" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">
                      Project Documentation
                    </option>
                    <option value="Custom Magazines" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">
                      Custom Magazines
                    </option>
                    <option value="Academic Project Assistance" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">
                      Academic Project Assistance
                    </option>
                    <option value="Web & Technical Services" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">
                      Web & Technical Services
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    Your Actual Experience & Feedback *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="How was the quality of formatting, speed of delivery, communication, and adherence to requirements?"
                    style={{ color: "#09090b" }}
                    className="w-full rounded-xl bg-white border border-zinc-300 px-3.5 sm:px-4 py-3 sm:py-2.5 text-base sm:text-xs text-zinc-950 font-bold placeholder-zinc-400 focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600 resize-none transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    required
                    defaultChecked
                    className="w-4 h-4 text-red-600 rounded border-zinc-300 focus:ring-red-600"
                  />
                  <label htmlFor="consentCheck" className="text-xs text-zinc-600 font-medium">
                    I confirm this is my genuine experience and agree to review moderation by Written Expressa.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <span>Submitting to Admin Panel...</span>
                  ) : (
                    <>
                      <span>Submit Review to Admin</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
