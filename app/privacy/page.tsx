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

const LAST_UPDATED = "June 17, 2026";

export default async function PrivacyPage() {
  const t = await getTranslations("public.privacy");

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

            <div>
              <p>
                Gunimi (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates an AI-first workspace
                operating system for business teams. This Privacy Policy explains what data we collect,
                how we use it, and your rights as a user. By creating an account you agree to the
                practices described here.
              </p>
              <div className="mt-4 rounded-[14px] border border-amber-500/[0.16] bg-amber-500/[0.05] p-4 text-[14px] text-amber-400/80">
                Gunimi is currently in private alpha. Features, data practices, and this policy may
                evolve. We will notify registered users of material changes by email.
              </div>
            </div>

            {[
              {
                title: "1. Data We Collect",
                content: (
                  <div className="space-y-4 text-[14px]">
                    <div>
                      <p className="font-medium text-[#C8CDD8]">Account Information</p>
                      <p className="mt-1">When you register, we collect your email address, full name, and any profile information you choose to provide (job title, avatar).</p>
                    </div>
                    <div>
                      <p className="font-medium text-[#C8CDD8]">Workspace Data</p>
                      <p className="mt-1">All content you create inside Gunimi — companies, contacts, deals, notes, tasks, and activity records — is stored in your workspace and associated with your account.</p>
                    </div>
                    <div>
                      <p className="font-medium text-[#C8CDD8]">Usage Activity</p>
                      <p className="mt-1">We record workspace activity events (e.g. &ldquo;deal created&rdquo;, &ldquo;task completed&rdquo;) to power your activity feed and workspace analytics.</p>
                    </div>
                    <div>
                      <p className="font-medium text-[#C8CDD8]">Technical Data</p>
                      <p className="mt-1">Standard server logs including IP addresses, browser type, and request timestamps for security and debugging purposes.</p>
                    </div>
                  </div>
                ),
              },
              {
                title: "2. How We Use Your Data",
                content: (
                  <ul className="space-y-2 text-[14px]">
                    {[
                      "To provide and operate the Gunimi platform",
                      "To authenticate your identity and secure your workspace",
                      "To power AI features: note content may be sent to AI model providers to generate summaries and insights (see Section 4)",
                      "To send transactional emails (workspace invites, verification) via Postmark",
                      "To improve the product during the alpha period based on usage patterns",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#6D5BFF]/50" />
                        {item}
                      </li>
                    ))}
                    <li className="text-[#9AA3B2]/50">We do not sell your data. We do not use your data for advertising.</li>
                  </ul>
                ),
              },
              {
                title: "3. Data Storage & Security",
                content: (
                  <div className="space-y-3 text-[14px]">
                    <p>Your data is stored in Supabase, a managed PostgreSQL platform. Data may be stored in the EU depending on your region. We enforce row-level security (RLS) so that workspace data is only accessible to authenticated members of that workspace.</p>
                    <p>Authentication is handled by Supabase Auth using email and password. Passwords are never stored in plain text. All connections are encrypted via TLS 1.3.</p>
                    <div className="rounded-[12px] border border-white/[0.055] bg-[#0A0E17] p-4">
                      <span className="font-medium text-[#C8CDD8]">Alpha note: </span>
                      During the private alpha period, workspace data may be reset, migrated, or deleted without advance notice as we iterate on the product. We recommend not storing business-critical information in Gunimi during this phase.
                    </div>
                  </div>
                ),
              },
              {
                title: "4. AI & Third-Party Services",
                content: (
                  <div className="space-y-4 text-[14px]">
                    {[
                      { name: "AI Model Providers", body: "When you use AI features, the relevant content is sent to third-party AI model APIs for processing. We have data processing agreements that prohibit use of your data for model training. We do not send credentials or payment information to AI providers." },
                      { name: "Supabase", body: "Database, authentication, and real-time features are provided by Supabase, Inc." },
                      { name: "Postmark", body: "Transactional emails are sent via Postmark. Email addresses are shared with Postmark only for delivery purposes." },
                      { name: "Upstash Redis", body: "User IDs are stored temporarily in Upstash Redis for rate limiting purposes. No personal data beyond user ID is stored." },
                    ].map(({ name, body }) => (
                      <div key={name}>
                        <p className="font-medium text-[#C8CDD8]">{name}</p>
                        <p className="mt-1">{body}</p>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                title: "5. Your Rights",
                content: (
                  <div className="space-y-3 text-[14px]">
                    <p>Depending on your jurisdiction, you may have rights including:</p>
                    <ul className="space-y-2">
                      {["Access to the personal data we hold about you", "Correction of inaccurate data", "Deletion of your account and associated data", "Export of your workspace data"].map((r) => (
                        <li key={r} className="flex items-start gap-2.5">
                          <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#6D5BFF]/50" />
                          {r}
                        </li>
                      ))}
                    </ul>
                    <p>To exercise any of these rights, email <a href="mailto:support@gunimi.com" className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]">support@gunimi.com</a>. We will respond within 30 days.</p>
                  </div>
                ),
              },
              {
                title: "6. Data Retention",
                content: <p className="text-[14px]">We retain your account and workspace data for as long as your account is active. If you request account deletion, we will remove your personal data within 30 days, except where we are required to retain it by law.</p>,
              },
              {
                title: "7. Cookies",
                content: <p className="text-[14px]">Gunimi uses session cookies provided by Supabase Auth to keep you logged in. These are strictly necessary for the service to function and do not track you across third-party websites. See our <a href="/cookies" className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]">Cookie Policy</a> for full details.</p>,
              },
              {
                title: "8. Contact",
                content: <p className="text-[14px]">For privacy questions, data requests, or concerns, contact us at <a href="mailto:support@gunimi.com" className="font-medium text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]">support@gunimi.com</a>.</p>,
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
