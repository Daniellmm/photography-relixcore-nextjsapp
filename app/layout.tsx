'use client'

// import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster as Sonner } from "sonner";
import { SessionProvider } from "next-auth/react";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: '100'
});

// export const metadata: Metadata = {
//   title: "RelixCore Photography Portfolio",
//   description: "Professional photography page",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}>
        <Sonner />
        <main><SessionProvider>{children}</SessionProvider></main>
      </body>
    </html>
  );
}
