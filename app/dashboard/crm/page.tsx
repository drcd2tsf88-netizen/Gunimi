"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CRMPage() {

  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("customers")
      .select(`
        *,
        companies (
          name
        )
      `)
      .eq("user_id", user?.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setCustomers(data || []);
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <main className="text-white">

      {/* Header */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            CRM
          </h1>

          <p className="mt-3 text-xl text-zinc-400">
            Manage all your customers in one place.
          </p>

        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full xl:w-96 rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white outline-none"
        />

      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Total Customers
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {customers.length}
          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Active Leads
          </p>

          <h2 className="mt-4 text-5xl font-bold">

            {
              customers.filter(
                (customer) =>
                  customer.status === "lead"
              ).length
            }

          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Won Deals
          </p>

          <h2 className="mt-4 text-5xl font-bold">

            {
              customers.filter(
                (customer) =>
                  customer.status === "won"
              ).length
            }

          </h2>

        </div>

      </div>

      {/* Customers */}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h3 className="text-2xl font-bold">
            Customers
          </h3>

          <p className="text-zinc-500">
            {filteredCustomers.length} results
          </p>

        </div>

        <div className="mt-6 grid gap-4">

          {filteredCustomers.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black p-10 text-center">

              <p className="text-lg text-zinc-500">
                No customers found
              </p>

              <p className="mt-2 text-zinc-600">
                Add customers inside your companies to build your CRM.
              </p>

            </div>

          ) : (

            filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
              >

                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                  <div>

                    <h4 className="text-xl font-bold">
                      {customer.name}
                    </h4>

                    <p className="mt-2 text-zinc-400">
                      {customer.email}
                    </p>

                    <p className="mt-3 text-sm text-zinc-500">

                      Company:
                      {" "}
                      {customer.companies?.name || "Unknown"}

                    </p>

                  </div>

                  <div>

                    <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm capitalize text-zinc-300">
                      {customer.status}
                    </span>

                  </div>

                </div>

              </div>
            ))

          )}

        </div>

      </div>

    </main>
  );
}