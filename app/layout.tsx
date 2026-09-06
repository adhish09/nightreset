import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AnalyticsProvider } from "@/components/analytics-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nightreset.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NightReset — Quiet Your Mind Before Sleep",
    template: "%s — NightReset",
  },
  description:
    "A simple 10-minute nighttime reset for racing thoughts and overthinking. No medication, no endless scrolling — just a guided way to slow things down before sleep.",
  keywords: [
    "racing thoughts at night",
    "overthinking at night",
    "can't sleep because of overthinking",
    "calm your mind before sleep",
    "nighttime overthinking",
  ],
  openGraph: {
    title: "NightReset — Quiet Your Mind Before Sleep",
    description:
      "A simple 10-minute nighttime reset for racing thoughts and overthinking.",
    url: siteUrl,
    siteName: "NightReset",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "NightReset" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NightReset — Quiet Your Mind Before Sleep",
    description:
      "A simple 10-minute nighttime reset for racing thoughts and overthinking.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AnalyticsProvider>
          {children}
          <Toaster
            theme="dark"
            position="top-center"
            toastOptions={{
              style: {
                background: "var(--card)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
              },
            }}
          />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
