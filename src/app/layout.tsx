import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import { site } from "@/lib/site";
import { getSite } from "@/lib/data";
import { SITE_URL, organizationLd, websiteLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const title = `${site.name} — ${site.tagline}`;

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSite();
  const favicon = siteConfig.brand.faviconUrl?.trim();
  const logo = siteConfig.brand.logoUrl?.trim() || "/logo.png";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s — ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    alternates: {
      canonical: "/",
    },
    keywords: [
      "By Areeqaan",
      "jewellery Pakistan",
      "minimal jewellery",
      "fashion accessories",
      "necklaces",
      "bracelets",
      "rings",
      "earrings",
      "anklets",
      "affordable luxury jewellery",
      "online jewellery store Pakistan",
    ],
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    category: "shopping",
    formatDetection: { telephone: false, address: false, email: false },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description: site.description,
      url: SITE_URL,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: site.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: favicon || "/favicon.ico",
      apple: logo,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#faf6f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${nunito.variable}`}>
      <head>
        {/* Warm up connections to image hosts for faster LCP. */}
        <link rel="preconnect" href="https://hmdszipyyayelegnimqh.supabase.co" />
        <link rel="dns-prefetch" href="https://hmdszipyyayelegnimqh.supabase.co" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased">
        <JsonLd data={[organizationLd(), websiteLd()]} />
        {children}
      </body>
    </html>
  );
}
