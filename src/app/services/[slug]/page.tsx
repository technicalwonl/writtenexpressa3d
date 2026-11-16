import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { getTableData, initializeDatabase } from "@/lib/db";
import { pricingConfig } from "@/config/pricing";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Users,
  Award,
} from "lucide-react";
import { buildWhatsAppOrderUrl, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

interface ServiceData {
  slug: string;
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: string;
  targetAudience: string;
  overview: string;
  useCases: string[];
  deliverables: string[];
  pricingKey: string;
  faqs: { q: string; a: string }[];
}

const serviceDirectory: Record<string, ServiceData> = {
  "notes-and-records": {
    slug: "notes-and-records",
    id: "srv_notes_records",
    title: "Notes & Academic Records Preparation",
    seoTitle: "Professional Notes & Lab Records Writing Service in India | Written Expressa",
    metaDescription: "Neat, accurate handwritten academic records, lab manuals, and customized course notes formatted according to Indian university standards. Fast pan-India delivery.",
    category: "Academic Solutions",
    targetAudience: "Engineering students, medical/pharmacy scholars, university undergraduates requiring verified laboratory journals and semester notes.",
    overview: "Written Expressa provides professionally prepared academic notes, handwritten records, and customized study materials. Every record is neatly organized with verified diagrams, legible handwriting, and standardized margins compliant with university assessment guidelines.",
    useCases: [
      "Semester practical laboratory record completion",
      "Handwritten lecture notes curation with diagrams",
      "University assignment submissions and record viva preparation",
      "Custom formatted study aids for high-difficulty technical subjects",
    ],
    deliverables: [
      "Handwritten or laser-printed academic records",
      "Precise schematics, circuit drawings, and data tables",
      "Hardcopy spiral/hardbound or softcopy PDF scanning",
      "Quality assurance against syllabus experiment guidelines",
    ],
    pricingKey: "notesAndRecords",
    faqs: [
      {
        q: "How many pages can I order for handwritten records?",
        a: "We offer standard tiers: 10 Pages (₹40), 50 Pages (₹240), and 100 Pages (₹480). Custom page counts can be quoted directly on WhatsApp.",
      },
      {
        q: "Are the records formatted according to my university's template?",
        a: "Yes. Simply upload or WhatsApp your department's record guidelines and index template, and our team adheres strictly to them.",
      },
      {
        q: "Do you ship physical records outside Hyderabad?",
        a: "Yes, we ship physical bound records via tracked speed post/courier across all states in India.",
      },
    ],
  },
  "powerpoint-presentations": {
    slug: "powerpoint-presentations",
    id: "srv_ppt",
    title: "PowerPoint Presentation Design Services",
    seoTitle: "Professional PPT Design Services in India | Seminar, Viva & Conference Decks",
    metaDescription: "Visually captivating, professional PowerPoint presentations for seminar defenses, conference papers, and business pitches. Starting at ₹49/slide.",
    category: "Creative Design",
    targetAudience: "B.Tech/M.Tech scholars, PhD defense candidates, seminar speakers, and startup founders needing high-impact visual decks.",
    overview: "Transform complex research papers and technical ideas into visually impressive presentation decks. We combine clean typography, custom scientific diagrams, subtle animations, and clear narrative flow tailored to evaluation committees.",
    useCases: [
      "Final year project seminar & viva defense presentations",
      "National and international academic conference slide decks",
      "Startup pitch decks and investor business presentations",
      "Corporate training and interactive workshop slide materials",
    ],
    deliverables: [
      "Fully editable PPTX format",
      "High-resolution PDF presentation export",
      "Custom vector infographics and process flowcharts",
      "Embedded font package and speaker presentation notes",
    ],
    pricingKey: "powerpointPresentations",
    faqs: [
      {
        q: "What is the difference between Simple and Creative PPT?",
        a: "Simple PPT (₹49–₹249 for 10–30 slides) focuses on structured text, clean charts, and standardized academic formatting. Creative PPT (₹99–₹400 for 10–40 slides) includes bespoke illustrations, custom animations, dynamic slide transitions, and publication-grade aesthetics.",
      },
      {
        q: "How quickly can I get an urgent seminar PPT?",
        a: "We accommodate fast-turnaround requests within 24 to 48 hours. Message our official WhatsApp at +91 9492801206 for immediate scheduling.",
      },
    ],
  },
  "academic-project-assistance": {
    slug: "academic-project-assistance",
    id: "srv_academic_project",
    title: "Academic Capstone Project Assistance",
    seoTitle: "Student Project Assistance & Technical Mentorship in India | Written Expressa",
    metaDescription: "Hands-on engineering capstone assistance for IoT, AI/ML, Embedded Systems, and Software Projects. Architecture guidance, schematics, and viva review.",
    category: "Technical Solutions",
    targetAudience: "Final year B.Tech, M.Tech, and diploma students undertaking hardware, IoT, machine learning, or software engineering capstones.",
    overview: "Get expert technical assistance with engineering capstone projects. From conceptual architecture and circuit schematics to algorithm debugging, hardware wiring, and viva defense preparation, our specialists guide you every step of the way.",
    useCases: [
      "IoT sensor telemetry prototypes (ESP32, Arduino, Raspberry Pi)",
      "Machine learning model implementation and dataset validation",
      "Fullstack web and mobile application development",
      "Hardware transducer integration and sensor calibration",
    ],
    deliverables: [
      "Clean, documented source code repository",
      "Complete circuit schematic diagrams and wiring guides",
      "Step-by-step setup and execution instructions",
      "Mock viva defense questions and technical review",
    ],
    pricingKey: "academicProjectAssistance",
    faqs: [
      {
        q: "What technical domains do you support?",
        a: "We support IoT, Embedded Systems, AI/Machine Learning, Image Processing, Web Development, and Sensor Automation projects.",
      },
      {
        q: "How much does project assistance cost?",
        a: "Concept reviews and architectural guidance start at ₹500, with comprehensive custom technical projects ranging between ₹799 and ₹4,999 based on component complexity.",
      },
    ],
  },
  "project-documentation": {
    slug: "project-documentation",
    id: "srv_documentation",
    title: "IEEE & University Project Documentation",
    seoTitle: "Affordable Academic Project Documentation & Report Writing Services | Written Expressa",
    metaDescription: "Comprehensive IEEE-compliant project reports, SRS, thesis documentation, and bound hardcopies for engineering graduates across India.",
    category: "Academic Solutions",
    targetAudience: "Engineering, MCA, and postgraduate researchers requiring publication-grade thesis and project reports complying with university rubrics.",
    overview: "Professional technical documentation crafted with rigorous structure, standard formatting, and accurate citations. We format abstracts, literature reviews, system architecture, data flow diagrams, results, and references per IEEE or university guidelines.",
    useCases: [
      "B.Tech / M.Tech Major & Minor project reports",
      "IEEE paper formatting and conference submission manuscripts",
      "Software Requirement Specifications (SRS) & System Design documents",
      "PhD research synopsis and chapter draft structuring",
    ],
    deliverables: [
      "Softcopy Package (₹499): Formatted PDF and editable Word DOCX",
      "Hardcopy Package (₹999): Deluxe leatherette bound printed volume with golden embossing",
      "Complete plagiarism check verification report",
      "Certificate templates and department acknowledgement sheets",
    ],
    pricingKey: "projectDocumentation",
    faqs: [
      {
        q: "What is included in the ₹499 Softcopy package?",
        a: "You receive a complete, editable DOCX file and print-ready PDF formatted to your university's exact margin, font, and citation standards.",
      },
      {
        q: "How do you ensure plagiarism compliance?",
        a: "All content is written originally by technical subject matter experts and verified through plagiarism detection tools before delivery.",
      },
    ],
  },
  "custom-magazines": {
    slug: "custom-magazines",
    id: "srv_magazines",
    title: "Custom Commemorative & Farewell Magazines",
    seoTitle: "Custom Farewell Magazine Design & Printing in India | Written Expressa",
    metaDescription: "Deluxe personalized student magazines, batch yearbooks, and farewell souvenirs designed with editorial layouts and shipped pan-India.",
    category: "Creative Design",
    targetAudience: "College graduating batches, student union councils, alumni associations, and event organizers seeking tangible commemorative souvenirs.",
    overview: "Transform batch memories, farewell photographs, teacher quotes, and batch awards into an editorial masterpiece. Our design team handles photo curation, personalized storytelling, and print-ready CMYK layouts for high-gloss commemorative magazines.",
    useCases: [
      "College departmental farewell souvenir magazines",
      "Batch alumni yearbooks and graduation retrospects",
      "Fest, symposium, and national conference commemorative editions",
      "Personalized milestone gifts and corporate commemorative booklets",
    ],
    deliverables: [
      "Digital interactive flipbook edition for online sharing",
      "High-resolution 300 DPI CMYK print-ready PDF",
      "Optional premium glossy paper hardbound printing and delivery",
      "Bespoke cover art tailored to your institution or batch theme",
    ],
    pricingKey: "customMagazines",
    faqs: [
      {
        q: "How do we submit batch photos and writeups?",
        a: "You can share a Google Drive folder link or send images directly on WhatsApp to +91 9492801206. Our editorial team organizes the spreads.",
      },
      {
        q: "What is the turnaround time for magazine design?",
        a: "Standard design for an 8–24 page magazine takes approximately 3 to 5 business days, with draft review rounds included.",
      },
    ],
  },
  "website-design-development": {
    slug: "website-design-development",
    id: "srv_web_tech",
    title: "Website Design & Technical Development",
    seoTitle: "Modern Web Development & Student Portfolio Website Services | Written Expressa",
    metaDescription: "Responsive portfolio websites, fullstack web applications, and database architectures crafted with Next.js, React, and modern UI engineering.",
    category: "Digital Services",
    targetAudience: "Aspiring developers, job applicants, startups, and campus organizations needing modern web presence.",
    overview: "Modern digital web solutions designed to elevate your professional profile. From developer portfolio websites to fullstack web dashboards and custom API integrations, we deliver clean, performant, and mobile-responsive code.",
    useCases: [
      "Developer & designer personal portfolio websites",
      "Fullstack capstone web application development (Next.js, React, Node)",
      "Database schema design and API endpoint development",
      "Interactive 3D Three.js WebGL web experiences",
    ],
    deliverables: [
      "Production-ready Next.js / React source code repository",
      "Live deployment on Vercel, Netlify, or Hostinger",
      "Domain DNS and SSL security configuration",
      "Responsive mobile and desktop UI testing",
    ],
    pricingKey: "webAndTechnical",
    faqs: [
      {
        q: "Do I get full ownership of the source code?",
        a: "Yes! All projects include complete source code ownership, GitHub repository transfer, and deployment documentation.",
      },
    ],
  },
  "iot-embedded-systems": {
    slug: "iot-embedded-systems",
    id: "srv_academic_project",
    title: "IoT & Embedded Systems Development",
    seoTitle: "IoT Project Development Services in India | ESP32, Arduino, Sensors | Written Expressa",
    metaDescription: "Custom IoT firmware, sensor telemetry, and microcontroller hardware capstone builds. ESP32, Arduino, Raspberry Pi, and Cloud IoT.",
    category: "Technical Solutions",
    targetAudience: "ECE, EEE, and Mechatronics engineering students developing physical hardware capstones.",
    overview: "Specialized embedded engineering services covering firmware authoring, sensor interfacing, and cloud IoT telemetry. We assist with hardware prototype wiring, testing, and complete technical documentation.",
    useCases: [
      "Smart agriculture telemetry and automated irrigation systems",
      "Home automation with PIR motion and mobile app relay control",
      "Biomedical wearable health monitoring prototypes",
      "Footstep and solar piezoelectric energy harvesting systems",
    ],
    deliverables: [
      "Embedded C/C++ firmware files with clear inline comments",
      "Fritzing and Proteus circuit schematics",
      "Sensor calibration and test benchmark reports",
      "Component bill of materials (BOM) sourcing guide",
    ],
    pricingKey: "academicProjectAssistance",
    faqs: [
      {
        q: "Can you help troubleshoot sensor errors or microcontroller crashes?",
        a: "Yes, we debug circuit wiring, I2C/SPI bus conflicts, and timing delays directly over WhatsApp and video consultation.",
      },
    ],
  },
  "ai-technical-solutions": {
    slug: "ai-technical-solutions",
    id: "srv_academic_project",
    title: "AI & Machine Learning Solutions",
    seoTitle: "AI & Machine Learning Project Assistance in India | Written Expressa",
    metaDescription: "Academic AI/ML project guidance: PyTorch, TensorFlow, Computer Vision, and NLP model implementation with thesis reports.",
    category: "Technical Solutions",
    targetAudience: "Computer Science and Data Science scholars undertaking machine learning, deep learning, or NLP capstones.",
    overview: "End-to-end guidance for artificial intelligence and data analytics projects. We assist with dataset preprocessing, model architecture selection, evaluation metrics, and comparative benchmarking.",
    useCases: [
      "Convolutional Neural Networks (CNN) for medical image classification",
      "Natural Language Processing (NLP) sentiment and text summarization",
      "Predictive machine learning models on structured tabular datasets",
      "Model deployment via Streamlit or FastAPI endpoints",
    ],
    deliverables: [
      "Jupyter Notebooks (.ipynb) with clean execution outputs",
      "Trained model weights and performance confusion matrix",
      "Comparative analysis charts and accuracy graphs",
      "Full academic thesis chapter covering methodology and results",
    ],
    pricingKey: "academicProjectAssistance",
    faqs: [
      {
        q: "Do you supply the datasets and training notebooks?",
        a: "Yes. We source verified benchmark datasets (Kaggle, UCI) and deliver clean, well-commented Jupyter notebooks ready for review.",
      },
    ],
  },
  "graphic-design": {
    slug: "graphic-design",
    id: "srv_ppt",
    title: "Creative Graphic Design Services",
    seoTitle: "Professional Graphic Design Services for Academic & Creative Projects | Written Expressa",
    metaDescription: "High-impact visual communication: technical posters, conference banners, event collateral, and brand identity design.",
    category: "Creative Design",
    targetAudience: "Colleges, student clubs, symposium committees, and researchers preparing academic poster presentations.",
    overview: "Elevate your academic and professional presence with premium graphic design. We create scientific conference posters, event promotional banners, digital flyers, and bespoke visual identities with unmatched precision.",
    useCases: [
      "Scientific conference research posters (A0, A1 formats)",
      "College fest and symposium promotional banners",
      "Technical infographics and system architecture diagrams",
      "Academic society logos and social media creative collateral",
    ],
    deliverables: [
      "Print-ready CMYK vector PDF / TIFF",
      "High-resolution digital PNG and WebP exports",
      "Editable source files (PSD / Illustrator)",
    ],
    pricingKey: "powerpointPresentations",
    faqs: [
      {
        q: "What dimensions do you support for conference posters?",
        a: "We support standard A0 (841 x 1189 mm), A1, and customized dimensions required by conference symposium guidelines.",
      },
    ],
  },
  "farewell-magazine-design": {
    slug: "farewell-magazine-design",
    id: "srv_magazines",
    title: "College & Batch Farewell Magazine Design",
    seoTitle: "Personalized College Farewell Magazine Design & Printing in India | Written Expressa",
    metaDescription: "Commemorative college farewell magazines, batch memory albums, senior spotlights, and department yearbooks. Custom editorial layout and pan-India print delivery.",
    category: "Creative Design",
    targetAudience: "Graduating college batches, class representatives, farewell committees, engineering & medical departments.",
    overview: "Preserve the friendships, stories, achievements, and candid campus memories of your college journey. Written Expressa crafts bespoke editorial farewell magazines featuring batch photo collages, personalized senior profiles, faculty blessings, inside jokes, and awards—delivered as digital flipbooks and hardbound print keepsakes.",
    useCases: [
      "Departmental graduation farewell magazines",
      "Senior batch memory yearbooks & retrospective chronicles",
      "College fest and student union commemorative editions",
      "Hostel batch farewell souvenirs with personalized tributes",
    ],
    deliverables: [
      "300 DPI CMYK Print-ready PDF edition",
      "Interactive Digital Flipbook for easy WhatsApp and mobile sharing",
      "Professional photo enhancement and multi-page editorial spreads",
      "Optional premium hardbound glossy printing with tracked pan-India courier",
    ],
    pricingKey: "customMagazines",
    faqs: [
      {
        q: "How many pages are typical for a college farewell magazine?",
        a: "Most farewell magazines range between 12 to 36 pages depending on batch size, photo count, and student profile sections.",
      },
      {
        q: "How do we collect student writeups and photos?",
        a: "We recommend sharing a Google Drive folder or sending batch collections directly to our WhatsApp at +91 9492801206. Our editorial team handles the layout curation.",
      },
    ],
  },
  "birthday-anniversary-magazines": {
    slug: "birthday-anniversary-magazines",
    id: "srv_magazines",
    title: "Personalized Birthday & Anniversary Magazines",
    seoTitle: "Custom Birthday & Anniversary Magazines in India | Written Expressa",
    metaDescription: "Turn personal milestone celebrations into luxury editorial magazines. Personalized cover art, life story timelines, candid photo curation, and bespoke printing.",
    category: "Creative Design",
    targetAudience: "Individuals and families celebrating milestone 21st, 25th, 50th birthdays, wedding anniversaries, or retirement tributes.",
    overview: "Give an unforgettable personal gift. We transform personal photographs, heartfelt letters, life milestones, and memorable family moments into a Vogue-style or Time-style luxury personal magazine. Every page is custom-designed to celebrate your loved one.",
    useCases: [
      "Milestone 21st, 25th, 50th, and 60th birthday tribute magazines",
      "Silver, Golden, and bespoke Wedding Anniversary retrospective albums",
      "Retirement and professional lifetime milestone commemorative books",
      "Couple storybooks and relationship milestone gifts",
    ],
    deliverables: [
      "Personalized front cover featuring custom headline and photography",
      "Life journey timeline spreads and memory chapters",
      "Family wishes, letters, and congratulatory quote styling",
      "Deluxe hardcover print edition and instant digital flipbook",
    ],
    pricingKey: "customMagazines",
    faqs: [
      {
        q: "Is our personal family content kept strictly confidential?",
        a: "Yes. All personal photographs, family stories, and private messages are held under strict non-disclosure and permanently deleted upon delivery.",
      },
      {
        q: "What is the delivery timeline for an anniversary magazine?",
        a: "Design drafts are typically ready within 3 to 4 days. Express turnarounds are also available via direct WhatsApp consultation at +91 9492801206.",
      },
    ],
  },
  "research-presentation-support": {
    slug: "research-presentation-support",
    id: "srv_ppt",
    title: "Research & Conference Presentation Design",
    seoTitle: "Academic Research Presentation & Conference Slide Design | Written Expressa",
    metaDescription: "Expert research presentation design for PhD defenses, IEEE/Scopus conferences, symposiums, and thesis evaluations. Precise scientific diagrams and structured slides.",
    category: "Academic Solutions",
    targetAudience: "PhD scholars, M.Tech/MS researchers, faculty members, and scientists presenting at national and international peer-reviewed conferences.",
    overview: "Conferences and doctoral defenses demand visual clarity without compromising technical rigor. Written Expressa structures complex research methodologies, mathematical models, experimental graphs, and comparative benchmarks into compelling, peer-evaluation-ready presentations.",
    useCases: [
      "Doctoral PhD thesis defense and synopsis presentations",
      "IEEE, Springer, and Elsevier international conference slide decks",
      "Grant proposals, funding presentations, and institutional research reviews",
      "Scientific poster presentations and executive research summaries",
    ],
    deliverables: [
      "Fully editable 16:9 widescreen PPTX presentation deck",
      "High-resolution vector scientific figures and architecture schematics",
      "Concise slide bulleting avoiding text-heavy clutter",
      "Speaker cue notes, time-budgeted slide sequencing, and PDF export",
    ],
    pricingKey: "powerpointPresentations",
    faqs: [
      {
        q: "Can you convert an IEEE paper or LaTeX draft into slides?",
        a: "Yes. Send us your research PDF or manuscript, and our academic specialists extract the core methodology, results, and architecture into structured slides.",
      },
      {
        q: "Are the charts and formulas editable?",
        a: "Yes, all vector figures, tables, and chart axes remain 100% editable within standard Microsoft PowerPoint.",
      },
    ],
  },
};

// Aliases for SEO variations and alternate URL slugs
serviceDirectory["notes-and-academic-records"] = {
  ...serviceDirectory["notes-and-records"],
  slug: "notes-and-academic-records",
};
serviceDirectory["powerpoint-presentation-design"] = {
  ...serviceDirectory["powerpoint-presentations"],
  slug: "powerpoint-presentation-design",
};
serviceDirectory["custom-magazine-design"] = {
  ...serviceDirectory["custom-magazines"],
  slug: "custom-magazine-design",
};
serviceDirectory["creative-art-graphic-design"] = {
  ...serviceDirectory["graphic-design"],
  slug: "creative-art-graphic-design",
};
serviceDirectory["iot-embedded-systems-development"] = {
  ...serviceDirectory["iot-embedded-systems"],
  slug: "iot-embedded-systems-development",
};

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const data = serviceDirectory[slug];

  if (!data) return { title: "Service | Written Expressa" };

  return {
    title: data.seoTitle,
    description: data.metaDescription,
    alternates: {
      canonical: `https://www.writtenexpressa.in/services/${data.slug}`,
    },
    openGraph: {
      title: data.seoTitle,
      description: data.metaDescription,
      url: `https://www.writtenexpressa.in/services/${data.slug}`,
      siteName: "Written Expressa",
      locale: "en_IN",
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  initializeDatabase();
  const { slug } = await params;
  const service = serviceDirectory[slug];

  if (!service) {
    notFound();
  }

  const pricing = pricingConfig[service.pricingKey];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    provider: {
      "@type": "Organization",
      name: "Written Expressa",
      url: "https://www.writtenexpressa.in/",
      telephone: "+91 9492801206",
      email: "writtenexpressa@gmail.com",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    description: service.metaDescription,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const waOrderUrl = buildWhatsAppOrderUrl({
    serviceName: service.title,
    packageName: pricing?.tiers?.[0]?.label || "Standard Tier",
    price: pricing?.tiers?.[0]?.price || "Consultation",
  });

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8 font-medium">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/services" className="hover:text-zinc-900 transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#C8102E] font-semibold">{service.title}</span>
        </nav>

        {/* Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-4">
              {service.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
              {service.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
              {service.overview}
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700 flex items-start gap-3">
              <Users className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900">Who is this for?</strong>
                <p className="text-zinc-600 mt-0.5">{service.targetAudience}</p>
              </div>
            </div>

            {/* Direct Order on WhatsApp Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={waOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>ORDER NOW ON WHATSAPP (+91 9492801206)</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>

              <Link
                href="/#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Email Consultation</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Pricing Matrix Card */}
          <div className="lg:col-span-4 bg-zinc-50 border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8102E] block mb-1">
              CENTRALIZED PRICING
            </span>
            <h3 className="text-xl font-bold font-serif text-zinc-900">
              {pricing?.pricingType || "Transparent Pricing"}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 mb-5">
              {pricing?.summary}
            </p>

            <div className="space-y-2.5">
              {pricing?.tiers?.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-zinc-200/80 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-zinc-800">{tier.label}</span>
                  <span className="font-extrabold text-[#C8102E] text-sm">{tier.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-200/80 text-[11px] text-zinc-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No hidden charges. Verified milestone approval.</span>
            </div>
          </div>
        </div>

        {/* Use Cases & Deliverables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
          <div className="p-7 rounded-3xl bg-zinc-50 border border-zinc-200/80">
            <h3 className="text-lg font-bold font-serif text-zinc-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8102E]" />
              <span>Common Project Use Cases</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-700">
              {service.useCases.map((u, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-7 rounded-3xl bg-zinc-50 border border-zinc-200/80">
            <h3 className="text-lg font-bold font-serif text-zinc-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C8102E]" />
              <span>Verified Deliverable Standards</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-700">
              {service.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] shrink-0 mt-2" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Service FAQs */}
        <div className="my-16 max-w-4xl">
          <h3 className="text-2xl font-bold font-serif text-zinc-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#C8102E]" />
            <span>Frequently Asked Questions about {service.title}</span>
          </h3>

          <div className="space-y-3">
            {service.faqs.map((f, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs sm:text-sm space-y-1.5"
              >
                <div className="font-bold text-zinc-900">{f.q}</div>
                <div className="text-zinc-600 leading-relaxed">{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Sticky WhatsApp CTA Strip */}
        <div className="mt-16 p-8 rounded-3xl bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Direct Assistance
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif mt-1">
              Ready to start your {service.title}?
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              WhatsApp our team directly at <strong>+91 9492801206</strong>. We respond in under 15 minutes.
            </p>
          </div>

          <a
            href={waOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-all shadow-lg shadow-emerald-600/30"
          >
            <MessageSquare className="w-4 h-4" />
            <span>ORDER ON WHATSAPP</span>
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
