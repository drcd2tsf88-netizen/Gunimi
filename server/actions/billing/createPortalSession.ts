"use server";

import Stripe from "stripe";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { createClient } from "@/lib/supabase/server";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-07-29.dahlia",
  });
}

export async function createPortalSession(): Promise<{ url: string } | { error: string }> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return { error: "Unauthorized" };

    const supabase = await createClient();
    const { data } = await supabase
      .from("workspaces")
      .select("preferences")
      .eq("id", workspace.id)
      .maybeSingle();

    const prefs = (data?.preferences ?? {}) as Record<string, unknown>;
    const customerId = prefs.stripeCustomerId as string | undefined;

    if (!customerId) return { error: "No active subscription found" };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gunimi.com";
    const stripe = getStripe();

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard/settings?section=billing`,
    });

    return { url: session.url };
  } catch {
    return { error: "Failed to create portal session" };
  }
}
