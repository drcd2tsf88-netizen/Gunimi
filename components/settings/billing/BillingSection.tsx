"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, CreditCard, Zap } from "lucide-react";
import { createCheckoutSession } from "@/server/actions/billing/createCheckoutSession";
import type { SubscriptionStatus } from "@/server/actions/billing/getSubscription";
import GunimiSection from "@/components/layout/GunimiSection";

type Props = {
  subscription: SubscriptionStatus;
  showSuccess?: boolean;
};

export default function BillingSection({ subscription, showSuccess }: Props) {
  const t = useTranslations("billing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    const result = await createCheckoutSession();
    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }
    window.location.href = result.url;
  }

  return (
    <GunimiSection>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/30">
            {t("badge")}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">{t("title")}</h2>
          <p className="mt-1 text-sm text-white/40">{t("subtitle")}</p>
        </div>

        {/* Success banner */}
        {showSuccess && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <p className="text-sm text-emerald-300">{t("successMessage")}</p>
          </div>
        )}

        {/* Current plan card */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs text-white/40">{t("currentPlan")}</p>
              <p className="text-base font-semibold text-white">
                {subscription.active ? t("planPro") : t("planAlpha")}
              </p>
              {subscription.active && subscription.currentPeriodEnd && (
                <p className="text-xs text-white/30">
                  {t("renewsOn", {
                    date: new Date(subscription.currentPeriodEnd).toLocaleDateString(),
                  })}
                </p>
              )}
              {!subscription.active && (
                <p className="text-xs text-white/30">{t("alphaDescription")}</p>
              )}
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04]">
              {subscription.active ? (
                <Zap size={16} className="text-violet-400" />
              ) : (
                <CreditCard size={16} className="text-white/30" />
              )}
            </div>
          </div>
        </div>

        {/* Upgrade section */}
        {!subscription.active && (
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-5">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-white">{t("upgradeTitle")}</p>
                <p className="mt-1 text-sm text-white/40">{t("upgradeDescription")}</p>
              </div>

              <div className="space-y-2">
                {(t.raw("upgradeFeatures") as string[]).map((feature: string) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <CheckCircle2 size={13} className="shrink-0 text-violet-400" />
                    <span className="text-sm text-white/60">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-2xl font-bold text-white">€19</span>
                  <span className="ml-1 text-sm text-white/40">{t("perMonth")}</span>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-violet-500 disabled:opacity-50"
                >
                  {loading ? t("redirecting") : t("subscribeButton")}
                </button>
              </div>

              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
            </div>
          </div>
        )}

        {/* Active subscription info */}
        {subscription.active && (
          <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
            <p className="text-xs text-white/30">{t("manageBilling")}</p>
          </div>
        )}
      </div>
    </GunimiSection>
  );
}
