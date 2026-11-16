import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.writtenexpressa.in";
  
  const coreRoutes = [
    { url: baseUrl, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/services`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/portfolio`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/blog`, priority: 0.85, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/about`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/contact`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/privacy-policy`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/terms`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/refund-policy`, priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const serviceSlugs = [
    "notes-and-records",
    "notes-and-academic-records",
    "powerpoint-presentations",
    "powerpoint-presentation-design",
    "academic-project-assistance",
    "project-documentation",
    "custom-magazines",
    "custom-magazine-design",
    "farewell-magazine-design",
    "birthday-anniversary-magazines",
    "creative-art-graphic-design",
    "graphic-design",
    "website-design-development",
    "iot-embedded-systems",
    "iot-embedded-systems-development",
    "ai-technical-solutions",
    "research-presentation-support",
  ];

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const blogSlugs = [
    "how-to-structure-engineering-project-documentation-ieee",
    "best-practices-professional-powerpoint-presentations",
    "complete-guide-college-farewell-magazines",
    "how-to-prepare-academic-project-documentation",
    "tips-creating-effective-research-presentation",
    "introduction-to-iot-academic-projects",
    "how-to-choose-technical-project-development-service",
    "creative-magazine-ideas-special-occasions",
    "how-to-organize-academic-records-professionally",
  ];

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    ...coreRoutes.map((r) => ({ ...r, lastModified: new Date() })),
    ...serviceRoutes,
    ...blogRoutes,
  ];
}
