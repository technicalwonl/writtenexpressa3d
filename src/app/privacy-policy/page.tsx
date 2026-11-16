import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";

export const metadata = {
  title: "Privacy Policy | Written Expressa",
  description: "Privacy policy and client data protection guidelines of Written Expressa.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-bold tracking-widest text-red-600 uppercase">Legal Policy</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mt-1 mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-zinc max-w-none text-sm leading-relaxed text-zinc-700 space-y-6">
          <p>
            At Written Expressa (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), we respect the privacy and intellectual
            confidentiality of every student, academician, and client who engages our services. This Privacy
            Policy outlines how your information is handled.
          </p>

          <h2 className="text-lg font-bold text-zinc-900">1. Information We Collect</h2>
          <p>
            When you submit a project enquiry or interact via WhatsApp, we collect your name, email address,
            WhatsApp phone number, academic/project requirements, and any reference documents or assets you provide.
          </p>

          <h2 className="text-lg font-bold text-zinc-900">2. Intellectual Property & Confidentiality</h2>
          <p>
            All manuscripts, research drafts, student notes, project source code, and personalized photo albums
            submitted to Written Expressa remain your intellectual property. We do not sell, rent, or publicly
            disclose your raw project materials without explicit prior consent.
          </p>

          <h2 className="text-lg font-bold text-zinc-900">3. How Your Information Is Used</h2>
          <p>
            Information collected is strictly utilized to communicate quotations, deliver work drafts,
            verify project formatting requirements, and provide ongoing customer support.
          </p>

          <h2 className="text-lg font-bold text-zinc-900">4. Contacting Us Regarding Privacy</h2>
          <p>
            If you have questions regarding your data or wish to request deletion of past enquiry records,
            please email us directly at <strong>writtenexpressa@gmail.com</strong> or <strong>support@writtenexpressa.in</strong>, or message our official WhatsApp at <strong>+91 9492801206</strong>.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
