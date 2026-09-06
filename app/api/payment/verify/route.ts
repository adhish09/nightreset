import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { createEntitlementForPayment } from "@/lib/entitlement";

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const isValidSignature = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValidSignature) {
    return NextResponse.json({ error: "SIGNATURE_INVALID" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: payment, error: fetchError } = await supabase
    .from("payments")
    .select("*")
    .eq("razorpay_order_id", razorpay_order_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !payment) {
    return NextResponse.json({ error: "PAYMENT_NOT_FOUND" }, { status: 404 });
  }

  if (payment.status !== "paid") {
    await supabase
      .from("payments")
      .update({ status: "paid", razorpay_payment_id })
      .eq("id", payment.id);
  }

  const entitlement = await createEntitlementForPayment(user.id, payment.id);
  if (!entitlement) {
    return NextResponse.json(
      { error: "ENTITLEMENT_FAILED", message: "Payment succeeded but activation failed. We'll fix this shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, expiresAt: entitlement.expires_at });
}
