"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle2, CreditCard, ExternalLink, Gem, Lock, Sparkles, Zap } from "lucide-react";
import { createPortalSession } from "@/server/actions/billing/createPortalSession";
import { createFounderCheckoutSession } from "@/server/actions/billing/createFounderCheckoutSession";
import type { SubscriptionStatus } from "@/server/actions/billing/getSubscription";
import GunimiSection from "@/components/layout/GunimiSection";

type Props = {
  subscription: SubscriptionStatus;
  showSuccess?: boolean;
  showFounderSuccess?: boolean;
};

export default function BillingSection({ subscription, showSuccess, showFounderSuccess }: Props) {
  const t = useTranslations("billing");
  const [founderLoading, setFounderLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFounder() {
    setFounderLoading(true);
    setError(null);
    const result = await createFounderCheckoutSession();
    if ("error" in result) { setError(result.error); setFounderLoading(false); return; }
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

        {/* Beta banner */}
        <div className="flex items-center gap-2.5 rounded-xl border border-violet-500/20 bg-violet-500/[0.07] px-3.5 py-2.5">
          <Sparkles size={13} className="shrink-0 text-violet-400" />
          <p className="text-sm text-violet-300">{t("betaBanner")}</p>
        </div>

        {/* Success banners */}
        {(showSuccess || showFounderSuccess) && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
            <p className="text-sm text-emerald-300">
              {showFounderSuccess ? t("founderSuccessMessage") : t("successMessage")}
            </p>
          </div>
        )}

        {/* Payment failed */}
        {subscription.paymentFailed && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5">
            <AlertTriangle size={14} className="shrink-0 text-red-400" />
            <p className="text-sm text-red-300">{t("paymentFailed")}</p>
          </div>
        )}

        {/* Active Pro subscription */}
        {subscription.active && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                <Zap size={15} className="text-violet-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{t("planPro")}</p>
                  {subscription.founderPlan && (
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                      {t("founderBadge")}
                    </span>
                  )}
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
                    ? expiryDate ? t("cancelsOn", { date: expiryDate }) : t("cancelPending")
                    : expiryDate ? t("renewsOn", { date: expiryDate }) : t("subtitle")}
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

        {/* Beta access card (no active sub) */}
        {!subscription.active && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                <CreditCard size={15} className="text-white/30" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{t("planBeta")}</p>
                  {subscription.founderPlan && (
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                      {t("founderBadge")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/30">{t("betaDescription")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Founder plan — active */}
        {subscription.founderPlan && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                <Gem size={15} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t("founderActive")}</p>
                <p className="text-xs text-white/30">{t("founderActiveDescription")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Founder plan — CTA (not yet founder) */}
        {!subscription.founderPlan && (
          <div className="rounded-2xl border border-amber-500/[0.15] bg-amber-500/[0.04] p-4">
            <div className="mb-3 flex items-center gap-2">
              <Gem size={14} className="text-amber-400" />
              <p className="text-sm font-semibold text-white">{t("founderTitle")}</p>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-white/40">{t("founderDescription")}</p>
            <div className="mb-4 grid grid-cols-2 gap-1.5">
              {(t.raw("founderFeatures") as string[]).map((f: string) => (
                <div key={f} className="flex items-center gap-1.5">
                  <CheckCircle2 size={11} className="shrink-0 text-amber-400" />
                  <span className="text-xs text-white/50">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-white">{t("founderPrice")}</span>
                <span className="ml-1.5 text-xs text-white/30">{t("founderOneTime")}</span>
              </div>
              <button
                onClick={handleFounder}
                disabled={founderLoading}
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-300 transition-all hover:bg-amber-500/20 hover:text-amber-200 disabled:opacity-50"
              >
                {founderLoading ? t("founderRedirecting") : t("founderButton")}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </div>
        )}

        {/* Pro plan — coming at launch */}
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.01] p-4 opacity-60">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
              <Lock size={15} className="text-white/20" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white/50">{t("planPro")}</p>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white/30">
                  {t("proComingSoon")}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-white/20">{t("proDescription")}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-lg font-bold text-white/30">{t("proPrice")}</span>
              <span className="ml-1 text-xs text-white/20">{t("perMonth")}</span>
            </div>
          </div>
        </div>

      </div>
    </GunimiSection>
  );
}
