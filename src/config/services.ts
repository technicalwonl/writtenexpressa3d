export interface ServiceCategory {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  color: string;
  services: string[];
}

export interface DetailedService {
  id: string;
  title: string;
  category: "Academic Solutions" | "Creative Design" | "Technical Solutions" | "Digital Services";
  description: string;
  ctaText: string;
  ctaActionId: string;
  threeDObject: string;
  threeDDescription: string;
  highlights: string[];
  pricingKey: string;
  features: string[];
  subcategories?: string[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "academic-solutions",
    name: "Academic Solutions",
    tagline: "Rigorous standards for scholarly & coursework success",
    description:
      "From handwritten records and formatted study notes to comprehensive project reports and research presentations.",
    iconName: "GraduationCap",
    color: "#E11D48",
    services: ["Notes & Academic Records", "Project Documentation", "Academic Project Assistance"],
  },
  {
    id: "creative-design",
    name: "Creative Design",
    tagline: "High-impact visual communication & editorial artistry",
    description:
      "Bespoke farewell magazines, dynamic pitch decks, commemorative albums, and vector branding that stand out.",
    iconName: "Palette",
    color: "#C81E32",
    services: ["Custom Magazines", "PowerPoint Presentations", "Creative Graphic Design"],
  },
  {
    id: "technical-solutions",
    name: "Technical Solutions",
    tagline: "Bridging engineering concepts and real-world execution",
    description:
      "IoT prototypes, embedded systems guidance, microcontroller programming, and technical project troubleshooting.",
    iconName: "Cpu",
    color: "#0F172A",
    services: ["Academic Project Assistance", "IoT & Embedded Development", "Technical Project Support"],
  },
  {
    id: "digital-services",
    name: "Digital Services",
    tagline: "Modern web platforms crafted for maximum engagement",
    description:
      "Modern responsive websites, interactive portfolio platforms, backend API integrations, and database architectures.",
    iconName: "Monitor",
    color: "#DC2626",
    services: ["Website Design & Development", "Portfolio Websites", "Fullstack Engineering"],
  },
];

export const detailedServices: DetailedService[] = [
  {
    id: "notes-and-records",
    title: "Notes & Academic Records",
    category: "Academic Solutions",
    description:
      "Professionally prepared academic notes, handwritten records and customized academic materials designed according to your requirements.",
    ctaText: "ORDER NOTES & RECORDS",
    ctaActionId: "notes-records",
    threeDObject: "Floating academic notebook",
    threeDDescription: "A bound hardcover notebook floating gracefully in space with crisp lined pages and red ribbon bookmark.",
    highlights: [
      "Precise handwritten records & lab reports",
      "Organized course notes with diagrams",
      "Custom formatting matching university guidelines",
    ],
    pricingKey: "notesAndRecords",
    features: [
      "Standard academic formatting and legible handwriting",
      "Diagrams, tables, and formula notations meticulously drawn",
      "Available across engineering, sciences, commerce, and humanities",
      "Express preparation options available upon consultation",
    ],
  },
  {
    id: "powerpoint-presentations",
    title: "PowerPoint Presentations",
    category: "Creative Design",
    description:
      "Transform your ideas into visually impressive presentations with professional layouts, attractive themes, diagrams, animations and structured content.",
    ctaText: "CREATE MY PRESENTATION",
    ctaActionId: "ppt-presentations",
    threeDObject: "Laptop with presentation slides",
    threeDDescription: "A floating aluminum laptop displaying high-resolution slide deck visuals with architecture and data charts.",
    highlights: [
      "Simple & Creative PPT tiers available",
      "Engaging animations and custom infographic layouts",
      "Optimized for academic defenses, project reviews & executive pitches",
    ],
    pricingKey: "powerpointPresentations",
    features: [
      "Bespoke slide typography and visual hierarchies",
      "Editable PPTX source files and presentation notes",
      "Custom vector charts, process flows, and architectural diagrams",
      "Designed for college symposiums, seminars, and corporate pitches",
    ],
  },
  {
    id: "academic-project-assistance",
    title: "Academic Project Assistance",
    category: "Technical Solutions",
    description:
      "Get assistance with academic projects, technical concepts, project development, documentation, presentation preparation and project-related requirements.",
    ctaText: "DISCUSS MY PROJECT",
    ctaActionId: "academic-projects",
    threeDObject: "3D technical project model",
    threeDDescription: "A smart autonomous robotic rover and circuit module with wireless signal indicator and code console.",
    highlights: [
      "Starting from ₹500 for conceptual guidance",
      "Hardware, IoT, AI, software, and embedded systems coverage",
      "End-to-end guidance from literature review to working prototype",
    ],
    pricingKey: "academicProjectAssistance",
    features: [
      "Architecture design, schematic layout, and component selection",
      "Source code review, debugging, and implementation assistance",
      "Preparation for viva-voce questions and technical defenses",
      "Custom technical projects spanning ₹799 to ₹4,999 based on complexity",
    ],
  },
  {
    id: "project-documentation",
    title: "Project Documentation",
    category: "Academic Solutions",
    description:
      "Professional project reports and technical documentation with organized content, structured formatting, diagrams, references and polished presentation.",
    ctaText: "GET DOCUMENTATION",
    ctaActionId: "project-documentation",
    threeDObject: "Organized research documents",
    threeDDescription: "Crisp layered document sheets with red binding tabs, engineering gears, and statistical charts.",
    highlights: [
      "Softcopy Documentation at ₹499",
      "Hardcopy Bound Documentation at ₹999",
      "Standard IEEE, APA, or University guideline compliance",
    ],
    pricingKey: "projectDocumentation",
    features: [
      "Full abstract, methodology, system analysis, and bibliography",
      "UML diagrams, flowcharts, circuit schematics, and test cases",
      "Proper plagiarism check support & formatting compliance",
      "Ready-to-submit bound formats available",
    ],
  },
  {
    id: "custom-magazines",
    title: "Custom Magazines",
    category: "Creative Design",
    description:
      "Turn your memories, emotions and special moments into beautifully designed personalized magazines.",
    ctaText: "CREATE MY MAGAZINE",
    ctaActionId: "custom-magazines",
    threeDObject: "Rotating hardcover magazine",
    threeDDescription: "A glossy multi-page magazine showcasing college farewell specials with commemorative layout covers.",
    highlights: [
      "College Farewell, Birthday & Anniversary Editions",
      "Friendship & Couple Memory publications",
      "Premium photo retouching & editorial print styling",
    ],
    pricingKey: "customMagazines",
    subcategories: [
      "College Farewell Magazines",
      "Birthday Magazines",
      "Anniversary Magazines",
      "Gifts for Loved Ones",
      "Friendship Memory Magazines",
      "Couple Memory Magazines",
      "Special Occasion Magazines",
    ],
    features: [
      "Personalized front cover featuring your photos and headlines",
      "Custom article spreads, photo collages, and personal notes",
      "High-resolution digital PDF and optional physical print delivery",
      "Transparent quotation based on page count and printing specs",
    ],
  },
  {
    id: "web-and-technical-services",
    title: "Web & Technical Services",
    category: "Digital Services",
    description:
      "Modern digital solutions and technical development services designed to bring your ideas to life.",
    ctaText: "BUILD MY PROJECT",
    ctaActionId: "web-technical",
    threeDObject: "Floating desktop monitor",
    threeDDescription: "A sleek floating display screen rendering responsive web interfaces and cloud application portals.",
    highlights: [
      "Portfolio websites & personal brand showcases",
      "Business landing pages & modern web apps",
      "Frontend, backend, databases & IoT integrations",
    ],
    pricingKey: "webAndTechnicalServices",
    features: [
      "Modern frameworks (React, Next.js, Tailwind CSS)",
      "Mobile-first, lightning-fast Core Web Vitals optimization",
      "REST & GraphQL API integrations with secure database schemas",
      "Microcontroller firmware, sensor interfaces, and IoT dashboards",
    ],
  },
];
