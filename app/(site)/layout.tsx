// app/(site)/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster as Sonner } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "100",
});

export const metadata: Metadata = {
  title: "RelixCore Photography Portfolio",
  description: "Professional photography page",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <Sonner />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
