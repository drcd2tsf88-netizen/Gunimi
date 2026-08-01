import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-07-29.dahlia",
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const workspaceId = session.metadata?.workspace_id;
    const customerId = session.customer as string;

    if (workspaceId && customerId) {
      const { data: ws } = await supabase
        .from("workspaces")
        .select("preferences")
        .eq("id", workspaceId)
        .maybeSingle();

      const prefs = (ws?.preferences ?? {}) as Record<string, unknown>;
      const updated = { ...prefs, stripeCustomerId: customerId };

      await supabase
        .from("workspaces")
        .update({ preferences: updated })
        .eq("id", workspaceId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;

    const { data: ws } = await supabase
      .from("workspaces")
      .select("id, preferences")
      .eq("preferences->>stripeCustomerId", customerId)
      .maybeSingle();

    if (ws) {
      const prefs = (ws.preferences ?? {}) as Record<string, unknown>;
      const { stripeCustomerId: _, ...rest } = prefs;
      void _;
      await supabase
        .from("workspaces")
        .update({ preferences: rest })
        .eq("id", ws.id);
    }
  }

  if (event.type === "customer.subscription.updated") {
    logger.warn("Stripe subscription updated", { type: event.type });
  }

  return NextResponse.json({ received: true });
}
