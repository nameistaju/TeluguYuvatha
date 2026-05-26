"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PromoBanner from "@/components/PromoBanner";
import Footer from "@/components/Footer";

const ProductShowcase3D = dynamic(() => import("@/components/ProductShowcase3D"), {
  ssr: false,
  loading: () => <div className="h-[480px] bg-[#080808]" />
});
const DomeGallery = dynamic(() => import("@/components/DomeGallery"), { ssr: false });
const ProductCollections = dynamic(() => import("@/components/ProductCollections"));
const HeroSignatureLoop = dynamic(() => import("@/components/HeroSignatureLoop"), { ssr: false });
const ComingSoonSection = dynamic(() => import("@/components/ComingSoonSection"));
const BrandVideoSection = dynamic(() => import("@/components/BrandVideoSection"), { ssr: false });
const NewsletterSection = dynamic(() => import("@/components/NewsletterSection"));

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {!introFinished && <Loader onComplete={() => setIntroFinished(true)} />}
      <div className="relative z-10 bg-background shadow-[0_15px_50px_rgba(0,0,0,0.65)]">
        <Navbar />
        <HeroSection />
        <ProductShowcase3D />
        <PromoBanner />
        <DomeGallery />
        <ProductCollections />
        <HeroSignatureLoop />
        <ComingSoonSection />
        <BrandVideoSection />
        <NewsletterSection />
      </div>
      <Footer />
    </main>
  );
}
