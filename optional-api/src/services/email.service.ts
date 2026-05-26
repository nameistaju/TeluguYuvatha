import nodemailer from "nodemailer";
import { env } from "../env.js";
import { getEntity, saveEntity } from "../lib/store.js";
import type { Order, OrderStatus } from "@telugu-yuvatha/shared";
import { getOrderConfirmationHtml } from "../templates/order-confirmation.template.js";
import { getPaymentFailedHtml } from "../templates/payment-failed.template.js";
import { getOrderStatusHtml } from "../templates/order-status.template.js";

// Safe, fallback email reading from process env
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@teluguyuvatha.com";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@teluguyuvatha.com";

class EmailService {
  private getTransporter() {
    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
      console.warn("SMTP credentials missing. Transactional email sending skipped.");
      return null;
    }
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    });
  }

  private async fetchUserEmail(order: Order): Promise<string> {
    try {
      const user = await getEntity("users", order.userId);
      if (user && user.email) return user.email.toLowerCase();
    } catch {
      // Ignore
    }
    // Fallback if notes contains guest email or check shipping details phone
    return order.shippingAddress.phone || "customer@teluguyuvatha.com";
  }

  /**
   * Helper to write state metrics back to database order safely.
   */
  private async persistEmailStatus(orderId: string, success: boolean, errorMsg?: string) {
    try {
      const order = await getEntity("orders", orderId);
      if (order) {
        order.emailSentAt = success ? new Date().toISOString() : undefined;
        order.emailError = errorMsg || undefined;
        await saveEntity("orders", order);
      }
    } catch (err) {
      console.error(`Failed to persist email status for order ${orderId}`, err);
    }
  }

  /**
   * Dispatches order confirmation (COD or Paid)
   */
  async sendOrderConfirmation(order: Order): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) return;

    const customerEmail = await this.fetchUserEmail(order);
    const isCod = !order.razorpayOrderId;
    const isPaid = order.paymentStatus === "paid";

    const customerSubject = isPaid
      ? "Payment Successful – Your Telugu Yuvatha Order is Confirmed"
      : "Your Telugu Yuvatha Order is Confirmed";

    const adminSubject = isCod
      ? "New COD Order Received"
      : "New Paid Order Received";

    // 1. Send to Customer
    try {
      const customerHtml = getOrderConfirmationHtml(order, false);
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to: customerEmail,
        subject: customerSubject,
        html: customerHtml
      });
      console.log(`[Email success] Confirmed order ${order.id} sent to ${customerEmail}`);
      
      // Persist success
      await this.persistEmailStatus(order.id, true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Customer dispatch failed";
      console.error(`[Email failure] Confirmation to ${customerEmail} failed:`, msg);
      await this.persistEmailStatus(order.id, false, msg);
    }

    // 2. Send to Admin
    try {
      const adminHtml = getOrderConfirmationHtml(order, true);
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to: ADMIN_EMAIL,
        subject: adminSubject,
        html: adminHtml
      });
      console.log(`[Email success] Admin alert order ${order.id} dispatched to ${ADMIN_EMAIL}`);
    } catch (error) {
      console.error(`[Email failure] Admin alert for order ${order.id} failed:`, error);
    }
  }

  /**
   * Dispatches payment failed notice
   */
  async sendPaymentFailed(order: Order): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) return;

    const customerEmail = await this.fetchUserEmail(order);
    const customerSubject = "Payment Failed – Complete Your Telugu Yuvatha Order";
    const adminSubject = `Payment Failed for Order ${order.id.slice(-8).toUpperCase()}`;

    // 1. Customer Alert
    try {
      const customerHtml = getPaymentFailedHtml(order, false);
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to: customerEmail,
        subject: customerSubject,
        html: customerHtml
      });
      console.log(`[Email success] Payment failure notice for ${order.id} sent to ${customerEmail}`);
      await this.persistEmailStatus(order.id, true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failure dispatch failed";
      console.error(`[Email failure] Failed payment alert for ${order.id} failed:`, msg);
      await this.persistEmailStatus(order.id, false, msg);
    }

    // 2. Admin Alert
    try {
      const adminHtml = getPaymentFailedHtml(order, true);
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to: ADMIN_EMAIL,
        subject: adminSubject,
        html: adminHtml
      });
    } catch (error) {
      console.error(`[Email failure] Admin alert failed payment for ${order.id} failed:`, error);
    }
  }

  /**
   * Dispatches shipping status transitions
   */
  async sendOrderStatusUpdate(order: Order, status: OrderStatus | string): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) return;

    const customerEmail = await this.fetchUserEmail(order);
    const { subject, html } = getOrderStatusHtml(order, status);

    try {
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to: customerEmail,
        subject,
        html
      });
      console.log(`[Email success] Status update [${status}] for ${order.id} sent to ${customerEmail}`);
    } catch (error) {
      console.error(`[Email failure] Status update to ${customerEmail} failed:`, error);
    }
  }
}

export const emailService = new EmailService();
export default emailService;
