"use server";

import Stripe from "stripe";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { createClient } from "@/lib/supabase/server";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-07-29.dahlia",
  });
}

export type SubscriptionStatus = {
  active: boolean;
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
};

export async function getSubscription(): Promise<SubscriptionStatus> {
  const empty: SubscriptionStatus = {
    active: false,
    status: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    stripeCustomerId: null,
  };

  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return empty;

    const supabase = await createClient();
    const { data } = await supabase
      .from("workspaces")
      .select("preferences")
      .eq("id", workspace.id)
      .maybeSingle();

    const prefs = (data?.preferences ?? {}) as Record<string, unknown>;
    const customerId = prefs.stripeCustomerId as string | undefined;

    if (!customerId) return empty;

    const stripe = getStripe();
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 1,
    });

    const sub = subscriptions.data[0];
    if (!sub) return { ...empty, stripeCustomerId: customerId };

    return {
      active: sub.status === "active" || sub.status === "trialing",
      status: sub.status,
      currentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: (sub as unknown as { cancel_at_period_end: boolean }).cancel_at_period_end,
      stripeCustomerId: customerId,
    };
  } catch {
    return empty;
  }
}
