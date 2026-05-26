"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, PackageCheck, ShieldCheck, Tag, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  notes: Record<string, string>;
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
  retry?: { enabled: boolean; max_count?: number };
  timeout?: number;
};

type RazorpayFailureResponse = {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: "payment.failed", handler: (response: RazorpayFailureResponse) => void) => void;
    };
  }
}

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_PATTERN = /^rzp_(test|live)_[A-Za-z0-9]+$/;

function money(value: number) {
  return `INR ${value.toLocaleString("en-IN")}`;
}

// Pre-load script to speed up online payments
function loadRazorpayScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Razorpay checkout could not load.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay checkout could not load."));
    document.body.appendChild(script);
  });
}

const initialAddress = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "Andhra Pradesh",
  postalCode: "",
  country: "India"
};

export default function CheckoutPage() {
  const { items, coupon, totalPrice, payableTotal, clearCart } = useCartStore();
  const { token, user, hasHydrated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState({ 
    ...initialAddress, 
    email: user?.email ?? "", 
    firstName: user?.name?.split(" ")[0] ?? "" 
  });
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [status, setStatus] = useState<"idle" | "creating" | "paying" | "verifying" | "success">("idle");
  const [message, setMessage] = useState("");
  const [pendingOnlineOrderId, setPendingOnlineOrderId] = useState<string>();
  const [authChecked, setAuthChecked] = useState(false);
  const [coldStartNotice, setColdStartNotice] = useState(false);
  const [, startTransition] = useTransition();

  // Monitor checkout status to warn users if backend takes more than 5s on cold starts
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "creating" || status === "paying" || status === "verifying") {
      timer = setTimeout(() => {
        setColdStartNotice(true);
      }, 5000);
    } else {
      setColdStartNotice(false);
    }
    return () => clearTimeout(timer);
  }, [status]);

  const totals = useMemo(() => {
    const subtotal = totalPrice();
    const discountedSubtotal = payableTotal();
    const shipping = discountedSubtotal >= 1999 ? 0 : 99;
    const tax = Math.round(discountedSubtotal * 0.05);
    return {
      subtotal,
      shipping,
      tax,
      grandTotal: discountedSubtotal + shipping + tax
    };
  }, [payableTotal, totalPrice]);

  const isAuthenticated = hasHydrated && authChecked && Boolean(token && user);

  useEffect(() => {
    setMounted(true);
    // Pre-load Razorpay script on mount to eliminate select/initialize lag completely!
    void loadRazorpayScript().catch(() => {});
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      setAuthChecked(true);
      return;
    }

    let cancelled = false;
    api
      .get<{ user: { id: string; name: string; email: string; role: string; phone?: string } }>("/auth/me", { token })
      .then(() => {
        if (!cancelled) setAuthChecked(true);
      })
      .catch(() => {
        if (!cancelled) {
          logout();
          setAuthChecked(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, logout, token]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setAddress((current) => ({
        ...current,
        email: current.email || user.email,
        firstName: current.firstName || user.name?.split(" ")[0] || ""
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (paymentMethod !== "razorpay") return;
    void loadRazorpayScript().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Razorpay checkout could not load.");
    });
  }, [paymentMethod]);

  const update = useCallback((key: keyof typeof address, value: string) => {
    setAddress((current) => ({ ...current, [key]: value }));
  }, []);

  const placeOrder = useCallback(async () => {
    if (status !== "idle") return;
    setStatus("creating");
    setMessage(paymentMethod === "cod" ? "Placing your COD order..." : "Preparing secure payment...");
    
    try {
      if (!items.length) throw new Error("Your cart is empty.");
      
      const fullName = `${address.firstName} ${address.lastName}`.trim();
      const normalizedEmail = address.email.trim().toLowerCase();
      if (!fullName || !normalizedEmail || !address.phone || !address.line1 || !address.city || !address.postalCode) {
        throw new Error("Please complete the required billing and shipping address fields.");
      }

      if (paymentMethod === "razorpay" && !RAZORPAY_KEY_ID) {
        throw new Error("Online payments are not configured. Please use Cash on Delivery or contact support.");
      }
      if (paymentMethod === "razorpay" && !RAZORPAY_KEY_PATTERN.test(RAZORPAY_KEY_ID!)) {
        throw new Error("Online payment key is invalid. Please contact support.");
      }

      const order =
        paymentMethod === "razorpay" && pendingOnlineOrderId
          ? { id: pendingOnlineOrderId, total: totals.grandTotal }
          : await api.post<{ id: string; total: number }>(
              "/orders",
              {
                email: normalizedEmail,
                paymentMethod,
                couponCode: coupon?.code,
                notes,
                shippingAddress: {
                  fullName,
                  phone: address.phone,
                  line1: address.line1,
                  line2: address.line2 || undefined,
                  city: address.city,
                  state: address.state,
                  postalCode: address.postalCode,
                  country: address.country
                },
                items: items.map((item) => ({
                  productId: item.productId,
                  name: item.name,
                  sku: item.sku ?? item.productId,
                  size: item.size,
                  color: item.color ?? "Standard",
                  quantity: item.quantity,
                  price: item.price
                }))
              },
              { token: isAuthenticated ? token : undefined }
            );

      if (paymentMethod === "cod") {
        clearCart();
        setPendingOnlineOrderId(undefined);
        setStatus("success");
        setMessage(`Order ${order.id} has been placed successfully via Cash on Delivery.`);
        return;
      }

      setPendingOnlineOrderId(order.id);
      setMessage("Opening Razorpay checkout...");
      await loadRazorpayScript();
      const razorpayOrder = await api.post<{ id: string; amount: number; currency: "INR"; orderId: string }>(
        "/payments/create-order",
        { orderId: order.id, email: normalizedEmail },
        { token: isAuthenticated ? token : undefined }
      );

      const RazorpayConstructor = window.Razorpay;
      if (!RazorpayConstructor) throw new Error("Razorpay checkout is still loading. Please try again in a moment.");

      const checkout = new RazorpayConstructor({
        key: RAZORPAY_KEY_ID!,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Telugu Yuvatha",
        description: `Order ${order.id}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: fullName,
          email: normalizedEmail,
          contact: address.phone
        },
        notes: { orderId: order.id },
        theme: { color: "#B00020" },
        retry: { enabled: true, max_count: 2 },
        timeout: 300,
        handler: (response) => {
          startTransition(() => {
            setStatus("verifying");
            setMessage("Verifying payment signature...");
          });
          void api
            .post(
              "/payments/verify",
              {
                orderId: order.id,
                email: normalizedEmail,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { token: isAuthenticated ? token : undefined }
            )
            .then(() => {
              clearCart();
              setPendingOnlineOrderId(undefined);
              setStatus("success");
              setMessage(`Payment verified successfully! Order ${order.id} confirmed.`);
            })
            .catch((error: unknown) => {
              setStatus("idle");
              setMessage(error instanceof Error ? error.message : "Payment verification failed.");
            });
        },
        modal: {
          ondismiss: () => {
            setStatus("idle");
            setMessage("Payment was cancelled. Your order is saved so you can retry without re-entering details.");
          }
        }
      });

      checkout.on("payment.failed", (response) => {
        const description = response.error?.description || "Payment could not be completed. Please try another method.";
        void api.post(
          "/payments/failure",
          {
            orderId: order.id,
            email: normalizedEmail,
            razorpay_order_id: response.error?.metadata?.order_id,
            razorpay_payment_id: response.error?.metadata?.payment_id,
            errorCode: response.error?.code,
            errorReason: response.error?.reason,
            errorDescription: description
          },
          { token: isAuthenticated ? token : undefined }
        );
        setStatus("idle");
        setMessage(description);
      });
      
      setStatus("paying");
      checkout.open();
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid session") logout();
      setStatus("idle");
      setMessage(error instanceof Error ? error.message : "Could not place order.");
    }
  }, [address, clearCart, coupon?.code, isAuthenticated, items, logout, notes, paymentMethod, pendingOnlineOrderId, startTransition, status, token, totals.grandTotal]);

  if (!mounted || !hasHydrated || !authChecked) {
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

  // Success dashboard screen
  if (status === "success") {
    return (
      <main className="min-h-screen bg-[#080808] text-foreground flex flex-col relative overflow-hidden">
        <Navbar />
        {/* Spotlights */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-green-500/5 blur-[100px] pointer-events-none" />
        
        <div className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 text-center px-4 relative z-10 max-w-xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-full text-green-400"
          >
            <CheckCircle2 size={80} />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
            Order Confirmed
          </h1>
          <p className="text-xs text-white/50 uppercase tracking-[0.2em] font-bold mb-6">
            Establishing Drop Shipment
          </p>
          <p className="text-sm text-white/70 leading-relaxed font-light mb-10">
            {message}
          </p>
          
          <Link href="/collections/all" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-background rounded-full font-black text-xs uppercase tracking-widest hover:bg-gold hover:text-background transition-all">
            <span>Continue Shopping</span>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] text-foreground flex flex-col relative overflow-hidden">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-4 w-full relative z-10">
        
        <Link href="/cart" className="inline-flex items-center text-white/50 hover:text-gold transition-colors mb-8 text-xs font-black uppercase tracking-widest">
          <ArrowLeft size={14} className="mr-2" /> Back to Cart
        </Link>

        {/* Banner Section */}
        <div className="mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Checkout Verification</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter">
            Checkout
          </h1>
        </div>

        {/* Guest vs Account alert */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-transparent p-4 flex items-center gap-3">
            <PackageCheck className="text-white/70 shrink-0" size={18} />
            {isAuthenticated && user ? (
              <span className="text-[11px] font-black uppercase tracking-wider text-white/70">Authenticated as: <span className="text-white">{user.email}</span></span>
            ) : (
              <span className="text-[11px] font-black uppercase tracking-wider text-white/70">
                Returning customer? <Link href="/login?next=/checkout" className="text-white underline hover:text-accent">Login for faster checkout</Link>
              </span>
            )}
          </div>
          <div className="rounded-lg border border-white/10 bg-transparent p-4 flex items-center gap-3">
            <Tag className="text-white/70 shrink-0" size={18} />
            <span className="text-[11px] font-black uppercase tracking-wider text-white/70">
              {coupon ? `${coupon.code} Applied: ${money(coupon.discount)} Discounted` : "Voucher discount active on billing"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_430px] items-start">
          
          {/* Billing Form panel */}
          <section className="rounded-xl border border-white/10 bg-[#0A0A0A] p-6 md:p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-white border-b border-white/10 pb-4 mb-6">Shipping Address</h2>
            
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-[10px] font-black uppercase tracking-wider text-white/60">
                <span>First name *</span>
                <input value={address.firstName} onChange={(event) => update("firstName", event.target.value)} className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-xs font-semibold outline-none focus:border-white text-white transition-colors" required />
              </label>
              
              <label className="grid gap-2 text-[10px] font-black uppercase tracking-wider text-white/60">
                <span>Last name *</span>
                <input value={address.lastName} onChange={(event) => update("lastName", event.target.value)} className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-xs font-semibold outline-none focus:border-white text-white transition-colors" required />
              </label>

              <label className="grid gap-2 text-[10px] font-black uppercase tracking-wider text-white/60">
                <span>Email address *</span>
                <input type="email" value={address.email} onChange={(event) => update("email", event.target.value)} className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-xs font-semibold outline-none focus:border-white text-white transition-colors" required />
              </label>

              <label className="grid gap-2 text-[10px] font-black uppercase tracking-wider text-white/60">
                <span>Phone number *</span>
                <input value={address.phone} onChange={(event) => update("phone", event.target.value)} className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-xs font-semibold outline-none focus:border-white text-white transition-colors" required />
              </label>

              <label className="grid gap-2 text-[10px] font-black uppercase tracking-wider text-white/60 md:col-span-2">
                <span>Street Address *</span>
                <input value={address.line1} onChange={(event) => update("line1", event.target.value)} className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-xs font-semibold outline-none focus:border-white text-white transition-colors" required />
              </label>

              <label className="grid gap-2 text-[10px] font-black uppercase tracking-wider text-white/60 md:col-span-2">
                <span>Apartment, Suite, Landmark</span>
                <input value={address.line2} onChange={(event) => update("line2", event.target.value)} className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-xs font-semibold outline-none focus:border-white text-white transition-colors" />
              </label>

              <label className="grid gap-2 text-[10px] font-black uppercase tracking-wider text-white/60">
                <span>Country / Region *</span>
                <select value={address.country} onChange={(event) => update("country", event.target.value)} className="h-12 w-full rounded-md border border-white/20 bg-[#0A0A0A] px-4 text-xs font-black text-white outline-none focus:border-white cursor-pointer">
                  <option>India</option>
                </select>
              </label>

              <label className="grid gap-2 text-[10px] font-black uppercase tracking-wider text-white/60">
                <span>State *</span>
                <select value={address.state} onChange={(event) => update("state", event.target.value)} className="h-12 w-full rounded-md border border-white/20 bg-[#0A0A0A] px-4 text-xs font-black text-white outline-none focus:border-white cursor-pointer">
                  <option>Andhra Pradesh</option>
                  <option>Telangana</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>Maharashtra</option>
                </select>
              </label>

              <label className="grid gap-2 text-[10px] font-black uppercase tracking-wider text-white/60">
                <span>Town / City *</span>
                <input value={address.city} onChange={(event) => update("city", event.target.value)} className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-xs font-semibold outline-none focus:border-white text-white transition-colors" required />
              </label>

              <label className="grid gap-2 text-[10px] font-black uppercase tracking-wider text-white/60">
                <span>PIN Code *</span>
                <input value={address.postalCode} onChange={(event) => update("postalCode", event.target.value)} className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-xs font-semibold outline-none focus:border-white text-white transition-colors" required />
              </label>

              <label className="grid gap-2 text-[10px] font-black uppercase tracking-wider text-white/60 md:col-span-2">
                <span>Add delivery note</span>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="How can we help you? (e.g. deliver after 5pm)" className="w-full rounded-md border border-white/20 bg-transparent px-4 py-3 text-xs font-semibold outline-none focus:border-white text-white transition-colors resize-none" />
              </label>
            </div>
          </section>

          {/* Right Summary column */}
          <aside className="h-fit rounded-xl bg-[#0A0A0A] border border-white/10 p-6 md:p-8 lg:sticky lg:top-32 space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-white border-b border-white/10 pb-4">Order Summary</h2>
            
            {/* Scrollable list of items */}
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-white/10 pb-4 items-center">
                  <div className="relative h-[60px] w-[50px] shrink-0 bg-[#151515] rounded-md overflow-hidden flex items-center justify-center p-1">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-black uppercase tracking-wider text-white truncate">{item.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-0.5">Qty {item.quantity} / {item.size}</p>
                  </div>
                  <strong className="text-[13px] font-black text-white">{money(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            {/* Calculations deck */}
            <div className="space-y-3 text-sm border-b border-white/10 pb-5">
              <div className="flex justify-between">
                <span className="text-white/60">Subtotal</span>
                <strong className="text-white">{money(totals.subtotal)}</strong>
              </div>
              {coupon && (
                <div className="flex justify-between text-[#d34a4a]">
                  <span className="uppercase tracking-wider">Voucher Discount</span>
                  <strong>-{money(coupon.discount)}</strong>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/60">Shipping</span>
                <strong className="text-white">{totals.shipping === 0 ? "FREE" : money(totals.shipping)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">GST Tax (5%)</span>
                <strong className="text-white">{money(totals.tax)}</strong>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="text-sm text-white/60 font-semibold">Total Payable</span>
              <span className="text-xl font-semibold text-white">{money(totals.grandTotal)}</span>
            </div>

            {/* Premium Selector Cards */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-[11px] font-medium uppercase tracking-widest text-white/50 mb-2">Select Payment Method</h3>
              
              {/* Cash on Delivery Card */}
              <div 
                onClick={() => setPaymentMethod("cod")}
                className={`flex gap-3 p-4 rounded-md border cursor-pointer transition-all ${
                  paymentMethod === "cod" 
                    ? "bg-white/5 border-white" 
                    : "border-white/20 hover:border-white/40 bg-transparent"
                }`}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-0.5 accent-white cursor-pointer"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Cash on Delivery</p>
                  <p className="text-xs text-white/50 mt-1">Pay with cash upon delivery.</p>
                </div>
              </div>

              {/* Online payment (Razorpay) Card */}
              <div 
                onClick={() => setPaymentMethod("razorpay")}
                className={`flex gap-3 p-4 rounded-md border cursor-pointer transition-all ${
                  paymentMethod === "razorpay" 
                    ? "bg-white/5 border-white" 
                    : "border-white/20 hover:border-white/40 bg-transparent"
                }`}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="mt-0.5 accent-white cursor-pointer"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Online Cards / UPI</p>
                  <p className="text-xs text-white/50 mt-1">Secure checkout powered by Razorpay.</p>
                </div>
              </div>
            </div>

            {/* Handshake security disclaimer */}
            <div className="flex flex-col gap-2 rounded-md border border-white/10 bg-[#151515] p-4 text-xs text-white/50 font-medium">
              <p className="flex items-center gap-2"><ShieldCheck size={14} className="text-white/70" /> Secure 256-bit SSL Vault</p>
              <p className="flex items-center gap-2"><PackageCheck size={14} className="text-white/70" /> Address details synced</p>
            </div>

            {/* Dynamic Button submission panel */}
            <div className="pt-2">
              <button 
                onClick={placeOrder} 
                disabled={status !== "idle" || !items.length} 
                className="w-full h-14 bg-white text-black font-semibold text-sm rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 cursor-pointer"
              >
                {status !== "idle" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Processing order...</span>
                  </>
                ) : paymentMethod === "cod" ? (
                  <span>Place Order (COD)</span>
                ) : (
                  <span>Initiate Online Payment</span>
                )}
              </button>
            </div>

            {/* Status alerts */}
            <AnimatePresence>
              {message && status !== ("success" as string) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5 text-white/60 text-[10px] leading-relaxed uppercase tracking-wider font-bold flex flex-col gap-2"
                >
                  <div className="flex gap-2 items-center">
                    <AlertCircle size={14} className="shrink-0 text-gold" />
                    <span>{message}</span>
                  </div>
                  {coldStartNotice && (
                    <p className="text-[9px] text-gold/90 block animate-pulse font-medium leading-normal border-t border-white/5 pt-2 normal-case">
                      ℹ️ Note: Processing this transaction takes a bit of time because our database is currently waking up on the free hosting tier. Your details are secured and will process automatically shortly!
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </aside>

        </div>
      </div>

      <Footer />
    </main>
  );
}
