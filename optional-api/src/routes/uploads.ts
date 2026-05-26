import { Readable } from "node:stream";
import multer from "multer";
import { Router } from "express";
import { z } from "zod";
import { getCloudinary } from "../lib/cloudinary.js";
import { ApiError, ok } from "../lib/http.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const uploadsRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

uploadsRouter.post("/", requireAuth, requireRole("admin"), upload.array("images", 8), async (req, res, next) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) throw new ApiError(400, "No images uploaded");
    const cloudinary = getCloudinary();
    const folder = z.string().default("telugu-yuvatha/products").parse(req.body.folder);
    const uploads = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder,
                resource_type: "image",
                transformation: [{ quality: "auto" }, { fetch_format: "auto" }]
              },
              (error, result) => (error ? reject(error) : resolve(result))
            );
            Readable.from(file.buffer).pipe(stream);
          })
      )
    );
    ok(res, uploads, 201);
  } catch (error) {
    next(error);
  }
});

uploadsRouter.delete("/:publicId", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const cloudinary = getCloudinary();
    ok(res, await cloudinary.uploader.destroy(decodeURIComponent(req.params.publicId)));
  } catch (error) {
    next(error);
  }
});
