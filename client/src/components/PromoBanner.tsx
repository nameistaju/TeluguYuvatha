import React from "react";

export default function PromoBanner() {
  return (
    <div className="w-full bg-[#111111] border-y border-white/5 py-4 overflow-hidden relative select-none">
      <div className="animate-marquee">
        {/* We repeat the spans to create the seamless infinite scroll effect */}
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-sm md:text-base text-white/70 font-medium tracking-wide mx-10 shrink-0 inline-flex items-center gap-2">
            <span className="text-white/30 text-[10px]">✦</span> 
            Use Code: <span className="text-gold font-bold">TY400</span> 
            <span className="text-white/30 text-[10px]">✦</span> 
            Buy Two And Get ₹400 Off
          </span>
        ))}
      </div>
    </div>
  );
}
