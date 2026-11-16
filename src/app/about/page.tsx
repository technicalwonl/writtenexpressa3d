import { Navbar } from "@/components/navigation/Navbar";
import { AboutSection } from "@/components/about/AboutSection";
import { WhyChooseSection } from "@/components/why-choose-us/WhyChooseSection";
import { Footer } from "@/components/footer/Footer";

export const metadata = {
  title: "About Us | Written Expressa - Your Creative & Academic Partner",
  description:
    "Learn about Written Expressa, our founding vision, mission, values, and dedication to delivering accessible creative, academic and technical services across India.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <AboutSection />
        <WhyChooseSection />
      </div>
      <Footer />
    </main>
  );
}
