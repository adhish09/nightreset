import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { createEntitlementForPayment } from "@/lib/entitlement";

export const runtime = "nodejs";

/**
 * Backup path for entitlement activation in case the client never completes
 * the /api/payment/verify round trip (closed tab, network drop, etc).
 * Idempotent: createEntitlementForPayment is keyed on payment.id, and a
 * payment already marked "paid" is left alone.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string } } };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const paymentEntity = event.payload?.payment?.entity;

  if (
    (event.event === "payment.captured" || event.event === "order.paid") &&
    paymentEntity?.order_id &&
    paymentEntity?.id
  ) {
    const supabase = createAdminClient();
    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("razorpay_order_id", paymentEntity.order_id)
      .maybeSingle();

    if (payment && payment.status !== "paid") {
      await supabase
        .from("payments")
        .update({ status: "paid", razorpay_payment_id: paymentEntity.id })
        .eq("id", payment.id);
    }

    if (payment) {
      await createEntitlementForPayment(payment.user_id, payment.id);
    }
  }

  return NextResponse.json({ received: true });
}
