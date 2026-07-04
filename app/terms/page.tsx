import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";

export const metadata: Metadata = {
  title: "Terms of Service — Gunimi",
  description: "Terms governing your use of the Gunimi platform.",
  openGraph: {
    title: "Terms of Service — Gunimi",
    description: "Terms governing your use of the Gunimi platform.",
    type: "website",
    url: "https://gunimi.com/terms",
  },
};

const LAST_UPDATED = "June 17, 2026";

export default async function TermsPage() {
  const t = await getTranslations("public.terms");

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">

        {/* AMBIENT */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 h-[360px] w-[560px] -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.05), transparent 65%)", filter: "blur(80px)" }}
          />
        </div>

        {/* HEADER */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-24 md:pt-32">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9AA3B2]/60">{t("badge")}</span>
          </div>
          <h1 className="text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC]">
            {t("headline")}
          </h1>
          <p className="mt-3 text-[14px] text-[#9AA3B2]/50">{t("lastUpdated")} {LAST_UPDATED}</p>
        </section>

        {/* BODY */}
        <section className="relative mx-auto max-w-3xl px-6 pb-32">
          <div className="space-y-10 text-[15px] leading-[1.8] text-[#9AA3B2]">

            <div>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of Gunimi,
                an AI-first workspace operating system (&ldquo;Service&rdquo;) operated by Gunimi
                (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;). By creating an account, you agree to these Terms.
              </p>
              <div className="mt-4 rounded-[14px] border border-amber-500/[0.16] bg-amber-500/[0.05] p-4 text-[14px] text-amber-400/80">
                Gunimi is in private alpha. You have been granted early access to test the platform.
                The Service is provided as-is. Features may change, and data may be reset without
                notice during this period.
              </div>
            </div>

            {[
              {
                title: "1. Eligibility & Account",
                content: (
                  <div className="space-y-3 text-[14px]">
                    <p>You must be at least 18 years old and have the legal capacity to enter into these Terms. By registering, you represent that all information you provide is accurate and complete.</p>
                    <p>You are responsible for maintaining the security of your account credentials. Do not share your password. Notify us immediately at <a href="mailto:support@gunimi.com" className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]">support@gunimi.com</a> if you suspect unauthorized access.</p>
                    <p>One account per person. Sharing accounts between multiple users is not permitted.</p>
                  </div>
                ),
              },
              {
                title: "2. Acceptable Use",
                content: (
                  <div className="text-[14px]">
                    <p className="mb-3">You agree to use Gunimi only for lawful business purposes. You must not:</p>
                    <ul className="space-y-2">
                      {[
                        "Use the Service to store or transmit illegal, harmful, or fraudulent content",
                        "Attempt to circumvent authentication, rate limits, or security controls",
                        "Use automated scripts to scrape, overload, or abuse the Service",
                        "Reverse engineer, decompile, or attempt to extract the source code of the Service",
                        "Resell, sublicense, or otherwise commercialize access to the Service without written permission",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-red-500/40" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3">Violation of these terms may result in immediate account termination.</p>
                  </div>
                ),
              },
              {
                title: "3. Your Data",
                content: (
                  <div className="space-y-3 text-[14px]">
                    <p>You retain ownership of all content and data you create in Gunimi. We do not claim intellectual property rights over your content.</p>
                    <p>You grant Gunimi a limited license to store, process, and display your content solely as necessary to provide the Service to you.</p>
                    <p>During the private alpha, workspace data may be reset, migrated, or permanently deleted as part of development. We will make reasonable efforts to notify registered users in advance of any planned data resets.</p>
                  </div>
                ),
              },
              {
                title: "4. AI Features",
                content: (
                  <div className="space-y-3 text-[14px]">
                    <p>Gunimi includes AI features powered by third-party AI model APIs. When you use these features, relevant content from your workspace may be sent to the AI provider for processing.</p>
                    <p>You are responsible for ensuring that any content you submit through AI features does not violate applicable laws or third-party rights.</p>
                    <p>AI-generated outputs are provided for informational purposes only. We do not guarantee the accuracy, completeness, or suitability of AI-generated content for any purpose.</p>
                  </div>
                ),
              },
              {
                title: "5. Alpha Program",
                content: (
                  <div className="text-[14px]">
                    <p className="mb-3">As a private alpha participant, you acknowledge that:</p>
                    <ul className="space-y-2">
                      {[
                        "The Service is unfinished and may contain bugs, incomplete features, and unstable behavior",
                        "Features shown as \"Coming Soon\" are in development and not yet available",
                        "Your feedback is valuable and may be used to improve the product",
                        "Alpha access may be revoked at any time at our discretion",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#6D5BFF]/50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
              {
                title: "6. Service Availability",
                content: <p className="text-[14px]">We strive for high availability but make no guarantees regarding uptime during the alpha period. The Service may be taken offline for maintenance, updates, or debugging at any time. We will make reasonable efforts to communicate planned downtime via email.</p>,
              },
              {
                title: "7. Disclaimer of Warranties",
                content: <p className="text-[14px] uppercase">The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components.</p>,
              },
              {
                title: "8. Limitation of Liability",
                content: <p className="text-[14px] uppercase">To the fullest extent permitted by law, Gunimi shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, loss of profits, or business interruption, arising from your use of or inability to use the service.</p>,
              },
              {
                title: "9. Termination",
                content: <p className="text-[14px]">Either party may terminate your access to the Service at any time. You may close your account by contacting us at <a href="mailto:support@gunimi.com" className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]">support@gunimi.com</a>. We may suspend your account if you violate these Terms.</p>,
              },
              {
                title: "10. Changes to Terms",
                content: <p className="text-[14px]">We may update these Terms from time to time. We will notify registered users of material changes by email at least 7 days before they take effect. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>,
              },
              {
                title: "11. Contact",
                content: <p className="text-[14px]">For questions about these Terms, contact us at <a href="mailto:support@gunimi.com" className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]">support@gunimi.com</a>.</p>,
              },
            ].map(({ title, content }) => (
              <div key={title}>
                <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{title}</h2>
                {content}
              </div>
            ))}

          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
