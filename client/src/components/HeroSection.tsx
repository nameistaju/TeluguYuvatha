"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// High-end curated fashion apparel list (7 items) with curated metadata for the right details panel
const PRODUCTS = [
  {
    id: 1,
    src: "/assets/OG_shirt_hero.png",
    name: "OG Strike Shirt",
    slug: "og-overshirt",
    collection: "OG Drop",
    material: "Cotton Twill Overshirt",
    price: "₹1,799"
  },
  {
    id: 2,
    src: "/assets/Darling_hero.png",
    name: "Darling Signature Tee",
    slug: "darling-tee",
    collection: "Cinema Core",
    material: "220 GSM Bio-Washed Cotton",
    price: "₹1,099"
  },
  {
    id: 3,
    src: "/assets/cinema_hero.png",
    name: "Cinema Lover Hoodie",
    slug: "cinema-yuvatha-tee",
    collection: "Cinema Core",
    material: "Heavyweight Fleece Blend",
    price: "₹999"
  },
  {
    id: 4,
    src: "/assets/jersyTshirt_hero.png",
    name: "Jersey Classic Tee",
    slug: "yuvatha-jersey-tee",
    collection: "OG Drop",
    material: "Performance Cotton Blend",
    price: "₹1,199"
  },
  {
    id: 5,
    src: "/assets/Pushpa_jean_hero.png",
    name: "Pushpa Raw Denim",
    slug: "pushpa-denim-jean",
    collection: "Cinema Core",
    material: "12 oz Rugged Raw Denim",
    price: "₹2,299"
  },
  {
    id: 6,
    src: "/assets/surya son of krishnan_hero.png",
    name: "Surya Signature Shirt",
    slug: "surya-son-of-krishnan-tee",
    collection: "Cinema Core",
    material: "240 GSM Retro-Fit Cotton",
    price: "₹1,099"
  },
  {
    id: 7,
    src: "/assets/OG_hero.png",
    name: "OG Windbreaker Jacket",
    slug: "og-telugu-tee",
    collection: "OG Drop",
    material: "Weatherproof Ripstop Shell",
    price: "₹999"
  }
];

const HERO_PARTICLES = [
  { id: 0, size: "1.6px", left: "10%", top: "64%", duration: 28, delay: 0.1, drift: "-18%" },
  { id: 1, size: "2.7px", left: "46%", top: "72%", duration: 33, delay: 0.4, drift: "12%" },
  { id: 2, size: "2.2px", left: "97%", top: "40%", duration: 25, delay: 0.8, drift: "-22%" },
  { id: 3, size: "1.9px", left: "24%", top: "45%", duration: 31, delay: 1.1, drift: "16%" },
  { id: 4, size: "2.6px", left: "57%", top: "78%", duration: 36, delay: 0.2, drift: "-8%" },
  { id: 5, size: "2.75px", left: "21%", top: "44%", duration: 27, delay: 1.6, drift: "20%" },
  { id: 6, size: "2.1px", left: "36%", top: "70%", duration: 34, delay: 0.9, drift: "-14%" },
  { id: 7, size: "1.7px", left: "68%", top: "92%", duration: 29, delay: 0.5, drift: "10%" },
  { id: 8, size: "1.35px", left: "90%", top: "89%", duration: 32, delay: 1.4, drift: "-24%" },
  { id: 9, size: "1.95px", left: "17%", top: "69%", duration: 30, delay: 0.7, drift: "18%" },
  { id: 10, size: "2.6px", left: "93%", top: "91%", duration: 35, delay: 1.8, drift: "-16%" },
  { id: 11, size: "1.55px", left: "53%", top: "34%", duration: 26, delay: 0.3, drift: "22%" },
  { id: 12, size: "1.45px", left: "9%", top: "83%", duration: 38, delay: 1.2, drift: "-12%" },
  { id: 13, size: "2.05px", left: "14%", top: "74%", duration: 24, delay: 0.6, drift: "15%" }
] as const;

export default function HeroSection() {
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const pointerFrame = useRef<number | null>(null);
  const latestPointer = useRef({ x: 0, y: 0 });

  // 1. Responsive Viewport Resize Handler
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Continuous Auto-Play Loop (Changes product automatically every 4.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIdx) => (prevIdx + 1) % PRODUCTS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (pointerFrame.current) cancelAnimationFrame(pointerFrame.current);
    };
  }, []);

  // 3. 3D Cursor Parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    latestPointer.current = {
      x: (e.clientX - viewport.width / 2) / (viewport.width / 2),
      y: (e.clientY - viewport.height / 2) / (viewport.height / 2)
    };
    if (pointerFrame.current) return;
    pointerFrame.current = requestAnimationFrame(() => {
      pointerFrame.current = null;
      setParallax(latestPointer.current);
    });
  };

  const activeProduct = PRODUCTS[activeIndex] || PRODUCTS[0];

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative h-[100vh] w-full overflow-hidden bg-[#0A0A0A] select-none flex flex-col justify-between"
      style={{ perspective: "1000px" }}
    >
      {/* Luxury Vignette and Warm Stage Spotlight Underlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Main Cinematic stage spotlight (Restored) */}
        <Image
          src="/assets/Hero_bg.png"
          alt="Atmospheric Vignette"
          fill
          priority
          className="object-cover object-center opacity-40 mix-blend-screen hidden md:block"
        />
        <Image
          src="/assets/mobile hero.png"
          alt="Atmospheric Vignette Mobile"
          fill
          priority
          className="object-cover object-center opacity-40 mix-blend-screen md:hidden"
        />

        {/* Faint Grid and Vignette frames */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.008)_1px,_transparent_1px)] bg-[size:100px_100px] md:bg-[size:140px_140px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(10,10,10,0.95)_95%)] z-10" />

        {/* Fine Floating Golden Sparkles */}
        <div className="absolute inset-0 z-10 overflow-hidden mix-blend-screen opacity-30">
          {HERO_PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-gold/20"
              style={{
                width: p.size,
                height: p.size,
                left: p.left,
                top: p.top,
              }}
              animate={{
                y: ["0%", "-100%"],
                x: ["0%", p.drift],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── EXACT CENTER STAGE SHOWCASE (SINGLE HERO APPAREL) ── */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mt-[-2vh] md:mt-[1vh]">
        <div
          className="relative w-[75vw] h-[45vh] sm:w-[45vw] sm:h-[48vh] md:w-[28vw] md:h-[52vh] flex items-center justify-center pointer-events-auto"
          style={{
            transform: `translate3d(${parallax.x * 20}px, ${parallax.y * 18}px, 0) rotateY(${parallax.x * 10}deg) rotateX(${-parallax.y * 10}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{
                scale: activeProduct.slug === "pushpa-raw-denim" ? 0.82 : 1.0,
                opacity: 0,
                y: 35,
              }}
              animate={{
                scale: activeProduct.slug === "pushpa-raw-denim" ? 1.0 : 1.22,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: activeProduct.slug === "pushpa-raw-denim" ? 0.82 : 1.0,
                opacity: 0,
                y: -35,
              }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 18,
              }}
              className="relative w-full h-full pointer-events-auto"
            >
              {/* Floating Breathing motion */}
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                }}
                transition={{
                  duration: 5,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="relative w-full h-full pointer-events-auto"
              >
                <Link
                  href={`/product/${activeProduct.slug}`}
                  className="relative w-full h-full block pointer-events-auto cursor-pointer z-30"
                >
                  <Image
                    src={activeProduct.src}
                    alt={activeProduct.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 75vw, 30vw"
                    className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:scale-[1.03] transition-transform duration-500"
                  />

                  {/* Pristine Clean shadow base */}
                  <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 w-[60%] h-[10px] bg-black/40 blur-[8px] rounded-full scale-[0.9] animate-pulse" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── MINIMAL PRODUCT DETAILS PANEL (RIGHT SIDE) ── */}
      <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-20 pointer-events-auto md:flex hidden flex-col gap-1 text-right max-w-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-end gap-1.5"
          >
            <span className="text-[9px] text-gold font-bold uppercase tracking-[0.25em]">
              {activeProduct.collection}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider leading-tight">
              {activeProduct.name}
            </h2>
            <span className="text-[10px] text-white/50 uppercase tracking-[0.15em] font-semibold mt-0.5">
              {activeProduct.material}
            </span>
            <span className="text-base font-extrabold text-white mt-1">
              {activeProduct.price}
            </span>
            
            <Link
              href={`/product/${activeProduct.slug}`}
              className="inline-flex items-center gap-1.5 text-[9px] text-accent font-black uppercase tracking-[0.2em] mt-3 hover:text-white transition-colors duration-300 group cursor-pointer"
            >
              Discover Drop
              <motion.span 
                className="inline-block"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                &rarr;
              </motion.span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
