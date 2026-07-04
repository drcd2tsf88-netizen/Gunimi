import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main
      className="
        min-h-screen
        bg-[#060816]
        text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-3xl
          px-6
          py-16
        "
      >
        {/* HEADER */}

        <div className="mb-12">
          <Link
            href="/"
            className="
              mb-8
              inline-flex
              items-center
              gap-2
              text-sm
              text-zinc-500
              transition
              hover:text-white
            "
          >
            ← Gunimi
          </Link>

          <div
            className="
              mt-6
              inline-flex
              rounded-full
              border
              border-zinc-800
              bg-zinc-900
              px-4
              py-1.5
              text-xs
              text-zinc-500
            "
          >
            Private Alpha — June 2026
          </div>

          <h1
            className="
              mt-4
              text-4xl
              font-bold
            "
          >
            Privacy Policy
          </h1>

          <p className="mt-3 text-zinc-500">
            Last updated: June 17, 2026
          </p>
        </div>

        {/* CONTENT */}

        <div
          className="
            space-y-10
            text-zinc-300
          "
        >
          <section>
            <p className="leading-relaxed">
              Gunimi (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates an
              AI-first workspace operating system for business teams. This Privacy
              Policy explains what data we collect, how we use it, and your rights
              as a user. By creating an account you agree to the practices described
              here.
            </p>

            <p className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
              Gunimi is currently in private alpha. Features, data practices, and
              this policy may evolve. We will notify registered users of material
              changes by email.
            </p>
          </section>

          <section>
            <h2
              className="
                mb-4
                text-xl
                font-semibold
                text-white
              "
            >
              1. Data We Collect
            </h2>

            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <p className="font-medium text-white">Account Information</p>
                <p className="mt-1 text-zinc-400">
                  When you register, we collect your email address, full name, and
                  any profile information you choose to provide (job title, avatar).
                </p>
              </div>

              <div>
                <p className="font-medium text-white">Workspace Data</p>
                <p className="mt-1 text-zinc-400">
                  All content you create inside Gunimi — companies, contacts,
                  deals, notes, tasks, and activity records — is stored in your
                  workspace and associated with your account.
                </p>
              </div>

              <div>
                <p className="font-medium text-white">Usage Activity</p>
                <p className="mt-1 text-zinc-400">
                  We record workspace activity events (e.g. &ldquo;deal created&rdquo;,
                  &ldquo;task completed&rdquo;) to power your activity feed and workspace
                  analytics.
                </p>
              </div>

              <div>
                <p className="font-medium text-white">Technical Data</p>
                <p className="mt-1 text-zinc-400">
                  Standard server logs including IP addresses, browser type, and
                  request timestamps for security and debugging purposes.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2
              className="
                mb-4
                text-xl
                font-semibold
                text-white
              "
            >
              2. How We Use Your Data
            </h2>

            <ul
              className="
                space-y-2
                text-sm
                leading-relaxed
                text-zinc-400
              "
            >
              <li className="flex gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                To provide and operate the Gunimi platform
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                To authenticate your identity and secure your workspace
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                To power AI features: note content may be sent to OpenAI&rsquo;s
                API to generate summaries and insights (see Section 4)
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                To send transactional emails (workspace invites, verification)
                via Resend
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                To improve the product during the alpha period based on usage
                patterns
              </li>
            </ul>

            <p className="mt-4 text-sm text-zinc-500">
              We do not sell your data. We do not use your data for advertising.
            </p>
          </section>

          <section>
            <h2
              className="
                mb-4
                text-xl
                font-semibold
                text-white
              "
            >
              3. Data Storage & Security
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              Your data is stored in Supabase, a managed PostgreSQL platform. Data
              may be stored in the US or EU depending on your region. We enforce
              row-level security (RLS) so that workspace data is only accessible to
              authenticated members of that workspace.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Authentication is handled by Supabase Auth using email and password.
              Passwords are never stored in plain text. All connections are
              encrypted via TLS.
            </p>

            <p className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400">
              <span className="font-medium text-white">Alpha note:</span> During the
              private alpha period, workspace data may be reset, migrated, or
              deleted without advance notice as we iterate on the product. We
              recommend not storing business-critical information in Gunimi
              during this phase.
            </p>
          </section>

          <section>
            <h2
              className="
                mb-4
                text-xl
                font-semibold
                text-white
              "
            >
              4. AI & Third-Party Services
            </h2>

            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <p className="font-medium text-white">OpenAI</p>
                <p className="mt-1 text-zinc-400">
                  When you use AI features (note summarization, AI assistant),
                  the relevant content is sent to OpenAI&rsquo;s API for processing.
                  OpenAI&rsquo;s{" "}
                  <span className="text-zinc-300">
                    data usage policies apply
                  </span>
                  . We do not send your account credentials or payment information
                  to OpenAI.
                </p>
              </div>

              <div>
                <p className="font-medium text-white">Supabase</p>
                <p className="mt-1 text-zinc-400">
                  Database, authentication, and real-time features are provided by
                  Supabase, Inc.
                </p>
              </div>

              <div>
                <p className="font-medium text-white">Resend</p>
                <p className="mt-1 text-zinc-400">
                  Transactional emails (workspace invites, account verification) are
                  sent via Resend. Email addresses are shared with Resend only for
                  delivery purposes.
                </p>
              </div>

              <div>
                <p className="font-medium text-white">Upstash Redis</p>
                <p className="mt-1 text-zinc-400">
                  User IDs are stored temporarily in Upstash Redis for rate limiting
                  purposes. No personal data beyond user ID is stored.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2
              className="
                mb-4
                text-xl
                font-semibold
                text-white
              "
            >
              5. Your Rights
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              Depending on your jurisdiction, you may have rights including:
            </p>

            <ul
              className="
                mt-3
                space-y-2
                text-sm
                leading-relaxed
                text-zinc-400
              "
            >
              <li className="flex gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                Access to the personal data we hold about you
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                Correction of inaccurate data
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                Deletion of your account and associated data
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                Export of your workspace data
              </li>
            </ul>

            <p className="mt-4 text-sm text-zinc-400">
              To exercise any of these rights, email{" "}
              <a
                href="mailto:support@gunimi.com"
                className="text-violet-400 underline"
              >
                support@gunimi.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2
              className="
                mb-4
                text-xl
                font-semibold
                text-white
              "
            >
              6. Data Retention
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              We retain your account and workspace data for as long as your account
              is active. If you request account deletion, we will remove your
              personal data within 30 days, except where we are required to retain
              it by law.
            </p>
          </section>

          <section>
            <h2
              className="
                mb-4
                text-xl
                font-semibold
                text-white
              "
            >
              7. Cookies
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              Gunimi uses session cookies provided by Supabase Auth to keep you
              logged in. These are strictly necessary for the service to function and
              do not track you across third-party websites. We do not use advertising
              cookies or third-party tracking scripts.
            </p>
          </section>

          <section>
            <h2
              className="
                mb-4
                text-xl
                font-semibold
                text-white
              "
            >
              8. Contact
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              For privacy questions, data requests, or concerns, contact us at{" "}
              <a
                href="mailto:support@gunimi.com"
                className="text-violet-400 underline"
              >
                support@gunimi.com
              </a>
              .
            </p>
          </section>

          {/* FOOTER NAV */}

          <div
            className="
              border-t
              border-zinc-800
              pt-8
              text-sm
              text-zinc-600
            "
          >
            <div className="flex flex-wrap gap-4">
              <Link
                href="/terms"
                className="transition hover:text-zinc-300"
              >
                Terms of Service
              </Link>

              <Link
                href="/register"
                className="transition hover:text-zinc-300"
              >
                Create Account
              </Link>

              <a
                href="mailto:support@gunimi.com"
                className="transition hover:text-zinc-300"
              >
                Support
              </a>
            </div>

            <p className="mt-4 text-zinc-700">
              © 2026 Gunimi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
