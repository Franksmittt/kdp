import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DeferredStyles } from "@/components/DeferredStyles";
import { LegacyScriptLoader } from "@/components/LegacyScriptLoader";
import { BUSINESS, SITE_URL } from "@/config/site";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
  weight: ["500", "600", "700"],
});

const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingSiteVerification =
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

const siteVerification: Metadata["verification"] = {};
if (googleSiteVerification) siteVerification.google = googleSiteVerification;
if (bingSiteVerification) {
  siteVerification.other = {
    "msvalidate.01": bingSiteVerification,
  };
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: BUSINESS.name,
  title: `${BUSINESS.name} | Interior & Exterior Painting`,
  description:
    "Owner-managed painting, roof restoration, waterproofing, and maintenance for Krugersdorp, the West Rand, and Gauteng.",
  robots: { index: true, follow: true },
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  },
  appleWebApp: {
    capable: true,
    title: BUSINESS.name,
    statusBarStyle: "default",
  },
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: BUSINESS.name,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
  ...(Object.keys(siteVerification).length > 0
    ? { verification: siteVerification }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e3a5f",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA">
      <head>
        <link rel="dns-prefetch" href="https://wa.me" />
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/css/slicknav.min.css" rel="stylesheet" />
        <link href="/css/swiper-bundle.min.css" rel="stylesheet" />
        <link href="/css/all.min.css" rel="stylesheet" />
        <link href="/css/custom.css" rel="stylesheet" />
      </head>
      <body
        id="top"
        className={`kgp-body ${dmSans.variable} ${spaceGrotesk.variable}`}
      >
        <a className="kgp-skip-link" href="#main-content">
          Skip to main content
        </a>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <a
          href="https://wa.me/27764719933"
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp Rico"
          aria-label="WhatsApp Rico on 076 471 9933"
        >
          <i className="fa-brands fa-whatsapp" aria-hidden="true" />
        </a>
        <DeferredStyles />
        <LegacyScriptLoader />
      </body>
    </html>
  );
}
