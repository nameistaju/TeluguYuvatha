"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { PRODUCTS } from "@/data/products";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { productIds, toggle } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const { token } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  const wishlistItems = PRODUCTS.filter((p) => productIds.includes(p.id));

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-4 w-full">
        <div className="mb-12 border-b border-white/10 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">
              Wishlist
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">{wishlistItems.length} items saved</p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart size={48} strokeWidth={1} className="text-white/20 mb-6" />
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-2">Your wishlist is empty.</h2>
            <p className="text-xs font-medium text-white/50 mb-8 max-w-md">Save your favorite pieces here to keep track of them and easily add them to your cart later.</p>
            <Link 
              href="/collections/all"
              className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-white/90 transition-colors"
            >
              Discover Drops
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group relative">
                <Link href={`/product/${item.slug}`} className="block">
                  <div className="relative aspect-[4/5] bg-[#111111] rounded-lg overflow-hidden mb-3 border border-white/5">
                    <Image src={item.images[0]} alt={item.name} fill sizes="300px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                </Link>
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/product/${item.slug}`} className="min-w-0 flex-1">
                    <span className="text-[9px] text-white/40 uppercase tracking-[0.1em] font-bold block">{item.type}</span>
                    <h3 className="text-sm font-black uppercase text-white tracking-wide truncate mt-0.5 transition-colors group-hover:text-white/80">{item.name}</h3>
                    <p className="text-xs font-black text-white/60 mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                  </Link>
                  <button 
                    onClick={() => toggle(item.id, token || undefined)}
                    className="p-2 -mr-2 text-white/40 hover:text-[#d34a4a] transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    addItem({
                      productId: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.images[0],
                      quantity: 1,
                      size: item.sizes[1] || item.sizes[0],
                      color: "Standard",
                    });
                  }}
                  className="w-full mt-4 py-2 border border-white/20 hover:border-white/50 text-white text-[11px] font-black uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={14} strokeWidth={1.5} /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
