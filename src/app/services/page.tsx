import { Navbar } from "@/components/navigation/Navbar";
import { ServicesSection } from "@/components/services/ServicesSection";
import { Interactive3DShowcase } from "@/components/three-scenes/Interactive3DShowcase";
import { Footer } from "@/components/footer/Footer";

export const metadata = {
  title: "Our Services & Pricing | Written Expressa",
  description:
    "Explore our academic notes preparation, PowerPoint design, technical project assistance, IEEE documentation, custom farewell magazines, and web development.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <Interactive3DShowcase />
        <ServicesSection />
      </div>
      <Footer />
    </main>
  );
}
