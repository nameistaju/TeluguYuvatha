"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import QuickViewModal from "./QuickViewModal";

import { PRODUCTS } from "@/data/products";

// Slice first 8 curated products from unified database
const products = PRODUCTS.slice(0, 8).map(p => ({
  id: Number(p.id),
  slug: p.slug,
  name: p.name,
  type: p.type,
  price: `₹${p.price.toLocaleString('en-IN')}`,
  img: p.img,
  priceVal: p.price
}));

export default function ProductCollections() {
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  return (
    <section className="py-32 bg-background px-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gold/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black uppercase text-white mb-2 tracking-tighter"
            >
              Latest Drops
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/50 uppercase tracking-[0.3em] text-xs font-bold"
            >
              Wear The Mass
            </motion.p>
          </div>
          <Link href="/collections/all">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mt-6 md:mt-0 uppercase tracking-widest text-xs font-bold border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-background transition-all"
            >
              View All Products
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => {
            // Make some items span 2 columns and rows for a masonry feel
            const isFeatured = i === 0 || i === 6;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.1, ease: "easeOut" }}
                className={`group cursor-pointer ${isFeatured ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <div className="block w-full h-full relative">
                  <Link href={`/product/${product.slug}`}>
                    <div className={`relative bg-surface rounded-2xl overflow-hidden mb-4 ${isFeatured ? "aspect-[4/5] md:aspect-square" : "aspect-[4/5]"}`}>
                      <Image
                        src={product.img}
                        alt={product.name}
                        fill
                        sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      
                      {/* Dark gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Quick action buttons text info */}
                      <div className="absolute bottom-6 left-6 right-28 flex flex-col opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-10 pointer-events-none">
                        <p className="text-xs text-gold uppercase tracking-widest mb-2 font-bold">{product.type}</p>
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider leading-tight">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                  </Link>

                  {/* Absolute positioned float actions to prevent link click conflicts */}
                  <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-20">
                    {/* Quick View Eye Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="w-12 h-12 bg-white/10 hover:bg-gold hover:text-background rounded-full flex items-center justify-center text-white transition-all shadow-xl hover:scale-110 cursor-pointer border border-white/10"
                      aria-label="Quick View Product"
                    >
                      <Eye size={20} />
                    </button>

                    {/* Direct Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to cart state
                        useCartStore.getState().addItem({
                          productId: String(product.id),
                          name: product.name,
                          price: product.priceVal,
                          size: "M",
                          image: product.img,
                          quantity: 1
                        });
                        // Open cart drawer by clicking navbar cart button
                        const navBtn = document.querySelector('button[aria-label="Open cart drawer"]') as HTMLButtonElement;
                        if (navBtn) navBtn.click();
                      }}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-background hover:bg-gold hover:text-background transition-all shadow-xl hover:scale-110 cursor-pointer"
                      aria-label="Add to Cart"
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                  
                  {/* Info below image for non-hover state */}
                  <Link href={`/product/${product.slug}`}>
                    <div className="flex justify-between items-center group-hover:opacity-0 transition-opacity duration-300">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          {product.name}
                        </h3>
                        <p className="text-xs text-white/50 uppercase tracking-widest">{product.type}</p>
                      </div>
                      <p className="text-white font-bold">{product.price}</p>
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* State-controlled Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}

