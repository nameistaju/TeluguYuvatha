"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Heart, ShoppingBag, Search, SlidersHorizontal, ArrowUpDown, Sparkles, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/data/products";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import QuickViewModal from "@/components/QuickViewModal";

// Standardize category page data mappings
const allProducts = PRODUCTS.map(p => ({
  id: Number(p.id),
  slug: p.slug,
  name: p.name,
  type: p.type,
  category: p.category,
  priceVal: p.price,
  price: `₹${p.price.toLocaleString('en-IN')}`,
  img: p.img,
  description: p.description
}));

const CATEGORIES = [
  { value: "all", label: "Shop All" },
  { value: "shirts", label: "Shirts & Polos" },
  { value: "denim", label: "Denim Jeans" },
  { value: "outerwear", label: "Hoodies & Jackets" },
  { value: "accessories", label: "Accessories" }
];

export default function CollectionPage() {
  const params = useParams();
  const categoryParam = params.category as string;

  // STRICT REQUIREMENT: Completely remove t-shirts page/category from code
  if (categoryParam === "t-shirts") {
    notFound();
  }

  // Reactive states for advanced premium filter system
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const token = useAuthStore((state) => state.token);
  const wishedIds = useWishlistStore((state) => state.productIds);
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  // Sync category param change (e.g. clicking link in Navbar) to active state
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Dynamically listen to URL search parameter ?q=... from Navbar search
  useEffect(() => {
    const updateSearchFromUrl = () => {
      if (typeof window !== "undefined") {
        const q = new URLSearchParams(window.location.search).get("q") || "";
        setSearchQuery(q);
      }
    };

    // Initial sync on mount
    updateSearchFromUrl();

    // Listen to history changes (back/forward) and our custom Navbar event
    window.addEventListener("popstate", updateSearchFromUrl);
    window.addEventListener("searchchange", updateSearchFromUrl);

    return () => {
      window.removeEventListener("popstate", updateSearchFromUrl);
      window.removeEventListener("searchchange", updateSearchFromUrl);
    };
  }, []);

  // Compute live filtered and sorted list of products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(product => {
        // 1. Category Filter
        const matchesCategory = 
          selectedCategory === "all" || 
          product.category === selectedCategory ||
          (selectedCategory === "shirts" && product.category === "t-shirts");
        
        // 2. Search Query Filter (Checks name, type, and description)
        const matchesSearch = 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
          
        return matchesCategory && matchesSearch;
      });
  }, [selectedCategory, searchQuery]);

  const activeCategoryLabel = CATEGORIES.find(c => c.value === selectedCategory)?.label || "Products";

  return (
    <main className="min-h-screen bg-[#080808] text-foreground flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Decorative Ambient Spotlights */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[40vw] h-[40vh] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Structural Stage Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.003)_1px,_transparent_1px)] bg-[size:120px_120px] opacity-40 pointer-events-none" />
      
      <div className="flex-grow pt-36 pb-24 max-w-7xl mx-auto px-4 w-full relative z-10">
        
        {/* Banner Section */}
        <div className="mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} className="text-gold" />
            <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.25em]">Cinema Collectives</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
            {activeCategoryLabel}
          </h1>
          <p className="text-xs text-white/40 uppercase tracking-[0.25em] font-bold mt-3">
            Showing {filteredProducts.length} premium drops
          </p>
        </div>

        {/* ── CATEGORY FILTER CHIPS ── */}
        <div className="flex flex-wrap gap-2.5 mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                  isActive 
                    ? "bg-white text-background border-white shadow-xl shadow-white/5" 
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── PRODUCTS RESULT GRID ── */}
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-2xl backdrop-blur-sm"
            >
              <p className="text-white/40 uppercase tracking-[0.3em] text-xs font-black">
                No matching dynamic products found
              </p>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const params = new URLSearchParams(window.location.search);
                    params.delete("q");
                    const newUrl = `${window.location.pathname}?${params.toString()}`;
                    window.history.replaceState(null, "", newUrl);
                    window.dispatchEvent(new Event("searchchange"));
                  }
                  setSelectedCategory("all");
                }}
                className="mt-6 text-[10px] font-black uppercase tracking-widest bg-white text-background px-6 py-3 rounded-xl hover:bg-gold transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4) }}
                  className="group cursor-pointer flex flex-col"
                >
                  <Link href={`/product/${product.slug}`} className="flex flex-col h-full w-full">
                    <div className="relative aspect-[3/4] bg-[#121212] rounded-2xl overflow-hidden mb-4 border border-white/5 group-hover:border-gold/25 transition-all duration-300 w-full">
                      <Image
                        src={product.img}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Dark Vignette Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                      {/* Quick action buttons (Fly in from Right) */}
                      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                        {/* Wishlist Heart */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void toggleWishlist(String(product.id), token);
                          }}
                          className={`p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full transition-all shadow-2xl ${
                            wishedIds.includes(String(product.id)) ? "text-accent scale-110" : "text-white hover:text-accent hover:scale-110"
                          }`}
                          aria-label="Toggle wishlist"
                        >
                          <Heart size={16} fill={wishedIds.includes(String(product.id)) ? "currentColor" : "none"} />
                        </button>

                        {/* Quick View Eye Icon */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuickViewProduct(product);
                          }}
                          className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-gold hover:scale-110 transition-all shadow-2xl"
                          aria-label="Quick view"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Direct Shopping Bag Add */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Quick add to cart
                            const rawPrice = typeof product.price === "string"
                              ? parseFloat(product.price.replace(/[^\d.]/g, ""))
                              : product.priceVal;
                            useCartStore.getState().addItem({
                              productId: String(product.id),
                              name: product.name,
                              price: rawPrice,
                              size: "M",
                              image: product.img,
                              quantity: 1
                            });
                            // Open cart drawer
                            const navBtn = document.querySelector('button[aria-label="Open cart drawer"]') as HTMLButtonElement;
                            if (navBtn) navBtn.click();
                          }}
                          className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-gold hover:scale-110 transition-all shadow-2xl"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Info Panel */}
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <span className="text-[9px] text-gold uppercase tracking-[0.2em] font-black">{product.type}</span>
                        <h3 className="text-base font-black text-white uppercase tracking-wider mt-1 mb-2 group-hover:text-gold transition-colors leading-tight">
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/5">
                        <p className="text-xs text-white/50 line-clamp-1 max-w-[150px] font-bold">{product.description}</p>
                        <p className="text-sm font-black text-white">{product.price}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      <Footer />

      {/* State-controlled Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </main>
  );
}
