import type { Order, OrderStatus } from "@telugu-yuvatha/shared";

export function getOrderStatusHtml(order: Order, status: OrderStatus | string): { subject: string; html: string } {
  let subject = "";
  let title = "";
  let message = "";
  let alertMessage = "";

  const uppercaseStatus = status.toUpperCase();

  switch (uppercaseStatus) {
    case "PROCESSING":
      subject = "Your Order Is Being Prepared";
      title = "ORDER UNDER PREPARATION";
      message = "Our cinematic logistics vault is packing your premium drop items with maximum care. We'll update you as soon as they dispatch.";
      alertMessage = "STATUS: PREPARING SHIPMENT";
      break;
    case "SHIPPED":
      subject = "Your Order Has Shipped";
      title = "ORDER DISPATCHED";
      message = "Great news! Your cinematic streetwear package has cleared our security docks and is officially in transit to your shipping destination.";
      alertMessage = "STATUS: SHIPPED & EN ROUTE";
      break;
    case "OUT_FOR_DELIVERY":
    case "OUT-FOR-DELIVERY":
      subject = "Your Order Is Out for Delivery";
      title = "OUT FOR DELIVERY";
      message = "Prepare your fit! A shipping agent is carrying your package and expects to reach your destination today.";
      alertMessage = "STATUS: ARRIVING TODAY";
      break;
    case "DELIVERED":
      subject = "Your Order Has Been Delivered";
      title = "ORDER DELIVERED";
      message = "Handshake complete. Your Telugu Yuvatha drop package has been successfully delivered. We hope you enjoy wearing the mass.";
      alertMessage = "STATUS: SUCCESSFUL HANDOFF";
      break;
    case "CANCELLED":
    case "REFUNDED":
      subject = "Your Order Has Been Cancelled";
      title = "ORDER CANCELLATION NOTICE";
      
      const isPaid = order.paymentStatus === "paid" || order.status === "paid";
      if (isPaid) {
        message = "This communication confirms that your order has been cancelled. As your payment was already verified, we have successfully initiated a full refund of your payment. Please expect the credit to settle in your payment account within 5-7 business days.";
        alertMessage = "STATUS: CANCELLED & REFUND INITIATED";
      } else {
        message = "This communication confirms that your order has been successfully cancelled as requested. No cash collection or payment will be processed.";
        alertMessage = "STATUS: CANCELLED";
      }
      break;
    default:
      subject = `Order Status Update: ${status}`;
      title = `ORDER STATUS: ${uppercaseStatus}`;
      message = `Your order status has been updated to ${status}. Log in to your account page or use the track link to view latest specs.`;
      alertMessage = `STATUS: ${uppercaseStatus}`;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="background-color: #080808; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0d0d0d; border: 1px solid rgba(212, 175, 55, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #000000; padding: 30px 20px; border-bottom: 1px solid rgba(255,255,255,0.03);">
                  <div style="font-size: 24px; font-weight: 900; letter-spacing: 4px; color: #ffffff; text-transform: uppercase; margin: 0;">
                    TELUGU YUVATHA
                  </div>
                  <div style="font-size: 9px; font-weight: bold; letter-spacing: 2px; color: #D4AF37; text-transform: uppercase; margin-top: 5px;">
                    STATUS MONITOR
                  </div>
                </td>
              </tr>

              <!-- Greeting Banner -->
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <span style="font-size: 10px; font-weight: 900; letter-spacing: 2px; color: #D4AF37; text-transform: uppercase; display: block; margin-bottom: 10px;">
                    ORDER UPDATE
                  </span>
                  <h1 style="font-size: 26px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; color: #ffffff; margin: 0 0 15px 0; line-height: 1.1;">
                    ${title}
                  </h1>
                  
                  <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 8px 15px; font-size: 11px; font-weight: 900; letter-spacing: 1px; color: #ffffff; display: inline-block; margin-bottom: 25px; text-transform: uppercase;">
                    ORDER #${order.id.slice(-8).toUpperCase()}
                  </div>

                  <p style="font-size: 14px; color: #a0a0a0; line-height: 1.6; max-width: 460px; margin: 0 auto 30px auto; font-weight: 300;">
                    ${message}
                  </p>

                  <div style="background-color: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.15); border-radius: 12px; padding: 15px; text-align: center; color: #D4AF37; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 30px; max-width: 320px; margin-left: auto; margin-right: auto;">
                    ${alertMessage}
                  </div>

                  <!-- CTA buttons -->
                  <a href="https://teluguyuvatha.com/track-order?id=${order.id}&email=${encodeURIComponent(order.shippingAddress.phone)}" style="background-color: #B00020; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 16px 36px; border-radius: 30px; display: inline-block; box-shadow: 0 4px 15px rgba(176,0,32,0.3); transition: all 0.3s;">
                    TRACK LIVE SHIPMENT STATUS
                  </a>
                </td>
              </tr>

              <!-- Footer disclaimer -->
              <tr>
                <td style="background-color: #000000; padding: 30px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.03);">
                  <p style="font-size: 11px; color: #666666; margin: 0; line-height: 1.6;">
                    Need shipment assistance? Connect with our support deck at <a href="mailto:support@teluguyuvatha.com" style="color: #D4AF37; text-decoration: none;">support@teluguyuvatha.com</a>
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

  return { subject, html };
}
