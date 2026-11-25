import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stackryze — Affordable infrastructure for the modern web",
  description:
    "Domains, DNS, and managed infrastructure built for developers and the people who depend on them. Reliable, fairly priced, and made for everyone shipping online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-background text-foreground">
        {/* Global atmosphere layers — fixed, behind all content.
            Each is isolated with `contain: strict` (via .bg-aurora /
            .bg-grid-fine) so they don't trigger paint on the rest of
            the page when content scrolls underneath. */}
        <div
          aria-hidden
          className="bg-aurora pointer-events-none fixed inset-0 -z-10"
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
