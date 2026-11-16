import { Navbar } from "@/components/navigation/Navbar";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/footer/Footer";

export const metadata = {
  title: "Contact & Project Enquiry | Written Expressa",
  description:
    "Get in touch with Written Expressa for project assistance, academic notes, presentation designs, and customized magazines. Direct WhatsApp & email support.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
