export interface PricingTier {
  label: string;
  price: string;
  details?: string;
}

export interface ServicePricingConfig {
  id: string;
  pricingType: "Fixed Tier Pricing" | "Indicative Range Pricing" | "Package Pricing" | "Custom Quotation" | "Indicative Scope Pricing";
  summary: string;
  tiers?: PricingTier[];
  note?: string;
}

export const pricingConfig: Record<string, ServicePricingConfig> = {
  notesAndRecords: {
    id: "notes-records",
    pricingType: "Fixed Tier Pricing",
    summary: "Fixed transparent page-based tiers for handwritten records, notes, and academic materials.",
    tiers: [
      { label: "10 Pages", price: "₹40", details: "Structured handwritten or formatted academic notes" },
      { label: "50 Pages", price: "₹240", details: "Mid-length record documentation and assignments" },
      { label: "100 Pages", price: "₹480", details: "Full semester notes and extensive lab records" },
    ],
    note: "All page counts are based on standard academic record formats.",
  },

  powerpointPresentations: {
    id: "powerpoint-presentations",
    pricingType: "Indicative Range Pricing",
    summary: "Indicative pricing depending on presentation depth, custom animations, and layout style.",
    tiers: [
      {
        label: "Simple PPT (10–30 Slides)",
        price: "₹49 – ₹249",
        details: "Clean, structured academic & project slides with clean typography and diagrams",
      },
      {
        label: "Creative PPT (10–40 Slides)",
        price: "₹99 – ₹400",
        details: "Dynamic themes, custom graphics, smooth slide transitions, and bespoke layout design",
      },
    ],
    note: "Final quotation confirmed after reviewing slide complexity, custom visuals, and technical diagrams.",
  },

  academicProjectAssistance: {
    id: "academic-project-assistance",
    pricingType: "Indicative Scope Pricing",
    summary: "Scope-based pricing for technical projects, implementation assistance, and concept reviews.",
    tiers: [
      {
        label: "Project Assistance",
        price: "Starting from ₹500",
        details: "Guidance on technical concepts, architecture review, and project troubleshooting",
      },
      {
        label: "Custom Academic & Technical Projects",
        price: "₹799 – ₹4,999",
        details: "End-to-end guidance depending on domain scope, hardware/software modules, and project depth",
      },
    ],
    note: "Indicative pricing. Exact scope and requirements are reviewed before confirming quotation.",
  },

  projectDocumentation: {
    id: "project-documentation",
    pricingType: "Package Pricing",
    summary: "Standardized packages for complete project reports and technical documentation.",
    tiers: [
      {
        label: "Softcopy Documentation",
        price: "₹499",
        details: "Formatted PDF & editable doc with diagrams, references, executive summary, and complete structure",
      },
      {
        label: "Hardcopy Documentation",
        price: "₹999",
        details: "Fully bound, print-ready formatted copy with high-grade paper and presentation binding",
      },
    ],
    note: "Includes table of contents, technical schematics, bibliography, and institutional standard layout.",
  },

  customMagazines: {
    id: "custom-magazines",
    pricingType: "Custom Quotation",
    summary: "Personalized quotation based on total pages, visual styling, photo curation, and print specifications.",
    tiers: [
      {
        label: "Personalized Magazine Design",
        price: "Custom Quotation",
        details: "Includes editorial design, photo retouching, customized cover, memory blurbs, and print-ready files",
      },
    ],
    note: "Pricing varies transparently according to page count, editorial complexity, and hardbound print requirements.",
  },

  webAndTechnicalServices: {
    id: "web-technical-services",
    pricingType: "Custom Quotation",
    summary: "Requirement-based pricing determined by architecture, tech stack, and feature complexity.",
    tiers: [
      {
        label: "Digital & Technical Development",
        price: "Custom Quotation",
        details: "Modern websites, portfolio sites, fullstack web applications, IoT firmware, and embedded systems",
      },
    ],
    note: "Quotations provided after comprehensive review of your technical specifications and milestone requirements.",
  },
};
