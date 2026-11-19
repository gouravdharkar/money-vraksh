import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount specified" },
        { status: 400 }
      );
    }

    const keyId =
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If real Razorpay keys are provided, create actual order with Razorpay SDK
    if (
      keyId &&
      keySecret &&
      keyId !== "rzp_test_placeholder" &&
      keySecret !== "placeholder_secret"
    ) {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // amount in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {},
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
      });
    }

    // Fallback for development / mock mode when real keys are not yet configured
    const mockOrderId = `order_test_${Date.now()}`;
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: Math.round(amount * 100),
      currency,
      keyId: keyId || "rzp_test_placeholder",
      isMock: true,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
