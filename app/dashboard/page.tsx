"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");

  const [companies, setCompanies] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
 Promise.all([
  loadCompanies(),
  loadActivities(),
]).finally(() => {
  setLoading(false);
}); 
}, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
    }
  }

  async function loadCompanies() {
   const {
  data: { user },
} = await supabase.auth.getUser();

const { data, error } = await supabase
  .from("companies")
  .select("*")
  .eq("user_id", user?.id)
  .order("created_at", {
    ascending: false,
  });

    if (error) {
      console.error(error);
      return;
    }

    setCompanies(data || []);
  }

  async function loadActivities() {
      const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return;
  }

  setActivities(data || []);
}

  async function handleAddCompany() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("companies")
      .insert({
        name: companyName,
        industry,
        user_id: user?.id,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setCompanyName("");
    setIndustry("");

    loadCompanies();
  }

  function openCompany(id: string) {
    router.push(`/dashboard/company/${id}`);
  }
if (loading) {
  return (
    <div className="space-y-6">

      <div className="h-12 w-64 animate-pulse rounded-xl bg-zinc-900" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="h-40 animate-pulse rounded-2xl bg-zinc-900" />
        <div className="h-40 animate-pulse rounded-2xl bg-zinc-900" />
        <div className="h-40 animate-pulse rounded-2xl bg-zinc-900" />
        <div className="h-40 animate-pulse rounded-2xl bg-zinc-900" />

      </div>

      <div className="h-96 animate-pulse rounded-2xl bg-zinc-900" />

    </div>
  );
}

  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-zinc-500">
            Welcome back to OrbitDesk
          </p>

        </div>

      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Total Companies
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {companies.length}
          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            CRM Customers
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            0
          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            AI Automations
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            0
          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Activities
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {activities.length}
          </h2>

        </div>

      </div>

      {/* Add Company */}
      <div className="mt-10 max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

        <h3 className="text-2xl font-bold">
          Add Company
        </h3>

        <div className="mt-6 flex flex-col gap-4">

          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white outline-none"
          />

          <button
            onClick={handleAddCompany}
            className="rounded-lg bg-white p-3 font-semibold text-black transition hover:opacity-90"
          >
            Add Company
          </button>

        </div>

      </div>

      {/* Companies */}
      {companies.length === 0 && (

  <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

    <div className="max-w-3xl">

      <div className="inline-flex rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
        Welcome to OrbitDesk
      </div>

      <h2 className="mt-6 text-5xl font-bold leading-tight">

        Let’s set up your
        first AI workspace.

      </h2>

      <p className="mt-6 text-xl leading-relaxed text-zinc-400">

        OrbitDesk helps you manage customers,
        tasks, notes and AI workflows in one place.

      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-zinc-800 bg-black p-5">

          <div className="text-3xl">
            1
          </div>

          <h3 className="mt-4 text-xl font-bold">
            Create Company
          </h3>

          <p className="mt-2 text-zinc-500">
            Start by creating your first business workspace.
          </p>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-black p-5">

          <div className="text-3xl">
            2
          </div>

          <h3 className="mt-4 text-xl font-bold">
            Add Customers
          </h3>

          <p className="mt-2 text-zinc-500">
            Build your CRM pipeline and organize contacts.
          </p>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-black p-5">

          <div className="text-3xl">
            3
          </div>

          <h3 className="mt-4 text-xl font-bold">
            Use Orbit AI
          </h3>

          <p className="mt-2 text-zinc-500">
            Automate workflows and generate smart insights.
          </p>

        </div>

      </div>

    </div>

  </div>

)}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h3 className="text-2xl font-bold">
            Companies
          </h3>

          <p className="text-zinc-500">
            {companies.length} total
          </p>

        </div>

        <div className="mt-6 grid gap-4">

          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => openCompany(company.id)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-left transition hover:border-zinc-600 hover:bg-zinc-900"
            >

              <h4 className="text-2xl font-semibold">
                {company.name}
              </h4>

              <p className="mt-2 text-zinc-400">
                {company.industry}
              </p>

            </button>
          ))}

        </div>

      </div>

      {/* Recent Activity */}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h3 className="text-2xl font-bold">
            Recent Activity
          </h3>

          <p className="text-zinc-500">
            Latest business actions
          </p>

        </div>

        <div className="mt-6 space-y-4">

          {activities.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
            >

              <p className="font-semibold text-white">
                {activity.content}
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                {activity.type}
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}