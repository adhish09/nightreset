import Razorpay from "razorpay";
import crypto from "crypto";

export const NIGHTRESET_PASS_PRICE_INR = 30;

let instance: Razorpay | null = null;

function getRazorpayInstance(): Razorpay {
  if (!instance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new Error("PAYMENTS_NOT_CONFIGURED");
    }
    instance = new Razorpay({ key_id, key_secret });
  }
  return instance;
}

export async function createRazorpayOrder(userId: string) {
  const razorpay = getRazorpayInstance();
  const amountInPaise = NIGHTRESET_PASS_PRICE_INR * 100;

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `nr_${userId.slice(0, 8)}_${Date.now()}`,
    notes: { user_id: userId, product: "nightreset_7day_pass" },
  });

  return order;
}

export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("PAYMENTS_NOT_CONFIGURED");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  return timingSafeEqual(expected, params.signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  // Webhook payloads are signed with the separate webhook secret configured
  // in the Razorpay dashboard — not the API key secret used for checkout verification.
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("PAYMENTS_NOT_CONFIGURED");

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
