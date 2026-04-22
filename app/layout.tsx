import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoCraft — Turning Plastic Waste into Beautiful Futures",
  description:
    "EcoCraft connects waste sellers, eco-product buyers, job seekers, and innovators to build a sustainable circular economy.",
  keywords: ["upcycled", "eco-friendly", "plastic waste", "green jobs", "sustainability", "recycled products"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
