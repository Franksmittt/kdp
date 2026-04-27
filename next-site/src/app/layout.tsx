import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DeferredStyles } from "@/components/DeferredStyles";
import { LegacyScriptLoader } from "@/components/LegacyScriptLoader";
import { SITE_URL } from "@/config/site";

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
  weight: ["400", "500", "600", "700"],
});

const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true },
  referrer: "origin-when-cross-origin",
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e3a5f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA">
      <head>
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
        {children}
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
