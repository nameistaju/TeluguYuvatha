"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";

export default function BrandVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = false;
      void video.play().then(() => setIsPlaying(true));
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  const stopPlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <section ref={containerRef} className="py-24 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold uppercase text-foreground mb-4">
          The Origin Story
        </h2>
        <p className="text-foreground/70 uppercase tracking-widest text-sm max-w-2xl mx-auto">
          Born from the masses, crafted for the elite. Telugu Yuvatha brings the raw energy of cinema into premium streetwear.
        </p>
      </div>

      <motion.div
        style={{ scale, opacity }}
        className="w-full max-w-5xl mx-auto aspect-video relative rounded-2xl overflow-hidden group border border-surface shadow-2xl"
      >
        <video
          ref={videoRef}
          src="/assets/hero_vedio_desktop_version.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onEnded={() => setIsPlaying(false)}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <button
            type="button"
            onClick={togglePlayback}
            className="w-20 h-20 bg-accent/80 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(176,0,32,0.5)]"
            aria-label={isPlaying ? "Pause brand video" : "Play brand video"}
          >
            {isPlaying ? <Pause size={30} /> : <Play size={32} className="ml-1" />}
          </button>
          {isPlaying && (
            <button
              type="button"
              onClick={stopPlayback}
              className="absolute bottom-5 right-5 rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
              aria-label="Stop and reset brand video"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
