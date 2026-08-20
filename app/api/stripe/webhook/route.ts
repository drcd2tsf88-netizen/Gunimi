import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-07-29.dahlia",
  });
}

async function findWorkspaceByCustomer(customerId: string) {
  const { data } = await supabaseAdmin
    .from("workspaces")
    .select("id, preferences")
    .eq("preferences->>stripeCustomerId", customerId)
    .maybeSingle();
  return data;
}

async function patchPreferences(workspaceId: string, patch: Record<string, unknown>) {
  const { data } = await supabaseAdmin
    .from("workspaces")
    .select("preferences")
    .eq("id", workspaceId)
    .maybeSingle();

  const prefs = ((data?.preferences ?? {}) as Record<string, unknown>);
  await supabaseAdmin
    .from("workspaces")
    .update({ preferences: { ...prefs, ...patch } })
    .eq("id", workspaceId);
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

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const workspaceId = session.metadata?.workspace_id;
        const customerId = session.customer as string;

        if (workspaceId && customerId) {
          await patchPreferences(workspaceId, {
            stripeCustomerId: customerId,
            stripeStatus: "active",
            stripePaymentFailed: false,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const ws = await findWorkspaceByCustomer(customerId);
        if (ws) {
          await patchPreferences(ws.id, {
            stripeStatus: sub.status,
            stripeCancelAtPeriodEnd: (sub as unknown as { cancel_at_period_end: boolean }).cancel_at_period_end,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const ws = await findWorkspaceByCustomer(customerId);
        if (ws) {
          const prefs = ((ws.preferences ?? {}) as Record<string, unknown>);
          const { stripeCustomerId: _, ...rest } = prefs;
          void _;
          await supabaseAdmin
            .from("workspaces")
            .update({ preferences: { ...rest, stripeStatus: "canceled", stripePaymentFailed: false } })
            .eq("id", ws.id);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const ws = await findWorkspaceByCustomer(customerId);
        if (ws) {
          await patchPreferences(ws.id, { stripePaymentFailed: true, stripeStatus: "past_due" });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const ws = await findWorkspaceByCustomer(customerId);
        if (ws) {
          await patchPreferences(ws.id, { stripePaymentFailed: false, stripeStatus: "active" });
        }
        break;
      }
    }
  } catch (err) {
    logger.error("Stripe webhook handler failed:", err);
  }

  return NextResponse.json({ received: true });
}
