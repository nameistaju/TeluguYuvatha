import { Router } from "express";
import { z } from "zod";
import type { Cart, Wishlist } from "@telugu-yuvatha/shared";
import { ok } from "../lib/http.js";
import { getEntity, listEntities, saveEntity, timestamped } from "../lib/store.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

export const cartRouter = Router();
export const wishlistRouter = Router();

const itemSchema = z.object({
  productId: z.string(),
  size: z.string(),
  color: z.string(),
  quantity: z.number().int().positive().default(1),
  price: z.number().nonnegative()
});

async function getOrCreateCart(userId: string): Promise<Cart> {
  const cart = (await listEntities("carts")).find((row) => row.userId === userId);
  if (cart) return cart;
  return saveEntity("carts", timestamped(({ userId, items: [] } as unknown) as Cart, "cart"));
}

async function getOrCreateWishlist(userId: string): Promise<Wishlist> {
  const wishlist = (await listEntities("wishlists")).find((row) => row.userId === userId);
  if (wishlist) return wishlist;
  return saveEntity("wishlists", timestamped(({ userId, productIds: [] } as unknown) as Wishlist, "wish"));
}

cartRouter.use(requireAuth);
wishlistRouter.use(requireAuth);

cartRouter.get("/", async (req: AuthRequest, res, next) => {
  try {
    ok(res, await getOrCreateCart(req.user!.id));
  } catch (error) {
    next(error);
  }
});

cartRouter.post("/items", async (req: AuthRequest, res, next) => {
  try {
    const item = itemSchema.parse(req.body);
    const cart = await getOrCreateCart(req.user!.id);
    const existing = cart.items.find((row) => row.productId === item.productId && row.size === item.size && row.color === item.color);
    if (existing) existing.quantity += item.quantity;
    else cart.items.push(item);
    ok(res, await saveEntity("carts", timestamped(cart, "cart")));
  } catch (error) {
    next(error);
  }
});

cartRouter.put("/items/:productId", async (req: AuthRequest, res, next) => {
  try {
    const { quantity } = z.object({ quantity: z.number().int().min(0) }).parse(req.body);
    const cart = await getOrCreateCart(req.user!.id);
    if (quantity === 0) cart.items = cart.items.filter((item) => item.productId !== req.params.productId);
    else cart.items = cart.items.map((item) => (item.productId === req.params.productId ? { ...item, quantity } : item));
    ok(res, await saveEntity("carts", timestamped(cart, "cart")));
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/items/:productId", async (req: AuthRequest, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user!.id);
    cart.items = cart.items.filter((item) => item.productId !== req.params.productId);
    ok(res, await saveEntity("carts", timestamped(cart, "cart")));
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/", async (req: AuthRequest, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user!.id);
    cart.items = [];
    ok(res, await saveEntity("carts", timestamped(cart, "cart")));
  } catch (error) {
    next(error);
  }
});

wishlistRouter.get("/", async (req: AuthRequest, res, next) => {
  try {
    ok(res, await getOrCreateWishlist(req.user!.id));
  } catch (error) {
    next(error);
  }
});

wishlistRouter.post("/items/:productId", async (req: AuthRequest, res, next) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user!.id);
    if (!wishlist.productIds.includes(req.params.productId)) wishlist.productIds.push(req.params.productId);
    ok(res, await saveEntity("wishlists", timestamped(wishlist, "wish")));
  } catch (error) {
    next(error);
  }
});

wishlistRouter.delete("/items/:productId", async (req: AuthRequest, res, next) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user!.id);
    wishlist.productIds = wishlist.productIds.filter((id) => id !== req.params.productId);
    ok(res, await saveEntity("wishlists", timestamped(wishlist, "wish")));
  } catch (error) {
    next(error);
  }
});

wishlistRouter.post("/items/:productId/move-to-cart", async (req: AuthRequest, res, next) => {
  try {
    const product = await getEntity("products", req.params.productId);
    const wishlist = await getOrCreateWishlist(req.user!.id);
    const cart = await getOrCreateCart(req.user!.id);
    wishlist.productIds = wishlist.productIds.filter((id) => id !== req.params.productId);
    if (product) {
      cart.items.push({
        productId: product.id,
        size: product.sizes[0] ?? "OS",
        color: product.colors[0] ?? "Default",
        quantity: 1,
        price: product.price
      });
    }
    await saveEntity("wishlists", timestamped(wishlist, "wish"));
    ok(res, await saveEntity("carts", timestamped(cart, "cart")));
  } catch (error) {
    next(error);
  }
});
