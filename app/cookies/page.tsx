import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";

export const metadata: Metadata = {
  title: "Cookie Policy — Gunimi",
  description: "How Gunimi uses cookies and similar technologies on its website and application.",
  openGraph: {
    title: "Cookie Policy — Gunimi",
    description: "How Gunimi uses cookies and similar technologies on its website and application.",
    type: "website",
    url: "https://gunimi.com/cookies",
  },
};

const LAST_UPDATED = "June 2026";

export default async function CookiesPage() {
  const t = await getTranslations("public.cookies");

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">

        {/* AMBIENT */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 h-[380px] w-[600px] -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.06), transparent 65%)", filter: "blur(80px)" }}
          />
        </div>

        {/* HEADER */}
        <section className="relative mx-auto max-w-3xl px-6 pb-14 pt-24 md:pt-32">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9AA3B2]/60">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC]">
            {t("headline")}
          </h1>
          <p className="mt-3 text-[14px] text-[#9AA3B2]/50">
            {t("lastUpdated")} {LAST_UPDATED}
          </p>
        </section>

        {/* BODY */}
        <section className="relative mx-auto max-w-3xl px-6 pb-32">
          <div className="space-y-10 text-[15px] leading-[1.8] text-[#9AA3B2]">

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section1Title")}
              </h2>
              <p>{t("section1Body")}</p>
            </div>

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section2Title")}
              </h2>
              <p className="mb-4">{t("section2Body")}</p>
              <div className="overflow-hidden rounded-[16px] border border-white/[0.055] bg-[#0A0E17]">
                <table className="w-full text-[13.5px]">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="px-5 py-4 text-left font-semibold text-[#C8CDD8]">{t("tableHeaderCookie")}</th>
                      <th className="px-5 py-4 text-left font-semibold text-[#C8CDD8]">{t("tableHeaderPurpose")}</th>
                      <th className="px-5 py-4 text-left font-semibold text-[#C8CDD8]">{t("tableHeaderDuration")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {[
                      { name: "sb-access-token",       purposeKey: "tableRow1Purpose", durationKey: "tableRow1Duration" },
                      { name: "sb-refresh-token",      purposeKey: "tableRow2Purpose", durationKey: "tableRow2Duration" },
                      { name: "gunimi_cookie_consent", purposeKey: "tableRow3Purpose", durationKey: "tableRow3Duration" },
                    ].map(({ name, purposeKey, durationKey }) => (
                      <tr key={name}>
                        <td className="px-5 py-3.5 font-mono text-[12.5px] text-[#8B7DFF]/70">{name}</td>
                        <td className="px-5 py-3.5 text-[#9AA3B2]">{t(purposeKey as Parameters<typeof t>[0])}</td>
                        <td className="px-5 py-3.5 text-[#9AA3B2]/60">{t(durationKey as Parameters<typeof t>[0])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section3Title")}
              </h2>
              <p>{t("section3Body1")}</p>
              <p className="mt-3">{t("section3Body2")}</p>
            </div>

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section4Title")}
              </h2>
              <p>
                {t("section4Body")}{" "}
                <code className="rounded-[5px] border border-white/[0.07] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[12px] text-[#8B7DFF]/70">
                  gunimi_cookie_consent
                </code>
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section5Title")}
              </h2>
              <p>{t("section5Body")}</p>
            </div>

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section6Title")}
              </h2>
              <p>{t("section6Body")}</p>
            </div>

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section7Title")}
              </h2>
              <p>
                {t("section7Body")}{" "}
                <a
                  href="mailto:privacy@gunimi.com"
                  className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]"
                >
                  privacy@gunimi.com
                </a>
              </p>
            </div>

          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
