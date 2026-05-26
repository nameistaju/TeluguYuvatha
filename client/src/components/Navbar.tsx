"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, User, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { PRODUCTS } from "@/data/products";
import CartDrawer from "./CartDrawer";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  
  // Use a store selector to prevent hydration mismatch on first render
  const totalItems = useCartStore((state) => state.totalItems);
  const wishedIds = useWishlistStore((state) => state.productIds);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync search input value with URL query parameters on path/history changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("q") || "";
      setSearchQuery(q);
      if (q) {
        setShowSearchDrawer(true);
      }
    }
  }, [pathname]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections/all?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/collections/all");
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? "bg-background/90 backdrop-blur-md border-b border-surface shadow-sm" : "bg-transparent"
        }`}
      >
        <div className={`max-w-7xl mx-auto px-4 flex justify-between items-center transition-all duration-300 relative ${
          isScrolled ? "py-4" : "py-6"
        }`}>
          <div className="flex items-center gap-6 hidden md:flex">
            <Link href="/collections/all" className="text-foreground/80 hover:text-accent font-black uppercase tracking-wider text-sm transition-colors">
              Shop
            </Link>
            <Link href="/collections/accessories" className="text-foreground/80 hover:text-accent font-black uppercase tracking-wider text-sm transition-colors">
              Accessories
            </Link>
            <Link href="/story" className="text-foreground/80 hover:text-accent font-black uppercase tracking-wider text-sm transition-colors">
              Story
            </Link>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-black uppercase tracking-tighter text-foreground hover:text-accent transition-colors">
            Telugu<br className="hidden md:block" />Yuvatha
          </Link>

          <div className="flex items-center gap-5">
            {/* Elegant Search Drawer Trigger */}
            <button 
              type="button"
              onClick={() => setShowSearchDrawer(true)}
              className="text-foreground hover:text-accent transition-colors cursor-pointer"
              aria-label="Open search drawer"
            >
              <Search size={20} strokeWidth={2} />
            </button>

            <Link href="/login" className="text-foreground hover:text-white transition-colors hidden sm:block" aria-label="Account login">
              <User size={22} strokeWidth={1.5} />
            </Link>

            <Link href="/wishlist" className="text-foreground hover:text-white transition-colors relative" aria-label="View wishlist">
              <Heart size={22} strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-2 bg-[#d34a4a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {mounted ? wishedIds.length : 0}
              </span>
            </Link>
            
            <button 
              onClick={() => setShowCartDrawer(true)}
              className="text-foreground hover:text-white transition-colors relative cursor-pointer"
              aria-label="Open cart drawer"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-2 bg-[#d34a4a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {mounted ? totalItems() : 0}
              </span>
            </button>
            <button
              className="text-foreground hover:text-white transition-colors lg:hidden ml-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background flex flex-col px-4 pt-6 pb-12"
          >
            <div className="flex justify-between items-center mb-12">
              <Link href="/" className="text-2xl font-black uppercase tracking-tighter text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                Telugu Yuvatha
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-foreground">
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-col gap-8 text-2xl font-black uppercase tracking-wider">
              <Link href="/collections/all" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent">Shop All</Link>
              <Link href="/collections/accessories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent">Accessories</Link>
              <Link href="/collections/shirts" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent">Shirts</Link>
              <Link href="/collections/denim" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent">Denim</Link>
              <Link href="/story" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent">Story</Link>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent">Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Search Drawer Overlay */}
      <AnimatePresence>
        {showSearchDrawer && (
          <div className="fixed inset-0 z-50 overflow-hidden flex flex-col">
            {/* Backdrop click below container to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearchDrawer(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer z-40"
            />

            {/* Slide Down Search Panel */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative w-full bg-[#0d0d0d] border-b border-white/10 p-6 md:p-12 z-50 flex flex-col gap-8 shadow-2xl shrink-0"
            >
              {/* Top search bar row */}
              <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6">
                <Link href="/" className="text-xl font-black uppercase tracking-tighter text-white" onClick={() => setShowSearchDrawer(false)}>
                  Telugu Yuvatha
                </Link>

                <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="I'm looking for..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (pathname.startsWith("/collections/")) {
                        const params = new URLSearchParams(window.location.search);
                        if (e.target.value) {
                          params.set("q", e.target.value);
                        } else {
                          params.delete("q");
                        }
                        const newUrl = `${window.location.pathname}?${params.toString()}`;
                        window.history.replaceState(null, "", newUrl);
                        window.dispatchEvent(new Event("searchchange"));
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 focus:border-gold/30 rounded-full py-3.5 pl-12 pr-4 text-xs font-black uppercase tracking-widest text-white placeholder-white/30 focus:outline-none transition-all"
                  />
                </form>

                <button
                  onClick={() => setShowSearchDrawer(false)}
                  className="p-2.5 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Suggestions and Popular Products Deck */}
              <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 mt-2">
                {/* Trending searches */}
                <div>
                  <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-4">Trending Search</h4>
                  <div className="flex flex-wrap gap-2">
                    {["t-shirts", "shirts", "hoodies", "accessories", "darling", "kgf"].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          setSearchQuery(chip);
                          if (pathname.startsWith("/collections/")) {
                            const params = new URLSearchParams(window.location.search);
                            params.set("q", chip);
                            const newUrl = `${window.location.pathname}?${params.toString()}`;
                            window.history.replaceState(null, "", newUrl);
                            window.dispatchEvent(new Event("searchchange"));
                          } else {
                            router.push(`/collections/all?q=${encodeURIComponent(chip)}`);
                          }
                          setShowSearchDrawer(false);
                        }}
                        className="px-4 py-2 border border-white/10 hover:border-gold/30 rounded-full text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Products Row */}
                <div>
                  <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-4">Popular Products</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {PRODUCTS.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setShowSearchDrawer(false);
                          router.push(`/product/${item.slug}`);
                        }}
                        className="group flex flex-col gap-2 cursor-pointer bg-[#121212] border border-white/5 hover:border-gold/20 p-3 rounded-2xl transition-all"
                      >
                        <div className="relative aspect-square w-full rounded-xl bg-background overflow-hidden p-2">
                          <Image
                            src={item.img}
                            alt={item.name}
                            fill
                            sizes="120px"
                            className="object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <p className="text-[8px] text-gold font-black uppercase tracking-widest">{item.type}</p>
                          <h5 className="text-[10px] font-black text-white uppercase tracking-wider truncate mt-0.5">{item.name}</h5>
                          <p className="text-[10px] font-bold text-white/50 mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sliding mini cart drawer */}
      <CartDrawer isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
    </>
  );
}
