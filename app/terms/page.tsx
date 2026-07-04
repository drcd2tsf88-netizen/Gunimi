import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
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
            Terms of Service
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
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
              Gunimi, an AI-first workspace operating system (&ldquo;Service&rdquo;) operated
              by Gunimi (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;). By creating an account, you
              agree to these Terms.
            </p>

            <p className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
              Gunimi is in private alpha. You have been granted early access to
              test the platform. The Service is provided as-is. Features may change,
              and data may be reset without notice during this period.
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
              1. Eligibility & Account
            </h2>

            <div className="space-y-3 text-sm leading-relaxed text-zinc-400">
              <p>
                You must be at least 18 years old and have the legal capacity to
                enter into these Terms. By registering, you represent that all
                information you provide is accurate and complete.
              </p>

              <p>
                You are responsible for maintaining the security of your account
                credentials. Do not share your password. Notify us immediately at{" "}
                <a
                  href="mailto:support@gunimi.com"
                  className="text-violet-400 underline"
                >
                  support@gunimi.com
                </a>{" "}
                if you suspect unauthorized access.
              </p>

              <p>
                One account per person. Sharing accounts between multiple users is
                not permitted.
              </p>
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
              2. Acceptable Use
            </h2>

            <p className="mb-3 text-sm text-zinc-400">
              You agree to use Gunimi only for lawful business purposes. You
              must not:
            </p>

            <ul
              className="
                space-y-2
                text-sm
                leading-relaxed
                text-zinc-400
              "
            >
              <li className="flex gap-2">
                <span className="mt-0.5 text-red-400">✕</span>
                Use the Service to store or transmit illegal, harmful, or
                fraudulent content
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-red-400">✕</span>
                Attempt to circumvent authentication, rate limits, or security
                controls
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-red-400">✕</span>
                Use automated scripts to scrape, overload, or abuse the Service
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-red-400">✕</span>
                Reverse engineer, decompile, or attempt to extract the source
                code of the Service
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-red-400">✕</span>
                Resell, sublicense, or otherwise commercialize access to the
                Service without written permission
              </li>
            </ul>

            <p className="mt-4 text-sm text-zinc-400">
              Violation of these terms may result in immediate account termination.
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
              3. Your Data
            </h2>

            <div className="space-y-3 text-sm leading-relaxed text-zinc-400">
              <p>
                You retain ownership of all content and data you create in
                Gunimi (companies, contacts, deals, notes, tasks, and other
                workspace data). We do not claim intellectual property rights over
                your content.
              </p>

              <p>
                You grant Gunimi a limited license to store, process, and display
                your content solely as necessary to provide the Service to you.
              </p>

              <p>
                During the private alpha, workspace data may be reset, migrated, or
                permanently deleted as part of development. We will make reasonable
                efforts to notify registered users in advance of any planned data
                resets.
              </p>
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
              4. AI Features
            </h2>

            <div className="space-y-3 text-sm leading-relaxed text-zinc-400">
              <p>
                Gunimi includes AI features powered by OpenAI&rsquo;s API. When you
                use these features, relevant content from your workspace may be sent
                to OpenAI for processing.
              </p>

              <p>
                You are responsible for ensuring that any content you submit through
                AI features does not violate applicable laws or third-party rights.
                Do not submit confidential information belonging to others without
                appropriate authorization.
              </p>

              <p>
                AI-generated outputs are provided for informational purposes only.
                We do not guarantee the accuracy, completeness, or suitability of
                AI-generated content for any purpose.
              </p>
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
              5. Alpha Program
            </h2>

            <div className="space-y-3 text-sm leading-relaxed text-zinc-400">
              <p>
                As a private alpha participant, you acknowledge that:
              </p>

              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-violet-400">→</span>
                  The Service is unfinished and may contain bugs, incomplete features,
                  and unstable behavior
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-violet-400">→</span>
                  Features shown as &ldquo;Coming Soon&rdquo; are in development and not yet
                  available
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-violet-400">→</span>
                  Your feedback is valuable and may be used to improve the product
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-violet-400">→</span>
                  Alpha access may be revoked at any time at our discretion
                </li>
              </ul>
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
              6. Service Availability
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              We strive for high availability but make no guarantees regarding
              uptime during the alpha period. The Service may be taken offline for
              maintenance, updates, or debugging at any time. We will make
              reasonable efforts to communicate planned downtime via email.
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
              7. Disclaimer of Warranties
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
              LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
              SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL
              COMPONENTS.
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
              8. Limitation of Liability
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              TO THE FULLEST EXTENT PERMITTED BY LAW, GUNIMI SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
              DAMAGES, INCLUDING LOSS OF DATA, LOSS OF PROFITS, OR BUSINESS
              INTERRUPTION, ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE,
              EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
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
              9. Termination
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              Either party may terminate your access to the Service at any time.
              You may close your account by contacting us at{" "}
              <a
                href="mailto:support@gunimi.com"
                className="text-violet-400 underline"
              >
                support@gunimi.com
              </a>
              . We may terminate or suspend your account if you violate these Terms.
              Upon termination, your right to access the Service ceases immediately.
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
              10. Changes to Terms
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              We may update these Terms from time to time. We will notify registered
              users of material changes by email at least 7 days before they take
              effect. Continued use of the Service after changes constitute
              acceptance of the new Terms.
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
              11. Contact
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              For questions about these Terms, contact us at{" "}
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
                href="/privacy"
                className="transition hover:text-zinc-300"
              >
                Privacy Policy
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
