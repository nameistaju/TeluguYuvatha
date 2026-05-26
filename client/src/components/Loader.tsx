"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Volume2, VolumeX } from "lucide-react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [showLoader, setShowLoader] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Skip intro entirely on mobile devices to get straight to products
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShowLoader(false);
        onComplete();
        return;
      }
    }

    // Use sessionStorage so the intro plays once per browser session,
    // not permanently forever (which was the old localStorage behavior).
    const hasSeenIntro = sessionStorage.getItem("ty_intro_seen");
    if (hasSeenIntro) {
      setShowLoader(false);
      onComplete();
      return;
    }

    const text = "Welcome to Telugu Yuvatha";
    if (textRef.current) {
      textRef.current.innerHTML = text
        .split("")
        .map((char) =>
          char === " "
            ? `<span>&nbsp;</span>`
            : `<span class="inline-block opacity-0 translate-y-4 letter">${char}</span>`
        )
        .join("");
    }

    const ctx = gsap.context(() => {
      gsap.to(".letter", {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(textRef.current, {
            opacity: 0,
            duration: 1,
            delay: 1,
          });
        },
      });
    }, containerRef);

    // Keep the cinematic intro bounded so it never blocks shopping interactions.
    // Increased to 15 seconds to allow full video to play before safety cutoff fires.
    timeoutRef.current = setTimeout(() => {
      finishIntro();
    }, 15000);

    // Ensure video plays
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch(() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => finishIntro(), 2500);
        });
    }

    return () => {
      ctx.revert();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    finishIntro();
  };

  const handleVideoError = () => {
    setVideoFailed(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTimeout(() => finishIntro(), 1800);
  };

  const finishIntro = () => {
    if (!containerRef.current) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        // sessionStorage: clears when the browser tab is closed
        sessionStorage.setItem("ty_intro_seen", "true");
        setShowLoader(false);
        onComplete();
      },
    });
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  if (!showLoader) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background text-foreground"
    >
      <video
        ref={videoRef}
        src="/assets/hero_vedio_desktop_version.mp4"
        className={`absolute inset-0 w-full h-full object-cover opacity-60 ${
          videoFailed ? "hidden" : ""
        }`}
        autoPlay
        muted={isMuted}
        playsInline
        preload="metadata"
        controls={false}
        onEnded={handleVideoEnd}
        onError={handleVideoError}
      />
      
      <button 
        onClick={toggleMute}
        className="absolute top-10 right-10 z-20 p-3 rounded-full bg-surface/50 backdrop-blur text-white hover:bg-accent transition"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <div className="relative z-10 text-center px-4 w-full">
        <h1
          ref={textRef}
          className="text-2xl md:text-5xl font-bold uppercase tracking-[0.2em] text-white break-words w-full"
        >
          {/* Handled by GSAP */}
        </h1>
      </div>
      <button
        onClick={finishIntro}
        className="absolute bottom-10 right-10 z-20 px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-background transition-colors uppercase tracking-widest text-xs font-bold text-white"
      >
        Skip Intro
      </button>
    </div>
  );
}
