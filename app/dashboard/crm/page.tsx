"use client";

import {
  useEffect,
  useState,
} from "react";

import toast
from "react-hot-toast";

import { supabase }
from "@/lib/supabase";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitSkeleton
from "@/components/ui/OrbitSkeleton";

export default function CRMPage() {

  const [customers, setCustomers] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadCustomers();

  }, []);

  async function loadCustomers() {

    try {

      setLoading(true);

      const {

        data,
        error,

      } =
        await supabase
          .from("workspace_contacts")
          .select(`
            *,
            companies (
              name
            )
          `)
          .order("created_at", {
            ascending: false,
          });

      if (error) {

        console.error(error);

        toast.error(
          error.message
        );

        return;
      }

      setCustomers(
        data || []
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load CRM"
      );

    } finally {

      setLoading(false);

    }
  }

  const filteredCustomers =
    customers.filter((customer) =>

      customer.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      customer.email
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  return (

  <div className="space-y-8">

    {/* Hero */}
    <OrbitSection>

      <OrbitHeading

        badge="Workspace CRM"

        title="Customer Relationships"

        subtitle="
          Manage leads,
          customers and
          workspace relationships
          in one unified system.
        "

      />

    </OrbitSection>

    {/* Search */}
    <OrbitSection>

      <OrbitCard
        className="p-6"
      >

        <div

          className="

            flex
            flex-col
            gap-6

            xl:flex-row
            xl:items-center
            xl:justify-between

          "
        >

          <div>

            <h2
              className="text-xl font-semibold"
            >

              Customer Database

            </h2>

            <p
              className="mt-2 text-zinc-400"
            >

              Search and manage
              workspace contacts.

            </p>

          </div>

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="

              w-full
              xl:w-96

              rounded-2xl

              border
              border-white/10

              bg-white/[0.03]

              px-5
              py-4

              text-white

              outline-none

              placeholder:text-zinc-500

            "
          />

        </div>

      </OrbitCard>

    </OrbitSection>

    {/* Stats */}
    <OrbitSection>

      <div
        className="grid gap-6 lg:grid-cols-3"
      >

        <OrbitCard
          className="p-6"
        >

          <p
            className="text-zinc-400"
          >

            Total Customers

          </p>

          <h2

            className="

              mt-5
              text-4xl
              font-semibold

            "
          >

            {customers.length}

          </h2>

        </OrbitCard>

        <OrbitCard
          className="p-6"
        >

          <p
            className="text-zinc-400"
          >

            Active Leads

          </p>

          <h2

            className="

              mt-5
              text-4xl
              font-semibold

            "
          >

            {

              customers.filter(
                (customer) =>

                  customer.status ===
                  "lead"

              ).length

            }

          </h2>

        </OrbitCard>

        <OrbitCard
          className="p-6"
        >

          <p
            className="text-zinc-400"
          >

            Won Deals

          </p>

          <h2

            className="

              mt-5
              text-4xl
              font-semibold

            "
          >

            {

              customers.filter(
                (customer) =>

                  customer.status ===
                  "won"

              ).length

            }

          </h2>

        </OrbitCard>

      </div>

    </OrbitSection>

    {/* Customers */}
    <OrbitSection>

      <OrbitCard
        className="p-6"
      >

        <div

          className="

            flex
            items-center
            justify-between

          "
        >

          <div>

            <h2
              className="text-xl font-semibold"
            >

              Customers

            </h2>

            <p
              className="mt-2 text-zinc-400"
            >

              Workspace CRM contacts.

            </p>

          </div>

          <div

            className="

              rounded-full

              border
              border-white/10

              bg-white/[0.03]

              px-4
              py-2

              text-sm
              text-zinc-300

            "
          >

            {filteredCustomers.length}
            {" "}
            results

          </div>

        </div>

        <div
          className="mt-8 space-y-4"
        >

          {loading ? (

            [1,2,3].map((item) => (

              <OrbitSkeleton
                key={item}
                className="h-[120px]"
              />

            ))

          ) : filteredCustomers.length === 0 ? (
            <div
             className="

    flex
    flex-col
    items-center
    justify-center

    rounded-[28px]

    border
    border-dashed
    border-white/10

    bg-white/[0.03]

    px-10
    py-20

    text-center
  "
>     
     
            

  {/* Icon */}
  <div

    className="

      mb-8

      flex
      h-20
      w-20

      items-center
      justify-center

      rounded-full

      border
      border-violet-500/20

      bg-violet-500/10

      text-3xl

      shadow-[0_0_40px_rgba(124,58,237,0.35)]

    "

  >

    ✦

  </div>

  <h2
    className="text-2xl font-semibold"
  >

    Your CRM is ready

  </h2>

  <p

    className="

      mt-4
      max-w-xl

      text-sm
      leading-relaxed
      text-zinc-400

    "
  >

    Start building your
    AI-powered customer workspace.

    Add contacts, manage pipelines
    and let Orbit AI optimize
    business relationships.

  </p>

  {/* Actions */}
  <div
    className="mt-10 flex gap-4"
  >

    <button

      className="

        rounded-2xl

        border
        border-violet-500/20

        bg-violet-500/10

        px-6
        py-3

        text-sm
        text-violet-200

        transition-all
        duration-300

        hover:bg-violet-500/20

      "

    >

      Add First Contact

    </button>

    <button

      className="

        rounded-2xl

        border
        border-white/10

        bg-white/[0.03]

        px-6
        py-3

        text-sm
        text-white

        transition-all
        duration-300

        hover:bg-white/[0.06]

      "

    >

      Generate Demo Data

    </button>

  </div>

</div>
          ) : (

            filteredCustomers.map((customer) => (

              <div

                key={customer.id}

                className="

                  flex
                  flex-col
                  gap-6

                  rounded-2xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  p-6

                  transition-all
                  duration-300

                  hover:bg-white/[0.05]

                  xl:flex-row
                  xl:items-center
                  xl:justify-between

                "
              >

                <div>

                  <h3
                    className="text-lg font-semibold"
                  >

                    {customer.name}

                  </h3>

                  <p
                    className="mt-2 text-zinc-400"
                  >

                    {customer.email}

                  </p>

                  <p
                    className="mt-3 text-sm text-zinc-500"
                  >

                    Company:
                    {" "}
                    {

                      customer.companies?.name ||

                      "Unknown"

                    }

                  </p>

                </div>

                <div>

                  <span

                    className="

                      rounded-full

                      border
                      border-white/10

                      bg-white/[0.04]

                      px-4
                      py-2

                      text-sm
                      capitalize
                      text-zinc-300

                    "
                  >

                    {customer.status}

                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </OrbitCard>

    </OrbitSection>

  </div>
  );

}