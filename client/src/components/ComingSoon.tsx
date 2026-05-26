"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const comingSoonItems = [
  "/assets/Comingsoon1.png",
  "/assets/Comingsoon2.png",
  "/assets/comingsoon3.png",
  "/assets/comingsoon4.png",
  "/assets/comingsoon5.png",
  "/assets/comingsoon6.png",
];

export default function ComingSoon() {
  return (
    <section className="py-24 bg-background px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
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
            className="text-white/50 uppercase tracking-[0.3em] text-xs font-bold"
          >
            Exclusive Future Drops
          </motion.p>
        </div>

        {/* Horizontal Marquee / Scroll */}
        <div className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory no-scrollbar">
          {comingSoonItems.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative w-[75vw] sm:w-[45vw] md:w-[30vw] aspect-[4/5] shrink-0 snap-center rounded-2xl overflow-hidden bg-surface group"
            >
              <Image 
                src={src} 
                alt={`Coming Soon ${idx + 1}`} 
                fill 
                sizes="(max-width: 768px) 75vw, 30vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm">
                <p className="text-white font-bold uppercase tracking-widest border border-white/30 px-6 py-2 rounded-full">
                  Stay Tuned
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
