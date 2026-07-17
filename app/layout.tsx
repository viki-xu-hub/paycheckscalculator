import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paycheck Atlas | Texas Paycheck Calculator 2026",
  description: "Free Texas paycheck calculator. Estimate your 2026 take-home pay after federal income tax, Social Security, Medicare, and pre-tax deductions.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Texas Paycheck Calculator",
    description: "Estimate your 2026 take-home pay",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Texas Paycheck Calculator" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
