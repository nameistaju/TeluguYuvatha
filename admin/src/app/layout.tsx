import type { Metadata } from "next";
import type React from "react";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Telugu Yuvatha Admin",
  description: "Premium ecommerce operations dashboard for Telugu Yuvatha."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
