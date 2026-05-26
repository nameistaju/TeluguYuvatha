import nodemailer from "nodemailer";
import { env } from "../env.js";

export async function sendOrderConfirmation(to: string, subject: string, html: string) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return;
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
  });
  await transport.sendMail({ from: env.SMTP_FROM, to, subject, html });
}
