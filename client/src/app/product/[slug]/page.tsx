"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Share2, Star, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import AddToCartButton from "@/components/AddToCartButton";

// Mock data matching our collections, imported dynamically from unified database
import { PRODUCTS as products } from "@/data/products";

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [showToast, setShowToast] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const token = useAuthStore((state) => state.token);
  const isWished = useWishlistStore((state) => state.has(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  // Sync state if product changes (e.g. from dynamic parameter navigation)
  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]);
      setSelectedSize(product.sizes[1] || product.sizes[0]);
      setQuantity(1);
    }
  }, [product]);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      quantity,
      size: selectedSize,
      color: "Standard", // generic fallback as per requirement
    });
    
    // Show toast animation
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      
      {/* Add to Cart Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-6 py-4 rounded-full font-bold flex items-center gap-3 shadow-2xl"
          >
            <div className="bg-green-500 rounded-full p-1 text-white">
              <Check size={16} />
            </div>
            <span>Item added to your cart!</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4">
        <Link href="/collections/all" className="inline-flex items-center text-foreground/60 hover:text-accent transition-colors mb-8 text-sm font-bold uppercase tracking-wider">
          <ArrowLeft size={16} className="mr-2" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Product Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 h-[60vh] md:h-[80vh]">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto w-full md:w-24 shrink-0 no-scrollbar pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative w-20 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${mainImage === img ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <motion.div 
              key={mainImage} // Re-animate on image change
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="relative flex-grow bg-surface rounded-2xl overflow-hidden border border-surface h-full"
            >
              <Image 
                src={mainImage} 
                alt={product.name} 
                fill 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </motion.div>
          </div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-foreground/60 text-xs font-black uppercase tracking-widest">{product.type}</span>
              <div className="flex gap-4">
                <button
                  onClick={() => toggleWishlist(product.id, token)}
                  className={`transition-colors ${isWished ? "text-[#d34a4a]" : "text-foreground/50 hover:text-foreground"}`}
                  aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={20} strokeWidth={1.5} fill={isWished ? "currentColor" : "none"} />
                </button>
                <button className="text-foreground/50 hover:text-foreground transition-colors"><Share2 size={20} strokeWidth={1.5} /></button>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-gold">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <span className="text-foreground/50 text-xs font-bold">(124 Reviews)</span>
            </div>
            
            <p className="text-2xl font-black mb-8">₹{product.price.toLocaleString('en-IN')}</p>
            
            <p className="text-foreground/70 font-light leading-relaxed mb-10 max-w-md text-sm">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70">Size</h3>
                <button className="text-xs font-bold text-foreground/50 underline uppercase tracking-wider hover:text-foreground transition-colors">Size Guide</button>
              </div>
              <div className="flex gap-3">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 flex items-center justify-center border ${selectedSize === size ? 'border-foreground bg-foreground text-background' : 'border-surface/50 text-foreground hover:border-foreground/50'} rounded-full text-xs font-black transition-all`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center border border-surface rounded-full px-4 h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-foreground hover:text-accent text-xl px-2">-</button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-foreground hover:text-accent text-xl px-2">+</button>
              </div>
              <AddToCartButton onAddToCart={handleAddToCart} />  
            </div>
          </motion.div>
        </div>

        {/* ── CUSTOMER REVIEWS MODULE ── */}
        <section className="mt-24 pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-3">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Based on 124 reviews</span>
              </div>
            </div>
            <button 
              onClick={() => {
                const userReview = prompt("Write your experience with this premium drop:");
                if (userReview) alert("Thank you! Your feedback is saved and pending moderation.");
              }}
              className="mt-6 md:mt-0 px-6 py-2.5 border border-white/20 text-xs font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-background transition-all"
            >
              Write a review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { author: "Karthik S.", rating: 5, date: "2 days ago", body: "Absolutely premium weight. The Combed heavy cotton drop shoulder feels exactly like high-end designer streetwear." },
              { author: "Rajesh K.", rating: 5, date: "1 week ago", body: "Ok Jaanu color pop and KGF puff prints are absolute screen fire. Telugu Yuvatha brand is killing the luxury streetwear game!" }
            ].map((review, i) => (
              <div key={i} className="bg-transparent border border-white/10 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-[13px] font-black uppercase text-white tracking-wide">{review.author}</h4>
                    <div className="flex text-gold mt-1">
                      {[...Array(review.rating)].map((_, idx) => <Star key={idx} size={10} fill="currentColor" className="text-gold" />)}
                    </div>
                  </div>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{review.date}</span>
                </div>
                <p className="text-[13px] text-white/70 leading-relaxed font-light">{review.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── RELATED PRODUCTS MODULE ── */}
        <section className="mt-24 pt-12 border-t border-white/5">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">Related Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.category === product.category && p.slug !== product.slug)
              .slice(0, 4)
              .map((item) => (
                <Link key={item.id} href={`/product/${item.slug}`} className="group block">
                  <div className="relative aspect-[4/5] bg-[#111111] rounded-lg overflow-hidden mb-3 border border-white/5">
                    <Image src={item.img} alt={item.name} fill sizes="250px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 uppercase tracking-[0.1em] font-bold">{item.type}</span>
                    <h3 className="text-sm font-black uppercase text-white tracking-wide truncate mt-0.5 transition-colors group-hover:text-white/80">{item.name}</h3>
                    <p className="text-xs font-black text-white/60 mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* ── RECENTLY VIEWED MODULE ── */}
        <RecentlyViewedDeck currentSlug={product.slug} />

      </div>
      
      <Footer />

      {/* ── STICKY BOTTOM BUY BAR (Tactile conversion tool) ── */}
      <StickyBuyBar 
        product={product} 
        selectedSize={selectedSize} 
        setSelectedSize={setSelectedSize} 
        quantity={quantity} 
        setQuantity={setQuantity} 
        handleAddToCart={handleAddToCart} 
      />
    </main>
  );
}

// Stateful Recently Viewed Deck helper
function RecentlyViewedDeck({ currentSlug }: { currentSlug: string }) {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recently_viewed");
      let slugs: string[] = stored ? JSON.parse(stored) : [];
      
      // Save current slug to list
      if (!slugs.includes(currentSlug)) {
        slugs = [currentSlug, ...slugs.filter(s => s !== currentSlug)].slice(0, 5);
        localStorage.setItem("recently_viewed", JSON.stringify(slugs));
      }
      
      // Load other slugs for deck
      const otherSlugs = slugs.filter(s => s !== currentSlug).slice(0, 4);
      const items = products.filter(p => otherSlugs.includes(p.slug));
      setList(items);
    }
  }, [currentSlug]);

  if (list.length === 0) return null;

  return (
    <section className="mt-24 pt-12 border-t border-white/5">
      <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">Recently Viewed</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {list.map((item) => (
          <Link key={item.id} href={`/product/${item.slug}`} className="group block">
            <div className="relative aspect-[4/5] bg-[#111111] rounded-lg overflow-hidden mb-3 border border-white/5">
              <Image src={item.img} alt={item.name} fill sizes="250px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div>
              <span className="text-[9px] text-white/40 uppercase tracking-[0.1em] font-bold">{item.type}</span>
              <h3 className="text-sm font-black uppercase text-white tracking-wide truncate mt-0.5 transition-colors group-hover:text-white/80">{item.name}</h3>
              <p className="text-xs font-black text-white/60 mt-1">₹{item.price.toLocaleString("en-IN")}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Tactical conversion Sticky Buy Bar
interface StickyBarProps {
  product: any;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  handleAddToCart: () => void;
}

function StickyBuyBar({ product, selectedSize, setSelectedSize, quantity, setQuantity, handleAddToCart }: StickyBarProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 550);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#0e0e0e]/95 backdrop-blur-md border-t border-white/10 py-4 px-4 shadow-[0_-15px_30px_rgba(0,0,0,0.8)]"
        >
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left side: Thumbnail & Meta */}
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-10 shrink-0 bg-background rounded-sm overflow-hidden p-1 border border-white/10">
                <Image src={product.images[0]} alt={product.name} fill sizes="40px" className="object-contain" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase text-white tracking-wide max-w-[200px] truncate">{product.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                  </div>
                  <span className="text-[10px] text-white/60 font-bold">₹{product.price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Right side: Interactive Form selectors */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Size chip dropdown */}
              <div className="relative">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-transparent border border-white/20 hover:border-white/40 text-white rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider focus:outline-none focus:border-white cursor-pointer appearance-none pr-8"
                >
                  {product.sizes.map((s: string) => (
                    <option key={s} value={s} className="bg-[#0A0A0A] text-white">SIZE {s}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-[10px]">▼</div>
              </div>

              {/* Quantity incrementer */}
              <div className="flex items-center border border-white/20 rounded-full px-3 h-9 bg-transparent">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white hover:text-white/70 font-black px-1.5">-</button>
                <span className="w-6 text-center font-black text-xs text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-white hover:text-white/70 font-black px-1.5">+</button>
              </div>

              {/* Add to cart CTA */}
              <button
                onClick={handleAddToCart}
                className="bg-white text-black hover:bg-white/90 font-black uppercase text-xs tracking-wider px-6 py-2.5 rounded-full transition-all duration-300 cursor-pointer"
              >
                Add to cart
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
