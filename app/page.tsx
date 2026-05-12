import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-800">

        <div className="mx-auto max-w-7xl px-6 py-28">

          <div className="max-w-4xl">

            <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
              AI Business Operating System
            </div>

            <h1 className="mt-8 text-6xl font-bold leading-tight md:text-7xl">

              Run your whole business
              <span className="block text-zinc-500">
                from one AI workspace.
              </span>

            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-zinc-400">

              OrbitDesk combines CRM, tasks, notes,
              AI workflows and business automation
              into one modern platform for small businesses.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/login"
                className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-black transition hover:opacity-90"
              >
                Start Free
              </Link>

              <a
                href="#features"
                className="rounded-xl border border-zinc-700 px-8 py-4 text-lg transition hover:bg-zinc-900"
              >
                Explore Features
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="border-b border-zinc-800">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">

            <div className="flex items-center justify-between border-b border-zinc-800 pb-6">

              <div>

                <h2 className="text-3xl font-bold">
                  OrbitDesk Dashboard
                </h2>

                <p className="mt-2 text-zinc-500">
                  AI-powered workspace for modern teams
                </p>

              </div>

              <div className="rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
                Live System
              </div>

            </div>

            {/* Fake Dashboard */}
            <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-4">

              <div className="rounded-2xl border border-zinc-800 bg-black p-6">
                <p className="text-zinc-500">
                  Companies
                </p>

                <h3 className="mt-4 text-5xl font-bold">
                  24
                </h3>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black p-6">
                <p className="text-zinc-500">
                  Customers
                </p>

                <h3 className="mt-4 text-5xl font-bold">
                  182
                </h3>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black p-6">
                <p className="text-zinc-500">
                  Tasks
                </p>

                <h3 className="mt-4 text-5xl font-bold">
                  48
                </h3>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black p-6">
                <p className="text-zinc-500">
                  AI Actions
                </p>

                <h3 className="mt-4 text-5xl font-bold">
                  312
                </h3>
              </div>

            </div>

            {/* Activity */}
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-black p-6">

              <div className="flex items-center justify-between">

                <h3 className="text-2xl font-bold">
                  Activity Timeline
                </h3>

                <p className="text-zinc-500">
                  Live business updates
                </p>

              </div>

              <div className="mt-6 space-y-4">

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  AI generated meeting summary
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  New customer added to CRM
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  Proposal moved to won stage
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="border-b border-zinc-800"
      >

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="max-w-3xl">

            <h2 className="text-5xl font-bold">
              Everything your business needs.
            </h2>

            <p className="mt-6 text-xl text-zinc-400">

              OrbitDesk brings together CRM,
              tasks, AI workflows and automation
              into one simple platform.

            </p>

          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

              <h3 className="text-2xl font-bold">
                CRM Pipeline
              </h3>

              <p className="mt-4 text-zinc-400">
                Manage leads, customers and deals
                through a modern visual pipeline.
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

              <h3 className="text-2xl font-bold">
                AI Assistant
              </h3>

              <p className="mt-4 text-zinc-400">
                Summarize meetings, generate tasks
                and automate workflows with AI.
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

              <h3 className="text-2xl font-bold">
                Tasks & Projects
              </h3>

              <p className="mt-4 text-zinc-400">
                Organize business operations
                with modern task management.
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

              <h3 className="text-2xl font-bold">
                Activity Timeline
              </h3>

              <p className="mt-4 text-zinc-400">
                Track every business action
                in real time.
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

              <h3 className="text-2xl font-bold">
                Business Analytics
              </h3>

              <p className="mt-4 text-zinc-400">
                Understand customer growth,
                productivity and workflow insights.
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

              <h3 className="text-2xl font-bold">
                Automations
              </h3>

              <p className="mt-4 text-zinc-400">
                Build AI-powered automations
                for repetitive business tasks.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* PRICING */}
      <section className="border-b border-zinc-800">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="text-center">

            <h2 className="text-5xl font-bold">
              Simple pricing.
            </h2>

            <p className="mt-6 text-xl text-zinc-400">
              Start free. Upgrade when your business grows.
            </p>

          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Starter */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

              <h3 className="text-3xl font-bold">
                Starter
              </h3>

              <p className="mt-4 text-zinc-400">
                Perfect for freelancers and solo founders.
              </p>

              <div className="mt-8 text-5xl font-bold">
                Free
              </div>

            </div>

            {/* Pro */}
            <div className="rounded-3xl border border-white bg-white p-8 text-black">

              <div className="rounded-full bg-black px-4 py-2 text-sm text-white w-fit">
                Most Popular
              </div>

              <h3 className="mt-6 text-3xl font-bold">
                Pro
              </h3>

              <p className="mt-4 text-zinc-700">
                AI workflows, CRM pipeline and automation.
              </p>

              <div className="mt-8 text-5xl font-bold">
                $29
                <span className="text-lg font-medium">
                  /mo
                </span>
              </div>

            </div>

            {/* Team */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

              <h3 className="text-3xl font-bold">
                Team
              </h3>

              <p className="mt-4 text-zinc-400">
                Collaboration and advanced business tools.
              </p>

              <div className="mt-8 text-5xl font-bold">
                $99
                <span className="text-lg font-medium">
                  /mo
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FINAL CTA */}
      <section>

        <div className="mx-auto max-w-5xl px-6 py-32 text-center">

          <h2 className="text-6xl font-bold leading-tight">

            The operating system
            <span className="block text-zinc-500">
              for modern small businesses.
            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-xl text-zinc-400">

            Replace scattered tools with one AI-powered workspace
            designed to help your business grow faster.

          </p>

          <div className="mt-10">

            <Link
              href="/login"
              className="rounded-xl bg-white px-10 py-5 text-xl font-semibold text-black transition hover:opacity-90"
            >
              Start Using OrbitDesk
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}