import { Router } from "express";
import { z } from "zod";
import type { ContactMessage, NewsletterSubscriber } from "@telugu-yuvatha/shared";
import { ok } from "../lib/http.js";
import { listEntities, saveEntity, timestamped } from "../lib/store.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const contactRouter = Router();
export const newsletterRouter = Router();

contactRouter.post("/", async (req, res, next) => {
  try {
    const input = z
      .object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().min(2),
        message: z.string().min(5)
      })
      .parse(req.body);
    ok(res, await saveEntity("contactMessages", timestamped({ ...input, status: "new" } as ContactMessage, "msg")), 201);
  } catch (error) {
    next(error);
  }
});

contactRouter.get("/", requireAuth, requireRole("admin"), async (_req, res, next) => {
  try {
    ok(res, await listEntities("contactMessages"));
  } catch (error) {
    next(error);
  }
});

newsletterRouter.post("/", async (req, res, next) => {
  try {
    const input = z.object({ email: z.string().email(), source: z.string().default("website") }).parse(req.body);
    const existing = (await listEntities("newsletterSubscribers")).find((row) => row.email === input.email);
    ok(
      res,
      await saveEntity(
        "newsletterSubscribers",
        timestamped({ ...existing, ...input, subscribed: true } as NewsletterSubscriber, "sub")
      ),
      existing ? 200 : 201
    );
  } catch (error) {
    next(error);
  }
});

newsletterRouter.get("/", requireAuth, requireRole("admin"), async (_req, res, next) => {
  try {
    ok(res, await listEntities("newsletterSubscribers"));
  } catch (error) {
    next(error);
  }
});
