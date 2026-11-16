import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.writtenexpressa.in"),
  title: {
    default: "Written Expressa | Your Creative & Academic Partner",
    template: "%s | Written Expressa",
  },
  description:
    "From academic presentations and IEEE documentation to personalized magazines and technical solutions, Written Expressa helps turn your ideas into professionally crafted experiences.",
  keywords: [
    "Written Expressa",
    "Academic Presentations India",
    "Project Documentation Services",
    "Personalized Magazines",
    "Technical Solutions",
    "PPT Design India",
    "Engineering Project Assistance",
  ],
  authors: [{ name: "Written Expressa Team" }],
  creator: "Written Expressa",
  publisher: "Written Expressa",
  alternates: {
    canonical: "https://www.writtenexpressa.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.writtenexpressa.in/",
    siteName: "Written Expressa",
    title: "Written Expressa | Your Creative & Academic Partner",
    description:
      "From academic presentations and IEEE documentation to personalized magazines and technical solutions, Written Expressa helps turn your ideas into professionally crafted experiences.",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 800,
        alt: "Written Expressa - Your Creative & Academic Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Written Expressa | Your Creative & Academic Partner",
    description:
      "From academic presentations and IEEE documentation to personalized magazines and technical solutions, Written Expressa helps turn your ideas into professionally crafted experiences.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.writtenexpressa.in/#organization",
        name: "Written Expressa",
        alternateName: ["WE", "Written Expressa Studio"],
        url: "https://www.writtenexpressa.in/",
        logo: "https://www.writtenexpressa.in/images/logo.png",
        image: "https://www.writtenexpressa.in/images/logo.png",
        description:
          "Written Expressa is India's creative and academic partner, providing professional academic presentations, IEEE project documentation, custom farewell magazines, lab records, and technical IoT/AI solutions.",
        email: "writtenexpressa@gmail.com",
        telephone: "+91 9492801206",
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        sameAs: [
          "https://www.instagram.com/written_expressa/",
          "https://www.linkedin.com/in/written-expressa/",
          "https://whatsapp.com/channel/0029VbADcwd7j6g5OBRBfW08",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+91 9492801206",
            contactType: "customer support and order desk",
            availableLanguage: ["English", "Hindi", "Telugu"],
            areaServed: "IN",
            email: "support@writtenexpressa.in",
            url: "https://wa.me/919492801206",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.writtenexpressa.in/#website",
        url: "https://www.writtenexpressa.in/",
        name: "Written Expressa",
        description: "Your Creative & Academic Partner",
        publisher: {
          "@id": "https://www.writtenexpressa.in/#organization",
        },
        inLanguage: "en-IN",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 font-sans selection:bg-red-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
