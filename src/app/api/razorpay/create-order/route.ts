import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST() {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: 5000,
      currency: "INR",
      receipt: `KarrierHub_${Date.now()}`,
      notes: {
        product: "KarrierHub Plus Unlock",
      },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Order creation failed" },
      { status: 500 }
    );
  }
}