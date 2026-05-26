export type UserRole = "customer" | "admin";
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Collection extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  aiDescription?: string;
  imageUrl?: string;
  featured: boolean;
  sortOrder: number;
}

export interface ProductImage {
  id: string;
  url: string;
  publicId?: string;
  alt: string;
  position: number;
}

export interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface Product extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  aiDescription?: string;
  categoryId: string;
  collectionId?: string;
  price: number;
  comparePrice?: number;
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  tags: string[];
  material: string;
  featured: boolean;
  comingSoon: boolean;
  images: ProductImage[];
  seo: SeoMetadata;
}

export interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Cart extends BaseEntity {
  userId: string;
  items: CartItem[];
}

export interface Wishlist extends BaseEntity {
  userId: string;
  productIds: string[];
}

export interface OrderItem extends CartItem {
  name: string;
  sku: string;
}

export interface Order extends BaseEntity {
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: "INR";
  status: OrderStatus;
  paymentStatus: "created" | "paid" | "failed" | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shippingAddress: Address;
  notes?: string;
  emailSentAt?: string;
  emailError?: string;
  paymentId?: string;
  paymentSignature?: string;
}

export interface Review extends BaseEntity {
  productId: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
  approved: boolean;
}

export interface ContactMessage extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "archived";
}

export interface NewsletterSubscriber extends BaseEntity {
  email: string;
  source: string;
  subscribed: boolean;
}

export interface SiteSetting extends BaseEntity {
  key: string;
  value: unknown;
}

export interface AnalyticsSummary {
  revenue: number;
  orders: number;
  customers: number;
  bestSellingProducts: Array<{ productId: string; name: string; quantity: number; revenue: number }>;
  lowStockProducts: Product[];
}
