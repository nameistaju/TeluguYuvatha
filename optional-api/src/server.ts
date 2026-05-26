import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "node:path";
import { ZodError } from "zod";
import { env } from "./env.js";
import { ApiError } from "./lib/http.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { cartRouter, wishlistRouter } from "./routes/cart.js";
import { crudRouter } from "./routes/crud.js";
import { contactRouter, newsletterRouter } from "./routes/engagement.js";
import { couponsRouter } from "./routes/coupons.js";
import { ordersRouter } from "./routes/orders.js";
import { paymentsRouter } from "./routes/payments.js";
import { uploadsRouter } from "./routes/uploads.js";
import { disconnectPrisma } from "./lib/prisma.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://telugu-yuvatha-client.vercel.app",
        "https://telugu-yuvatha-admin.vercel.app"
      ];

      const parseEnvUrl = (urlStr: string) => {
        if (!urlStr) return [];
        return urlStr.split(",").map((u) => u.trim());
      };

      const parsedOrigins = [
        ...allowedOrigins,
        ...parseEnvUrl(env.FRONTEND_URL),
        ...parseEnvUrl(env.ADMIN_URL)
      ];

      const isAllowed = parsedOrigins.some((allowed) => {
        if (!allowed) return false;
        return origin === allowed || origin.endsWith(".vercel.app") || allowed === "*";
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 200 }));
app.use("/assets", express.static(path.resolve(process.cwd(), "..")));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "telugu-yuvatha-api" }));
app.use("/api/auth", authRouter);
app.use("/api/products", crudRouter("products", "prod", true));
app.use("/api/categories", crudRouter("categories", "cat", true));
app.use("/api/collections", crudRouter("collections", "col", true));
app.use("/api/reviews", crudRouter("reviews", "rev"));
app.use("/api/settings", crudRouter("siteSettings", "setting", true));
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/admin", adminRouter);
app.use("/api/uploads", uploadsRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) return res.status(400).json({ error: "Validation failed", details: error.flatten() });
  if (error instanceof ApiError) return res.status(error.status).json({ error: error.message });
  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(env.PORT, () => {
  console.log(`Telugu Yuvatha API listening on http://localhost:${env.PORT}/api`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${env.PORT} is already in use. Stop the existing API process or set a different PORT in optional-api/.env.`);
    process.exit(1);
  }
  throw error;
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close(() => {
      void disconnectPrisma().finally(() => process.exit(0));
    });
  });
}
