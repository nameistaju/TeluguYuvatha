import { Router } from "express";
import { z } from "zod";
import { ok } from "../lib/http.js";
import { deleteEntity, getEntity, listEntities, saveEntity, timestamped } from "../lib/store.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

type CrudCollection = "products" | "categories" | "collections" | "reviews" | "siteSettings";

export function crudRouter(collection: CrudCollection, prefix: string, adminOnly = false) {
  const router = Router();
  const writer = adminOnly ? [requireAuth, requireRole("admin")] : [requireAuth];

  router.get("/", async (_req, res, next) => {
    try {
      ok(res, await listEntities(collection));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      ok(res, await getEntity(collection, req.params.id));
    } catch (error) {
      next(error);
    }
  });

  router.post("/", ...writer, async (req, res, next) => {
    try {
      const body = z.record(z.unknown()).parse(req.body);
      ok(res, await saveEntity(collection, timestamped(body, prefix) as never), 201);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", ...writer, async (req, res, next) => {
    try {
      const existing = await getEntity(collection, req.params.id);
      const body = z.record(z.unknown()).parse(req.body);
      ok(res, await saveEntity(collection, timestamped({ ...existing, ...body, id: req.params.id }, prefix) as never));
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", ...writer, async (req, res, next) => {
    try {
      await deleteEntity(collection, req.params.id);
      ok(res, { deleted: true });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
