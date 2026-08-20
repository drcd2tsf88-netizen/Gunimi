"use server";

import Stripe from "stripe";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { createClient } from "@/lib/supabase/server";

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

    const supabase = await createClient();
    const { data } = await supabase
      .from("workspaces")
      .select("preferences")
      .eq("id", workspace.id)
      .maybeSingle();

    const prefs = ((data?.preferences ?? {}) as Record<string, unknown>);
    const existingCustomerId = prefs.stripeCustomerId as string | undefined;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gunimi.com";
    const stripe = getStripe();

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      metadata: { workspace_id: workspace.id, user_id: user.id },
      success_url: `${baseUrl}/dashboard/settings?section=billing&success=1`,
      cancel_url: `${baseUrl}/dashboard/settings?section=billing`,
    };

    if (existingCustomerId) {
      sessionParams.customer = existingCustomerId;
    } else {
      sessionParams.customer_email = user.email ?? undefined;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    if (!session.url) return { error: "Failed to create session" };

    return { url: session.url };
  } catch {
    return { error: "Failed to create checkout session" };
  }
}
