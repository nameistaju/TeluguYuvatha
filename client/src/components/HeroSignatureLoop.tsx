"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const items = [
  { type: "text", value: "OG" },
  { type: "image", src: "/assets/Alluarjun_sign.png" },
  { type: "text", value: "PUSHPA" },
  { type: "image", src: "/assets/MaheshBabu_sign.png" },
  { type: "text", value: "CINEMA" },
  { type: "image", src: "/assets/NTR_sign.png" },
  { type: "text", value: "MASS" },
  { type: "image", src: "/assets/RamCharan_sign.png" },
  { type: "text", value: "FDFS" },
  { type: "image", src: "/assets/prabhas_sign.png" },
  { type: "text", value: "BLOCKBUSTER" },
  { type: "image", src: "/assets/pawankalyan_sign.png" },
  { type: "text", value: "REBEL" },
  { type: "image", src: "/assets/Nani_sign.png" },
];

export default function HeroSignatureLoop() {
  return (
    <section className="py-12 bg-surface overflow-hidden border-y border-foreground/10">
      <div className="flex w-full overflow-hidden whitespace-nowrap">
        <motion.div
          className="flex items-center gap-16 px-8 shrink-0"
          animate={{ x: "-100%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {[...items, ...items, ...items].map((item, index) => (
            <div key={index} className="flex items-center justify-center shrink-0">
              {item.type === "text" ? (
                <span className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50 uppercase tracking-tighter">
                  {item.value}
                </span>
              ) : (
                <div className="relative h-16 w-48 opacity-80 invert">
                  <Image src={item.src!} alt="Signature" fill className="object-contain" />
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
