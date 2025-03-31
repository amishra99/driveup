import Razorpay from "razorpay";
import type { NextApiRequest, NextApiResponse } from "next";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!, // set in .env.local
  key_secret: process.env.RAZORPAY_KEY_SECRET!, // set in .env.local
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { amount } = JSON.parse(req.body); // amount in ₹
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert ₹ to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: "Error creating Razorpay order" });
  }
}
