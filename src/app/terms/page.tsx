import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";

export const metadata = {
  title: "Terms & Conditions | Written Expressa",
  description: "Terms and conditions of service for Written Expressa.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-bold tracking-widest text-red-600 uppercase">Terms of Service</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mt-1 mb-8">
          Terms & Conditions
        </h1>

        <div className="prose prose-zinc max-w-none text-sm leading-relaxed text-zinc-700 space-y-6">
          <p>
            By accessing the Written Expressa website or engaging our creative, academic, or technical services,
            you agree to adhere to these standard Terms & Conditions.
          </p>

          <h2 className="text-lg font-bold text-zinc-900">1. Nature of Services</h2>
          <p>
            Written Expressa provides creative design, presentation layout, academic formatting, project
            assistance, and documentation support. All academic deliverables are intended as educational
            reference materials, templates, and consulting aids.
          </p>

          <h2 className="text-lg font-bold text-zinc-900">2. Centralized Quotations & Scope</h2>
          <p>
            Quotations are provided in Indian Rupees (₹) following our centralized pricing schedule. Work
            commences only after mutual scope confirmation between the client and our team.
          </p>

          <h2 className="text-lg font-bold text-zinc-900">3. Review & Revisions</h2>
          <p>
            Clients are entitled to review initial drafts and request corrections aligned with the agreed
            initial scope. Scope expansions beyond agreed parameters will be quoted transparently.
          </p>

          <h2 className="text-lg font-bold text-zinc-900">4. Deliverables Handoff</h2>
          <p>
            Digital deliverables (PDFs, PPTX, source code archives) are transferred via secure download links
            or direct communication channels upon project completion.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
