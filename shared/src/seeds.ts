import type { Category, Collection, Product, SiteSetting } from "./types.js";

const now = new Date().toISOString();

export const seedCategories: Category[] = [
  {
    id: "cat-tshirts",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Premium Telugu graphic tees built for everyday streetwear.",
    sortOrder: 1,
    isActive: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "cat-shirts",
    name: "Shirts",
    slug: "shirts",
    description: "Statement shirts with cinema-coded Telugu energy.",
    sortOrder: 2,
    isActive: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "cat-denim",
    name: "Jeans",
    slug: "jeans",
    description: "Denim for bold everyday fits.",
    sortOrder: 3,
    isActive: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "cat-coming-soon",
    name: "Coming Soon",
    slug: "coming-soon",
    description: "Upcoming Telugu Yuvatha drops.",
    sortOrder: 4,
    isActive: true,
    createdAt: now,
    updatedAt: now
  }
];

export const seedCollections: Collection[] = [
  {
    id: "col-cinema-core",
    name: "Cinema Core",
    slug: "cinema-core",
    description: "A premium tribute to Telugu cinema attitude, icons, and punchline culture.",
    featured: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "col-og-drop",
    name: "OG Drop",
    slug: "og-drop",
    description: "The first wave of Telugu Yuvatha essentials.",
    featured: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "col-coming-soon",
    name: "Coming Soon",
    slug: "coming-soon",
    description: "Designs in production for the next drop.",
    featured: false,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now
  }
];

export const seedProducts: Product[] = [
  {
    id: "prod-og-tee",
    name: "OG Telugu Tee",
    slug: "og-telugu-tee",
    description: "Heavyweight black T-shirt with Telugu Yuvatha OG artwork.",
    categoryId: "cat-tshirts",
    collectionId: "col-og-drop",
    price: 999,
    comparePrice: 1299,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    stock: 42,
    sku: "TY-TEE-OG",
    tags: ["og", "black", "telugu", "streetwear"],
    material: "240 GSM cotton",
    featured: true,
    comingSoon: false,
    images: [
      { id: "img-og-1", url: "/assets/OG1.png", alt: "OG Telugu Tee front", position: 1 },
      { id: "img-og-2", url: "/assets/OG2.png", alt: "OG Telugu Tee angle", position: 2 },
      { id: "img-og-3", url: "/assets/OG3.png", alt: "OG Telugu Tee detail", position: 3 },
      { id: "img-og-4", url: "/assets/OG4.png", alt: "OG Telugu Tee back", position: 4 }
    ],
    seo: { title: "OG Telugu Tee | Telugu Yuvatha", description: "Premium Telugu streetwear T-shirt from the OG Drop." },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod-darling-tee",
    name: "Darling Tee",
    slug: "darling-tee",
    description: "Soft cotton tee with a confident Telugu cinema-inspired Darling graphic.",
    categoryId: "cat-tshirts",
    collectionId: "col-cinema-core",
    price: 1099,
    comparePrice: 1399,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Charcoal"],
    stock: 36,
    sku: "TY-TEE-DARLING",
    tags: ["darling", "cinema", "charcoal"],
    material: "220 GSM bio-washed cotton",
    featured: true,
    comingSoon: false,
    images: [
      { id: "img-darling-1", url: "/assets/Darling1.png", alt: "Darling Tee front", position: 1 },
      { id: "img-darling-2", url: "/assets/Darling2.png", alt: "Darling Tee angle", position: 2 },
      { id: "img-darling-3", url: "/assets/Darling3.png", alt: "Darling Tee detail", position: 3 }
    ],
    seo: { title: "Darling Tee | Telugu Yuvatha", description: "Cinema-inspired Telugu graphic T-shirt." },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod-cinema-tee",
    name: "Cinema Yuvatha Tee",
    slug: "cinema-yuvatha-tee",
    description: "Streetwear tee for fans who carry Telugu cinema energy everywhere.",
    categoryId: "cat-tshirts",
    collectionId: "col-cinema-core",
    price: 999,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black"],
    stock: 28,
    sku: "TY-TEE-CINEMA",
    tags: ["cinema", "graphic", "fanwear"],
    material: "220 GSM cotton",
    featured: true,
    comingSoon: false,
    images: [
      { id: "img-cinema-1", url: "/assets/cinema1.png", alt: "Cinema Yuvatha Tee front", position: 1 },
      { id: "img-cinema-2", url: "/assets/cinema2.png", alt: "Cinema Yuvatha Tee angle", position: 2 },
      { id: "img-cinema-3", url: "/assets/cinema3.png", alt: "Cinema Yuvatha Tee detail", position: 3 },
      { id: "img-cinema-4", url: "/assets/cinema4.png", alt: "Cinema Yuvatha Tee back", position: 4 }
    ],
    seo: { title: "Cinema Yuvatha Tee | Telugu Yuvatha", description: "Premium Telugu cinema streetwear T-shirt." },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod-jersey-tee",
    name: "Yuvatha Jersey Tee",
    slug: "yuvatha-jersey-tee",
    description: "Sport-street T-shirt with jersey styling and Telugu Yuvatha attitude.",
    categoryId: "cat-tshirts",
    collectionId: "col-og-drop",
    price: 1199,
    comparePrice: 1499,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy"],
    stock: 18,
    sku: "TY-TEE-JERSEY",
    tags: ["jersey", "sport", "navy"],
    material: "Performance cotton blend",
    featured: false,
    comingSoon: false,
    images: [
      { id: "img-jersey-2", url: "/assets/jersyTshirt2.png", alt: "Yuvatha Jersey Tee front", position: 1 },
      { id: "img-jersey-3", url: "/assets/jersyTshirt3.png", alt: "Yuvatha Jersey Tee angle", position: 2 },
      { id: "img-jersey-4", url: "/assets/jersyTshirt4.png", alt: "Yuvatha Jersey Tee detail", position: 3 }
    ],
    seo: { title: "Yuvatha Jersey Tee | Telugu Yuvatha", description: "Sport-street Telugu jersey T-shirt." },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod-surya-tee",
    name: "Surya Son of Krishnan Tee",
    slug: "surya-son-of-krishnan-tee",
    description: "A premium nostalgia tee inspired by timeless Telugu youth culture.",
    categoryId: "cat-tshirts",
    collectionId: "col-cinema-core",
    price: 1099,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Olive"],
    stock: 24,
    sku: "TY-TEE-SURYA",
    tags: ["nostalgia", "cinema", "olive"],
    material: "240 GSM cotton",
    featured: false,
    comingSoon: false,
    images: [
      { id: "img-surya-1", url: "/assets/surya son of krishnan1.png", alt: "Surya Son of Krishnan Tee front", position: 1 },
      { id: "img-surya-2", url: "/assets/surya son of krishnan2.png", alt: "Surya Son of Krishnan Tee angle", position: 2 },
      { id: "img-surya-3", url: "/assets/surya son of krishnan3.png", alt: "Surya Son of Krishnan Tee detail", position: 3 },
      { id: "img-surya-4", url: "/assets/surya son of krishnan4.png", alt: "Surya Son of Krishnan Tee back", position: 4 }
    ],
    seo: { title: "Surya Son of Krishnan Tee | Telugu Yuvatha", description: "Nostalgic Telugu streetwear tee." },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod-og-shirt",
    name: "OG Overshirt",
    slug: "og-overshirt",
    description: "Premium overshirt with subtle Telugu Yuvatha branding.",
    categoryId: "cat-shirts",
    collectionId: "col-og-drop",
    price: 1799,
    comparePrice: 2199,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    stock: 15,
    sku: "TY-SHIRT-OG",
    tags: ["shirt", "overshirt", "og"],
    material: "Cotton twill",
    featured: true,
    comingSoon: false,
    images: [
      { id: "img-shirt-1", url: "/assets/OG_shirt1.png", alt: "OG Overshirt front", position: 1 },
      { id: "img-shirt-2", url: "/assets/OG_shirt2.png", alt: "OG Overshirt angle", position: 2 },
      { id: "img-shirt-3", url: "/assets/OG_shirt3.png", alt: "OG Overshirt detail", position: 3 },
      { id: "img-shirt-4", url: "/assets/OG_shirt4.png", alt: "OG Overshirt back", position: 4 }
    ],
    seo: { title: "OG Overshirt | Telugu Yuvatha", description: "Premium Telugu Yuvatha overshirt." },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod-pushpa-jean",
    name: "Pushpa Denim Jean",
    slug: "pushpa-denim-jean",
    description: "Statement denim with rugged Telugu streetwear styling.",
    categoryId: "cat-denim",
    collectionId: "col-cinema-core",
    price: 2299,
    comparePrice: 2799,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Washed Blue"],
    stock: 12,
    sku: "TY-DENIM-PUSHPA",
    tags: ["denim", "pushpa", "jeans"],
    material: "12 oz denim",
    featured: true,
    comingSoon: false,
    images: [
      { id: "img-jean-1", url: "/assets/Pushpa_jean.png", alt: "Pushpa Denim Jean front", position: 1 },
      { id: "img-jean-2", url: "/assets/Pushpa_jean2.png", alt: "Pushpa Denim Jean angle", position: 2 },
      { id: "img-jean-3", url: "/assets/Pushpa_jean3.png", alt: "Pushpa Denim Jean detail", position: 3 },
      { id: "img-jean-4", url: "/assets/Pushpa_jean4.png", alt: "Pushpa Denim Jean back", position: 4 }
    ],
    seo: { title: "Pushpa Denim Jean | Telugu Yuvatha", description: "Rugged Telugu streetwear denim." },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod-coming-soon-pack",
    name: "Next Drop Designs",
    slug: "next-drop-designs",
    description: "Upcoming Telugu Yuvatha designs being prepared for release.",
    categoryId: "cat-coming-soon",
    collectionId: "col-coming-soon",
    price: 0,
    sizes: [],
    colors: [],
    stock: 0,
    sku: "TY-COMING-SOON",
    tags: ["coming soon", "next drop"],
    material: "To be announced",
    featured: false,
    comingSoon: true,
    images: [
      { id: "img-cs-1", url: "/assets/Comingsoon1.png", alt: "Coming soon design 1", position: 1 },
      { id: "img-cs-2", url: "/assets/Comingsoon2.png", alt: "Coming soon design 2", position: 2 },
      { id: "img-cs-3", url: "/assets/comingsoon3.png", alt: "Coming soon design 3", position: 3 },
      { id: "img-cs-4", url: "/assets/comingsoon4.png", alt: "Coming soon design 4", position: 4 },
      { id: "img-cs-5", url: "/assets/comingsoon5.png", alt: "Coming soon design 5", position: 5 },
      { id: "img-cs-6", url: "/assets/comingsoon6.png", alt: "Coming soon design 6", position: 6 }
    ],
    seo: { title: "Coming Soon | Telugu Yuvatha", description: "Preview future Telugu Yuvatha drops." },
    createdAt: now,
    updatedAt: now
  }
];

export const seedSettings: SiteSetting[] = [
  {
    id: "setting-brand",
    key: "brand",
    value: {
      name: "Telugu Yuvatha",
      currency: "INR",
      supportEmail: "support@teluguyuvatha.com",
      freeShippingThreshold: 1999
    },
    createdAt: now,
    updatedAt: now
  }
];
