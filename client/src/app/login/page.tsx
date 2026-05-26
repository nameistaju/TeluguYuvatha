"use client";

import type React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Sparkles, UserPlus, LogIn, ArrowRight, Eye, EyeOff } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/checkout";
  const { setSession } = useAuthStore();
  const syncWishlist = useWishlistStore((state) => state.syncFromServer);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [coldStartNotice, setColdStartNotice] = useState(false);

  // Monitor loading to show cold start notice if it takes too long on free tiers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setColdStartNotice(true);
      }, 5000);
    } else {
      setColdStartNotice(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  // Clear message on mode change
  useEffect(() => {
    setMessage("");
    setIsSuccess(false);
  }, [mode]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setIsSuccess(false);
    setMessage(mode === "login" ? "Authenticating security credentials..." : "Provisioning cinematic account...");
    
    try {
      const result = await api.post<{ token: string; user: { id: string; name: string; email: string; role: string } }>(
        mode === "login" ? "/auth/login" : "/auth/register",
        mode === "login" ? { email, password } : { name, email, password, role: "customer" }
      );
      
      setIsSuccess(true);
      setMessage(mode === "login" ? "Login successful! Proceeding..." : "Account created successfully! Preparing secure vault...");
      
      setTimeout(async () => {
        setSession(result.token, result.user);
        await syncWishlist(result.token);
        router.push(next);
      }, 1000);
    } catch (error) {
      setLoading(false);
      setIsSuccess(false);
      setMessage(error instanceof Error ? error.message : "Authentication handshake failed.");
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-foreground flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Atmospheric Cinematic Spotlights */}
      <div className="absolute top-0 left-0 w-[60vw] h-[60vh] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.002)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.002)_1px,_transparent_1px)] bg-[size:100px_100px] opacity-45 pointer-events-none" />

      <section className="flex-grow flex items-center justify-center pt-36 pb-24 px-4 relative z-10">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[1fr_450px] items-center w-full">
          {/* Brand Left Column */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={12} className="text-gold animate-pulse" />
              <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.25em]">Cinema Collectives</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none mb-6">
              Wear the<br className="hidden md:block" /> Mass.
            </h1>
            <p className="max-w-md text-sm text-white/60 leading-relaxed font-light mb-8">
              Unlock exclusive streetwear drops, save your cinematic wishlist across devices, track delivery status, and checkout in a single tap.
            </p>
            <Link 
              href="/checkout" 
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 hover:border-gold/30 px-6 py-3 text-xs font-black uppercase tracking-widest text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
            >
              <span>Continue guest checkout</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Luxury login box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-[#0d0d0d]/90 backdrop-blur-md p-8 md:p-10 shadow-2xl relative"
          >
            {/* Tab Swiper */}
            <div className="mb-8 grid grid-cols-2 rounded-full bg-black/60 p-1 border border-white/5 relative">
              <button 
                type="button" 
                onClick={() => setMode("login")} 
                className={`relative z-10 rounded-full py-3.5 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer ${mode === "login" ? "text-white" : "text-white/60 hover:text-white"}`}
              >
                Login
              </button>
              <button 
                type="button" 
                onClick={() => setMode("register")} 
                className={`relative z-10 rounded-full py-3.5 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer ${mode === "register" ? "text-white" : "text-white/60 hover:text-white"}`}
              >
                Create
              </button>
              {/* Dynamic slider indicator */}
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-y-1 rounded-full bg-white/10 border border-white/10"
                style={{
                  width: "calc(50% - 4px)",
                  left: mode === "login" ? "4px" : "calc(50% + 0px)"
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            </div>

            <form onSubmit={submit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    key="name-input"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-2">Full Name</label>
                    <input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="e.g. Rocky Bhai" 
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-sm outline-none focus:border-gold/30 text-white placeholder-white/20 focus:bg-white/10 transition-all" 
                      required 
                      minLength={2}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-2">Email Address</label>
                <input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  type="email" 
                  placeholder="name@domain.com" 
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-sm outline-none focus:border-gold/30 text-white placeholder-white/20 focus:bg-white/10 transition-all" 
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-2">Secure Password</label>
                <div className="relative">
                  <input 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Min. 8 characters" 
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-5 pr-12 text-sm outline-none focus:border-gold/30 text-white placeholder-white/20 focus:bg-white/10 transition-all" 
                    required 
                    minLength={8} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-accent font-black uppercase tracking-widest text-white hover:bg-white hover:text-background transition-all duration-300 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6 cursor-pointer"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : mode === "login" ? (
                  <>
                    <LogIn size={14} />
                    <span>Authorize Login</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    <span>Establish Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Premium Handshake Message Banner */}
            <AnimatePresence>
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`mt-6 p-4 rounded-xl border flex gap-3 text-xs leading-relaxed ${
                    isSuccess 
                      ? "bg-green-500/10 border-green-500/20 text-green-400" 
                      : loading 
                        ? "bg-white/5 border-white/10 text-white/70"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  {!isSuccess && !loading && <ShieldAlert size={16} className="shrink-0" />}
                  <div className="flex flex-col gap-1 w-full">
                    <span>{message}</span>
                    {loading && coldStartNotice && (
                      <span className="mt-2 text-[10px] text-gold/90 block animate-pulse font-medium leading-normal border-t border-white/5 pt-2">
                        ℹ️ Waking the backend server from its sleep cycle (Render free tier spin-ups take ~45 seconds). Please hold on; your secure request will process automatically as soon as it goes live!
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
