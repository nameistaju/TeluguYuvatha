"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice, payableTotal, coupon } = useCartStore();

  const subtotal = totalPrice();
  const discountedSubtotal = payableTotal();
  const savings = subtotal - discountedSubtotal;

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Dim Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Sliding Cart Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pointer-events-none">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-screen max-w-[420px] bg-[#0A0A0A] pointer-events-auto flex flex-col shadow-2xl relative"
            >
              {/* Header */}
              <div className="px-6 py-5 flex items-center justify-between border-b border-white/10">
                <h2 className="text-sm font-black uppercase tracking-wider text-white">Shopping Cart</h2>
                <button
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <ShoppingBag size={40} strokeWidth={1} className="text-white/30 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-6">Your cart is empty.</p>
                    <button
                      onClick={() => handleNavigate("/collections/all")}
                      className="text-xs font-black uppercase tracking-widest bg-white text-black px-8 py-3 rounded-full hover:bg-gold transition-colors duration-300"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const originalPrice = item.price * 2.5;
                    return (
                      <div key={item.id} className="flex gap-4 group">
                        {/* Image Thumbnail */}
                        <div className="relative h-[110px] w-[90px] shrink-0 bg-[#151515] rounded-md overflow-hidden flex items-center justify-center p-2">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="90px"
                            className="object-contain"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <h3 className="text-[13px] font-black uppercase tracking-wider text-white leading-tight mb-1">
                              {item.name}
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">
                              [UNISEX] - {item.size}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-black text-[#d34a4a]">
                                ₹{item.price.toLocaleString("en-IN")}
                              </span>
                              <span className="text-[11px] font-bold text-white/40 line-through">
                                ₹{originalPrice.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-end mt-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-white/20 rounded-[4px] px-2 py-1 bg-transparent">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-white/60 hover:text-white px-2"
                              >
                                <Minus size={12} strokeWidth={1.5} />
                              </button>
                              <span className="w-6 text-center text-xs text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-white/60 hover:text-white px-2"
                              >
                                <Plus size={12} strokeWidth={1.5} />
                              </button>
                            </div>

                            {/* Trash Icon */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-white/40 hover:text-white transition-colors cursor-pointer pb-1"
                            >
                              <Trash2 size={16} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Panel */}
              {items.length > 0 && (
                <div className="bg-[#0A0A0A]">
                  {/* Icons Strip */}
                  <div className="flex items-center justify-center gap-12 py-4 border-y border-white/10">
                    <button className="text-white/70 hover:text-white">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </button>
                    <button className="text-white/70 hover:text-white">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    </button>
                    <button className="text-white/70 hover:text-white">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Price Breakdown */}
                    <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                      <span className="text-white">Subtotal:</span>
                      <div className="flex items-center gap-3">
                        <span className="text-white">₹{discountedSubtotal.toLocaleString("en-IN")}</span>
                        {savings > 0 && (
                          <span className="border border-[#d34a4a] text-[#d34a4a] text-[9px] px-1.5 py-0.5 rounded-[2px]">
                            SAVE: ₹{savings.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Checkout Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleNavigate("/cart")}
                        className="w-full py-3.5 bg-transparent border border-white hover:bg-white/5 text-white font-black uppercase tracking-widest text-[11px] rounded-full transition-all cursor-pointer"
                      >
                        View cart
                      </button>
                      <button
                        onClick={() => handleNavigate("/checkout")}
                        className="w-full py-3.5 bg-white hover:bg-white/90 text-black font-black uppercase tracking-widest text-[11px] rounded-full transition-all cursor-pointer"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
