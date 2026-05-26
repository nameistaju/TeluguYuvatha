export interface Product {
  id: string;
  slug: string;
  name: string;
  type: string;
  category: string;
  price: number;
  img: string;
  images: string[];
  description: string;
  sizes: string[];
}

export interface ComingSoonProduct {
  id: string;
  slug: string;
  name: string;
  type: string;
  img: string;
}

// 7 products strictly mapped for the Hero Section autoplay.
// DO NOT ADD NEW PRODUCTS HERE so the Hero Section autoplay remains undisturbed.
export const HERO_PRODUCTS = [
  {
    id: 1,
    src: "/assets/OG_shirt_hero.png",
    name: "OG Strike Shirt",
    slug: "og-strike-shirt",
  },
  {
    id: 2,
    src: "/assets/Darling_hero.png",
    name: "Darling Signature Tee",
    slug: "darling-tee",
  },
  {
    id: 3,
    src: "/assets/cinema_hero.png",
    name: "Cinema Lover Hoodie",
    slug: "cinema-lover-tee",
  },
  {
    id: 4,
    src: "/assets/jersyTshirt_hero.png",
    name: "Jersey Classic Tee",
    slug: "jersey-classic-tee",
  },
  {
    id: 5,
    src: "/assets/Pushpa_jean_hero.png",
    name: "Pushpa Raw Denim",
    slug: "pushpa-raw-denim",
  },
  {
    id: 6,
    src: "/assets/surya son of krishnan_hero.png",
    name: "Surya Signature Shirt",
    slug: "surya-signature-shirt",
  },
  {
    id: 7,
    src: "/assets/OG_hero.png",
    name: "OG Windbreaker Jacket",
    slug: "og-strike-shirt",
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "og-strike-shirt",
    name: "OG Strike Shirt",
    type: "Shirt",
    category: "shirts",
    price: 1499,
    img: "/assets/OG_shirt1.png",
    images: [
      "/assets/OG_shirt1.png",
      "/assets/OG_shirt2.png",
      "/assets/OG_shirt3.png",
      "/assets/OG_shirt4.png"
    ],
    description: "Premium structured button-up or oversized shirt representing the Original Gangster vibe. Heavyweight premium feel, cinema-inspired design.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "3",
    slug: "cinema-lover-tee",
    name: "Cinema Lover Tee",
    type: "T-Shirt",
    category: "t-shirts",
    price: 1499,
    img: "/assets/cinema1.png",
    images: [
      "/assets/cinema1.png",
      "/assets/cinema2.png",
      "/assets/cinema3.png",
      "/assets/cinema4.png"
    ],
    description: "For the die-hard fans of Telugu cinema. High density puff print representing the gold standards of cinema.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "5",
    slug: "jersey-classic-tee",
    name: "Jersey Classic Tee",
    type: "T-Shirt",
    category: "t-shirts",
    price: 1499,
    img: "/assets/jersyTshirt3.png",
    images: [
      "/assets/jersyTshirt3.png",
      "/assets/jersyTshirt4.png",
      "/assets/jersyTshirt_hero.png"
    ],
    description: "Sporty aesthetic meets premium street wear. Highlighted contrast stitching details.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "6",
    slug: "surya-signature-shirt",
    name: "Surya Signature Shirt",
    type: "Shirt",
    category: "shirts",
    price: 2499,
    img: "/assets/surya son of krishnan1.png",
    images: [
      "/assets/surya son of krishnan1.png",
      "/assets/surya son of krishnan2.png",
      "/assets/surya son of krishnan3.png",
      "/assets/surya son of krishnan4.png"
    ],
    description: "Premium structured button-up shirt inspired by classic Surya cinematic styling. Ultra lightweight rayon fabric.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "7",
    slug: "pushpa-raw-denim",
    name: "Pushpa Raw Denim",
    type: "Jean",
    category: "denim",
    price: 3999,
    img: "/assets/Pushpa_jean.png",
    images: [
      "/assets/Pushpa_jean.png",
      "/assets/Pushpa_jean2.png",
      "/assets/Pushpa_jean3.png",
      "/assets/Pushpa_jean4.png"
    ],
    description: "Rugged raw denim that fades uniquely to you over time. Straight relaxed cinematic fit.",
    sizes: ["30", "32", "34", "36"]
  },
  {
    id: "8",
    slug: "darling-tee",
    name: "Darling Vintage Tee",
    type: "T-Shirt",
    category: "t-shirts",
    price: 1499,
    img: "/assets/Darling1.png",
    images: [
      "/assets/Darling1.png",
      "/assets/Darling2.png",
      "/assets/Darling3.png",
      "/assets/Darling4.png"
    ],
    description: "Embrace the signature sweet Darling vintage aesthetic with this super comfortable cinema-inspired graphic tee.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "9",
    slug: "acidwash-zipper-hoodie",
    name: "Acid Wash Black Zipper Hoodie",
    type: "Hoodie",
    category: "outerwear",
    price: 2999,
    img: "/assets/AcidWash_Black_zipperHoodie_Og1.png",
    images: [
      "/assets/AcidWash_Black_zipperHoodie_Og1.png",
      "/assets/AcidWash_Black_zipperHoodie_Og2.png",
      "/assets/AcidWash_Black_zipperHoodie_Og3.png"
    ],
    description: "Heavyweight acid wash black zip-up hoodie. Premium raw edge streetwear style with cinema-grade wash finish.",
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "10",
    slug: "blue-ruby-critics-polo",
    name: "Blue Ruby Critics Polo",
    type: "Polo",
    category: "shirts",
    price: 1799,
    img: "/assets/Blue_ruby_crtics_polo1.png",
    images: [
      "/assets/Blue_ruby_crtics_polo1.png",
      "/assets/Blue_ruby_crtics_polo2.png",
      "/assets/Blue_ruby_crtics_polo3.png",
      "/assets/Blue_ruby_crtics_polo4.png"
    ],
    description: "Sophisticated critic-inspired polo shirt in deep blue ruby shades. Exquisite knit details and custom logo embroidery.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "11",
    slug: "butter-yellow-ok-jaanu-shirt",
    name: "Butter Yellow Cuban Collar Shirt",
    type: "Shirt",
    category: "shirts",
    price: 2299,
    img: "/assets/ButterYellow_cubanCollarShirt_okJaanu_1.png",
    images: [
      "/assets/ButterYellow_cubanCollarShirt_okJaanu_1.png",
      "/assets/ButterYellow_cubanCollarShirt_okJaanu_2.png",
      "/assets/ButterYellow_cubanCollarShirt_okJaanu_3.png",
      "/assets/ButterYellow_cubanCollarShirt_okJaanu_4.png"
    ],
    description: "Breezy butter yellow cuban collar shirt, perfectly relaxed fit for casual cinematic escapes and summer vibes.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "12",
    slug: "comeback-denim-jacket",
    name: "Comeback Black Denim Jacket",
    type: "Jacket",
    category: "outerwear",
    price: 3499,
    img: "/assets/Comback_blackdenime_jacket1.png",
    images: [
      "/assets/Comback_blackdenime_jacket1.png",
      "/assets/Comback_blackdenime_jacket2.png",
      "/assets/Comback_blackdenime_jacket3.png"
    ],
    description: "Vintage black denim jacket with distressed textures. A legendary cinematic comeback statement piece.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "13",
    slug: "jaibabutshirt",
    name: "Jai Babu White T-Shirt",
    type: "T-Shirt",
    category: "t-shirts",
    price: 1499,
    img: "/assets/Jaibabu_White_tshirt_1.png",
    images: [
      "/assets/Jaibabu_White_tshirt_1.png",
      "/assets/Jaibabu_White_Tshirt_2.png",
      "/assets/Jaibabu_White_tshirt_3.png"
    ],
    description: "Absolute power aesthetic. High-grade pristine white t-shirt featuring the signature legendary Jai Babu cinema look. 100% premium heavy cotton.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "14",
    slug: "kgf-rocky-red-hoodie",
    name: "KGF Rocky Red Hoodie",
    type: "Hoodie",
    category: "outerwear",
    price: 2899,
    img: "/assets/KGF_rocky_red_hoodie_Featured Drops1.png",
    images: [
      "/assets/KGF_rocky_red_hoodie_Featured Drops1.png",
      "/assets/KGF_rocky_red_hoodie2.png",
      "/assets/KGF_rocky_red_hoodie3.png",
      "/assets/KGF_rocky_red_hoodie4.png"
    ],
    description: "Massive red heavy-cotton hoodie. Inspired by the raw dominance of Rocky Bhai. absolute screen fire.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "15",
    slug: "music-black-tee",
    name: "Music Black T-Shirt",
    type: "T-Shirt",
    category: "t-shirts",
    price: 1299,
    img: "/assets/Music_blackThisrt_1.png",
    images: [
      "/assets/Music_blackThisrt_1.png",
      "/assets/Music_blackThisrt_2.png",
      "/assets/Music_blackThisrt_3.png"
    ],
    description: "Cinematic musical rhythm printed on a premium heavy black tee. Deep bass vibration pattern graphic.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "16",
    slug: "red-print-biryani-tee",
    name: "Red Print T-Shirt (Biryani)",
    type: "T-Shirt",
    category: "t-shirts",
    price: 1399,
    img: "/assets/Red_Printed_tshirt_briyani_1.png",
    images: [
      "/assets/Red_Printed_tshirt_briyani_1.png",
      "/assets/Red_Printed_tshirt_briyani_2.png"
    ],
    description: "Show your love for the ultimate Telugu comfort food: Biryani. Vibrant red graphic print on soft combed cotton.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "17",
    slug: "alliswell-yellow-tanktop",
    name: "All Is Well Yellow Tank Top",
    type: "Tank Top",
    category: "t-shirts",
    price: 999,
    img: "/assets/allIsWell_Yellow_tanktop1.png",
    images: [
      "/assets/allIsWell_Yellow_tanktop1.png",
      "/assets/allIsWell_Yellow_tanktop2.png"
    ],
    description: "Sunny yellow comfort fit tank top, inspired by signature classic cinematic dialogues. All Is Well.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "18",
    slug: "babypink-darling-shirt",
    name: "Baby Pink Shirt (Darling)",
    type: "Shirt",
    category: "shirts",
    price: 2199,
    img: "/assets/babyPink_shirt_darling_1.png",
    images: [
      "/assets/babyPink_shirt_darling_1.png",
      "/assets/babyPink_shirt_darling_2.png",
      "/assets/babyPink_shirt_darling_3.png"
    ],
    description: "Soft premium linen shirt in baby pink. Classic romance aesthetic for the modern gentleman.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "19",
    slug: "blue-tshirt-surya",
    name: "Blue T-Shirt (Surya)",
    type: "T-Shirt",
    category: "t-shirts",
    price: 2799,
    img: "/assets/blue_tshirt_surya son of krishnan1.png",
    images: [
      "/assets/blue_tshirt_surya son of krishnan1.png",
      "/assets/blue_tshirt_surya son of krishnan2.png",
      "/assets/blue_tshirt_surya son of krishnan3.png"
    ],
    description: "Comfort fit blue graphic t-shirt, capturing the retro love and nostalgia. Premium heavy cotton fabric.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "20",
    slug: "green-sweatshirt-subhash",
    name: "Green Sweatshirt (Subhash)",
    type: "Sweatshirt",
    category: "outerwear",
    price: 2499,
    img: "/assets/green_sweatshirt_Subhash_1.png",
    images: [
      "/assets/green_sweatshirt_Subhash_1.png",
      "/assets/green_sweatshirt_Subhash_2.png",
      "/assets/green_sweatshirt_Subhash_3.png"
    ],
    description: "Rich emerald green crewneck sweatshirt. Vintage collegiate film-maker lettering and premium textures.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "21",
    slug: "jersey-denim-jacket-blue",
    name: "Jersey Denim Jacket (Blue)",
    type: "Jacket",
    category: "outerwear",
    price: 3599,
    img: "/assets/jersey_demieJacket_1_blue.png",
    images: [
      "/assets/jersey_demieJacket_1_blue.png",
      "/assets/jersey_demieJacket_3_blue.png",
      "/assets/jersey_demieJacket_4_blue.png"
    ],
    description: "Hybrid sporty jersey sleeves fused with premium blue denim body. Dual cinematic styles combined.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "22",
    slug: "skyblue-surya-shirt",
    name: "Sky Blue Shirt (Surya)",
    type: "Shirt",
    category: "shirts",
    price: 2199,
    img: "/assets/surya son of krishnan_skyblueShirt_1.png",
    images: [
      "/assets/surya son of krishnan_skyblueShirt_1.png",
      "/assets/surya son of krishnan_skyblueShirt_2.png"
    ],
    description: "Premium sky blue structured shirt. Absolute retro-romance style nostalgia from signature cinematic styles.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "23",
    slug: "white-sweatshirt-meiyazhagan",
    name: "White Sweatshirt (Meiyazhagan)",
    type: "Sweatshirt",
    category: "outerwear",
    price: 2699,
    img: "/assets/white_sweatshirt_meiyazhagan1.png",
    images: [
      "/assets/white_sweatshirt_meiyazhagan1.png",
      "/assets/white_Sweatshirt_meiyazhagan2.png",
      "/assets/white_Sweatshirt_meiyazhagan3.png"
    ],
    description: "Pure white cinematic design sweatshirt. Gentle soul aesthetics for maximum warmth and comfort.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "24",
    slug: "og-headband",
    name: "OG Headband",
    type: "Accessory",
    category: "accessories",
    price: 1,
    img: "/assets/Og_headBand_showcase_5.png",
    images: [
      "/assets/Og_headBand_showcase_5.png",
      "/assets/Og_headBand_black_2.png",
      "/assets/Og_headBand_white_1.png",
      "/assets/Og_headBand_both_3.png",
      "/assets/Og_headBand_both_4.png"
    ],
    description: "Premium stretchy sportswear headband with bold cinematic statement stitch details.",
    sizes: ["One Size"]
  },
  {
    id: "25",
    slug: "rebel-red-phonecase",
    name: "Rebel Red Phone Case",
    type: "Accessory",
    category: "accessories",
    price: 1,
    img: "/assets/Rebel_red_phoneCase_1.png",
    images: [
      "/assets/Rebel_red_phoneCase_1.png",
      "/assets/Rebel_red_phoneCase_2.png",
      "/assets/Rebel_red_phoneCase_3.png"
    ],
    description: "Indestructible shockproof armor case in striking rebel red. Tailored for absolute cinema action buffs.",
    sizes: ["iPhone 13 Pro", "iPhone 14 Pro", "iPhone 15 Pro", "S23 Ultra", "S24 Ultra"]
  },
  {
    id: "26",
    slug: "spirit-transparent-phonecase",
    name: "Spirit Transparent Phone Case",
    type: "Accessory",
    category: "accessories",
    price: 1,
    img: "/assets/sprit_transparent_phoneCase_1.png",
    images: [
      "/assets/sprit_transparent_phoneCase_1.png",
      "/assets/sprit_transparent_phoneCase_2.png",
      "/assets/sprit_transparent_phoneCase_3.png"
    ],
    description: "Anti-yellowing crystal clear shockproof phone case highlighting custom underlaid cinematic prints.",
    sizes: ["iPhone 13 Pro", "iPhone 14 Pro", "iPhone 15 Pro", "S23 Ultra", "S24 Ultra"]
  },
  {
    id: "27",
    slug: "week-of-cinema-socks",
    name: "Week of Cinema™ Socks",
    type: "Accessory",
    category: "accessories",
    price: 1,
    img: "/assets/Week of Cinema Socks1.png",
    images: [
      "/assets/Week of Cinema Socks1.png",
      "/assets/Week of Cinema Socks2.png",
      "/assets/Week of Cinema Socks3.png",
      "/assets/Week of Cinema Socks4.png",
      "/assets/Week of Cinema Socks5.png"
    ],
    description: "A different movie mood for every day of the week. Packaging: 7 Days. 7 Movie Moods. One Ultimate Fan Collection. Premium combed cotton fabric for maximum ventilation and comfort.",
    sizes: ["One Size"]
  },
  {
    id: "28",
    slug: "seetharamaraju-taxi-driver-cap",
    name: "Seetha Rama Raju Taxi Driver Black Cap",
    type: "Accessory",
    category: "accessories",
    price: 1,
    img: "/assets/SeethaRamaRaju_taxiDriver_blackCap1.png",
    images: [
      "/assets/SeethaRamaRaju_taxiDriver_blackCap1.png",
      "/assets/SeethaRamaRaju_taxiDriver_blackCap2.png",
      "/assets/SeethaRamaRaju_taxiDriver_blackCap3.png",
      "/assets/SeethaRamaRaju_taxiDriver_blackCap4.png"
    ],
    description: "Premium structured black cap inspired by the iconic Seetha Rama Raju taxi driver aesthetic. Features high-density embroidery, adjustable metal buckle strap, and breathable premium cotton.",
    sizes: ["One Size"]
  }
];

export const COMING_SOON_PRODUCTS: ComingSoonProduct[] = [
  {
    id: "cs1",
    slug: "loose-tanktop-chillguy",
    name: "Loose Tank Top (Chill Guy)",
    type: "Tank Top",
    img: "/assets/Loose_tankTop_chillGuy_comingSoon.png"
  },
  {
    id: "cs2",
    slug: "red-checkshirt-pk",
    name: "Red Check Shirt (PK)",
    type: "Shirt",
    img: "/assets/Red_checkShirt_Pk1_comingsoon.png"
  },
  {
    id: "cs3",
    slug: "nostalgia-retro-tee",
    name: "Nostalgia Retro Tee",
    type: "T-Shirt",
    img: "/assets/comingsoon3.png"
  },
  {
    id: "cs4",
    slug: "cinematic-pop-cap",
    name: "Cinematic Pop Cap",
    type: "Accessory",
    img: "/assets/comingsoon5.png"
  },
  {
    id: "cs5",
    slug: "massive-street-pants",
    name: "Massive Street Pants",
    type: "Pant",
    img: "/assets/comingsoon6.png"
  }
];
