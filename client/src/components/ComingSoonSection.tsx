"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bell, Sparkles } from "lucide-react";
import { COMING_SOON_PRODUCTS } from "@/data/products";

export default function ComingSoonSection() {
  // Duplicate the array to create a seamless infinite wrapping loop
  const marqueeItems = [...COMING_SOON_PRODUCTS, ...COMING_SOON_PRODUCTS, ...COMING_SOON_PRODUCTS];

  return (
    <section className="py-32 bg-[#0A0A0A] px-4 overflow-hidden relative border-t border-white/5">
      {/* Background Cinematic Texture Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-screen">
        <Image src="/assets/useit.png" alt="Film Grain Texture" fill className="object-cover" />
      </div>

      {/* Decorative Spotlights */}
      <div className="absolute top-1/2 left-0 w-[30vw] h-[30vw] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 mb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
            <Sparkles size={10} className="text-gold" />
            <span className="text-[9px] text-white/50 font-black uppercase tracking-[0.2em]">Future Releases</span>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black uppercase text-white mb-2 tracking-tighter"
          >
            Coming Soon
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gold uppercase tracking-[0.3em] text-xs font-bold"
          >
            Sneak Peeks & Concepts
          </motion.p>
        </div>
      </div>

      {/* ── SEAMLESS INFINITE AUTO-SCROLLING MARQUEE ── */}
      <div className="relative w-full flex items-center overflow-hidden py-4 select-none">
        
        {/* Soft Left and Right Edge Vignette Fades to hide cutoff */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#0A0A0A] to-transparent z-20 pointer-events-none" />

        {/* Scrolling flex track driven by Framer Motion */}
        <motion.div
          animate={{
            x: ["0%", "-33.333%"] // Moves precisely by one complete set width to loop seamlessly
          }}
          transition={{
            ease: "linear",
            duration: 25, // Premium slow luxury glissando drift
            repeat: Infinity,
          }}
          className="flex gap-6 shrink-0 w-max"
        >
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="relative w-[75vw] sm:w-[42vw] md:w-[26vw] aspect-[3/4.2] shrink-0 rounded-2xl overflow-hidden bg-[#121212] border border-white/5 group transition-colors duration-300 hover:border-gold/20"
            >
              {/* Product Coming Soon Image */}
              <Image 
                src={item.img} 
                alt={item.name} 
                fill 
                sizes="(max-width: 768px) 75vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
              />

              {/* Dark Ambient Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              {/* Info Badges */}
              <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gold">
                {item.type}
              </div>

              {/* Dynamic bottom details container */}
              <div className="absolute bottom-0 inset-x-0 p-6 z-20 flex flex-col justify-end">
                <span className="text-[10px] text-white/40 uppercase tracking-[0.25em] font-black mb-1">Concept Drop</span>
                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-wider mb-4 leading-tight">
                  {item.name}
                </h3>
                
                {/* Notify Me Button */}
                <button className="w-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all duration-300">
                  <Bell size={12} className="animate-pulse" />
                  <span>Notify Launch</span>
                </button>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
