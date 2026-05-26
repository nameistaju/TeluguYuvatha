import crypto from "node:crypto";
import Razorpay from "razorpay";
import { Router } from "express";
import { z } from "zod";
import { env } from "../env.js";
import { ApiError, ok } from "../lib/http.js";
import { getEntity, saveEntity, timestamped } from "../lib/store.js";
import { optionalAuth, type AuthRequest } from "../middleware/auth.js";

export const paymentsRouter = Router();

function getRazorpay() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) throw new ApiError(500, "Razorpay is not configured");
  return new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });
}

paymentsRouter.use(optionalAuth);

async function assertCheckoutAccess(req: AuthRequest, orderId: string, email: string) {
  const order = await getEntity("orders", orderId);
  if (!order) throw new ApiError(404, "Order not found");
  if (req.user?.role === "admin" || req.user?.id === order.userId) return order;

  const owner = await getEntity("users", order.userId);
  if (owner?.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
    throw new ApiError(403, "Order ownership could not be verified");
  }

  return order;
}

paymentsRouter.post("/create-order", async (req: AuthRequest, res, next) => {
  try {
    const { orderId, email } = z.object({ orderId: z.string(), email: z.string().email() }).parse(req.body);
    const order = await assertCheckoutAccess(req, orderId, email);
    if (order.paymentStatus === "paid") throw new ApiError(409, "Order is already paid");
    if (order.razorpayOrderId && order.paymentStatus !== "failed") {
      ok(res, {
        id: order.razorpayOrderId,
        amount: Math.round(order.total * 100),
        currency: "INR",
        orderId: order.id
      });
      return;
    }

    const razorpay = getRazorpay();
    const receipt = `${order.id}-${Date.now()}`.slice(0, 40);
    const paymentOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100),
      currency: "INR",
      receipt,
      notes: { orderId: order.id }
    });
    order.razorpayOrderId = paymentOrder.id;
    order.paymentStatus = "created";
    await saveEntity("orders", timestamped(order, "ord"));
    ok(res, {
      id: paymentOrder.id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      orderId: order.id
    });
  } catch (error) {
    next(error);
  }
});

paymentsRouter.post("/verify", async (req: AuthRequest, res, next) => {
  try {
    const input = z
      .object({
        orderId: z.string(),
        email: z.string().email(),
        razorpay_order_id: z.string(),
        razorpay_payment_id: z.string(),
        razorpay_signature: z.string()
      })
      .parse(req.body);
    if (!env.RAZORPAY_KEY_SECRET) throw new ApiError(500, "Razorpay is not configured");
    const expected = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`)
      .digest("hex");
    if (expected !== input.razorpay_signature) throw new ApiError(400, "Invalid payment signature");
    const order = await assertCheckoutAccess(req, input.orderId, input.email);
    if (order.razorpayOrderId && order.razorpayOrderId !== input.razorpay_order_id) {
      throw new ApiError(400, "Payment order does not match checkout order");
    }
    if (order.paymentStatus === "paid") {
      ok(res, { success: true, order });
      return;
    }

    order.status = "paid";
    order.paymentStatus = "paid";
    order.razorpayOrderId = input.razorpay_order_id;
    order.razorpayPaymentId = input.razorpay_payment_id;
    order.paymentId = input.razorpay_payment_id;
    order.paymentSignature = input.razorpay_signature;
    const savedOrder = await saveEntity("orders", timestamped(order, "ord"));
    
    // Asynchronously dispatch the premium confirmation email
    const { queueOrderConfirmationEmail } = await import("../utils/queue-email.js");
    queueOrderConfirmationEmail(savedOrder);

    ok(res, { success: true, order: savedOrder });
  } catch (error) {
    next(error);
  }
});

paymentsRouter.post("/failure", async (req: AuthRequest, res, next) => {
  try {
    const input = z
      .object({
        orderId: z.string(),
        email: z.string().email(),
        razorpay_order_id: z.string().optional(),
        razorpay_payment_id: z.string().optional(),
        errorCode: z.string().optional(),
        errorReason: z.string().optional(),
        errorDescription: z.string().optional()
      })
      .parse(req.body);
    const { orderId, email } = input;
    const order = await assertCheckoutAccess(req, orderId, email);
    let savedOrder = order;
    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "failed";
      order.razorpayOrderId = input.razorpay_order_id ?? order.razorpayOrderId;
      order.razorpayPaymentId = input.razorpay_payment_id ?? order.razorpayPaymentId;
      order.paymentId = input.razorpay_payment_id ?? order.paymentId;
      order.notes = [
        order.notes,
        input.errorCode || input.errorReason || input.errorDescription
          ? `Payment failure: ${[input.errorCode, input.errorReason, input.errorDescription].filter(Boolean).join(" / ")}`
          : ""
      ]
        .filter(Boolean)
        .join("\n");
      savedOrder = await saveEntity("orders", timestamped(order, "ord"));
      
      if (input.razorpay_payment_id || input.errorCode || input.errorDescription) {
        const { queuePaymentFailedEmail } = await import("../utils/queue-email.js");
        queuePaymentFailedEmail(savedOrder);
      }
    }
    ok(res, { success: false, order: savedOrder });
  } catch (error) {
    next(error);
  }
});
