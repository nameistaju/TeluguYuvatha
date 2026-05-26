import type { Order } from "@telugu-yuvatha/shared";

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function getOrderConfirmationHtml(order: Order, isAdmin: boolean = false): string {
  const isCod = !order.razorpayOrderId;
  const isPaid = order.paymentStatus === "paid";
  
  const heading = isAdmin 
    ? (isCod ? "NEW COD ORDER RECEIVED" : "NEW PAID ORDER RECEIVED") 
    : (isPaid ? "PAYMENT SUCCESSFUL" : "ORDER CONFIRMED");

  const subHeading = isAdmin
    ? "Review full fulfillment particulars below"
    : (isPaid 
        ? "Payment received. Your cinematic drop is now in production."
        : "Your style is booked. Get ready to wear the mass.");

  const expectedDelivery = "Expected delivery: Within 3-5 business days.";

  // Generate product list HTML
  const itemsHtml = order.items.map(item => `
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 12px 0; color: #ffffff; font-size: 14px; font-weight: bold; text-transform: uppercase;">
        ${item.name}
        <div style="font-size: 10px; color: #888888; margin-top: 4px; letter-spacing: 1px;">
          SIZE: ${item.size} | COLOR: ${item.color} | QTY: ${item.quantity}
        </div>
      </td>
      <td style="padding: 12px 0; text-align: right; color: #D4AF37; font-size: 14px; font-weight: bold;">
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
      <title>${heading}</title>
    </head>
    <body style="background-color: #080808; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; -webkit-text-size-adjust: none;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0d0d0d; border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              
              <!-- Branded Stage Header -->
              <tr>
                <td align="center" style="background-color: #000000; padding: 30px 20px; border-bottom: 1px solid rgba(212, 175, 55, 0.1);">
                  <div style="font-size: 24px; font-weight: 900; letter-spacing: 4px; color: #ffffff; text-transform: uppercase; margin: 0;">
                    TELUGU YUVATHA
                  </div>
                  <div style="font-size: 9px; font-weight: bold; letter-spacing: 2px; color: #D4AF37; text-transform: uppercase; margin-top: 5px;">
                    CINEMATIC STREETWEAR
                  </div>
                </td>
              </tr>

              <!-- Greeting Banner -->
              <tr>
                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                  <span style="font-size: 10px; font-weight: 900; letter-spacing: 2px; color: #D4AF37; text-transform: uppercase;">
                    ${heading}
                  </span>
                  <h1 style="font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; color: #ffffff; margin: 10px 0 15px 0; line-height: 1.1;">
                    ${isAdmin ? `ORDER #${order.id.slice(-8).toUpperCase()}` : "THANK YOU FOR YOUR ORDER"}
                  </h1>
                  <p style="font-size: 13px; color: #a0a0a0; line-height: 1.6; max-width: 400px; margin: 0 auto; font-weight: 300;">
                    ${subHeading}
                  </p>
                </td>
              </tr>

              <!-- Order Summary Block -->
              <tr>
                <td style="padding: 20px 30px;">
                  <div style="border-bottom: 2px solid rgba(255,255,255,0.05); padding-bottom: 10px; margin-bottom: 15px;">
                    <span style="font-size: 11px; font-weight: bold; letter-spacing: 1px; color: #888888; text-transform: uppercase;">
                      Order items
                    </span>
                  </div>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    ${itemsHtml}
                  </table>
                </td>
              </tr>

              <!-- Calculations deck -->
              <tr>
                <td style="padding: 10px 30px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(255,255,255,0.02); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.03);">
                    <tr>
                      <td style="padding: 6px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Subtotal</td>
                      <td style="padding: 6px 0; text-align: right; color: #ffffff; font-size: 12px; font-weight: bold;">${money(order.subtotal)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #888888; font-size: 12px; text-transform: uppercase;">Shipping charges</td>
                      <td style="padding: 6px 0; text-align: right; color: #ffffff; font-size: 12px; font-weight: bold;">${order.shipping === 0 ? "FREE" : money(order.shipping)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #888888; font-size: 12px; text-transform: uppercase;">GST Tax (5%)</td>
                      <td style="padding: 6px 0; text-align: right; color: #ffffff; font-size: 12px; font-weight: bold;">${money(order.tax)}</td>
                    </tr>
                    <tr style="border-top: 1px solid rgba(255,255,255,0.05);">
                      <td style="padding: 12px 0 0 0; color: #ffffff; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Grand Total</td>
                      <td style="padding: 12px 0 0 0; text-align: right; color: #D4AF37; font-size: 16px; font-weight: 900;">${money(order.total)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Transaction particulars -->
              <tr>
                <td style="padding: 20px 30px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; line-height: 1.6;">
                    <tr>
                      <td width="50%" valign="top" style="padding-right: 15px;">
                        <span style="font-weight: bold; color: #888888; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Shipping Destination</span>
                        <div style="color: #ffffff; font-weight: 300;">
                          <strong>${order.shippingAddress.fullName}</strong><br>
                          ${order.shippingAddress.line1}<br>
                          ${order.shippingAddress.line2 ? `${order.shippingAddress.line2}<br>` : ""}
                          ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
                          ${order.shippingAddress.country}
                        </div>
                      </td>
                      <td width="50%" valign="top">
                        <span style="font-weight: bold; color: #888888; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Billing Specs</span>
                        <div style="color: #ffffff; font-weight: 300;">
                          <strong>Payment Method:</strong><br>
                          ${isCod ? "Cash on Delivery (COD)" : "Online Card/UPI"}<br>
                          <strong>Payment Status:</strong><br>
                          ${isPaid ? "PAID" : (isCod ? "COLLECT UPON DELIVERY" : "PENDING")}<br>
                          ${order.razorpayPaymentId ? `<strong>Payment ID:</strong><br><code style="color: #D4AF37; font-size: 11px;">${order.razorpayPaymentId}</code>` : ""}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- expected Delivery timeframe info -->
              <tr>
                <td align="center" style="padding: 10px 30px 40px 30px;">
                  <div style="background-color: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 12px; padding: 15px; text-align: center; color: #D4AF37; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 30px;">
                    ${expectedDelivery}
                  </div>

                  <!-- CTA buttons -->
                  ${!isAdmin ? `
                    <a href="https://teluguyuvatha.com/track-order?id=${order.id}&email=${encodeURIComponent(order.shippingAddress.phone)}" style="background-color: #B00020; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 16px 36px; border-radius: 30px; display: inline-block; box-shadow: 0 4px 15px rgba(176,0,32,0.3); transition: all 0.3s;">
                      Track Order Status
                    </a>
                  ` : ""}
                </td>
              </tr>

              <!-- Footer disclaimer -->
              <tr>
                <td style="background-color: #000000; padding: 30px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.03);">
                  <p style="font-size: 11px; color: #666666; margin: 0; line-height: 1.6;">
                    This is an automated security receipt from Telugu Yuvatha. Please do not reply directly to this mail.<br>
                    Need assistance? Connect with our support deck at <a href="mailto:support@teluguyuvatha.com" style="color: #D4AF37; text-decoration: none;">support@teluguyuvatha.com</a>
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
