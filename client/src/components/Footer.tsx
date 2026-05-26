"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SocialIcon({ label }: { label: "IG" | "X" | "f" }) {
  return <span className="text-sm font-black" aria-hidden>{label}</span>;
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState(380);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
    if (!footerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.target.clientHeight);
      }
    });

    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Spacer to push content so the fixed footer is scroll-revealed on desktop */}
      {mounted && isHome && (
        <div 
          style={{ height: `${height}px` }} 
          className="md:block hidden pointer-events-none w-full bg-transparent" 
        />
      )}
      <footer 
        ref={footerRef}
        className={`${
          isHome ? "md:fixed md:bottom-0 md:left-0 md:w-full md:z-0" : "relative"
        } z-10 bg-background pt-20 pb-10 border-t border-surface`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground mb-4">
                Telugu<br />Yuvatha
              </h3>
              <p className="text-foreground/50 text-sm font-light mb-6">
                Premium streetwear inspired by the raw, unapologetic energy of Telugu cinema culture.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-foreground hover:bg-accent hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <SocialIcon label="IG" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-foreground hover:bg-accent hover:text-white transition-colors">
                  <span className="sr-only">X</span>
                  <SocialIcon label="X" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-foreground hover:bg-accent hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <SocialIcon label="f" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Shop</h4>
              <ul className="space-y-4 text-foreground/70 text-sm">
                <li><Link href="/collections/all" className="hover:text-accent transition-colors">All Products</Link></li>
                <li><Link href="/collections/shirts" className="hover:text-accent transition-colors">Shirts</Link></li>
                <li><Link href="/collections/denim" className="hover:text-accent transition-colors">Denim</Link></li>
                <li><Link href="/collections/accessories" className="hover:text-accent transition-colors">Accessories</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Company</h4>
              <ul className="space-y-4 text-foreground/70 text-sm">
                <li><Link href="/story" className="hover:text-accent transition-colors">Our Story</Link></li>
                <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                <li><Link href="/careers" className="hover:text-accent transition-colors">Careers</Link></li>
                <li><Link href="/stockists" className="hover:text-accent transition-colors">Stockists</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Support</h4>
              <ul className="space-y-4 text-foreground/70 text-sm">
                <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
                <li><Link href="/shipping" className="hover:text-accent transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/size-guide" className="hover:text-accent transition-colors">Size Guide</Link></li>
                <li><Link href="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-surface flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-foreground/40 text-xs uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Telugu Yuvatha. All rights reserved.
            </p>
            <div className="flex gap-4 text-foreground/40 text-xs uppercase tracking-widest">
              <span>Secured by Razorpay</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
