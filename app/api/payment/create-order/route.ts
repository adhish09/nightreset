import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { createRazorpayOrder, NIGHTRESET_PASS_PRICE_INR } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  try {
    const order = await createRazorpayOrder(user.id);

    const supabase = createAdminClient();
    const { error } = await supabase.from("payments").insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      status: "created",
      amount: NIGHTRESET_PASS_PRICE_INR * 100,
    });

    if (error) {
      throw new Error("PAYMENT_ROW_CREATE_FAILED");
    }

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("create-order failed", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json(
      { error: "ORDER_FAILED", message: "We couldn't start checkout. Please try again." },
      { status: 502 }
    );
  }
}
