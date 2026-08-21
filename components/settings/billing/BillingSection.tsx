"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle2, CreditCard, ExternalLink, Zap } from "lucide-react";
import { createCheckoutSession } from "@/server/actions/billing/createCheckoutSession";
import { createPortalSession } from "@/server/actions/billing/createPortalSession";
import type { SubscriptionStatus } from "@/server/actions/billing/getSubscription";
import GunimiSection from "@/components/layout/GunimiSection";

type Props = {
  subscription: SubscriptionStatus;
  showSuccess?: boolean;
};

export default function BillingSection({ subscription, showSuccess }: Props) {
  const t = useTranslations("billing");
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    const result = await createCheckoutSession();
    if ("error" in result) { setError(result.error); setLoading(false); return; }
    window.location.href = result.url;
  }

  async function handleManage() {
    setPortalLoading(true);
    const result = await createPortalSession();
    if ("error" in result) { setPortalLoading(false); return; }
    window.location.href = result.url;
  }

  const expiryDate = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : null;

  return (
    <GunimiSection>
      <div className="max-w-lg space-y-4">

        {/* Header */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/30">{t("badge")}</p>
          <h2 className="mt-0.5 text-lg font-semibold text-white">{t("title")}</h2>
        </div>

        {/* Banners */}
        {showSuccess && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
            <p className="text-sm text-emerald-300">{t("successMessage")}</p>
          </div>
        )}
        {subscription.paymentFailed && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5">
            <AlertTriangle size={14} className="shrink-0 text-red-400" />
            <p className="text-sm text-red-300">{t("paymentFailed")}</p>
          </div>
        )}

        {/* Active plan card */}
        {subscription.active && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                <Zap size={15} className="text-violet-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{t("planPro")}</p>
                  {subscription.cancelAtPeriodEnd ? (
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                      {t("statusCanceling")}
                    </span>
                  ) : (
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      {t("statusActive")}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-white/30">
                  {subscription.cancelAtPeriodEnd
                    ? expiryDate
                      ? t("cancelsOn", { date: expiryDate })
                      : t("cancelPending")
                    : expiryDate
                      ? t("renewsOn", { date: expiryDate })
                      : t("subtitle")}
                </p>
              </div>
              <button
                onClick={handleManage}
                disabled={portalLoading}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white/50 transition-all hover:border-white/[0.15] hover:text-white/80 disabled:opacity-40"
              >
                {t("manageSubscription")}
                <ExternalLink size={11} />
              </button>
            </div>
          </div>
        )}

        {/* Free plan + upgrade */}
        {!subscription.active && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                <CreditCard size={15} className="text-white/30" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{t("planAlpha")}</p>
                <p className="text-xs text-white/30">{t("alphaDescription")}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-4">
              <p className="text-sm font-semibold text-white">{t("upgradeTitle")}</p>
              <p className="mt-0.5 text-xs text-white/40">{t("upgradeDescription")}</p>

              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {(t.raw("upgradeFeatures") as string[]).map((f: string) => (
                  <div key={f} className="flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="shrink-0 text-violet-400" />
                    <span className="text-xs text-white/50">{f}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-white">€19</span>
                  <span className="ml-1 text-xs text-white/40">{t("perMonth")}</span>
                </div>
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-violet-500 disabled:opacity-50"
                >
                  {loading ? t("redirecting") : t("subscribeButton")}
                </button>
              </div>
              {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </GunimiSection>
  );
}
