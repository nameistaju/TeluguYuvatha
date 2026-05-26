"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 text-center px-4">
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-4 text-surface border-text relative">
          <span className="absolute inset-0 flex items-center justify-center text-foreground opacity-20">404</span>
          <span className="relative z-10">404</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wider mb-6">Page In Development</h2>
        <p className="text-foreground/70 max-w-md mx-auto mb-8 uppercase tracking-widest text-sm">
          The cinematic experience for this page is currently being crafted. Check back on our next drop.
        </p>
        <Link href="/" className="px-8 py-4 bg-foreground text-background rounded-full font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-colors">
          Back to Home
        </Link>
      </div>
      <Footer />
    </main>
  );
}
