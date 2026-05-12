"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function SettingsPage() {

  const [email, setEmail] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setEmail(user?.email || "");
  }

  async function handleLogout() {

    await supabase.auth.signOut();

    toast.success("Logged out");

    window.location.href = "/login";
  }

  return (
    <main className="text-white">

      {/* Header */}
      <div>

        <div className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
          Workspace Settings
        </div>

        <h1 className="mt-6 text-5xl font-bold">
          Settings
        </h1>

        <p className="mt-4 max-w-3xl text-xl text-zinc-400">

          Manage your OrbitDesk workspace,
          AI preferences and account settings.

        </p>

      </div>

      {/* Account */}
      <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Account
          </h2>

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
            Active Session
          </span>

        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-zinc-800 bg-black p-6">

            <p className="text-zinc-500">
              Email Address
            </p>

            <h3 className="mt-4 text-2xl font-bold">
              {email}
            </h3>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black p-6">

            <p className="text-zinc-500">
              Workspace Plan
            </p>

            <h3 className="mt-4 text-2xl font-bold">
              Starter
            </h3>

          </div>

        </div>

      </div>

      {/* AI Preferences */}
      <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            AI Preferences
          </h2>

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
            Orbit AI
          </span>

        </div>

        <div className="mt-8 space-y-4">

          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black p-5">

            <div>

              <h3 className="text-lg font-semibold">
                AI Summaries
              </h3>

              <p className="mt-2 text-zinc-500">
                Automatically generate AI meeting summaries.
              </p>

            </div>

            <button className="rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
              Enabled
            </button>

          </div>

          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black p-5">

            <div>

              <h3 className="text-lg font-semibold">
                Smart Suggestions
              </h3>

              <p className="mt-2 text-zinc-500">
                Receive AI-powered CRM and productivity insights.
              </p>

            </div>

            <button className="rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
              Enabled
            </button>

          </div>

        </div>

      </div>

      {/* Notifications */}
      <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Notifications
          </h2>

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
            Workspace Alerts
          </span>

        </div>

        <div className="mt-8 space-y-4">

          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black p-5">

            <div>

              <h3 className="text-lg font-semibold">
                Task Reminders
              </h3>

              <p className="mt-2 text-zinc-500">
                Get notified about active and overdue tasks.
              </p>

            </div>

            <button className="rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
              Enabled
            </button>

          </div>

          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black p-5">

            <div>

              <h3 className="text-lg font-semibold">
                CRM Updates
              </h3>

              <p className="mt-2 text-zinc-500">
                Receive updates when leads move through the pipeline.
              </p>

            </div>

            <button className="rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
              Enabled
            </button>

          </div>

        </div>

      </div>

      {/* Security */}
      <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Security
          </h2>

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
            Protected Workspace
          </span>

        </div>

        <div className="mt-8 flex flex-wrap gap-4">

          <button
            onClick={handleLogout}
            className="rounded-xl border border-zinc-700 px-6 py-3 transition hover:bg-zinc-800"
          >
            Logout
          </button>

          <button className="rounded-xl border border-zinc-700 px-6 py-3 transition hover:bg-zinc-800">
            Change Password
          </button>

        </div>

      </div>

    </main>
  );
}