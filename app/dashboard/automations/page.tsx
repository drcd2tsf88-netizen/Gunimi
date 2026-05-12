"use client";

export default function AutomationsPage() {

  const automations = [
    {
      title: "Lead Follow-Up",
      description:
        "Automatically create a follow-up task when a new lead is added.",
      status: "Active",
    },
    {
      title: "AI Meeting Summary",
      description:
        "Generate AI summaries after creating company notes.",
      status: "Active",
    },
    {
      title: "Won Deal Workflow",
      description:
        "Create onboarding tasks when a customer is moved to won stage.",
      status: "Coming Soon",
    },
    {
      title: "Task Reminder",
      description:
        "Notify team members about overdue tasks and deadlines.",
      status: "Coming Soon",
    },
  ];

  return (
    <main className="text-white">

      {/* Header */}
      <div>

        <div className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
          Orbit Automations
        </div>

        <h1 className="mt-6 text-5xl font-bold">
          AI-powered business automations.
        </h1>

        <p className="mt-4 max-w-3xl text-xl text-zinc-400">

          Automate repetitive workflows,
          CRM actions and business operations
          with OrbitDesk AI.

        </p>

      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Active Automations
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            2
          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            AI Workflows
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            4
          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Productivity Boost
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            +38%
          </h2>

        </div>

      </div>

      {/* Automation Cards */}
      <div className="mt-10 grid gap-6 xl:grid-cols-2">

        {automations.map((automation) => (
          <div
            key={automation.title}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
          >

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                {automation.title}
              </h2>

              <span
                className={
                  automation.status === "Active"
                    ? "rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400"
                    : "rounded-full bg-yellow-500/20 px-4 py-2 text-sm text-yellow-400"
                }
              >
                {automation.status}
              </span>

            </div>

            <p className="mt-6 leading-relaxed text-zinc-400">

              {automation.description}

            </p>

            <button
              className="mt-8 rounded-xl border border-zinc-700 px-6 py-3 transition hover:bg-zinc-800"
            >
              Configure Automation
            </button>

          </div>
        ))}

      </div>

      {/* AI Automation Ideas */}
      <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Suggested AI Workflows
          </h2>

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
            Orbit AI
          </span>

        </div>

        <div className="mt-8 grid gap-4">

          <div className="rounded-2xl border border-zinc-800 bg-black p-5">

            <p className="font-semibold">
              Create tasks from meeting notes automatically
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black p-5">

            <p className="font-semibold">
              Generate CRM follow-up reminders using AI
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black p-5">

            <p className="font-semibold">
              Detect inactive leads and suggest re-engagement
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}