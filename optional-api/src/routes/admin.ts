import { Router } from "express";
import { AnalyticsSummary } from "@telugu-yuvatha/shared";
import { ok } from "../lib/http.js";
import { listEntities } from "../lib/store.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/analytics", async (_req, res, next) => {
  try {
    const [orders, products, users] = await Promise.all([listEntities("orders"), listEntities("products"), listEntities("users")]);
    const paidOrders = orders.filter((order) => ["paid", "processing", "shipped", "delivered"].includes(order.status));
    const productSales = new Map<string, { productId: string; name: string; quantity: number; revenue: number }>();
    for (const order of paidOrders) {
      for (const item of order.items) {
        const row = productSales.get(item.productId) ?? { productId: item.productId, name: item.name, quantity: 0, revenue: 0 };
        row.quantity += item.quantity;
        row.revenue += item.quantity * item.price;
        productSales.set(item.productId, row);
      }
    }
    const summary: AnalyticsSummary = {
      revenue: paidOrders.reduce((sum, order) => sum + order.total, 0),
      orders: orders.length,
      customers: users.filter((user) => user.role === "customer").length,
      bestSellingProducts: [...productSales.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5),
      lowStockProducts: products.filter((product) => !product.comingSoon && product.stock <= 15)
    };
    ok(res, summary);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/customers", async (_req, res, next) => {
  try {
    ok(
      res,
      (await listEntities("users")).filter((user) => user.role === "customer").map(({ passwordHash, ...user }) => user)
    );
  } catch (error) {
    next(error);
  }
});
