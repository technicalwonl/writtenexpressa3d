import { Navbar } from "@/components/navigation/Navbar";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { Footer } from "@/components/footer/Footer";

export const metadata = {
  title: "Portfolio & Deliverable Samples | Written Expressa",
  description:
    "Review sample formats, research presentations, custom magazines, IoT technical prototypes, and engineering documentation crafted by Written Expressa.",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <PortfolioSection />
      </div>
      <Footer />
    </main>
  );
}
