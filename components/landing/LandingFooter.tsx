"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import AiCore from "@/components/ui/AiCore";

function NavGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#9AA3B2]/35">
        {title}
      </p>
      <ul className="space-y-2">
        {links.map(({ label, href }) => (
          <li key={href}>
            {href.startsWith("#") ? (
              <a href={href} className="text-[13px] text-[#9AA3B2]/55 transition-colors duration-200 hover:text-[#9AA3B2]">
                {label}
              </a>
            ) : (
              <Link href={href} className="text-[13px] text-[#9AA3B2]/55 transition-colors duration-200 hover:text-[#9AA3B2]">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function LandingFooter() {
  const t = useTranslations("landing.footer");
  const tNav = useTranslations("landing.nav");

  const PRODUCT_LINKS = [
    { label: t("links.features"),  href: "#systems" },
    { label: t("links.ai"),        href: "#ai" },
    { label: t("links.pricing"),   href: "#pricing" },
    { label: t("links.changelog"), href: "/changelog" },
    { label: t("links.roadmap"),   href: "/roadmap" },
  ];

  const COMPANY_LINKS = [
    { label: t("links.about"),   href: "/about" },
    { label: t("links.press"),   href: "/press" },
    { label: t("links.contact"), href: "/contact" },
    { label: t("links.brand"),   href: "/brand" },
  ];

  const LEGAL_LINKS = [
    { label: t("links.privacy"),         href: "/privacy" },
    { label: t("links.terms"),           href: "/terms" },
    { label: t("links.cookies"),         href: "/cookies" },
    { label: t("links.security"),        href: "/security" },
    { label: t("links.aiTransparency"),  href: "/ai-transparency" },
  ];

  return (
    <footer className="relative border-t border-white/[0.04] bg-[#05060A] px-6 py-16">
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[200px]"
        style={{ background: "radial-gradient(ellipse at top center, rgba(109,91,255,0.05), transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* MAIN GRID */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]">

          {/* BRAND */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <AiCore size={28} showRings={false} showParticles={false} intensity="medium" />
              <div>
                <p className="text-[14px] font-semibold text-[#F7F8FC]">Gunimi</p>
                <p className="text-[11px] text-[#9AA3B2]/45">{t("tagline")}</p>
              </div>
            </div>
            <p className="max-w-[26ch] text-[13px] leading-[1.65] text-[#9AA3B2]/40">
              {t("description")}
            </p>
          </div>

          <NavGroup title={t("groups.product")} links={PRODUCT_LINKS} />
          <NavGroup title={t("groups.company")} links={COMPANY_LINKS} />
          <NavGroup title={t("groups.legal")}   links={LEGAL_LINKS} />

        </div>

        {/* BOTTOM ROW */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.04] pt-8 text-[12px] text-[#9AA3B2]/35 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright")}</p>
          <div className="flex items-center gap-5">
            <Link href="/login"    className="transition-colors hover:text-[#9AA3B2]/60">{tNav("signIn")}</Link>
            <Link href="/register" className="transition-colors hover:text-[#9AA3B2]/60">{tNav("getStarted")}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
