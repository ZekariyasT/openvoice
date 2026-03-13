import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import SettingsProvider from "@/components/SettingsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenVoice | Modern Accessibility Platform",
  description: "Next-generation accessibility tools including sign language translation, voice assistance, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SettingsProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-accent-blue focus:text-navy-950 focus:font-black focus:rounded-xl focus:shadow-2xl transition-all"
          >
            Skip to Content
          </a>
          <Navbar />
          <main id="main-content" className="flex-grow outline-none" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <AccessibilityToolbar />
        </SettingsProvider>
      </body>
    </html>
  );
}
