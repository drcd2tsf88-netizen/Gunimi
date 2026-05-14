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

  const [open, setOpen] =
    useState(false);

  const [name, setName] =
    useState("");

  const [industry, setIndustry] =
    useState("");

  const [creating, setCreating] =
    useState(false);

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

  async function handleCreateCompany() {

    if (!name || !industry) {

      toast.error(
        "Please fill all fields"
      );

      return;
    }

    try {

      setCreating(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } =
        await supabase
          .from("companies")
          .insert({
            name,
            industry,
            user_id: user?.id,
          });

      if (error) {

        toast.error(error.message);

        return;
      }

      toast.success(
        "Company created"
      );

      setName("");
      setIndustry("");

      setOpen(false);

      loadCompanies();

    } catch (error) {

      console.error(error);

      toast.error(
        "Something went wrong"
      );

    } finally {

      setCreating(false);

    }
  }

  if (loading) {

    return (
      <main className="text-white">

        <div className="animate-pulse">

          {/* Header */}
          <div className="h-12 w-72 rounded-xl bg-zinc-800" />

          <div className="mt-4 h-6 w-96 rounded-xl bg-zinc-900" />

          {/* Cards */}
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

        {/* Create Button */}
        <button
          onClick={() => setOpen(true)}
          className="rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:opacity-90"
        >
          Create Company
        </button>

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

          <button
            onClick={() =>
              setOpen(true)
            }
            className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90"
          >
            Create First Company
          </button>

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

                <h2 className="text-2xl font-bold transition group-hover:text-white">
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

      {/* Modal */}
      {open && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">

          <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            {/* Header */}
            <div className="flex items-center justify-between">

              <div>

                <div className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
                  New Workspace
                </div>

                <h2 className="mt-5 text-3xl font-bold">
                  Create Company
                </h2>

                <p className="mt-3 text-zinc-400">
                  Create a new business workspace inside OrbitDesk.
                </p>

              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-xl border border-zinc-700 px-4 py-2 transition hover:bg-zinc-800"
              >
                ✕
              </button>

            </div>

            {/* Form */}
            <div className="mt-8 space-y-5">

              <input
                type="text"
                placeholder="Company Name"
                value={name}
                disabled={creating}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-700 bg-black p-4 text-white outline-none transition focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <input
                type="text"
                placeholder="Industry"
                value={industry}
                disabled={creating}
                onChange={(e) =>
                  setIndustry(e.target.value)
                }
                className="w-full rounded-2xl border border-zinc-700 bg-black p-4 text-white outline-none transition focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-4">

                <button
                  onClick={handleCreateCompany}
                  disabled={creating}
                  className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {creating
                    ? "Creating..."
                    : "Create Workspace"}

                </button>

                <button
                  onClick={() =>
                    setOpen(false)
                  }
                  disabled={creating}
                  className="rounded-2xl border border-zinc-700 px-6 py-3 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}