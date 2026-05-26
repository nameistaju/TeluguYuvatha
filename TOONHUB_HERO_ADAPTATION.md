# TOONHUB Hero Section Adaptation Guide

## Project Assessment

Your **Telugu Yuvatha** project is a **Next.js 15 + React 19 + TypeScript + Tailwind CSS 4** application (not Vite). Here's how to adapt the TOONHUB carousel prompt:

---

## Key Differences from the Original Prompt

| Aspect | Original Prompt | Your Project | Action Required |
|--------|-----------------|--------------|-----------------|
| **Framework** | React + Vite | Next.js 15 | Remove Vite-specific setup; use Next.js patterns |
| **Font Loading** | Manual Google Fonts in `index.html` | Next.js Google Fonts API | Use `next/font/google` in `layout.tsx` |
| **Images** | External URLs via `new Image()` | Next.js `Image` component | Use `Image` from `next/image` with `priority` |
| **Tailwind Config** | Separate `tailwind.config.ts` | Inline `@theme` in `globals.css` | Add theme colors/fonts to Tailwind `@theme` block |
| **Font Variable** | CSS custom properties | Tailwind `@theme` | Define Anton font using `@theme` |
| **Animation Library** | Framer Motion (implicit) | Framer Motion (already installed) | Use existing Framer Motion setup |
| **Icons** | lucide-react | lucide-react ✓ | Already available |

---

## Step-by-Step Implementation Plan

### 1. **Update Fonts in `layout.tsx`**

Your current setup uses `Outfit`. Add **Anton** font:

```tsx
// client/src/app/layout.tsx
import { Outfit, Anton } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const anton = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  weight: "400",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${anton.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
```

### 2. **Update `globals.css` Tailwind Theme**

Add Anton font family and the TOONHUB color palette to your `@theme` block:

```css
@import "tailwindcss";

@theme {
  --color-background: #0A0A0A;
  --color-surface: #121212;
  --color-accent: #B00020;
  --color-gold: #FFD54F;
  --color-foreground: #F5F5F5;
  --font-sans: var(--font-outfit);
  --font-anton: var(--font-anton);
  
  /* TOONHUB Colors */
  --color-toon-orange: #F4845F;
  --color-toon-orange-light: #F79B7F;
  --color-toon-green: #6BBF7A;
  --color-toon-green-light: #85CC92;
  --color-toon-pink: #E882B4;
  --color-toon-pink-light: #ED9DC4;
  --color-toon-blue: #6EB5FF;
  --color-toon-blue-light: #8DC4FF;
}
```

### 3. **Create TOONHUB Carousel Component**

Create a new component: `client/src/components/ToonHubHero.tsx`

**Key adaptations:**

- Replace `new Image()` preloading with Next.js `Image` component + `priority` prop
- Use Next.js `Image` instead of `<img>` tags
- Leverage your existing Framer Motion setup (already in `package.json`)
- Adjust responsive breakpoints to match your Tailwind config (`sm:`, `md:`)
- Use CSS custom properties for colors that update via `style={{ backgroundColor }}`

**Sample structure:**

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const IMAGES = [
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png",
    bg: "#F4845F",
    panel: "#F79B7F",
  },
  // ... 3 more items
];

export default function ToonHubHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Preload images
    IMAGES.forEach((img) => {
      const preload = new Image();
      preload.src = img.src;
    });

    // Responsive check
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = (direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) =>
      direction === "next" ? (prev + 1) % 4 : (prev + 3) % 4
    );
    setTimeout(() => setIsAnimating(false), 650);
  };

  // Compute roles based on activeIndex
  const center = activeIndex;
  const left = (activeIndex + 3) % 4;
  const right = (activeIndex + 1) % 4;
  const back = (activeIndex + 2) % 4;

  return (
    <section
      className="relative w-full overflow-hidden font-sans"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: "background-color 650ms cubic-bezier(0.4,0,0.2,1)",
        height: "100vh",
      }}
    >
      {/* Grain overlay */}
      <div className="absolute inset-0 pointer-events-none z-50" style={{ opacity: 0.4 }}>
        <svg
          className="w-full h-full"
          style={{ opacity: 0.08, backgroundSize: "200px 200px" }}
        >
          <filter id="fractalNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
          </filter>
          <rect width="100%" height="100%" filter="url(#fractalNoise)" />
        </svg>
      </div>

      {/* Giant "3D SHAPE" text */}
      <div
        className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          zIndex: 2,
          top: "18%",
          fontFamily: "'Anton', sans-serif",
          fontSize: "clamp(90px, 28vw, 380px)",
          fontWeight: 900,
          color: "white",
          opacity: 1,
          lineHeight: 1,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}
      >
        3D SHAPE
      </div>

      {/* Top-left brand label */}
      <div className="absolute top-6 left-4 sm:left-8 z-60 text-xs font-semibold uppercase text-white opacity-90" style={{ letterSpacing: "0.18em" }}>
        TOONHUB
      </div>

      {/* Carousel - 4 items with role-based positioning */}
      <div className="absolute inset-0 z-30">
        {IMAGES.map((img, idx) => {
          let role: "center" | "left" | "right" | "back";
          if (idx === center) role = "center";
          else if (idx === left) role = "left";
          else if (idx === right) role = "right";
          else role = "back";

          return (
            <motion.div
              key={idx}
              className="absolute"
              style={{
                aspectRatio: "0.6 / 1",
                ...getRoleStyles(role, isMobile),
              }}
              animate={getRoleStyles(role, isMobile)}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            >
              <Image
                src={img.src}
                alt={`Character ${idx}`}
                fill
                className="object-contain object-bottom"
                priority={idx === activeIndex}
                draggable={false}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Bottom-left content + nav */}
      <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 z-60 max-w-80">
        <p className="text-base sm:text-[22px] font-bold uppercase text-white opacity-95 mb-2 sm:mb-3" style={{ letterSpacing: "0.02em" }}>
          TOONHUB FIGURINES
        </p>
        <p className="hidden sm:block text-xs sm:text-sm text-white opacity-85 leading-relaxed mb-4 sm:mb-5">
          The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("prev")}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white text-white hover:bg-white/12 hover:scale-108 transition-all duration-150 flex items-center justify-center"
          >
            <ArrowLeft size={26} strokeWidth={2.25} />
          </button>
          <button
            onClick={() => navigate("next")}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white text-white hover:bg-white/12 hover:scale-108 transition-all duration-150 flex items-center justify-center"
          >
            <ArrowRight size={26} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      {/* Bottom-right "DISCOVER IT" link */}
      <a
        href="#"
        className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 z-60 flex items-center gap-2 no-underline"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: "clamp(20px, 4vw, 56px)",
          fontWeight: 400,
          color: "white",
          opacity: 0.95,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          textTransform: "uppercase",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.95")}
      >
        DISCOVER IT
        <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
      </a>
    </section>
  );
}

// Helper function for role-based positioning
function getRoleStyles(role: "center" | "left" | "right" | "back", isMobile: boolean) {
  const baseStyle = {
    transition: "all 650ms cubic-bezier(0.4,0,0.2,1)",
    willChange: "transform, filter, opacity",
    left: "50%",
    bottom: "0%",
  };

  if (role === "center") {
    return {
      ...baseStyle,
      transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
      filter: "blur(0px)",
      opacity: 1,
      zIndex: 20,
      left: "50%",
      height: isMobile ? "60%" : "92%",
      bottom: isMobile ? "22%" : "0%",
    };
  }

  if (role === "left") {
    return {
      ...baseStyle,
      transform: "translateX(-50%) scale(1)",
      filter: "blur(2px)",
      opacity: 0.85,
      zIndex: 10,
      left: isMobile ? "20%" : "30%",
      height: isMobile ? "16%" : "28%",
      bottom: isMobile ? "32%" : "12%",
    };
  }

  if (role === "right") {
    return {
      ...baseStyle,
      transform: "translateX(-50%) scale(1)",
      filter: "blur(2px)",
      opacity: 0.85,
      zIndex: 10,
      left: isMobile ? "80%" : "70%",
      height: isMobile ? "16%" : "28%",
      bottom: isMobile ? "32%" : "12%",
    };
  }

  // back
  return {
    ...baseStyle,
    transform: "translateX(-50%) scale(1)",
    filter: "blur(4px)",
    opacity: 1,
    zIndex: 5,
    left: "50%",
    height: isMobile ? "13%" : "22%",
    bottom: isMobile ? "32%" : "12%",
  };
}
```

---

## 4. **Update Your Assets**

- Replace the 4 TOONHUB image URLs with your actual character asset URLs
- Ensure images have transparent backgrounds for proper blending
- Test loading performance with `next/image` priority preloading

---

## 5. **Integration into Existing Hero**

**Option A: Replace current HeroSection**
- Rename `HeroSection.tsx` → `HeroSection.backup.tsx`
- Create `ToonHubHero.tsx`
- Import in `page.tsx`

**Option B: Keep both**
- Create toggle between current hero and TOONHUB carousel
- Useful for A/B testing

---

## Key Next.js-Specific Adaptations

### Image Optimization
```tsx
// ❌ Don't use:
<img src="url" />

// ✅ Do use:
import Image from "next/image";
<Image src="url" alt="..." fill priority draggable={false} />
```

### Font Loading
```tsx
// ❌ Don't use @theme with arbitrary fonts in globals.css

// ✅ Do use:
const anton = Anton({ subsets: ["latin"], variable: "--font-anton" });
// Then in @theme: --font-anton: var(--font-anton);
```

### Animation Library
Your project already has **Framer Motion** — use it directly (no Vite-specific setup needed).

---

## Color Palette for Tailwind

Add these to your `@theme` in `globals.css`:

```css
--color-toon-orange: #F4845F;
--color-toon-orange-light: #F79B7F;
--color-toon-green: #6BBF7A;
--color-toon-green-light: #85CC92;
--color-toon-pink: #E882B4;
--color-toon-pink-light: #ED9DC4;
--color-toon-blue: #6EB5FF;
--color-toon-blue-light: #8DC4FF;
```

Then use in Tailwind: `bg-toon-orange`, `bg-toon-green`, etc.

---

## Browser Compatibility & Performance Tips

1. **Image Preloading**: Use Next.js `priority` prop for active carousel image
2. **Animation Performance**: Keep `willChange` limited to `transform, filter, opacity`
3. **Responsive**: Test on `sm` (640px), `md` (768px), `lg` (1024px) breakpoints
4. **Accessibility**: Add `aria-label` to carousel buttons, ensure focus states

---

## Testing Checklist

- [ ] Fonts render correctly (Outfit + Anton)
- [ ] Images load and display without layout shift
- [ ] Carousel navigation works (4-item rotation)
- [ ] Colors transition smoothly (650ms)
- [ ] Responsive breakpoints work (`sm`, `md`)
- [ ] Mobile viewport (<640px) scales/positions correctly
- [ ] Icons render properly from lucide-react
- [ ] No console errors or TypeScript issues

---

## File Structure After Implementation

```
client/src/
├── app/
│   ├── layout.tsx              (Update: add Anton font)
│   ├── globals.css             (Update: add @theme colors)
│   └── page.tsx                (Import ToonHubHero)
├── components/
│   ├── HeroSection.tsx         (Keep or backup)
│   └── ToonHubHero.tsx         (New: TOONHUB carousel)
└── ...
```

---

## Next Steps

1. Update `layout.tsx` with Anton font
2. Update `globals.css` with TOONHUB color palette
3. Create `ToonHubHero.tsx` component
4. Test component in isolation
5. Integrate into `page.tsx`
6. Deploy and monitor performance
