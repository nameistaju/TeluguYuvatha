import { Router } from "express";
import { z } from "zod";
import type { Order, OrderItem, Product } from "@telugu-yuvatha/shared";
import { ApiError, ok } from "../lib/http.js";
import { getEntity, getUserByEmail, listEntities, listOrdersForUser, saveEntity, timestamped } from "../lib/store.js";
import { optionalAuth, requireAuth, requireRole, type AuthRequest } from "../middleware/auth.js";
import { calculateCouponDiscount } from "./coupons.js";

export const ordersRouter = Router();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function ensureOrderProducts(items: OrderItem[]) {
  const categories = await listEntities("categories");
  const fallbackCategoryId = categories[0]?.id ?? "cat-tshirts";

  const normalized: OrderItem[] = [];
  for (const item of items) {
    const existing = await getEntity("products", item.productId);
    if (existing) {
      normalized.push(item);
      continue;
    }

    const product = await saveEntity(
      "products",
      timestamped<Product>(
        {
          id: item.productId,
          name: item.name,
          slug: slugify(`${item.name}-${item.productId}`),
          description: "Product snapshot created from checkout.",
          categoryId: fallbackCategoryId,
          price: item.price,
          comparePrice: undefined,
          sizes: [item.size],
          colors: [item.color],
          stock: 0,
          sku: item.sku || `CHECKOUT-${item.productId}`,
          tags: ["checkout"],
          material: "Not specified",
          featured: false,
          comingSoon: false,
          images: [],
          seo: {}
        } as unknown as Product,
        "prod"
      )
    );
    normalized.push({ ...item, productId: product.id, sku: product.sku });
  }
  return normalized;
}

ordersRouter.post("/track", async (req, res, next) => {
  try {
    const { orderId, email } = z.object({ orderId: z.string().min(1), email: z.string().email() }).parse(req.body);
    const order = await getEntity("orders", orderId);
    if (!order) throw new ApiError(404, "Order not found");
    const user = await getEntity("users", order.userId);
    const userEmailMatches = user && user.email.toLowerCase().trim() === email.toLowerCase().trim();
    if (!userEmailMatches) {
      throw new ApiError(403, "Order ID found but billing email verification failed.");
    }
    ok(res, order);
  } catch (error) {
    next(error);
  }
});

ordersRouter.get("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    ok(res, req.user!.role === "admin" ? await listEntities("orders") : await listOrdersForUser(req.user!.id));
  } catch (error) {
    next(error);
  }
});

const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1).max(160),
  sku: z.string().min(1).max(120),
  size: z.string().min(1).max(40),
  color: z.string().min(1).max(40),
  quantity: z.number().int().min(1).max(20),
  price: z.number().positive().max(100_000)
});

ordersRouter.post("/", optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const body = z
      .object({
        items: z.array(checkoutItemSchema).min(1).max(50),
        paymentMethod: z.enum(["cod", "razorpay"]).default("cod"),
        shippingAddress: z.object({
          fullName: z.string().min(2),
          phone: z.string().min(7),
          line1: z.string().min(3),
          line2: z.string().optional(),
          city: z.string().min(2),
          state: z.string().min(2),
          postalCode: z.string().min(4),
          country: z.string().min(2)
        }),
        email: z.string().email().optional(),
        couponCode: z.string().optional(),
        notes: z.string().optional()
      })
      .parse(req.body);
    const items = await ensureOrderProducts(body.items);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const coupon = calculateCouponDiscount(body.couponCode, subtotal);
    const discountedSubtotal = Math.max(0, subtotal - coupon.discount);
    const shipping = discountedSubtotal >= 1999 ? 0 : 99;
    const tax = Math.round(discountedSubtotal * 0.05);
    let user = req.user;

    if (!user) {
      if (!body.email) throw new ApiError(400, "Email is required for guest checkout");
      const guestEmail = body.email.toLowerCase();
      user = await getUserByEmail(guestEmail);
      if (!user) {
        user = await saveEntity(
          "users",
          timestamped(
            {
              name: body.shippingAddress.fullName,
              email: guestEmail,
              role: "customer",
              phone: body.shippingAddress.phone,
              addresses: []
            } as never,
            "usr"
          )
        );
      }
    }

    const notes = [
      body.notes,
      `Payment Method: ${body.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}`,
      coupon.code ? `Coupon: ${coupon.code} (-INR ${coupon.discount})` : ""
    ]
      .filter(Boolean)
      .join("\n");

    const order = timestamped<Order>(
      {
        userId: user.id,
        items,
        subtotal,
        shipping,
        tax,
        total: discountedSubtotal + shipping + tax,
        currency: "INR",
        status: "pending",
        paymentStatus: "created",
        shippingAddress: {
          id: "",
          ...body.shippingAddress
        },
        notes
      } as Order,
      "ord"
    );
    const savedOrder = await saveEntity("orders", order);
    if (body.paymentMethod === "cod") {
      const { queueOrderConfirmationEmail } = await import("../utils/queue-email.js");
      queueOrderConfirmationEmail(savedOrder);
    }
    ok(res, savedOrder, 201);
  } catch (error) {
    next(error);
  }
});

ordersRouter.put("/:id/status", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const input = z.object({ status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]) }).parse(req.body);
    const order = (await listEntities("orders")).find((row) => row.id === req.params.id);
    if (!order) throw new ApiError(404, "Order not found");
    order.status = input.status;
    const savedOrder = await saveEntity("orders", timestamped(order, "ord"));
    const { queueOrderStatusEmail } = await import("../utils/queue-email.js");
    queueOrderStatusEmail(savedOrder, input.status);
    ok(res, savedOrder);
  } catch (error) {
    next(error);
  }
});
