import { Router } from "express";
import { z } from "zod";
import { ApiError, ok } from "../lib/http.js";

export const couponsRouter = Router();

type Coupon = {
  code: string;
  label: string;
  type: "fixed" | "percent";
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
};

const coupons: Coupon[] = [
  {
    code: "ROFERO400",
    label: "Buy two and get INR 400 off",
    type: "fixed",
    value: 400,
    minSubtotal: 1998
  },
  {
    code: "TELUGU10",
    label: "10% off your order",
    type: "percent",
    value: 10,
    minSubtotal: 999,
    maxDiscount: 300
  }
];

export function calculateCouponDiscount(code: string | undefined, subtotal: number) {
  if (!code) return { code: undefined, label: undefined, discount: 0 };
  const normalized = code.trim().toUpperCase();
  const coupon = coupons.find((item) => item.code === normalized);
  if (!coupon) throw new ApiError(404, "Coupon code is not valid");
  if (subtotal < coupon.minSubtotal) throw new ApiError(400, `Minimum cart value is INR ${coupon.minSubtotal}`);

  const rawDiscount = coupon.type === "fixed" ? coupon.value : Math.round((subtotal * coupon.value) / 100);
  const discount = Math.min(rawDiscount, coupon.maxDiscount ?? rawDiscount, subtotal);
  return { code: coupon.code, label: coupon.label, discount };
}

couponsRouter.post("/validate", (req, res, next) => {
  try {
    const input = z.object({ code: z.string().min(2), subtotal: z.number().nonnegative() }).parse(req.body);
    ok(res, calculateCouponDiscount(input.code, input.subtotal));
  } catch (error) {
    next(error);
  }
});
