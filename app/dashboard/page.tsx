"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function DashboardPage() {

  const [companies, setCompanies] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {

    try {

      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } =
        await supabase
          .from("companies")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", {
            ascending: false,
          });

      if (error) {

        toast.error(error.message);

        return;
      }

      setCompanies(data || []);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load companies"
      );

    } finally {

      setLoading(false);

    }
  }

  if (loading) {

    return (
      <main className="text-white">

        <div className="animate-pulse">

          <div className="h-12 w-72 rounded-xl bg-zinc-800" />

          <div className="mt-4 h-6 w-96 rounded-xl bg-zinc-900" />

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 rounded-3xl bg-zinc-900"
              />
            ))}

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="text-white">

      {/* Header */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        <div>

          <div className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
            OrbitDesk Workspace
          </div>

          <h1 className="mt-6 text-5xl font-bold">
            Dashboard
          </h1>

          <p className="mt-4 max-w-2xl text-xl text-zinc-400">

            Manage companies, CRM pipelines,
            AI workflows and business operations
            from one workspace.

          </p>

        </div>

        <button
          onClick={() =>
            toast(
              "Create Company module updating"
            )
          }
          className="rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:opacity-90"
        >
          Create Company
        </button>

      </div>

      {/* AI Workspace */}
      <div className="mt-10 grid gap-6 xl:grid-cols-3">

        {/* AI Card */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              Orbit AI
            </h2>

            <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
              AI Workspace
            </span>

          </div>

          <p className="mt-4 leading-relaxed text-zinc-400">

            AI-powered business assistance,
            summaries, workflow suggestions
            and productivity insights.

          </p>

          <button className="mt-8 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:opacity-90">
            Open AI Assistant
          </button>

        </div>

        {/* Health */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              Workspace Health
            </h2>

            <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
              Healthy
            </span>

          </div>

          <div className="mt-8 space-y-5">

            <div>

              <div className="flex items-center justify-between">

                <p className="text-zinc-400">
                  CRM Activity
                </p>

                <p className="font-semibold">
                  Active
                </p>

              </div>

              <div className="mt-3 h-3 rounded-full bg-zinc-800">

                <div className="h-3 w-[78%] rounded-full bg-white" />

              </div>

            </div>

            <div>

              <div className="flex items-center justify-between">

                <p className="text-zinc-400">
                  Productivity
                </p>

                <p className="font-semibold">
                  Strong
                </p>

              </div>

              <div className="mt-3 h-3 rounded-full bg-zinc-800">

                <div className="h-3 w-[64%] rounded-full bg-zinc-400" />

              </div>

            </div>

          </div>

        </div>

        {/* Activity */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              Activity
            </h2>

            <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
              Today
            </span>

          </div>

          <div className="mt-8 space-y-4">

            <div className="rounded-2xl border border-zinc-800 bg-black p-4">

              <p className="text-sm text-zinc-400">
                Customer activity updated
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-4">

              <p className="text-sm text-zinc-400">
                Tasks synchronized successfully
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-4">

              <p className="text-sm text-zinc-400">
                Orbit AI generated insights
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Empty State */}
      {companies.length === 0 && (

        <div className="mt-10 rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-12 text-center">

          <h2 className="text-3xl font-bold">
            Welcome to OrbitDesk
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">

            Start by creating your first company
            workspace to manage customers,
            tasks, AI workflows and analytics.

          </p>

        </div>

      )}

      {/* Companies */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/dashboard/company/${company.id}`}
            className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700 hover:bg-zinc-950"
          >

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  {company.name}
                </h2>

                <p className="mt-3 text-zinc-400">
                  {company.industry}
                </p>

              </div>

              <div className="rounded-full border border-zinc-700 bg-black px-4 py-2 text-sm text-zinc-400">
                Workspace
              </div>

            </div>

            <div className="mt-10 flex items-center justify-between">

              <p className="text-sm text-zinc-500">
                Open workspace
              </p>

              <span className="text-zinc-500 transition group-hover:translate-x-1">
                →
              </span>

            </div>

          </Link>
        ))}

      </div>

    </main>
  );
}