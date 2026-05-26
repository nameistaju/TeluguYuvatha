import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().default("change_this_to_a_long_random_secret"),
  RAZORPAY_KEY_ID: z.string().regex(/^rzp_(test|live)_[A-Za-z0-9]+$/, "RAZORPAY_KEY_ID must be a Razorpay test or live key").optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  ADMIN_URL: z.string().default("http://localhost:3001"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default("Telugu Yuvatha <orders@teluguyuvatha.com>")
});

export const env = envSchema
  .superRefine((value, ctx) => {
    if (Boolean(value.RAZORPAY_KEY_ID) !== Boolean(value.RAZORPAY_KEY_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured together",
        path: ["RAZORPAY_KEY_SECRET"]
      });
    }
  })
  .parse(process.env);
