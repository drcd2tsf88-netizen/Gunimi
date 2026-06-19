"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useTranslations } from "next-intl";

import toast
from "react-hot-toast";

import { getCRMContacts }
from "@/server/actions/crm/getCRMContacts";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitSkeleton
from "@/components/ui/OrbitSkeleton";
import WorkspaceCRM
from "@/components/workspace/WorkspaceCRM";

export default function CRMPage() {
  const t = useTranslations("crm");

  const [customers, setCustomers] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const createFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    loadCustomers();

  }, []);

  async function loadCustomers() {

    try {

      setLoading(true);

      const data =
        await getCRMContacts();

      setCustomers(data);

    } catch (error) {

      console.error(error);

      toast.error(
        t("failedToLoad")
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

        badge={t("badge")}

        title={t("title")}

        subtitle={t("subtitle")}

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

              {t("customerDatabase")}

            </h2>

            <p
              className="mt-2 text-zinc-400"
            >

              {t("searchAndManage")}

            </p>

          </div>

          <input
            type="text"
            placeholder={t("searchCustomers")}
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

            {t("totalCustomers")}

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

            {t("activeLeads")}

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

            {t("wonDeals")}

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

              {t("customers")}

            </h2>

            <p
              className="mt-2 text-zinc-400"
            >

              {t("workspaceCrmContacts")}

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
            {t("results")}

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

    {t("crmReady")}

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

    {t("crmReadyDescription")}

  </p>

  {/* Actions */}
  <div
    className="mt-10 flex gap-4"
  >

    <button

      onClick={() =>
        createFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }

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

      {t("addFirstContact")}

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

      {t("generateDemoData")}

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

                    {t("company")}:
                    {" "}
                    {
                      customer.companies?.name ||
                      t("unknown")
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
    <div ref={createFormRef}>
      <WorkspaceCRM
        contacts={customers}
        refresh={loadCustomers}
        refreshActivity={() => {}}
      />
    </div>

  </div>
  );

}
