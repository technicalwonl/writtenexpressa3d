import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SEED_TIMESTAMP = "2026-11-16T00:00:00.000Z";

// Helper to ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Generic file-backed table read/write with error recovery
export function getTableData<T>(tableName: string, defaultData: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  if (!fs.existsSync(filePath)) {
    saveTableData(tableName, defaultData);
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${tableName}.json, restoring default:`, error);
    return defaultData;
  }
}

export function saveTableData<T>(tableName: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  const tempPath = path.join(DATA_DIR, `${tableName}.tmp`);
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  }
}

// Log audit activity
export function recordActivity(action: string, entity: string, details: string, user: string = "Admin User"): void {
  try {
    const logs = getTableData<any[]>("activity_logs", []);
    const newLog = {
      id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      user,
      action,
      entity,
      details,
    };
    logs.unshift(newLog);
    saveTableData("activity_logs", logs.slice(0, 500)); // retain last 500 actions
  } catch (e) {
    console.error("Failed to record activity log:", e);
  }
}

// Seed initial business data if not present
export function initializeDatabase() {
  ensureDataDir();

  // 1. SERVICES
  getTableData("services", [
    {
      id: "srv_notes_records",
      title: "Notes & Academic Records",
      category: "Academic Solutions",
      status: "Published",
      featured: true,
      description: "Professionally prepared academic notes, handwritten records and customized academic materials designed according to your requirements.",
      ctaText: "ORDER NOTES & RECORDS",
      ctaActionId: "notes-records",
      threeDObject: "Floating academic notebook",
      highlights: ["Precise handwritten records & lab reports", "Organized course notes with diagrams", "Custom university formatting"],
      pricingModel: "Fixed Tier Pricing",
      packages: [
        { name: "10 Pages", price: "₹40", note: "Handwritten or formatted notes" },
        { name: "50 Pages", price: "₹240", note: "Standard lab record" },
        { name: "100 Pages", price: "₹480", note: "Full semester notebook" }
      ],
      updatedAt: SEED_TIMESTAMP
    },
    {
      id: "srv_ppt",
      title: "PowerPoint Presentations",
      category: "Creative Design",
      status: "Published",
      featured: true,
      description: "Transform your ideas into visually impressive presentations with professional layouts, attractive themes, diagrams, animations and structured content.",
      ctaText: "CREATE MY PRESENTATION",
      ctaActionId: "ppt-presentations",
      threeDObject: "Laptop with presentation slides",
      highlights: ["Simple & Creative PPT tiers", "Engaging animations & vector charts", "Academic defenses & symposiums"],
      pricingModel: "Indicative Range Pricing",
      packages: [
        { name: "Simple PPT (10–30 Slides)", price: "₹49 – ₹249", note: "Clean typography, graphs & structured slides" },
        { name: "Creative PPT (10–40 Slides)", price: "₹99 – ₹400", note: "Bespoke animations, graphics & dynamic slides" }
      ],
      updatedAt: SEED_TIMESTAMP
    },
    {
      id: "srv_academic_project",
      title: "Academic Project Assistance",
      category: "Technical Solutions",
      status: "Published",
      featured: true,
      description: "Get assistance with academic projects, technical concepts, project development, documentation, presentation preparation and project-related requirements.",
      ctaText: "DISCUSS MY PROJECT",
      ctaActionId: "academic-projects",
      threeDObject: "3D technical project model",
      highlights: ["Hardware, IoT, AI, software, and embedded systems", "Starting from ₹500 for conceptual review", "Viva preparation guidance"],
      pricingModel: "Indicative Scope Pricing",
      packages: [
        { name: "Project Guidance & Review", price: "Starting from ₹500", note: "Concept assistance & architecture review" },
        { name: "Custom Technical Projects", price: "₹799 – ₹4,999", note: "Hardware & software capstone builds" }
      ],
      updatedAt: SEED_TIMESTAMP
    },
    {
      id: "srv_documentation",
      title: "Project Documentation",
      category: "Academic Solutions",
      status: "Published",
      featured: true,
      description: "Professional project reports and technical documentation with organized content, structured formatting, diagrams, references and polished presentation.",
      ctaText: "GET DOCUMENTATION",
      ctaActionId: "project-documentation",
      threeDObject: "Organized research documents",
      highlights: ["IEEE, APA & University guideline compliance", "Softcopy & Hardcopy options", "Complete schematics, SRS & testing"],
      pricingModel: "Package Pricing",
      packages: [
        { name: "Softcopy Documentation", price: "₹499", note: "Formatted PDF & editable Word doc" },
        { name: "Hardcopy Documentation", price: "₹999", note: "Deluxe bound & printed thesis report" }
      ],
      updatedAt: SEED_TIMESTAMP
    },
    {
      id: "srv_magazines",
      title: "Custom Magazines",
      category: "Creative Design",
      status: "Published",
      featured: true,
      description: "Turn your memories, emotions and special moments into beautifully designed personalized magazines.",
      ctaText: "CREATE MY MAGAZINE",
      ctaActionId: "custom-magazines",
      threeDObject: "Rotating hardcover magazine",
      highlights: ["College Farewell & Anniversary editions", "Personalized cover with your photos", "Digital flipbook & print-ready CMYK"],
      pricingModel: "Custom Quotation",
      packages: [
        { name: "Personalized Magazine", price: "Custom Quotation", note: "Based on page count and binding" }
      ],
      updatedAt: SEED_TIMESTAMP
    },
    {
      id: "srv_web_tech",
      title: "Web & Technical Services",
      category: "Digital Services",
      status: "Published",
      featured: true,
      description: "Modern digital solutions and technical development services designed to bring your ideas to life.",
      ctaText: "BUILD MY PROJECT",
      ctaActionId: "web-technical",
      threeDObject: "Floating desktop monitor",
      highlights: ["Portfolio & business websites", "Fullstack development & database schemas", "IoT firmware & sensor interfaces"],
      pricingModel: "Custom Quotation",
      packages: [
        { name: "Fullstack Web & Technical Solution", price: "Custom Quotation", note: "Based on scope and complexity" }
      ],
      updatedAt: SEED_TIMESTAMP
    },
    {
      id: "srv_art_store",
      title: "Expressa Art Store",
      category: "Creative Design",
      status: "Published",
      featured: false,
      description: "Handcrafted physical art prints, framed technical sketches, and commemorative student artworks.",
      ctaText: "ORDER ART PRINT",
      ctaActionId: "art-store",
      threeDObject: "Framed art canvas",
      highlights: ["Matte archival framing", "Standard academic desk sizes", "Custom personalized prints"],
      pricingModel: "Fixed Tier Pricing",
      packages: [
        { name: "5×7 Inch Print", price: "₹149", note: "Compact framed print" },
        { name: "8×10 Inch Print", price: "₹299", note: "Standard desk display" },
        { name: "11×14 Inch Print", price: "₹499", note: "Wall commemorative frame" }
      ],
      updatedAt: SEED_TIMESTAMP
    }
  ]);

  // 2. PRICING
  getTableData("pricing", [
    { id: "prc_notes", serviceId: "srv_notes_records", serviceName: "Notes & Records", type: "Fixed Tier Pricing", details: "10 Pages: ₹40 | 50 Pages: ₹240 | 100 Pages: ₹480", minPrice: 40, maxPrice: 480, isCustom: false, updatedAt: SEED_TIMESTAMP },
    { id: "prc_ppt", serviceId: "srv_ppt", serviceName: "PowerPoint Presentations", type: "Indicative Range Pricing", details: "Simple: ₹49–₹249 | Creative: ₹99–₹400", minPrice: 49, maxPrice: 400, isCustom: false, updatedAt: SEED_TIMESTAMP },
    { id: "prc_projects", serviceId: "srv_academic_project", serviceName: "Academic Project Assistance", type: "Indicative Scope Pricing", details: "Review: Starting ₹500 | Custom: ₹799–₹4,999", minPrice: 500, maxPrice: 4999, isCustom: false, updatedAt: SEED_TIMESTAMP },
    { id: "prc_doc", serviceId: "srv_documentation", serviceName: "Project Documentation", type: "Package Pricing", details: "Softcopy: ₹499 | Hardcopy: ₹999", minPrice: 499, maxPrice: 999, isCustom: false, updatedAt: SEED_TIMESTAMP },
    { id: "prc_art", serviceId: "srv_art_store", serviceName: "Art Store", type: "Fixed Tier Pricing", details: "5×7: ₹149 | 8×10: ₹299 | 11×14: ₹499", minPrice: 149, maxPrice: 499, isCustom: false, updatedAt: SEED_TIMESTAMP },
    { id: "prc_mag", serviceId: "srv_magazines", serviceName: "Custom Magazines", type: "Custom Quotation", details: "Personalized quotation based on page count and binding", minPrice: 0, maxPrice: 0, isCustom: true, updatedAt: SEED_TIMESTAMP },
    { id: "prc_web", serviceId: "srv_web_tech", serviceName: "Web & Technical Services", type: "Custom Quotation", details: "Requirement-based pricing based on tech stack and complexity", minPrice: 0, maxPrice: 0, isCustom: true, updatedAt: SEED_TIMESTAMP }
  ]);

  // 3. ORDERS (From existing business logs: Home automation, foot step doc, records)
  getTableData("orders", [
    {
      id: "ORD-2026-101",
      customerName: "Harshitha Rao",
      customerPhone: "+91 98765 23412",
      customerEmail: "harshitha.r@gmail.com",
      serviceName: "PowerPoint Presentations",
      projectTitle: "Biomedical Signal Processing Seminar Deck",
      agreedAmount: 350,
      advanceReceived: 350,
      remainingBalance: 0,
      paymentStatus: "Paid",
      orderStatus: "Delivered",
      assignedTo: "Creative Lead",
      deliveryDate: "2026-10-24",
      createdAt: "2026-10-20T10:30:00Z",
      notes: "Quotation WE2564 fulfilled. Client approved final PPTX."
    },
    {
      id: "ORD-2026-102",
      customerName: "Shabari Swamy",
      customerPhone: "+91 98490 88219",
      customerEmail: "shabari.tech@yahoo.com",
      serviceName: "Academic Project Assistance",
      projectTitle: "Foot Step Power Generation with Documentation",
      agreedAmount: 850,
      advanceReceived: 450,
      remainingBalance: 400,
      paymentStatus: "Payment Partially Received",
      orderStatus: "In Progress",
      assignedTo: "Technical Specialist",
      deliveryDate: "2026-11-20",
      createdAt: "2026-11-02T14:15:00Z",
      notes: "Hardware chassis assembled. Documentation draft in progress."
    },
    {
      id: "ORD-2026-103",
      customerName: "Karthik Verma",
      customerPhone: "+91 97001 44520",
      customerEmail: "karthik.v@collegelabs.in",
      serviceName: "Academic Project Assistance",
      projectTitle: "Home Automation PIR Sensor Module",
      agreedAmount: 500,
      advanceReceived: 300,
      remainingBalance: 200,
      paymentStatus: "Payment Partially Received",
      orderStatus: "In Progress",
      assignedTo: "Technical Specialist",
      deliveryDate: "2026-11-25",
      createdAt: "2026-11-08T09:00:00Z",
      notes: "PIR sensor code and wiring schematic shared."
    },
    {
      id: "ORD-2026-104",
      customerName: "Sneha Reddy",
      customerPhone: "+91 99880 11223",
      customerEmail: "sneha.reddy@btech.ac.in",
      serviceName: "Notes & Academic Records",
      projectTitle: "Semester Lab Record Writing (November Batch)",
      agreedAmount: 480,
      advanceReceived: 480,
      remainingBalance: 0,
      paymentStatus: "Paid",
      orderStatus: "Completed",
      assignedTo: "Academic Team",
      deliveryDate: "2026-11-14",
      createdAt: "2026-11-10T11:45:00Z",
      notes: "100 pages completed with neat schematics."
    }
  ]);

  // 4. TESTIMONIALS (Initial authentic testimonials)
  getTableData("testimonials", [
    {
      id: "tst_1",
      customerName: "Harshitha Rao",
      servicePurchased: "PowerPoint Presentations",
      rating: 5,
      reviewText: "The presentation design for my university seminar was extraordinary. The custom diagrams and clean structure received immense appreciation from our review panel.",
      status: "Approved",
      featured: true,
      consentVerified: true,
      createdAt: "2026-10-25T16:00:00Z"
    },
    {
      id: "tst_2",
      customerName: "Shabari Swamy",
      servicePurchased: "Academic Project Assistance",
      rating: 5,
      reviewText: "Written Expressa helped explain the technical architecture clearly and provided complete assistance with the circuit schematic and viva preparation.",
      status: "Approved",
      featured: true,
      consentVerified: true,
      createdAt: "2026-11-05T12:30:00Z"
    }
  ]);

  // 5. 3D EXPERIENCE SETTINGS
  getTableData("three_d_settings", {
    enabled: true,
    scrollControlled: true,
    scrollContainerHeight: 520, // vh
    lerpSpeed: 0.065,
    enableMouseParallax: true,
    fallbackImage: "/images/brand-wall.webp",
    desktopFrameRateTarget: 60,
    mobileMode: "OptimizedCanvas",
    updatedAt: SEED_TIMESTAMP
  });

  // 6. WEBSITE CONTENT
  getTableData("website_content", {
    hero: {
      headline: "Your Ideas. Our Creativity. One Expressive Result.",
      supportingDescription: "From academic presentations and documentation to personalized magazines and technical solutions, Written Expressa helps turn your ideas into professionally crafted experiences.",
      philosophy: "Your ideas deserve more than ordinary execution."
    },
    about: {
      heading: "More Than a Service. Your Creative Partner.",
      foundingVision: "Written Expressa was established with a simple vision: to make professional creative, academic and technical services accessible to everyone.",
      mission: "To empower individuals and organizations with affordable, innovative and professionally crafted creative and academic solutions.",
      vision: "To become a trusted creative and academic partner, connecting ideas with meaningful outcomes through innovation and technology.",
      creed: "At Written Expressa, your idea is our starting point."
    },
    contact: {
      officialEmail: "writtenexpressa@gmail.com",
      businessEmail: "writtenexpressa@gmail.com",
      supportEmail: "support@writtenexpressa.in",
      whatsappNumber: "+91 9492801206",
      whatsappNumberRaw: "919492801206",
      instagramHandle: "@writtenexpressa",
      instagramUrl: "https://instagram.com/writtenexpressa",
      linkedinUrl: "https://linkedin.com/company/written-expressa",
      websiteUrl: "https://www.writtenexpressa.in/",
      workingHours: "Monday – Saturday: 9:00 AM – 9:00 PM IST",
      location: "India — Serving Students, Scholars & Professionals Pan-India."
    },
    updatedAt: SEED_TIMESTAMP
  });

  // 7. TEAM & USERS
  getTableData("team_users", [
    {
      id: "usr_wefounder",
      name: "WE Founder",
      username: "wefounder",
      email: "wefounder@writtenexpressa.in",
      password: "founder@we",
      role: "Super Admin",
      status: "Active",
      lastLogin: SEED_TIMESTAMP,
      permissions: ["all"]
    },
    {
      id: "usr_superadmin",
      name: "Sai Sheshank",
      username: "saisheshank",
      email: "admin@writtenexpressa.com",
      password: "ExpressaAdmin2026!",
      role: "Super Admin",
      status: "Active",
      lastLogin: SEED_TIMESTAMP,
      permissions: ["all"]
    },
    {
      id: "usr_admin_ops",
      name: "Operations Lead",
      username: "operations",
      email: "operations@writtenexpressa.in",
      password: "expressa@ops2026",
      role: "Admin",
      status: "Active",
      lastLogin: "2026-11-16T08:00:00Z",
      permissions: ["services", "pricing", "content", "portfolio", "orders", "enquiries", "notifications"]
    },
    {
      id: "usr_moderator_reviews",
      name: "Review Moderator",
      username: "moderator",
      email: "moderator@writtenexpressa.in",
      password: "expressa@mod2026",
      role: "Moderator",
      status: "Active",
      lastLogin: "2026-11-15T18:00:00Z",
      permissions: ["testimonials", "enquiries_view", "content_draft"]
    }
  ]);

  // 8. REFERRALS
  getTableData("referrals", [
    { id: "ref_1", code: "EXPRESSA20", referrerName: "Rahul Sharma", email: "rahul.s@gmail.com", visits: 84, enquiries: 12, converted: 3, rewardEarned: 600, status: "Active" },
    { id: "ref_2", code: "CAMPUSVIP", referrerName: "Ananya Patel", email: "ananya.p@college.edu", visits: 142, enquiries: 24, converted: 7, rewardEarned: 1400, status: "Active" }
  ]);

  // 9. NEWSLETTER SUBSCRIBERS
  getTableData("newsletter", [
    { id: "sub_1", email: "student.club@osmania.ac.in", subscribedAt: "2026-10-15T10:00:00Z", status: "Subscribed", source: "Website Footer" },
    { id: "sub_2", email: "kiran.ece@gmail.com", subscribedAt: "2026-11-01T14:22:00Z", status: "Subscribed", source: "Resource Download" },
    { id: "sub_3", email: "sneha.reddy@btech.ac.in", subscribedAt: "2026-11-10T11:50:00Z", status: "Subscribed", source: "Enquiry Form" }
  ]);

  // 10. FAQS
  getTableData("faqs", [
    { id: "faq_1", question: "How does the project delivery and revision process work?", answer: "Once you submit your requirements, we prepare an initial draft for your review. You can suggest adjustments and we incorporate feedback before handing over final deliverables.", category: "General", order: 1, published: true },
    { id: "faq_2", question: "What is your pricing model for PPTs and documentation?", answer: "Pricing starts from ₹49 for simple PPT slides and ₹499 for softcopy documentation. Exact quotations are confirmed based on slide count, custom graphics, and formatting standards.", category: "Pricing", order: 2, published: true },
    { id: "faq_3", question: "Can I get physical bound documentation or printed magazines?", answer: "Yes! We offer hardcopy deluxe thesis documentation at ₹999 and physical commemorative magazines with customized page counts and print specs.", category: "Delivery", order: 3, published: true },
    { id: "faq_4", question: "What services does Written Expressa provide?", answer: "We provide Academic Notes & Records, PowerPoint Presentations, Capstone Project Assistance, IEEE Documentation, Custom Commemorative Magazines, and Web/Technical Development.", category: "Services", order: 4, published: true },
    { id: "faq_5", question: "Can I order directly through WhatsApp?", answer: "Yes! Simply choose your service and click 'ORDER NOW'. Your WhatsApp will open automatically with your prefilled order details to +91 9492801206.", category: "WhatsApp Ordering", order: 5, published: true },
    { id: "faq_6", question: "Do you serve students outside Hyderabad?", answer: "Yes, Written Expressa serves students, researchers, and professionals pan-India with digital deliverables and nationwide courier delivery for hardcopies.", category: "General Information", order: 6, published: true },
    { id: "faq_7", question: "What payment methods are available?", answer: "We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, and Bank Transfer. We typically begin with an advance and collect the balance upon milestone approval.", category: "Payment", order: 7, published: true },
    { id: "faq_8", question: "How can I request modifications or revisions?", answer: "We share draft milestones for your review. You can message us your feedback directly on WhatsApp or email, and we refine the work until you are satisfied.", category: "Revisions", order: 8, published: true }
  ]);

  // 11. INTEGRATIONS
  getTableData("integrations", [
    { id: "int_whatsapp", name: "WhatsApp Business Direct Ordering", provider: "WhatsApp", status: "Connected & Operational", details: "Direct ordering and instant consultation routing (+91 9492801206)", lastSync: SEED_TIMESTAMP },
    { id: "int_supabase", name: "Supabase Database & Storage", provider: "Supabase", status: "Configured (Local / Cloud Ready)", details: "Ready for Supabase cloud credentials; normalized tables synced in data/ layer", lastSync: SEED_TIMESTAMP },
    { id: "int_analytics", name: "Google Analytics 4 & Internal Tracking", provider: "Google", status: "Ready", details: "GA4 measurement ID hook and local order-intent telemetry active", lastSync: SEED_TIMESTAMP },
    { id: "int_razorpay", name: "Razorpay Payments Gateway", provider: "Razorpay", status: "Architecture Ready", details: "Indian payment gateway webhook handlers ready for live credentials", lastSync: null }
  ]);

  // 12. SEO SETTINGS
  getTableData("seo_settings", {
    siteTitle: "Written Expressa | Your Creative & Academic Partner",
    metaDescription: "From academic presentations and IEEE documentation to personalized magazines and technical solutions, Written Expressa turns your ideas into professionally crafted experiences.",
    keywords: "Written Expressa, Academic Project Services India, PPT Design Services India, Project Documentation, Custom Magazines, Notes Preparation, IoT Projects, Web Development",
    ogImage: "/images/brand-wall.webp",
    twitterHandle: "@writtenexpressa",
    canonicalUrl: "https://www.writtenexpressa.in/",
    updatedAt: SEED_TIMESTAMP
  });

  // 13. SITE SETTINGS
  getTableData("site_settings", {
    siteName: "Written Expressa",
    tagline: "Your Creative & Academic Partner",
    maintenanceMode: false,
    allowEnquiries: true,
    currencySymbol: "₹",
    supportEmail: "writtenexpressa@gmail.com",
    supportPhone: "+91 9492801206",
    updatedAt: SEED_TIMESTAMP
  });

  // 14. PORTFOLIO PROJECTS (Reflects only authentic uploaded files)
  getTableData("portfolio", []);

  // 15. BLOG ARTICLES
  getTableData("blogs", [
    {
      id: "blog_1",
      slug: "how-to-structure-engineering-project-documentation-ieee",
      title: "How to Structure an Engineering Project Report According to IEEE Standards",
      excerpt: "Master the anatomy of an academic technical report: from Abstract and System Architecture to Results and References.",
      content: "Writing an academic project report can be daunting. The standard format requires a crisp abstract, problem definition, literature survey, system design schematics, implementation flowcharts, results, and proper references. Written Expressa ensures that your reports strictly comply with college guidelines and IEEE standard formatting.",
      coverImage: "/hero-sequence/frame_075.webp",
      category: "Academic Solutions",
      tags: ["Documentation", "IEEE", "Engineering Projects"],
      author: "Sai Sheshank",
      status: "Published",
      publishedAt: "2026-11-10T10:00:00Z"
    },
    {
      id: "blog_2",
      slug: "crafting-high-impact-ppt-for-seminar-viva-defense",
      title: "10 Secrets to Delivering a High-Impact PowerPoint Presentation for Your Viva Defense",
      excerpt: "Ditch walls of text. Learn how clear typography, diagrams, and purposeful animations convince your review committee.",
      content: "When presenting before external evaluators, less is often more. Focus on problem formulation, system methodology, comparison charts, and clean visuals. Our design team at Written Expressa transforms complex technical concepts into intuitive, visually captivating slide decks.",
      coverImage: "/hero-sequence/frame_060.webp",
      category: "Creative Design",
      tags: ["Presentation Design", "Viva", "Slides"],
      author: "Creative Team",
      status: "Published",
      publishedAt: "2026-11-12T14:30:00Z"
    },
    {
      id: "blog_3",
      slug: "why-custom-farewell-magazines-are-the-ultimate-college-memory",
      title: "Why Custom Commemorative Magazines Are the Ultimate College Farewell Memory",
      excerpt: "Transform batch memories, inside jokes, and senior tributes into a deluxe printed magazine.",
      content: "Digital photos get lost in group chats. A tangible, beautifully bound commemorative magazine preserves your batch's memories forever. Written Expressa designs custom magazines with personalized photo curations, senior profiles, and print-ready finishes.",
      coverImage: "/hero-sequence/frame_085.webp",
      category: "Creative Design",
      tags: ["Magazines", "College Farewell", "Design"],
      author: "Editorial Team",
      status: "Published",
      publishedAt: "2026-11-14T09:15:00Z"
    }
  ]);

  // 14. NOTIFICATION SUBSCRIBERS
  getTableData("notification_subscribers", [
    {
      id: "sub_1",
      name: "Harshitha Rao",
      contact: "harshitha.r@gmail.com",
      type: "Browser & Email",
      browserEnabled: true,
      status: "Active",
      createdAt: "2026-11-10T09:30:00.000Z"
    },
    {
      id: "sub_2",
      name: "Karthik Verma",
      contact: "+91 97001 44520",
      type: "WhatsApp & Browser",
      browserEnabled: true,
      status: "Active",
      createdAt: "2026-11-12T14:15:00.000Z"
    }
  ]);

  // 15. BROADCAST NOTIFICATIONS
  getTableData("broadcast_notifications", [
    {
      id: "notif_broadcast_1",
      title: "Semester Project Submission Deadline Assistance",
      message: "Finalizing your IEEE Major Project report? Book your softcopy review or deluxe binding with 24-hour turnaround.",
      category: "Academic Alert",
      actionUrl: "/services/project-documentation",
      actionText: "View Documentation Packages",
      sentAt: "2026-11-14T10:00:00.000Z",
      recipientCount: 148,
      status: "Delivered"
    }
  ]);
}
