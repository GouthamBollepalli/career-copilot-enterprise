import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buildContainer } from "@bootstrap/container";
import type { ProfilePort } from "@domain/ports/profile.port";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  const stripe = new Stripe(key, { apiVersion: "2024-06-20" as const });

  const buf = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, secret);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id as string | null;
    if (userId) {
      const c = buildContainer();
      await c.resolve<ProfilePort>("ProfilePort").setPro({ userId, isPro: true });
    }
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
