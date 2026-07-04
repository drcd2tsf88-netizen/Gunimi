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
              <p>
                Cookies are small text files stored on your device when you visit a website
                or use a web application. They allow the application to remember your preferences,
                keep you signed in, and function correctly across page loads.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section2Title")}
              </h2>
              <p className="mb-4">
                Gunimi uses a minimal set of cookies. We do not use advertising cookies.
                We do not use third-party tracking cookies. We do not sell or share cookie
                data with advertising networks.
              </p>
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
                      ["sb-access-token", "Supabase authentication session", "Session"],
                      ["sb-refresh-token", "Supabase session refresh", "30 days"],
                      ["gunimi_cookie_consent", "Records your cookie consent choice", "1 year"],
                    ].map(([name, purpose, duration]) => (
                      <tr key={name}>
                        <td className="px-5 py-3.5 font-mono text-[12.5px] text-[#8B7DFF]/70">{name}</td>
                        <td className="px-5 py-3.5 text-[#9AA3B2]">{purpose}</td>
                        <td className="px-5 py-3.5 text-[#9AA3B2]/60">{duration}</td>
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
              <p>
                The cookies listed above are all classified as <strong className="font-medium text-[#C8CDD8]">essential cookies</strong>.
                They are required for the application to function. Without them, you cannot
                sign in or use the product.
              </p>
              <p className="mt-3">
                Gunimi does not currently use non-essential cookies such as analytics cookies,
                preference cookies unrelated to authentication, or marketing cookies.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section4Title")}
              </h2>
              <p>
                In addition to cookies, we store a small amount of data in your browser&apos;s
                local storage. This includes your cookie consent preference (key:{" "}
                <code className="rounded-[5px] border border-white/[0.07] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[12px] text-[#8B7DFF]/70">
                  gunimi_cookie_consent
                </code>
                ) and certain UI state preferences. This data stays on your device and is
                not transmitted to our servers.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section5Title")}
              </h2>
              <p>
                You can control cookies through your browser settings. Note that disabling
                authentication cookies will prevent you from signing in to Gunimi. Most
                browsers allow you to view, delete and block cookies via their settings pages.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section6Title")}
              </h2>
              <p>
                We will update this page if our cookie usage changes. The date at the top
                of this page reflects when the policy was last revised.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("section7Title")}
              </h2>
              <p>
                Questions about this policy?{" "}
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
