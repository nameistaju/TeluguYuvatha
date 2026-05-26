"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Check, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

interface Product {
  id: string | number;
  slug: string;
  name: string;
  type: string;
  price: string | number;
  img: string;
  description?: string;
  sizes?: string[];
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  // Handle parsing price values correctly
  const rawPrice = typeof product.price === "string"
    ? parseFloat(product.price.replace(/[^\d.]/g, ""))
    : product.price;

  const originalPrice = rawPrice * 2.5;

  const handleAddToCart = () => {
    addToCart({
      productId: String(product.id),
      name: product.name,
      price: rawPrice,
      size: selectedSize,
      image: product.img,
      quantity: quantity
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1500);
  };

  const sizes = product.sizes || ["S", "M", "L", "XL"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dim Backdrop - Clicking empty space below closes the modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 KakashiClose z-30 p-2 bg-black/60 border border-white/10 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Left Image Section */}
            <div className="relative aspect-square md:aspect-auto bg-[#121212] p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5 min-h-[320px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent pointer-events-none" />
              <div className="relative w-full h-full min-h-[250px]">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>

            {/* Right Details Section */}
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                {/* Discount Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/20 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-wider mb-4">
                  -60% OFF
                </div>

                <span className="block text-[10px] text-gold uppercase tracking-[0.25em] font-black">{product.type}</span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white mt-1 mb-4 leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-2xl font-black text-white">₹{rawPrice.toLocaleString("en-IN")}</span>
                  <span className="text-sm font-bold text-white/30 line-through">₹{originalPrice.toLocaleString("en-IN")}</span>
                </div>

                <p className="text-xs text-white/50 leading-relaxed mb-6 font-semibold uppercase tracking-wider">
                  {product.description || "Absolute premium drop from Telugu Yuvatha streetwear collectives volume 1. Features high-density prints and tailored cinema-grade heavy cotton structure."}
                </p>

                {/* Size Selection */}
                <div className="mb-6">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block mb-3">Select Size:</span>
                  <div className="flex gap-2">
                    {sizes.map((size) => {
                      const isActive = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                            isActive
                              ? "bg-white text-background border-white shadow-xl shadow-white/5"
                              : "bg-white/5 border-white/10 text-white hover:border-white/30"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block mb-3">Quantity:</span>
                  <div className="flex items-center bg-white/5 border border-white/10 w-fit rounded-full px-2 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 hover:text-gold transition-colors text-white"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-10 text-center text-xs font-black text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 hover:text-gold transition-colors text-white"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className="w-full h-14 bg-white hover:bg-gold hover:text-background text-background font-black uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl"
                >
                  {added ? (
                    <>
                      <Check size={16} className="text-green-600 animate-pulse" />
                      <span>Added to cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Add to cart</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="block text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-gold transition-all"
                >
                  View Full Details &gt;&gt;
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
