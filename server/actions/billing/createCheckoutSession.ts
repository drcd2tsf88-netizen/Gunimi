"use server";

import Stripe from "stripe";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-07-29.dahlia",
  });
}

export async function createCheckoutSession(): Promise<{ url: string } | { error: string }> {
  try {
    const [workspace, user] = await Promise.all([
      getCurrentWorkspace(),
      getUser(),
    ]);

    if (!workspace || !user) return { error: "Unauthorized" };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gunimi.com";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        workspace_id: workspace.id,
        user_id: user.id,
      },
      success_url: `${baseUrl}/dashboard/settings?section=billing&success=1`,
      cancel_url: `${baseUrl}/dashboard/settings?section=billing`,
    });

    if (!session.url) return { error: "Failed to create session" };

    return { url: session.url };
  } catch {
    return { error: "Failed to create checkout session" };
  }
}
