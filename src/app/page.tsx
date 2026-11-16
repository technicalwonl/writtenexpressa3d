import { Navbar } from "@/components/navigation/Navbar";
import { HeroScrollAnimation } from "@/components/hero/HeroScrollAnimation";
import { WhatWeDoSection } from "@/components/services/WhatWeDoSection";
import { AboutSection } from "@/components/about/AboutSection";
import { Interactive3DShowcase } from "@/components/three-scenes/Interactive3DShowcase";
import { ServicesSection } from "@/components/services/ServicesSection";
import { HowItWorksSection } from "@/components/how-it-works/HowItWorksSection";
import { WhyChooseSection } from "@/components/why-choose-us/WhyChooseSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { FAQSection } from "@/components/faq/FAQSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/footer/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Fixed Navigation Header */}
      <Navbar />

      {/* 3D Interactive Slow & Smooth Scroll Hero */}
      <HeroScrollAnimation />

      {/* 01 Our Services & Ordering (Immediately Up After 3D Animation) */}
      <ServicesSection />

      {/* 02 Interactive 3D Service Models Showcase */}
      <Interactive3DShowcase />

      {/* 03 Home: What We Do (4 Major Divisions) */}
      <WhatWeDoSection />

      {/* 04 About Written Expressa */}
      <AboutSection />

      {/* 05 How It Works (4 Steps) */}
      <HowItWorksSection />

      {/* 06 Why Choose Written Expressa? */}
      <WhyChooseSection />

      {/* 07 Customer Testimonials (Authentic Feedback Portal) */}
      <TestimonialsSection />

      {/* 08 Frequently Asked Questions */}
      <FAQSection />

      {/* 09 Contact & Project Enquiry */}
      <ContactSection />

      {/* Premium Charcoal Footer */}
      <Footer />
    </main>
  );
}
