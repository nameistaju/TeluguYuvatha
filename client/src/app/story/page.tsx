"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Variants } from "framer-motion";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";

type StoryParticle = {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  randomX: number;
};

export default function StoryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [particles, setParticles] = useState<StoryParticle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        randomX: (Math.random() - 0.5) * 100,
      }))
    );
  }, []);

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white overflow-hidden">
      <Navbar />

      {/* 1. STORY HERO SECTION */}
      <section ref={containerRef} className="relative h-[100svh] w-full overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Image
            src="/assets/story_img.png"
            alt="Telugu Yuvatha Story"
            fill
            priority
            className="object-cover object-center opacity-70 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--tw-gradient-stops))] from-transparent via-background/20 to-background/90" />
        </motion.div>

        {/* Hero Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-accent/40"
              style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
              animate={{ y: ["0%", "-1000%"], x: ["0%", `${p.randomX}%`], opacity: [0, 0.6, 0] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-end text-center px-4 pb-32">
          <motion.div initial="hidden" animate="visible" variants={fadeUpVariant} className="max-w-4xl mx-auto">
            <span className="text-accent text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-6 block">Our Story</span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6 drop-shadow-2xl">
              Every Drop Begins <br /> With a Story
            </h1>
            <p className="text-lg md:text-2xl text-white/70 font-medium max-w-2xl mx-auto">
              Telugu Yuvatha was born from cinema, culture, and the desire to wear what we feel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. BRAND ORIGIN SECTION */}
      <section className="py-32 px-4 relative z-10 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">Born from <br/><span className="text-accent">Telugu Emotion</span></h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant} transition={{ delay: 0.2 }}>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
                Telugu Yuvatha was created to transform the passion Telugu youth have for cinema into premium streetwear. Every design captures memories, dialogues, heroes, and emotions that shaped our generation. We are not just printing shirts; we are documenting cultural history.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. WHY TELUGU YUVATHA SECTION */}
      <section className="py-32 px-4 bg-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-xs text-accent font-bold uppercase tracking-[0.4em] mb-6">Why We Exist</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} transition={{ delay: 0.2 }} className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight text-white">
            We believe clothing should express identity. Our designs celebrate first-day-first-show excitement, unforgettable movie moments, and the emotional connection Telugu people share with their heroes.
          </motion.p>
        </div>
      </section>

      {/* 4. WHAT WE CREATE SECTION */}
      <section className="py-32 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-center mb-20">What We Create</motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Oversized T-Shirts", desc: "Heavyweight cotton, relaxed cinematic fits." },
              { title: "Premium Shirts", desc: "Classic silhouettes infused with nostalgic motifs." },
              { title: "Raw Denim", desc: "Rugged textures built for the mass appeal." },
              { title: "Limited Drops", desc: "Exclusive collector items with unique packaging." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-surface/50 border border-white/5 p-8 rounded-2xl hover:bg-surface transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="text-accent font-bold">0{idx + 1}</span>
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-wider mb-4">{item.title}</h3>
                <p className="text-foreground/60 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR VISION SECTION */}
      <section className="py-32 px-4 bg-background border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-xs text-gold font-bold uppercase tracking-[0.4em] mb-6">Our Vision</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} transition={{ delay: 0.2 }} className="text-2xl md:text-4xl font-light text-white/90 leading-relaxed">
            To build the most iconic Telugu streetwear brand and create a global cultural movement that represents Telugu pride through fashion.
          </motion.p>
        </div>
      </section>

      {/* 6. FOUNDERS NOTE SECTION */}
      <section className="py-32 px-4 bg-surface">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="md:col-span-5">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">From the Founder</h2>
            <div className="w-16 h-1 bg-accent mb-8" />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} transition={{ delay: 0.2 }} className="md:col-span-7">
            <blockquote className="text-2xl md:text-3xl italic font-serif text-white/80 leading-relaxed border-l-4 border-accent/30 pl-8">
              "This brand was built for every Telugu fan who carries cinema in their heart. Telugu Yuvatha is more than clothing—it is identity, nostalgia, and emotion made wearable."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* 7. QUOTE SECTION */}
      <section className="py-40 px-4 bg-background relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background to-background pointer-events-none" />
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black uppercase tracking-tighter text-center leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 relative z-10"
        >
          We don't just <br /> wear clothes. <br />
          <span className="text-accent bg-none text-accent bg-clip-border">We wear memories.</span>
        </motion.h2>
      </section>

      {/* 8. CTA SECTION */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-50" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">Join the Movement</motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/collections/all" className="w-full sm:w-auto px-10 py-5 bg-white text-background rounded-full font-bold uppercase tracking-widest hover:bg-gold hover:text-background transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,213,79,0.3)]">
              Shop Collection
            </Link>
            <Link href="/collections/all" className="w-full sm:w-auto px-10 py-5 border border-white/20 text-white rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm">
              Explore Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 9. CUSTOM STORY FOOTER */}
      <footer className="relative w-full overflow-hidden border-t border-white/10">
        {/* Responsive Background Images */}
        <div className="absolute inset-0 z-0">
          <div className="hidden md:block w-full h-full relative">
            <Image src="/assets/Story_footer_desktop.png" alt="Footer Background" fill className="object-cover object-bottom" />
          </div>
          <div className="block md:hidden w-full h-full relative">
            <Image src="/assets/Story_footer_mobile.png" alt="Footer Background" fill className="object-cover object-bottom" />
          </div>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-background/80 md:bg-background/70 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-black uppercase tracking-widest mb-6 text-white">Telugu Yuvatha</h2>
              <p className="text-white/60 font-light max-w-sm mb-8 leading-relaxed">
                Premium streetwear inspired by the heart, soul, and unforgettable moments of Telugu cinema culture.
              </p>
              <div className="flex gap-4">
                {['Instagram', 'Twitter', 'YouTube'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white hover:text-background transition-colors text-xs font-bold">
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Explore</h3>
              <ul className="space-y-4">
                {['Shop All', 'New Arrivals', 'Our Story', 'Contact Us'].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-white/60 hover:text-white transition-colors text-sm uppercase tracking-wider">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Stay Updated</h3>
              <p className="text-white/60 text-sm mb-4">Join our newsletter for exclusive drops.</p>
              <form className="flex gap-2">
                <input suppressHydrationWarning type="email" placeholder="YOUR EMAIL" className="bg-white/5 border border-white/10 px-4 py-3 rounded-full text-sm w-full focus:outline-none focus:border-accent text-white placeholder-white/30" />
                <button type="submit" className="bg-white text-background px-6 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-white transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} Telugu Yuvatha. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
