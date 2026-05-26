"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PRODUCTS } from "@/data/products";

// Select 4 most cinematic premium drops to feature in the Showcase Card Deck
const FEATURED_ITEMS = PRODUCTS.filter(p => 
  ["comeback-denim-jacket", "kgf-rocky-red-hoodie", "acidwash-zipper-hoodie", "butter-yellow-ok-jaanu-shirt"].includes(p.slug)
);

const getFeaturedImg = (slug: string, defaultImg: string) => {
  switch (slug) {
    case "acidwash-zipper-hoodie":
      return "/assets/acidwash-zipper-hoodie_Featured Drops1.png";
    case "butter-yellow-ok-jaanu-shirt":
      return "/assets/butter-yellow-ok-jaanu-shirt_Featured Drops2.png";
    case "comeback-denim-jacket":
      return "/assets/comeback-denim-jacket_Featured Drops3.png";
    case "kgf-rocky-red-hoodie":
      return "/assets/KGF_rocky_red_hoodie_Featured Drops1.png";
    default:
      return defaultImg;
  }
};

// 3D Tilting Card Component for ultra-tactile physical feedback
function FeaturedCard({ product }: { product: typeof FEATURED_ITEMS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Motion values for mouse coordinates relative to card center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring dampeners
  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 18 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 18 });

  // Map coordinate bounds to degrees of rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Floating parallax shift for the apparel image
  const imgX = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);
  const imgY = useTransform(mouseYSpring, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize coordinates to ranges -0.5 to 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  // Curated specs/details based on product slug
  const getSpecs = (slug: string) => {
    switch(slug) {
      case "comeback-denim-jacket":
        return ["Distressed Denim Body", "Raw Edge Trims", "Metal Branded Buttons"];
      case "kgf-rocky-red-hoodie":
        return ["450GSM Ultra Heavyweight", "Puff Print Cinematic Graphic", "Double-Lined Hood"];
      case "acidwash-zipper-hoodie":
        return ["Premium Mineral Wash", "Custom Steel Zip puller", "Drop Shoulder Fit"];
      case "butter-yellow-ok-jaanu-shirt":
        return ["Luxe Linen-Cotton Blend", "Ok Jaanu Cuban Collar", "Mother of Pearl Buttons"];
      default:
        return ["Premium Streetwear Grade", "100% Combed Heavy Cotton", "Cinematic Styling"];
    }
  };

  const getThemeColor = (slug: string) => {
    switch(slug) {
      case "kgf-rocky-red-hoodie":
        return "from-red-600/10 via-transparent to-transparent";
      case "comeback-denim-jacket":
        return "from-blue-500/10 via-transparent to-transparent";
      case "butter-yellow-ok-jaanu-shirt":
        return "from-yellow-400/10 via-transparent to-transparent";
      default:
        return "from-gold/10 via-transparent to-transparent";
    }
  };

  return (
    <Link href={`/product/${product.slug}`} className="block w-full h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4.2] rounded-3xl overflow-hidden bg-[#121212] border border-white/5 cursor-pointer shadow-2xl transition-all duration-300 hover:border-gold/20"
      >
        {/* Dynamic Background Glowing Stage */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${getThemeColor(product.slug)} z-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-40"}`} />
        
        {/* Delicate Blueprint Overlay inside Card */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.003)_1px,_transparent_1px)] bg-[size:30px_30px] opacity-40 z-0 pointer-events-none" />

        {/* Product Card Title & Type (Top Left) */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-black">{product.type}</span>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white/90 mt-1 max-w-[200px] leading-tight">
            {product.name}
          </h3>
        </div>

        {/* Floating Price Badge (Top Right) */}
        <div className="absolute top-6 right-6 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-sm font-bold text-white pointer-events-none">
          ₹{product.price.toLocaleString('en-IN')}
        </div>

        {/* ── EXACT CENTER STAGE IMAGE (3D PARALLAX FLYOUT) ── */}
        <div className="absolute inset-0 flex items-center justify-center z-0 p-12 mt-4 pointer-events-none">
          <motion.div
            style={{
              x: imgX,
              y: imgY,
              z: 80, // Push image forward in 3D perspective
              transformStyle: "preserve-3d",
            }}
            className="relative w-full h-full"
          >
            <Image
              src={getFeaturedImg(product.slug, product.img)}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 90vw, 30vw"
              className="object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:scale-105"
            />
          </motion.div>
        </div>

        {/* Dynamic Hover Specifications Overlay (Fades Up from bottom) */}
        <div className="absolute bottom-0 inset-x-0 p-6 z-20 flex flex-col justify-end bg-gradient-to-t from-black via-black/85 to-transparent pt-24 pointer-events-none">
          {/* Specs List */}
          <div className="flex flex-col gap-1.5 mb-5 overflow-hidden">
            {getSpecs(product.slug).map((spec, i) => (
              <motion.div
                key={spec}
                initial={{ opacity: 0, y: 15 }}
                animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-gold" />
                <span className="text-[11px] text-white/50 font-bold uppercase tracking-wider">{spec}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            className="w-full bg-white hover:bg-gold text-background font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300 pointer-events-auto"
          >
            <span>Explore Drop</span>
            <ArrowRight size={14} />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ProductShowcase3D() {
  return (
    <section className="relative w-full py-32 bg-[#080808] px-4 overflow-hidden border-t border-white/5">
      {/* Background Ambient Spotlights */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Main Structural Stage Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.005)_1px,_transparent_1px)] bg-[size:100px_100px] md:bg-[size:160px_160px] opacity-35 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
            <Sparkles size={12} className="text-gold animate-pulse" />
            <span className="text-[10px] text-white/70 font-black uppercase tracking-[0.25em]">Exclusive Launch</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none">
            Featured Drops
          </h2>
          <p className="text-white/40 uppercase tracking-[0.35em] text-xs font-bold mt-4">
            Volume 01 / Cinema Streetwear Collectives
          </p>
        </div>

        {/* 3D Showcase Card Deck Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_ITEMS.map((product) => (
            <FeaturedCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 text-center">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">
            * Extremely limited quantities. Zero Restocks once sold out.
          </p>
        </div>

      </div>
    </section>
  );
}
