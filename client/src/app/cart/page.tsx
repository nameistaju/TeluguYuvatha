"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag, Trash2, X, Sparkles, ShoppingBag, Percent } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function CartPage() {
  const { items, coupon, updateQuantity, removeItem, totalPrice, payableTotal, applyCoupon, clearCoupon } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState(coupon?.code ?? "");
  const [message, setMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function submitCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setMessage("Checking code eligibility...");
    try {
      const result = await api.post<{ code: string; label?: string; discount: number }>("/coupons/validate", {
        code: couponCode.toUpperCase(),
        subtotal: totalPrice()
      });
      applyCoupon(result);
      setMessage(`Coupon ${result.code} applied successfully.`);
      setCouponLoading(false);
    } catch (error) {
      clearCoupon();
      setMessage(error instanceof Error ? error.message : "Coupon could not be applied.");
      setCouponLoading(false);
    }
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#080808] text-foreground flex flex-col">
        <Navbar />
        <div className="flex-grow pt-36 pb-24 max-w-7xl mx-auto px-4 w-full">
          <div className="h-96 rounded-2xl border border-white/10 bg-surface/60 animate-pulse" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] text-foreground flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Atmospheric highlights */}
      <div className="absolute top-0 right-0 w-[50vw] h-[55vh] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[45vw] h-[45vh] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.002)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.002)_1px,_transparent_1px)] bg-[size:100px_100px] opacity-40 pointer-events-none" />

      <div className="flex-grow pt-36 pb-24 max-w-7xl mx-auto px-4 w-full relative z-10">
        
        {/* Banner header */}
        <div className="mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} className="text-gold" />
            <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.25em]">Your Selections</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
            Shopping Cart
          </h1>
          <p className="text-xs text-white/40 uppercase tracking-[0.25em] font-bold mt-3">
            {items.length === 0 ? "No drops in cart" : `${items.length} premium drops active`}
          </p>
        </div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md p-16 text-center max-w-2xl mx-auto"
          >
            <ShoppingBag size={48} className="text-white/20 mx-auto mb-6" />
            <p className="text-white/50 uppercase tracking-[0.25em] text-xs font-black mb-8">
              Your bag is currently empty
            </p>
            <Link href="/collections/all" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-background rounded-full font-black text-xs uppercase tracking-widest hover:bg-gold hover:text-background transition-all">
              <span>View Collections</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
            
            {/* Left Column: Cart items */}
            <section className="space-y-6">
              
              {/* Desktop Headers */}
              <div className="hidden md:grid grid-cols-[1fr_140px_160px_120px] border-b border-white/5 pb-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                <span>Product Details</span>
                <span>Price</span>
                <span>Quantity</span>
                <span className="text-right">Total</span>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.article 
                      key={item.id}
                      layout
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="grid gap-6 rounded-2xl border border-white/5 bg-[#0d0d0d]/50 p-5 md:grid-cols-[1fr_140px_160px_120px] md:items-center hover:border-white/10 transition-colors"
                    >
                      {/* Product details thumbnail */}
                      <div className="flex gap-5">
                        <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-background border border-white/5 p-2 flex items-center justify-center">
                          <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain" />
                        </div>
                        <div className="flex flex-col justify-between py-1">
                          <div>
                            <span className="text-[8px] text-gold uppercase tracking-wider font-black">Standard Drop</span>
                            <h2 className="font-black uppercase tracking-wide text-white text-sm mt-1 leading-snug">{item.name}</h2>
                            <p className="mt-1.5 text-[10px] text-white/40 uppercase tracking-widest font-black">
                              Size: <span className="text-white">{item.size}</span>
                            </p>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)} 
                            className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-red-400 w-fit transition-all uppercase tracking-wider font-black"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Price tag */}
                      <p className="font-black text-white/70 text-sm md:text-base">{money(item.price)}</p>

                      {/* Quantity Controls */}
                      <div className="flex w-32 items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 py-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-white hover:text-gold text-lg font-black px-1">-</button>
                        <span className="font-black text-xs text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white hover:text-gold text-lg font-black px-1">+</button>
                      </div>

                      {/* Subtotal */}
                      <p className="text-right text-sm md:text-lg font-black text-white">{money(item.price * item.quantity)}</p>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* Coupon selector module */}
              <section className="rounded-2xl border border-white/5 bg-[#0d0d0d]/40 p-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
                  <Percent size={14} className="text-gold" />
                  <span>Promo / Discount Voucher</span>
                </h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} aria-hidden />
                    <input
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                      placeholder="ENTER COUPON CODE"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 pl-12 pr-4 text-xs font-black uppercase tracking-widest text-white outline-none focus:border-gold/30 placeholder-white/20"
                    />
                  </div>
                  <button 
                    onClick={submitCoupon}
                    disabled={couponLoading || !couponCode.trim()} 
                    className="h-14 rounded-2xl bg-white hover:bg-gold text-background hover:text-background font-black text-xs uppercase tracking-widest px-8 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {couponLoading ? "Checking..." : "Apply Coupon"}
                  </button>
                </div>

                <AnimatePresence>
                  {coupon && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="mt-4 flex items-center justify-between bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl text-green-400 text-xs font-black uppercase tracking-wider"
                    >
                      <span className="flex items-center gap-2">
                        <Tag size={13} />
                        <span>Code: {coupon.code} Applied</span>
                      </span>
                      <button onClick={clearCoupon} className="text-green-400 hover:text-red-400 transition-colors">
                        <X size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {message && <p className="mt-3 text-xs font-black uppercase tracking-wider text-white/40">{message}</p>}
              </section>
            </section>

            {/* Right Column: Checkout aside block */}
            <aside className="h-fit rounded-3xl bg-[#0d0d0d]/80 border border-white/10 p-6 md:p-8 lg:sticky lg:top-32 shadow-2xl backdrop-blur-md">
              <h2 className="text-xl font-black uppercase tracking-wider text-white border-b border-white/5 pb-4">Cart Summary</h2>
              
              <div className="mt-6 space-y-4 border-b border-white/5 pb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50 uppercase tracking-wider font-bold">Subtotal</span>
                  <span className="font-black text-white">{money(totalPrice())}</span>
                </div>
                
                {coupon && (
                  <div className="flex justify-between text-green-400">
                    <span className="uppercase tracking-wider font-bold">Voucher Discount</span>
                    <span className="font-black">-{money(coupon.discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-white/50 uppercase tracking-wider font-bold">Shipping Duty</span>
                  <span className="font-black text-white uppercase tracking-widest text-xs">Free Delivery</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-baseline">
                <span className="text-sm text-white/50 uppercase tracking-wider font-bold">Order Total</span>
                <span className="text-2xl font-black text-white tracking-tight">{money(payableTotal())}</span>
              </div>

              <Link 
                href="/checkout" 
                className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-background shadow-xl text-xs cursor-pointer"
              >
                <span>Secure Checkout</span>
                <ArrowRight size={14} />
              </Link>
            </aside>

          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
