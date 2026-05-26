import { randomUUID } from "node:crypto";
import type {
  Cart,
  Category,
  Collection,
  ContactMessage,
  NewsletterSubscriber,
  Order,
  Product,
  Review,
  SiteSetting,
  User,
  Wishlist
} from "@telugu-yuvatha/shared";
import { seedCategories, seedCollections, seedProducts, seedSettings } from "@telugu-yuvatha/shared";
import { prisma } from "./prisma.js";
import bcrypt from "bcryptjs";

type EntityMap = {
  users: User;
  products: Product;
  categories: Category;
  collections: Collection;
  carts: Cart;
  wishlists: Wishlist;
  orders: Order;
  reviews: Review;
  contactMessages: ContactMessage;
  newsletterSubscribers: NewsletterSubscriber;
  siteSettings: SiteSetting;
};

type CollectionName = keyof EntityMap;

const collectionIncludes = {
  users: { addresses: true },
  carts: { items: true },
  wishlists: { items: true },
  orders: { items: true, shippingAddress: true },
  products: undefined,
  categories: undefined,
  collections: undefined,
  reviews: undefined,
  contactMessages: undefined,
  newsletterSubscribers: undefined,
  siteSettings: undefined
} satisfies Record<CollectionName, unknown>;

let seedPromise: Promise<void> | null = null;

function isTransientDatabaseError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("E57P01") ||
    message.includes("terminating connection due to administrator command") ||
    message.includes("Can't reach database server") ||
    message.includes("Connection terminated")
  );
}

async function withDatabaseRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isTransientDatabaseError(error)) throw error;
    await prisma.$disconnect().catch(() => undefined);
    await new Promise((resolve) => setTimeout(resolve, 150));
    return operation();
  }
}

function iso(value: unknown) {
  return value instanceof Date ? value.toISOString() : value;
}

function normalize<T>(value: T): T {
  if (Array.isArray(value)) return value.map(normalize) as T;
  if (!value || typeof value !== "object") return iso(value) as T;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalize(item)])) as T;
}

function toCart(row: any): Cart {
  return normalize({
    ...row,
    items: row.items?.map(({ id: _id, cartId: _cartId, createdAt: _createdAt, updatedAt: _updatedAt, ...item }: any) => item) ?? []
  });
}

function toWishlist(row: any): Wishlist {
  return normalize({
    ...row,
    productIds: row.items?.map((item: any) => item.productId) ?? [],
    items: undefined
  });
}

function toOrder(row: any): Order {
  return normalize({
    ...row,
    shippingAddress: row.shippingAddress,
    items:
      row.items?.map(({ id: _id, orderId: _orderId, createdAt: _createdAt, updatedAt: _updatedAt, ...item }: any) => item) ?? []
  });
}

function toUser(row: any): User {
  return normalize({ ...row, addresses: row.addresses ?? [] });
}

function mapRow<K extends CollectionName>(collection: K, row: unknown): EntityMap[K] {
  if (!row) return row as EntityMap[K];
  if (collection === "carts") return toCart(row) as EntityMap[K];
  if (collection === "wishlists") return toWishlist(row) as EntityMap[K];
  if (collection === "orders") return toOrder(row) as EntityMap[K];
  if (collection === "users") return toUser(row) as EntityMap[K];
  return normalize(row) as EntityMap[K];
}

function delegate(collection: CollectionName): any {
  const delegates = {
    users: prisma.user,
    products: prisma.product,
    categories: prisma.category,
    collections: prisma.collection,
    carts: prisma.cart,
    wishlists: prisma.wishlist,
    orders: prisma.order,
    reviews: prisma.review,
    contactMessages: prisma.contactMessage,
    newsletterSubscribers: prisma.newsletterSubscriber,
    siteSettings: prisma.siteSetting
  };
  return delegates[collection];
}

async function seedDatabase() {
  for (const category of seedCategories) {
    await withDatabaseRetry(() => prisma.category.upsert({ where: { id: category.id }, update: {}, create: category }));
  }
  for (const collection of seedCollections) {
    await withDatabaseRetry(() => prisma.collection.upsert({ where: { id: collection.id }, update: {}, create: collection }));
  }
  for (const product of seedProducts) {
    await withDatabaseRetry(() => prisma.product.upsert({ where: { id: product.id }, update: {}, create: product as any }));
  }
  for (const setting of seedSettings) {
    await withDatabaseRetry(() => prisma.siteSetting.upsert({ where: { key: setting.key }, update: {}, create: setting as any }));
  }

  // Seed default admin account for easy out-of-the-box command center access
  const adminEmail = "admin@teluguyuvatha.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("adminpassword123", 12);
    await withDatabaseRetry(() => prisma.user.create({
      data: {
        id: "usr_admin",
        name: "System Admin",
        email: adminEmail,
        role: "admin",
        passwordHash
      }
    }));
  }
}

async function ensureSeeded() {
  seedPromise ??= seedDatabase().catch((error) => {
    seedPromise = null;
    throw error;
  });
  await seedPromise;
}

function stripMeta<T extends Record<string, unknown>>(entity: T) {
  const { createdAt: _createdAt, updatedAt: _updatedAt, ...data } = entity;
  return data;
}

function stripNestedMeta<T extends Record<string, unknown>>(entity: T) {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = entity;
  return data;
}

async function saveCart(entity: Cart) {
  const data = stripMeta(entity as any);
  const items = entity.items ?? [];
  const cart = await prisma.cart.upsert({
    where: { id: entity.id },
    create: {
      id: entity.id,
      userId: entity.userId,
      items: { create: items.map((item) => ({ id: createId("cart_item"), ...item })) }
    },
    update: {
      userId: entity.userId,
      items: {
        deleteMany: {},
        create: items.map((item) => ({ id: createId("cart_item"), ...item }))
      }
    },
    include: { items: true }
  });
  return toCart(cart);
}

async function saveWishlist(entity: Wishlist) {
  const productIds = entity.productIds ?? [];
  const wishlist = await prisma.wishlist.upsert({
    where: { id: entity.id },
    create: {
      id: entity.id,
      userId: entity.userId,
      items: { create: productIds.map((productId) => ({ id: createId("wish_item"), productId })) }
    },
    update: {
      userId: entity.userId,
      items: {
        deleteMany: {},
        create: productIds.map((productId) => ({ id: createId("wish_item"), productId }))
      }
    },
    include: { items: true }
  });
  return toWishlist(wishlist);
}

async function saveOrder(entity: Order) {
  const items = entity.items ?? [];
  const address = entity.shippingAddress;
  const existing = await prisma.order.findUnique({ where: { id: entity.id }, include: { shippingAddress: true } });
  if (existing) {
    await prisma.address.update({
      where: { id: existing.shippingAddressId },
      data: stripNestedMeta(address as any)
    });
    const order = await prisma.order.update({
      where: { id: entity.id },
      data: {
        userId: entity.userId,
        subtotal: entity.subtotal,
        shipping: entity.shipping,
        tax: entity.tax,
        total: entity.total,
        currency: entity.currency,
        status: entity.status,
        paymentStatus: entity.paymentStatus,
        razorpayOrderId: entity.razorpayOrderId,
        razorpayPaymentId: entity.razorpayPaymentId,
        notes: entity.notes,
        emailSentAt: entity.emailSentAt ? new Date(entity.emailSentAt) : undefined,
        emailError: entity.emailError,
        paymentId: entity.paymentId,
        paymentSignature: entity.paymentSignature,
        items: {
          deleteMany: {},
          create: items.map((item) => ({ id: createId("ord_item"), ...item }))
        }
      },
      include: { items: true, shippingAddress: true }
    });
    return toOrder(order);
  }

  const shippingAddressData = { id: address.id || createId("addr"), ...stripNestedMeta(address as any) } as any;
  const order = await prisma.order.create({
    data: {
      id: entity.id,
      user: { connect: { id: entity.userId } },
      subtotal: entity.subtotal,
      shipping: entity.shipping,
      tax: entity.tax,
      total: entity.total,
      currency: entity.currency,
      status: entity.status,
      paymentStatus: entity.paymentStatus,
      razorpayOrderId: entity.razorpayOrderId,
      razorpayPaymentId: entity.razorpayPaymentId,
      notes: entity.notes,
      emailSentAt: entity.emailSentAt ? new Date(entity.emailSentAt) : undefined,
      emailError: entity.emailError,
      paymentId: entity.paymentId,
      paymentSignature: entity.paymentSignature,
      shippingAddress: { create: shippingAddressData },
      items: { create: items.map((item) => ({ id: createId("ord_item"), ...item })) }
    } as any,
    include: { items: true, shippingAddress: true }
  });

  return toOrder(order);
}

async function saveUser(entity: User) {
  const { addresses, ...userData } = stripMeta(entity as any);
  const user = await prisma.user.upsert({
    where: { id: entity.id },
    create: {
      id: entity.id,
      ...userData,
      addresses: addresses?.length ? { create: addresses.map((address: any) => ({ id: address.id ?? createId("addr"), ...stripNestedMeta(address) })) } : undefined
    } as any,
    update: {
      ...userData,
      addresses: addresses
        ? {
            deleteMany: {},
            create: addresses.map((address: any) => ({ id: address.id ?? createId("addr"), ...stripNestedMeta(address) }))
          }
        : undefined
    } as any,
    include: { addresses: true }
  });
  return toUser(user);
}

export async function listEntities<K extends CollectionName>(collection: K): Promise<EntityMap[K][]> {
  await ensureSeeded();
  return withDatabaseRetry(async () => {
    const orderBy =
      collection === "categories" || collection === "collections"
        ? { sortOrder: "asc" }
        : collection === "products"
          ? { name: "asc" }
          : { createdAt: "desc" };
    const rows = await delegate(collection).findMany({
      ...(collectionIncludes[collection] ? { include: collectionIncludes[collection] } : {}),
      orderBy
    });
    return rows.map((row: unknown) => mapRow(collection, row));
  });
}

export async function getEntity<K extends CollectionName>(collection: K, id: string): Promise<EntityMap[K] | undefined> {
  await ensureSeeded();
  return withDatabaseRetry(async () => {
    const row = await delegate(collection).findUnique({
      where: { id },
      ...(collectionIncludes[collection] ? { include: collectionIncludes[collection] } : {})
    });
    return row ? mapRow(collection, row) : undefined;
  });
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  await ensureSeeded();
  return withDatabaseRetry(async () => {
    const row = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { addresses: true }
    });
    return row ? toUser(row) : undefined;
  });
}

export async function listOrdersForUser(userId: string): Promise<Order[]> {
  await ensureSeeded();
  return withDatabaseRetry(async () => {
    const rows = await prisma.order.findMany({
      where: { userId },
      include: { items: true, shippingAddress: true },
      orderBy: { createdAt: "desc" }
    });
    return rows.map(toOrder);
  });
}

export async function saveEntity<K extends CollectionName>(collection: K, entity: EntityMap[K]): Promise<EntityMap[K]> {
  await ensureSeeded();
  return withDatabaseRetry(async () => {
    if (collection === "carts") return (await saveCart(entity as Cart)) as EntityMap[K];
    if (collection === "wishlists") return (await saveWishlist(entity as Wishlist)) as EntityMap[K];
    if (collection === "orders") return (await saveOrder(entity as Order)) as EntityMap[K];
    if (collection === "users") return (await saveUser(entity as User)) as EntityMap[K];

    const data = stripMeta(entity as any);
    const row = await delegate(collection).upsert({
      where: { id: entity.id },
      create: { id: entity.id, ...data },
      update: data,
      ...(collectionIncludes[collection] ? { include: collectionIncludes[collection] } : {})
    });
    return mapRow(collection, row);
  });
}

export async function deleteEntity<K extends CollectionName>(collection: K, id: string) {
  await ensureSeeded();
  await withDatabaseRetry(() => delegate(collection).delete({ where: { id } }));
}

export function createId(prefix: string) {
  return `${prefix}_${randomUUID()}`;
}

export function timestamped<T extends { id?: string; createdAt?: string; updatedAt?: string }>(entity: T, prefix: string) {
  const now = new Date().toISOString();
  return {
    ...entity,
    id: entity.id ?? createId(prefix),
    createdAt: entity.createdAt ?? now,
    updatedAt: now
  };
}
