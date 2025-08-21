import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserFromAuthHeader } from "../../_lib/auth";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_PRO;
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  if (!key || !priceId) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  const user = await getUserFromAuthHeader(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const stripe = new Stripe(key, { apiVersion: "2024-06-20" as const});
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/pricing`
  });
  return NextResponse.json({ url: session.url }, { status: 200 });
}
