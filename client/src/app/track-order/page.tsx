"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, Clock, PackageCheck, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  productId: string;
  name: string; 
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: Address;
  notes?: string;
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  // Auto-trigger lookup if parameters exist in the URL query string
  useEffect(() => {
    const qId = searchParams.get("id");
    const qEmail = searchParams.get("email");
    if (qId && qEmail) {
      setOrderId(qId);
      setEmail(qEmail);
      handleTrack(null, qId, qEmail);
    }
  }, [searchParams]);

  const handleTrack = async (e: React.FormEvent | null, customId?: string, customEmail?: string) => {
    if (e) e.preventDefault();
    const queryId = customId || orderId;
    const queryEmail = customEmail || email;

    if (!queryId.trim() || !queryEmail.trim()) {
      setError("Please fill in both the Order ID and Billing Email.");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch("http://localhost:5000/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: queryId.trim(), email: queryEmail.trim().toLowerCase() }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Order lookup failed. Please double check details.");
      }

      const data = await response.json();
      setOrder(data.data || data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const getTimelineSteps = (status: string) => {
    const s = status.toLowerCase();
    const steps = [
      { key: "placed", label: "Order Placed", desc: "Order details received", active: true },
      { key: "processing", label: "Preparation", desc: "Items packed at vault", active: false },
      { key: "shipped", label: "Shipped", desc: "En route with carrier", active: false },
      { key: "delivered", label: "Delivered", desc: "Handshake completed", active: false },
    ];

    if (s === "processing" || s === "paid") {
      steps[1].active = true;
    } else if (s === "shipped") {
      steps[1].active = true;
      steps[2].active = true;
    } else if (s === "delivered") {
      steps[1].active = true;
      steps[2].active = true;
      steps[3].active = true;
    } else if (s === "cancelled") {
      return [
        { key: "placed", label: "Order Placed", desc: "Order details received", active: true },
        { key: "cancelled", label: "Cancelled", desc: "Fulfillment terminated", active: true, isCancelled: true },
      ];
    }
    return steps;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-28">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-white/40 mb-6">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span>•</span>
        <span className="text-gold">Track Order</span>
      </nav>

      {/* Main heading */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-4">
          TRACK ORDER
        </h1>
        <p className="text-white/60 text-sm max-w-2xl leading-relaxed font-light">
          To track your order please enter your Order ID in the box below and press the &quot;Track&quot; button. 
          This was given to you on your receipt and in the confirmation email you should have received.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Track Form panel */}
        <div className="lg:col-span-1">
          <form onSubmit={(e) => handleTrack(e)} className="bg-surface/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col gap-5">
            <div>
              <label htmlFor="orderId" className="block text-[10px] font-black uppercase tracking-wider text-white/50 mb-2">
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ord_..."
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                required
              />
              <span className="text-[10px] text-white/30 mt-1 block">
                Found inside confirmation email.
              </span>
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-wider text-white/50 mb-2">
                Billing Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                required
              />
              <span className="text-[10px] text-white/30 mt-1 block">
                Email address used at checkout.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white font-bold uppercase tracking-wider text-xs py-4 rounded-xl cursor-pointer hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Track Status <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Need help sidebar */}
          <div className="bg-gradient-to-br from-gold/5 to-transparent border border-gold/10 p-6 rounded-2xl mt-6">
            <h3 className="text-gold text-xs font-black uppercase tracking-wider mb-2">Fulfillment Support</h3>
            <p className="text-white/60 text-xs leading-relaxed font-light mb-4">
              Have questions regarding shipping pipelines or custom adjustments? Our cinematic support vault is active.
            </p>
            <a href="mailto:support@teluguyuvatha.com" className="text-xs text-white font-bold hover:underline inline-flex items-center gap-1.5">
              support@teluguyuvatha.com <ArrowRight size={12} className="text-gold" />
            </a>
          </div>
        </div>

        {/* Results Timeline Container */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-accent/10 border border-accent/20 p-6 rounded-2xl flex gap-4 items-start"
              >
                <AlertTriangle className="text-accent shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                    Lookup Handshake Failed
                  </h4>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}

            {!order && !error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-white/5 p-12 rounded-2xl text-center flex flex-col items-center justify-center min-h-[300px]"
              >
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 mb-4">
                  <Truck size={20} />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  Waiting for search query
                </h4>
                <p className="text-white/40 text-xs max-w-sm leading-relaxed">
                  Enter your order particulars in the search terminal to retrieve realtime carrier status tracking logs.
                </p>
              </motion.div>
            )}

            {order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-6"
              >
                {/* Status timeline header */}
                <div className="bg-surface/30 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] text-gold font-black uppercase tracking-widest block mb-1">
                      REALTIME TIMELINE LOGS
                    </span>
                    <h3 className="text-lg font-black text-white uppercase">
                      ORDER #{order.id.slice(-8).toUpperCase()}
                    </h3>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <span className="text-[10px] text-white/40 uppercase font-semibold">
                      PLACED ON: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="text-xs text-white/60 font-medium mt-1">
                      Grand Total: <strong className="text-gold">₹{order.total.toLocaleString("en-IN")}</strong>
                    </span>
                  </div>
                </div>

                {/* Timeline display */}
                <div className="bg-surface/10 border border-white/5 p-8 rounded-2xl">
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
                    {/* Horizontal progress bar background (desktop) */}
                    <div className="absolute top-[22px] left-[40px] right-[40px] h-[2px] bg-white/5 hidden md:block z-0" />
                    
                    {/* Rendered steps */}
                    {getTimelineSteps(order.status).map((step, idx, arr) => {
                      const isLast = idx === arr.length - 1;
                      return (
                        <div key={step.key} className="flex md:flex-col items-center gap-4 md:gap-2 z-10 relative md:text-center w-full">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            step.active 
                              ? (step.isCancelled ? "bg-accent text-white" : "bg-gold text-background") 
                              : "bg-[#161616] text-white/30 border border-white/5"
                          }`}>
                            {step.key === "placed" && <ShieldCheck size={18} />}
                            {step.key === "processing" && <Clock size={18} />}
                            {step.key === "shipped" && <Truck size={18} />}
                            {step.key === "delivered" && <PackageCheck size={18} />}
                            {step.key === "cancelled" && <AlertTriangle size={18} />}
                          </div>
                          
                          <div className="flex flex-col md:items-center">
                            <span className={`text-xs font-bold uppercase tracking-wider ${
                              step.active 
                                ? (step.isCancelled ? "text-accent" : "text-white") 
                                : "text-white/30"
                            }`}>
                              {step.label}
                            </span>
                            <span className="text-[10px] text-white/40 font-light mt-0.5">
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping address & items details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Items catalog card */}
                  <div className="bg-surface/20 border border-white/5 p-6 rounded-2xl">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-white/50 mb-4 border-b border-white/5 pb-2">
                      Drop package items
                    </h4>
                    <div className="flex flex-col gap-4">
                      {order.items.map((item) => (
                        <div key={`${item.productId}-${item.size}`} className="flex justify-between items-center gap-2">
                          <div>
                            <span className="text-xs font-bold text-white uppercase block">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-white/40 block mt-0.5">
                              SIZE: {item.size} | COLOR: {item.color} | QTY: {item.quantity}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-gold shrink-0">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping address info */}
                  <div className="bg-surface/20 border border-white/5 p-6 rounded-2xl">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-white/50 mb-4 border-b border-white/5 pb-2">
                      Shipping Destination
                    </h4>
                    <div className="text-xs leading-relaxed text-white/70 font-light">
                      <strong className="text-white text-sm font-bold block mb-1">
                        {order.shippingAddress.fullName}
                      </strong>
                      {order.shippingAddress.line1}<br />
                      {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}
                      <span className="block mt-3 pt-3 border-t border-white/5 text-[10px] text-white/40">
                        PHONE: {order.shippingAddress.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back Link */}
                <div className="text-center mt-4">
                  <Link href="/collections/all" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold hover:text-white transition-colors">
                    <ArrowLeft size={12} /> Continue Shopping
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <TrackOrderContent />
      </Suspense>
      <Footer />
    </div>
  );
}
