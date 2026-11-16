import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";

export const metadata = {
  title: "Refund Policy | Written Expressa",
  description: "Fair and transparent refund policy of Written Expressa.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-bold tracking-widest text-red-600 uppercase">Fair Practices</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mt-1 mb-8">
          Refund Policy
        </h1>

        <div className="prose prose-zinc max-w-none text-sm leading-relaxed text-zinc-700 space-y-6">
          <p>
            Written Expressa is dedicated to delivering high quality academic and creative work tailored to
            your specifications. Because our services involve custom editorial, design, and software work,
            the following fair refund principles apply:
          </p>

          <h2 className="text-lg font-bold text-zinc-900">1. Pre-Production Cancellation</h2>
          <p>
            If you cancel an order before design drafting or technical research has commenced, you are eligible
            for a full refund minus any third-party payment gateway transaction fees.
          </p>

          <h2 className="text-lg font-bold text-zinc-900">2. Revisions Prior to Completion</h2>
          <p>
            If a draft does not align with your confirmed instructions, we provide prioritized revisions to
            rectify formatting, diagrams, or content structure until requirements are met.
          </p>

          <h2 className="text-lg font-bold text-zinc-900">3. Non-Delivery</h2>
          <p>
            In the rare event that our team is unable to fulfill a confirmed order by the agreed deadline due
            to internal constraints, a 100% full refund will be processed immediately.
          </p>

          <h2 className="text-lg font-bold text-zinc-900">4. Physical Prints (Magazines & Hardcopies)</h2>
          <p>
            For printed items (hardcopy documentation binders or printed farewell magazines), once physical
            press printing has commenced, printing material costs cannot be refunded.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
