export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  previewImage: string;
  deliverables: string[];
  toolsUsed: string[];
  clientType: string;
}

export const portfolioCategories = [
  "All",
  "Academic PPT Designs",
  "Research Presentations",
  "Project Documentation",
  "Customized Magazines",
  "Website Projects",
  "Technical Projects",
  "Creative Graphic Designs",
] as const;

export const portfolioItems: PortfolioItem[] = [
  {
    id: "college-farewell-magazine",
    title: "College Farewell Special Magazine",
    category: "Customized Magazines",
    shortDescription:
      "A 32-page commemorative graduation magazine featuring batch memories, faculty tributes, student achievements, and high-resolution photo spreads.",
    fullDescription:
      "Designed for an engineering graduating class, this custom magazine combines editorial magazine aesthetics with sentimental storytelling. Includes candid photo galleries, heartfelt messages, department trivia, and a bespoke hardbound cover.",
    previewImage: "/images/portfolio/farewell-magazine.webp",
    deliverables: ["Print-Ready CMYK PDF", "Digital Flipbook Version", "Custom Cover Art"],
    toolsUsed: ["Adobe InDesign", "Photoshop", "Typography Systems"],
    clientType: "College Student Committee",
  },
  {
    id: "architecture-project-deck",
    title: "Urban Architecture Defense Deck",
    category: "Academic PPT Designs",
    shortDescription:
      "A 35-slide high-impact architectural project presentation featuring 3D elevation renders, structural diagrams, and clean minimalist layouts.",
    fullDescription:
      "Crafted for a final year architecture thesis presentation. Structured around zoning laws, sustainable materials, HVAC integrations, and site plans with subtle page transitions that keep defense evaluators engaged.",
    previewImage: "/images/portfolio/web-laptop.webp",
    deliverables: ["35 Custom Slides", "Vector Floorplan Graphics", "Presenter Delivery Notes"],
    toolsUsed: ["PowerPoint", "Figma", "Illustrator"],
    clientType: "Architecture Thesis Candidate",
  },
  {
    id: "embedded-robotics-rover",
    title: "Autonomous IoT Obstacle-Avoidance Rover",
    category: "Technical Projects",
    shortDescription:
      "Embedded microcontroller hardware prototype with ultrasonic radar mapping, Wi-Fi telemetry telemetry reporting, and interactive tablet control dashboard.",
    fullDescription:
      "Assisted an electronics team with sensor calibration, dual-motor driver H-bridge wiring, microcontroller C++ firmware, and real-time sensor visualization on a web telemetry console.",
    previewImage: "/images/portfolio/iot-technical.webp",
    deliverables: ["Firmware Code (.cpp)", "Circuit Schematics & BOM", "Viva Demonstration Guide"],
    toolsUsed: ["Arduino IDE", "ESP32", "C++", "Circuit Simulation"],
    clientType: "Engineering Senior Capstone",
  },
  {
    id: "comprehensive-project-dossier",
    title: "Cloud Infrastructure Engineering Dossier",
    category: "Project Documentation",
    shortDescription:
      "A complete 90-page IEEE standard project documentation report with architecture schematics, security analysis, test verification cases, and bibliography.",
    fullDescription:
      "Authored with strict adherence to institutional thesis guidelines. Covers problem statement, literature survey of 30+ peer-reviewed papers, system requirements specification (SRS), sequence diagrams, and empirical benchmark data.",
    previewImage: "/images/portfolio/studio-showcase.webp",
    deliverables: ["IEEE Format Softcopy PDF", "Editable Word Source Document", "Plagiarism Compliance Summary"],
    toolsUsed: ["LaTeX", "Microsoft Word", "Draw.io", "Zotero"],
    clientType: "Computer Science Research Scholar",
  },
  {
    id: "ai-medical-research-paper",
    title: "Deep Learning Diagnostic Analysis Paper",
    category: "Research Presentations",
    shortDescription:
      "An analytical academic symposium presentation translating complex CNN diagnostic accuracy curves and confusion matrices into intuitive visual graphs.",
    fullDescription:
      "Created for an international student conference. Features custom data visualizations of model training loss, receiver operating characteristic (ROC) curves, and comparative clinical benchmarks.",
    previewImage: "/images/portfolio/creative-universe.webp",
    deliverables: ["20 Conference Slides", "High-Resolution Figure Exports", "Executive Research Abstract"],
    toolsUsed: ["PowerPoint", "Matplotlib / Python", "Adobe Illustrator"],
    clientType: "Biomedical Engineering Researcher",
  },
  {
    id: "written-expressa-digital-platform",
    title: "Creative Digital Studio Web Experience",
    category: "Website Projects",
    shortDescription:
      "Next.js 16 modern studio platform with interactive 3D WebGL scenes, 60fps scroll storytelling, and instant WhatsApp enquiry integration.",
    fullDescription:
      "A state-of-the-art responsive web application designed for creative and academic solutions. Features canvas frame scrubbing, dark charcoal typography contrasts, and server-side inquiry dispatching.",
    previewImage: "/images/brand-wall.webp",
    deliverables: ["Fullstack Next.js App", "Three.js 3D Showcase", "Centralized Admin Configs"],
    toolsUsed: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js"],
    clientType: "Digital Creative Brand",
  },
  {
    id: "curated-academic-records-binder",
    title: "Coursework Records & Laboratory Notebooks",
    category: "Creative Graphic Designs",
    shortDescription:
      "Precision handwritten records and structured academic record binders featuring ruled pagination, hand-drawn schematics, and clear notation.",
    fullDescription:
      "Meticulously organized lab manuals and term assignments adhering strictly to departmental layout templates, indexing rules, and experimental observation charts.",
    previewImage: "/images/portfolio/academic-records.webp",
    deliverables: ["Structured Academic Binders", "Lab Manual Tables & Plots", "Hand-drawn Schematics"],
    toolsUsed: ["Handcrafted Drafting", "Technical Calligraphy", "Fine-tip Archival Pens"],
    clientType: "Undergraduate Science & Tech Students",
  },
];
