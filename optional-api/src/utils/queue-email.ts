import { emailService } from "../services/email.service.js";
import type { Order, OrderStatus } from "@telugu-yuvatha/shared";

/**
 * Dispatches confirmation emails asynchronously in the background.
 * Ensures the main HTTP thread finishes instantly.
 */
export function queueOrderConfirmationEmail(order: Order) {
  setTimeout(() => {
    emailService.sendOrderConfirmation(order)
      .catch((err) => console.error(`[Async Queue Error] Order Confirmation email failed for ${order.id}:`, err));
  }, 0);
}

/**
 * Dispatches payment failed warnings asynchronously in the background.
 */
export function queuePaymentFailedEmail(order: Order) {
  setTimeout(() => {
    emailService.sendPaymentFailed(order)
      .catch((err) => console.error(`[Async Queue Error] Payment Failed email failed for ${order.id}:`, err));
  }, 0);
}

/**
 * Dispatches shipping updates asynchronously in the background.
 */
export function queueOrderStatusEmail(order: Order, status: OrderStatus | string) {
  setTimeout(() => {
    emailService.sendOrderStatusUpdate(order, status)
      .catch((err) => console.error(`[Async Queue Error] Order Status [${status}] email failed for ${order.id}:`, err));
  }, 0);
}
