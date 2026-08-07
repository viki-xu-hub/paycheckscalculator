import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import ConsentBanner from "./ConsentBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.paycheckscalculator.org"),
  title: "Paycheck Atlas | Free Paycheck Calculator 2026",
  description: "Free 2026 paycheck calculators for salary, hourly, biweekly, federal withholding, FICA, state taxes, and take-home pay.",
  icons: { icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml" }], shortcut: "/favicon.svg?v=2" },
  alternates: { canonical: "/" },
  applicationName: "Paycheck Atlas",
  creator: "Paycheck Atlas",
  category: "finance",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Paycheck", statusBarStyle: "black-translucent" },
  openGraph: {
    title: "Paycheck Calculator 2026",
    description: "Estimate salary or hourly take-home pay with source-backed federal and state methods.",
    type: "website",
    siteName: "Paycheck Calculator",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Paycheck Calculator 2026" }],
  },
  twitter: { card: "summary_large_image", site: "@paycheckscalc", images: ["/og.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#172b3a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${GeistSans.variable} ${GeistMono.variable}`}>{children}<ConsentBanner/></body></html>;
}
