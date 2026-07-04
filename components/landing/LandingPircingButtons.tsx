"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// LandingPricingButtons — Pricing section. GDL v1.0.
// Three tiers. Lots of breathing room. Clear hierarchy.
// No color chaos. Premium and understated.
// ─────────────────────────────────────────────────────────────

const PLANS = [
  {
    name:     "Free",
    price:    "$0",
    period:   null,
    tagline:  "Start building your AI workspace.",
    cta:      "Get started free",
    ctaHref:  "/register",
    featured: false,
    features: [
      "Up to 3 users",
      "500 AI actions / month",
      "Contacts, deals & tasks",
      "Basic automation",
      "AI command center",
    ],
  },
  {
    name:     "Pro",
    price:    "$29",
    period:   "/user/month",
    tagline:  "Unlimited intelligence for growing teams.",
    cta:      "Start free trial",
    ctaHref:  "/register",
    featured: true,
    features: [
      "Unlimited users",
      "Unlimited AI actions",
      "Full automation engine",
      "Memory & context recall",
      "AI agents",
      "Priority support",
    ],
  },
  {
    name:     "Enterprise",
    price:    "Custom",
    period:   null,
    tagline:  "Your operating system. Your rules.",
    cta:      "Talk to sales",
    ctaHref:  "/register",
    featured: false,
    features: [
      "Everything in Pro",
      "Custom AI models",
      "SSO & SCIM",
      "Dedicated infrastructure",
      "SLA guarantee",
      "White-glove onboarding",
    ],
  },
];

export default function LandingPricingButtons() {
  return (
    <section id="pricing" className="relative overflow-hidden px-6 py-32 md:px-12">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.07) 0%, transparent 65%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute left-0 right-0 top-0 h-[1px]"
          style={{ background: "linear-gradient(to right, transparent, rgba(109,91,255,0.10), transparent)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9AA3B2]/60">
            Pricing
          </p>
          <h2 className="text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[52px]">
            Simple pricing.
            <br />
            <span className="text-[#9AA3B2]">No surprises.</span>
          </h2>
        </motion.div>

        {/* PLANS GRID */}
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className={[
                "relative overflow-hidden rounded-[24px] border p-8 transition-all duration-300",
                plan.featured
                  ? "border-[rgba(109,91,255,0.30)] bg-[#0A0E17] shadow-[0_16px_50px_rgba(109,91,255,0.18),0_0_0_1px_rgba(109,91,255,0.10)]"
                  : "border-white/[0.055] bg-[#0A0E17] shadow-[0_4px_20px_rgba(109,91,255,0.06)] hover:border-white/[0.09]",
              ].join(" ")}
            >
              {/* Top sheen */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

              {/* Featured ambient glow */}
              {plan.featured && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "radial-gradient(ellipse at top, rgba(109,91,255,0.08), transparent 55%)" }}
                />
              )}

              <div className="relative z-10">
                {/* Badge */}
                {plan.featured && (
                  <div className="mb-5 inline-flex items-center rounded-full border border-[rgba(109,91,255,0.25)] bg-[rgba(109,91,255,0.10)] px-3 py-1">
                    <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#A998FF]">
                      Most popular
                    </span>
                  </div>
                )}

                {/* Name + Price */}
                <h3 className="text-[17px] font-semibold text-[#F7F8FC]">{plan.name}</h3>
                <div className="mt-5 flex items-end gap-1.5">
                  <span className="text-[44px] font-bold tracking-[-0.05em] text-[#F7F8FC] leading-none">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="mb-1.5 text-[13px] text-[#9AA3B2]/60">{plan.period}</span>
                  )}
                </div>

                {/* Tagline */}
                <p className="mt-3 text-[13px] leading-[1.5] text-[#9AA3B2]">{plan.tagline}</p>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={[
                    "mt-7 flex items-center justify-center gap-2 rounded-[12px] px-5 py-3 text-[13px] font-semibold transition-all duration-300",
                    plan.featured
                      ? "border border-[#6D5BFF]/30 bg-[#6D5BFF] text-white shadow-[0_0_20px_rgba(109,91,255,0.40)] hover:bg-[#7B6BFF] hover:shadow-[0_0_32px_rgba(109,91,255,0.55)]"
                      : "border border-white/[0.09] bg-white/[0.04] text-[#C8CDD8] hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-[#F7F8FC]",
                  ].join(" ")}
                >
                  {plan.cta}
                  <ArrowRight size={13} />
                </Link>

                {/* Features */}
                <div className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <Check size={13} className="shrink-0 text-[#22c55e]" />
                      <span className="text-[13px] text-[#9AA3B2]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FOOTER NOTE */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-10 text-center text-[12px] text-[#9AA3B2]/40"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}
