# TOONHUB Hero Carousel - Asset Generation Prompts

## Overview
This document contains AI prompts for generating character figurine images and videos for the TOONHUB carousel hero section. Use these with image/video generation tools like:
- **Image Generation**: DALL-E 3, Midjourney, Stable Diffusion XL
- **Video Generation**: Runway ML, Pika Labs, Synthesia, HeyGen
- **3D Models**: Meshy, Tripo 3D, Spline

---

## 1. CHARACTER FIGURINE IMAGES (Static)

Each character needs a high-quality image on a **transparent background** (PNG format) that will be displayed in the carousel.

### Character 1: "Orange Rogue" - Warm & Energetic

**Prompt for Image Generation (DALL-E 3 / Midjourney):**

```
Create a vibrant cartoon character figurine design in a 3D stylized art style.
The character is a confident street style persona, wearing modern urban fashion with orange and warm tones.
Pose: Standing confidently with a dynamic stance, looking slightly to the side.
Style: Glossy 3D rendered figurine, high detail, smooth surfaces, playful expression.
Background: Transparent/white background (for carousel overlay).
Color scheme: Orange accents, warm earth tones, modern streetwear aesthetic.
Resolution: 4000x5000px
Details: Highly detailed facial features, expressive eyes, trending 2024 fashion silhouette.
Mood: Energetic, youthful, trendy.
```

**Use case**: Orange (#F4845F) / Light Orange (#F79B7F) background in carousel

---

### Character 2: "Green Vibe" - Fresh & Cool

**Prompt for Image Generation:**

```
Create a stylized 3D cartoon character figurine with a cool, fresh aesthetic.
The character embodies street culture with green and natural tones in their outfit.
Pose: Relaxed confident stance, arms slightly open, inviting expression.
Style: Polished 3D figurine render with premium finish, smooth lighting, expressive personality.
Background: Transparent/white (for web carousel).
Color scheme: Forest green accents, sage tones, modern casual wear.
Resolution: 4000x5000px
Details: Detailed character design, contemporary urban fashion, friendly expression, intricate outfit textures.
Mood: Cool, laid-back, approachable.
```

**Use case**: Green (#6BBF7A) / Light Green (#85CC92) background in carousel

---

### Character 3: "Pink Spirit" - Bold & Playful

**Prompt for Image Generation:**

```
Design a vibrant 3D cartoon character figurine with a bold, playful personality.
The character features pink tones and modern streetwear with artistic flair.
Pose: Dynamic stance with personality, perhaps with attitude, looking forward confidently.
Style: Glossy 3D rendered figurine, eye-catching colors, smooth materials, fashion-forward.
Background: Transparent/white background.
Color scheme: Hot pink accents, complementary warm tones, trendy street fashion.
Resolution: 4000x5000px
Details: Expressive face, fashionable outfit with intricate details, artistic accessories.
Mood: Bold, playful, artistic, trendsetting.
```

**Use case**: Pink (#E882B4) / Light Pink (#ED9DC4) background in carousel

---

### Character 4: "Blue Dream" - Cool & Sophisticated

**Prompt for Image Generation:**

```
Create a sophisticated 3D cartoon character figurine with cool blue tones.
The character has a modern, slightly futuristic aesthetic with premium fashion sense.
Pose: Poised standing position with subtle elegance, looking confident and refined.
Style: High-quality 3D rendered figurine with premium finish, clean surfaces, sophisticated design.
Background: Transparent/white background (for carousel integration).
Color scheme: Electric blue accents, cool tones, modern minimalist fashion.
Resolution: 4000x5000px
Details: Premium styling, refined facial features, contemporary fashion design, polished appearance.
Mood: Cool, sophisticated, modern, aspirational.
```

**Use case**: Blue (#6EB5FF) / Light Blue (#8DC4FF) background in carousel

---

## 2. VIDEO ASSETS (Optional - for animated hero)

If you want animated videos instead of static images, use these prompts:

### Carousel Loop Animation

**Prompt for Video Generation (Runway ML / Pika Labs):**

```
Create a 3-second loop video of a cartoon character figurine rotating on a turntable.
- Character: A stylized 3D figurine in urban streetwear
- Animation: 360-degree slow rotation (one full turn in 3 seconds)
- Lighting: Cinematic studio lighting with subtle key light and fill light
- Background: Solid color background (can be keyed to transparent later)
- Quality: 4K, 30fps, smooth motion, professional product showcase style
- Mood: Premium, high-end fashion product display
```

**Output format**: MP4 (transparent or solid background, will be converted)

---

### Brand Transition Video

**Prompt for Video Animation:**

```
Create a 2-second transition video for "TOONHUB FIGURINES" text reveal.
- Text: "TOONHUB FIGURINES" (uppercase, bold Anton font style)
- Animation: Text fades in with subtle scale + glow effect
- Background: Transparent with particle effects around text
- Color: White text with soft glow
- Style: Modern, premium, merchandise brand aesthetic
- Resolution: 1920x1080, 30fps
- Mood: Sophisticated reveal, eye-catching but elegant
```

---

## 3. BACKGROUND/TEXTURE ASSETS

### Grain/Noise Texture

You already have this in SVG format (fractal noise), but if you want to enhance:

**For texture generation:**
```
Create a fine film grain/noise texture suitable for a modern web hero section overlay.
- Style: Subtle, barely noticeable grain
- Resolution: 2000x2000px
- Format: PNG (can be tiled)
- Opacity: Designed to be used at 8-12% opacity
- Purpose: Professional photography film grain effect
```

---

## 4. ALTERNATIVE: USE EXISTING SERVICES

### Quick Asset Services (No Prompting Needed)

If you want to skip AI generation, consider:

1. **3D Character Models**
   - Sketchfab.com (free/paid 3D models)
   - TurboSquid.com (premium 3D assets)
   - CGTrader.com (character figurines)

2. **Character Design Services**
   - Fiverr (search "3D character design")
   - Upwork (3D artist for figurine design)
   - ArtStation (commission 3D artists)

3. **Stock Video**
   - Pexels.com (free videos)
   - Unsplash.com (free images)
   - Envato Elements (premium assets)

---

## 5. PROMPT ENGINEERING TIPS FOR BEST RESULTS

### For Image Generation:

1. **Specify Dimensions**: Always mention "4000x5000px" or desired aspect ratio
2. **Background**: Always say "transparent background" or "white background"
3. **Style Keywords**: "3D rendered," "glossy," "figurine," "stylized"
4. **Quality Level**: Include "high detail," "professional," "premium finish"
5. **Negative Prompt** (if supported):
   ```
   Avoid: blurry, low quality, deformed, unrealistic proportions, cropped, 
   partial views, sketchy, unfinished, simple, cartoonish (if you want realistic)
   ```

### For Video Generation:

1. **Frame Rate**: Specify "30fps" or "60fps"
2. **Duration**: Always mention seconds ("3 seconds," "2-second loop")
3. **Format**: Request "MP4" or "WebM"
4. **Loop**: Specify if video should loop seamlessly
5. **Quality**: Mention "4K" or "1080p"

---

## 6. IMAGE SPECIFICATIONS FOR YOUR CAROUSEL

Each character image should follow these specs:

```
Format: PNG (transparent background)
Dimensions: 4000 x 5000 pixels (or 0.6:1 aspect ratio)
Color Mode: RGBA (with alpha channel for transparency)
DPI: 72 dpi (web-optimized)
File Size: Optimized for web (under 2MB ideally)
Opacity: 100% for character, transparent background
Positioning: Character centered, with breathing room for transforms
```

---

## 7. WORKFLOW FOR GENERATION

### Step 1: Generate Images
1. Use Midjourney / DALL-E 3 / Stable Diffusion
2. Generate 4 character images (use prompts above)
3. Download as PNG with transparent background
4. Resize/optimize for web

### Step 2: Optimize for Web
```bash
# Use ImageOptim, TinyPNG, or ImageMagick
convert character1.png -resize 2000x2500 -quality 85 character1-optimized.png
```

### Step 3: Test in Carousel
1. Upload to your Figma components (or CDN)
2. Test in the ToonHubHero component
3. Verify transforms and positioning look correct

### Step 4: Optional - Generate Videos
1. If adding animations, use Runway ML
2. Export as MP4
3. Convert and optimize for web with FFmpeg

---

## 8. RECOMMENDED TOOLS & PLATFORMS

| Task | Tool | Cost | Notes |
|------|------|------|-------|
| Character Images | Midjourney | $10-20/mo | Best quality, consistent style |
| Character Images | DALL-E 3 | $0.02-0.06/img | Fast, good detail control |
| Character Images | Stable Diffusion | Free/Local | Open-source, requires setup |
| 3D Models | Meshify / Tripo 3D | Free/Paid | Can convert 2D to 3D |
| Video Animation | Runway ML | $15-30/mo | Professional quality |
| Video Generation | Pika Labs | $10/mo | Affordable, good for loops |
| Asset Optimization | TinyPNG | Free/$50/mo | Batch compression |

---

## 9. EXAMPLE MIDJOURNEY COMMAND

If using Midjourney Discord bot:

```
/imagine
A vibrant 3D cartoon character figurine wearing modern streetwear, 
orange and warm tones, confident stance, glossy finish, 
transparent background, highly detailed, professional 3D render,
4000x5000px, premium figurine quality --ar 3:4 --niji --s 750 --q 2
```

---

## 10. LOCAL STORAGE & CDN RECOMMENDATION

### Option A: Local (Faster Loading)
Store optimized images in:
```
client/public/assets/toonhub/
├── character-1-orange.png
├── character-2-green.png
├── character-3-pink.png
└── character-4-blue.png
```

Then reference as:
```tsx
const IMAGES = [
  { src: '/assets/toonhub/character-1-orange.png', bg: '#F4845F', panel: '#F79B7F' },
  // ...
];
```

### Option B: CDN (Cloud Delivery)
Upload to Cloudinary / AWS S3 / Vercel Blob and reference URLs.

**Advantage**: Faster global delivery, automatic optimization

---

## Quick Start Checklist

- [ ] Generate 4 character images using prompts above
- [ ] Download as PNG with transparent background
- [ ] Optimize for web (resize, compress)
- [ ] Store in `client/public/assets/toonhub/` or CDN
- [ ] Update image URLs in `ToonHubHero.tsx`
- [ ] Test carousel in browser
- [ ] Verify animations and transitions work smoothly
- [ ] Test on mobile and desktop viewports
