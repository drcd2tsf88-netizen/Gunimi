import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PublicLayout from "@/components/public/PublicLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Gunimi",
  description: "How Gunimi collects, uses, and protects your personal data.",
  openGraph: {
    title: "Privacy Policy — Gunimi",
    description: "How Gunimi collects, uses, and protects your personal data.",
    type: "website",
    url: "https://gunimi.com/privacy",
  },
};

const LAST_UPDATED = "September 21, 2026";

export default async function PrivacyPage() {
  const t = await getTranslations("public.privacy");
  const legalBasisItems = t.raw("legalBasisItems") as string[];
  const s2Items = t.raw("s2Items") as string[];
  const s4Rights = t.raw("s4Rights") as string[];
  const s5Services = t.raw("s5Services") as Array<{ name: string; body: string }>;
  const s10GoogleScopes = t.raw("s10GoogleScopes") as string[];
  const s10GoogleProhibitions = t.raw("s10GoogleProhibitions") as string[];

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">

        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 h-[360px] w-[560px] -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.05), transparent 65%)", filter: "blur(80px)" }}
          />
        </div>

        {/* HEADER */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-24 md:pt-32">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9AA3B2]/60">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC]">
            {t("headline")}
          </h1>
          <p className="mt-3 text-[14px] text-[#9AA3B2]/50">{t("lastUpdated")} {LAST_UPDATED}</p>
        </section>

        {/* BODY */}
        <section className="relative mx-auto max-w-3xl px-6 pb-32">
          <div className="space-y-10 text-[15px] leading-[1.8] text-[#9AA3B2]">

            {/* Intro + Alpha notice */}
            <div>
              <p>{t("intro")}</p>
              <div className="mt-4 rounded-[14px] border border-amber-500/[0.16] bg-amber-500/[0.05] p-4 text-[14px] text-amber-400/80">
                {t("alphaNote")}
              </div>
            </div>

            {/* Data Controller */}
            <div>
              <h2 className="mb-3 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("controllerTitle")}
              </h2>
              <div className="rounded-[12px] border border-white/[0.055] bg-[#0A0E17] p-4 text-[14px]">
                {t("controllerBody")}
              </div>
            </div>

            {/* Legal Basis */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
                {t("legalBasisTitle")}
              </h2>
              <p className="mb-3 text-[14px]">{t("legalBasisIntro")}</p>
              <ul className="space-y-2">
                {legalBasisItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px]">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#6D5BFF]/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 1 - Data We Collect */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{t("s1Title")}</h2>
              <div className="space-y-4 text-[14px]">
                {[
                  { heading: t("s1AccountHeading"), body: t("s1AccountBody") },
                  { heading: t("s1WorkspaceHeading"), body: t("s1WorkspaceBody") },
                  { heading: t("s1UsageHeading"), body: t("s1UsageBody") },
                  { heading: t("s1TechHeading"), body: t("s1TechBody") },
                ].map(({ heading, body }) => (
                  <div key={heading}>
                    <p className="font-medium text-[#C8CDD8]">{heading}</p>
                    <p className="mt-1">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2 - How We Use */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{t("s2Title")}</h2>
              <ul className="space-y-2 text-[14px]">
                {s2Items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#6D5BFF]/50" />
                    {item}
                  </li>
                ))}
                <li className="mt-2 text-[#9AA3B2]/50">{t("s2NoSell")}</li>
              </ul>
            </div>

            {/* 3 - Storage & Security */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{t("s3Title")}</h2>
              <div className="space-y-3 text-[14px]">
                <p>{t("s3Body1")}</p>
                <p>{t("s3Body2")}</p>
                <div className="rounded-[12px] border border-white/[0.055] bg-[#0A0E17] p-4">
                  <span className="font-medium text-[#C8CDD8]">{t("s3CommitmentLabel")} </span>
                  {t("s3CommitmentBody")}
                </div>
              </div>
            </div>

            {/* 4 - Your Rights */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{t("s4Title")}</h2>
              <div className="space-y-3 text-[14px]">
                <p>{t("s4Intro")}</p>
                <ul className="space-y-2">
                  {s4Rights.map((r) => (
                    <li key={r} className="flex items-start gap-2.5">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#6D5BFF]/50" />
                      {r}
                    </li>
                  ))}
                </ul>
                <p>
                  {t("s4ContactIntro")}{" "}
                  <a href="mailto:support@gunimi.com" className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]">
                    support@gunimi.com
                  </a>
                  {t("s4ContactSuffix")}
                </p>
              </div>
            </div>

            {/* 5 - AI & Third-Party Processors */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{t("s5Title")}</h2>
              <div className="space-y-4 text-[14px]">
                {s5Services.map(({ name, body }) => (
                  <div key={name}>
                    <p className="font-medium text-[#C8CDD8]">{name}</p>
                    <p className="mt-1">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6 - International Transfers */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{t("s6Title")}</h2>
              <p className="text-[14px]">{t("s6Body")}</p>
            </div>

            {/* 7 - Data Retention */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{t("s7Title")}</h2>
              <p className="text-[14px]">{t("s7Body")}</p>
            </div>

            {/* 8 - Cookies */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{t("s8Title")}</h2>
              <p className="text-[14px]">
                {t("s8Body")}{" "}
                <a href="/cookies" className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]">
                  {t("s8LinkLabel")}
                </a>
              </p>
            </div>

            {/* 9 - Supervisory Authority */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{t("s9Title")}</h2>
              <p className="text-[14px]">{t("s9Body")}</p>
            </div>

            {/* 10 - Google API */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{t("s10Title")}</h2>
              <div className="space-y-4 text-[14px]">
                <div className="rounded-[14px] border border-[#6D5BFF]/[0.15] bg-[#6D5BFF]/[0.05] p-4 text-[13px] leading-[1.75]">
                  <p className="font-medium text-[#C8CDD8]">{t("s10LimitedUseLabel")}</p>
                  <p className="mt-1 text-[#9AA3B2]">
                    {t("s10LimitedUseBody")}{" "}
                    <a
                      href="https://developers.google.com/terms/api-services-user-data-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]"
                    >
                      {t("s10GooglePolicyLink")}
                    </a>
                  </p>
                </div>
                <p>{t("s10GoogleScopesIntro")}</p>
                <ul className="space-y-2">
                  {s10GoogleScopes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#6D5BFF]/50" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p>{t("s10GoogleProhibitionsIntro")}</p>
                <ul className="space-y-2">
                  {s10GoogleProhibitions.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#6D5BFF]/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 11 - Contact */}
            <div>
              <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{t("s11Title")}</h2>
              <p className="text-[14px]">
                {t("s11Body")}{" "}
                <a href="mailto:support@gunimi.com" className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]">
                  support@gunimi.com
                </a>.
              </p>
            </div>

          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
