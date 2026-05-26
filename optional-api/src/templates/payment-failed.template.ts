import type { Order } from "@telugu-yuvatha/shared";

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function getPaymentFailedHtml(order: Order, isAdmin: boolean = false): string {
  const retryUrl = `https://teluguyuvatha.com/checkout?retryOrder=${order.id}`;

  const itemsHtml = order.items.map(item => `
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 10px 0; color: #ffffff; font-size: 13px; font-weight: bold; text-transform: uppercase;">
        ${item.name} <span style="color: #666666; font-size: 11px;">x ${item.quantity}</span>
      </td>
      <td style="padding: 10px 0; text-align: right; color: #D4AF37; font-size: 13px; font-weight: bold;">
        ${money(item.price * item.quantity)}
      </td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Handshake Failed</title>
    </head>
    <body style="background-color: #080808; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0d0d0d; border: 1px solid rgba(176, 0, 32, 0.2); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              
              <!-- Logo Header -->
              <tr>
                <td align="center" style="background-color: #000000; padding: 30px 20px; border-bottom: 1px solid rgba(176, 0, 32, 0.1);">
                  <div style="font-size: 24px; font-weight: 900; letter-spacing: 4px; color: #ffffff; text-transform: uppercase; margin: 0;">
                    TELUGU YUVATHA
                  </div>
                  <div style="font-size: 9px; font-weight: bold; letter-spacing: 2px; color: #B00020; text-transform: uppercase; margin-top: 5px;">
                    SECURE GATEWAY NOTICE
                  </div>
                </td>
              </tr>

              <!-- Alert graphic / body text -->
              <tr>
                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                  <span style="font-size: 10px; font-weight: 900; letter-spacing: 2px; color: #B00020; text-transform: uppercase; display: block; margin-bottom: 10px;">
                    ACTION REQUIRED
                  </span>
                  <h1 style="font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; color: #ffffff; margin: 0 0 15px 0; line-height: 1.1;">
                    ${isAdmin ? `PAYMENT FAILED FOR ORDER` : "PAYMENT HANDSHAKE FAILED"}
                  </h1>
                  <p style="font-size: 13px; color: #a0a0a0; line-height: 1.6; max-width: 440px; margin: 0 auto; font-weight: 300;">
                    ${isAdmin 
                      ? `Payment authorization failed during Razorpay callback verify for customer order ID: <code>${order.id}</code>.`
                      : "We were unable to verify the online card/UPI payment token for your cinematic streetwear drop. Your selections have been saved in our vault and are ready for retry."}
                  </p>
                </td>
              </tr>

              <!-- details table -->
              <tr>
                <td style="padding: 20px 30px;">
                  <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; margin-bottom: 12px;">
                    <span style="font-size: 10px; font-weight: bold; letter-spacing: 1px; color: #888888; text-transform: uppercase;">
                      Order items pending booking
                    </span>
                  </div>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    ${itemsHtml}
                    <tr style="border-top: 1px solid rgba(255,255,255,0.1);">
                      <td style="padding: 12px 0 0 0; color: #ffffff; font-size: 13px; font-weight: bold; text-transform: uppercase;">Order Total Payable</td>
                      <td style="padding: 12px 0 0 0; text-align: right; color: #D4AF37; font-size: 14px; font-weight: 900;">${money(order.total)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA Retry button -->
              <tr>
                <td align="center" style="padding: 20px 30px 40px 30px;">
                  ${!isAdmin ? `
                    <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 15px; font-size: 12px; color: #888888; text-transform: uppercase; margin-bottom: 25px; line-height: 1.5;">
                      Your drop allocation is reserved for 60 minutes.<br>
                      Click the button below to resume.
                    </div>
                    <a href="${retryUrl}" style="background-color: #B00020; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 16px 36px; border-radius: 30px; display: inline-block; box-shadow: 0 4px 15px rgba(176,0,32,0.3);">
                      RETRY PAYMENT TRANSACTION
                    </a>
                  ` : `
                    <div style="background-color: rgba(176, 0, 32, 0.05); border: 1px solid rgba(176, 0, 32, 0.15); border-radius: 12px; padding: 15px; font-size: 12px; color: #B00020; font-weight: bold; text-transform: uppercase;">
                      Payment status: FAILED | Order saved under pending status
                    </div>
                  `}
                </td>
              </tr>

              <!-- Footer disclaimer -->
              <tr>
                <td style="background-color: #000000; padding: 30px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.03);">
                  <p style="font-size: 11px; color: #666666; margin: 0; line-height: 1.6;">
                    Need help processing payment? Connect with our support deck at <a href="mailto:support@teluguyuvatha.com" style="color: #D4AF37; text-decoration: none;">support@teluguyuvatha.com</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
