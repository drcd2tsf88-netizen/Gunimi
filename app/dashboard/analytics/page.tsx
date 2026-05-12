"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {

  const [companies, setCompanies] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Companies
    const { data: companiesData } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user?.id);

    // Customers
    const { data: customersData } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user?.id);

    // Tasks
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user?.id);

    // Activities
    const { data: activitiesData } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", user?.id);

    setCompanies(companiesData || []);
    setCustomers(customersData || []);
    setTasks(tasksData || []);
    setActivities(activitiesData || []);
  }

  const completedTasks = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const activeTasks = tasks.filter(
    (task) => task.status !== "done"
  ).length;

  const wonDeals = customers.filter(
    (customer) => customer.status === "won"
  ).length;

  const activeLeads = customers.filter(
    (customer) => customer.status === "lead"
  ).length;

  const aiActivities = activities.filter(
    (activity) => activity.type === "ai"
  ).length;

  return (
    <main className="text-white">

      {/* Header */}
      <div>

        <h1 className="text-5xl font-bold">
          Analytics
        </h1>

        <p className="mt-3 text-xl text-zinc-400">
          Business insights and performance overview.
        </p>

      </div>

      {/* Main Stats */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Companies
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {companies.length}
          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Customers
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {customers.length}
          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Tasks
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {tasks.length}
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

      {/* Business Insights */}
      <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Tasks Overview */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <h3 className="text-2xl font-bold">
              Task Performance
            </h3>

            <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
              Productivity
            </span>

          </div>

          <div className="mt-8 space-y-6">

            <div>

              <div className="flex items-center justify-between">

                <p className="text-zinc-400">
                  Completed Tasks
                </p>

                <p className="font-semibold">
                  {completedTasks}
                </p>

              </div>

              <div className="mt-3 h-3 rounded-full bg-zinc-800">

                <div
                  className="h-3 rounded-full bg-white"
                  style={{
                    width: `${
                      tasks.length
                        ? (completedTasks / tasks.length) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

            <div>

              <div className="flex items-center justify-between">

                <p className="text-zinc-400">
                  Active Tasks
                </p>

                <p className="font-semibold">
                  {activeTasks}
                </p>

              </div>

              <div className="mt-3 h-3 rounded-full bg-zinc-800">

                <div
                  className="h-3 rounded-full bg-zinc-400"
                  style={{
                    width: `${
                      tasks.length
                        ? (activeTasks / tasks.length) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

        {/* CRM Overview */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <h3 className="text-2xl font-bold">
              CRM Pipeline
            </h3>

            <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
              Sales
            </span>

          </div>

          <div className="mt-8 space-y-6">

            <div>

              <div className="flex items-center justify-between">

                <p className="text-zinc-400">
                  Active Leads
                </p>

                <p className="font-semibold">
                  {activeLeads}
                </p>

              </div>

              <div className="mt-3 h-3 rounded-full bg-zinc-800">

                <div
                  className="h-3 rounded-full bg-white"
                  style={{
                    width: `${
                      customers.length
                        ? (activeLeads / customers.length) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

            <div>

              <div className="flex items-center justify-between">

                <p className="text-zinc-400">
                  Won Deals
                </p>

                <p className="font-semibold">
                  {wonDeals}
                </p>

              </div>

              <div className="mt-3 h-3 rounded-full bg-zinc-800">

                <div
                  className="h-3 rounded-full bg-zinc-400"
                  style={{
                    width: `${
                      customers.length
                        ? (wonDeals / customers.length) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* AI Insights */}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h3 className="text-2xl font-bold">
            AI Insights
          </h3>

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
            Orbit AI
          </span>

        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-zinc-800 bg-black p-6">

            <p className="text-zinc-500">
              AI Actions
            </p>

            <h4 className="mt-4 text-4xl font-bold">
              {aiActivities}
            </h4>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black p-6">

            <p className="text-zinc-500">
              Productivity Score
            </p>

            <h4 className="mt-4 text-4xl font-bold">

              {Math.min(
                100,
                completedTasks * 10
              )}
              %

            </h4>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black p-6">

            <p className="text-zinc-500">
              CRM Health
            </p>

            <h4 className="mt-4 text-4xl font-bold">

              {Math.min(
                100,
                wonDeals * 20
              )}
              %

            </h4>

          </div>

        </div>

      </div>

    </main>
  );
}