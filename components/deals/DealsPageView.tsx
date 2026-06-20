"use client";

import {
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import {
  LayoutGrid,
  List,
} from "lucide-react";

import { cn } from "@/lib/utils";

import OrbitInput from "@/components/ui/OrbitInput";
import OrbitButton from "@/components/ui/OrbitButton";

import DealsMetricStrip from "./DealsMetricStrip";
import DealsPipeline from "./DealsPipeline";
import DealsListCommand from "./DealsListCommand";
import CreateDealSheet from "./CreateDealSheet";

import { Deal } from "@/types/deal";
import { Company } from "@/types/company";
import { Contact } from "@/types/contact";

type View = "list" | "pipeline";

type Props = {
  deals: Deal[];
  companies: Company[];
  contacts: Contact[];
};

export default function DealsPageView({
  deals,
  companies,
  contacts,
}: Props) {
  const t = useTranslations("deals");

  const router = useRouter();

  const [view, setView] = useState<View>("list");

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const filteredDeals = useMemo(() => {
    const query = search.toLowerCase();

    return deals.filter(
      (deal) =>
        deal.title?.toLowerCase().includes(query) ||
        deal.company?.name?.toLowerCase().includes(query) ||
        deal.contact?.name?.toLowerCase().includes(query)
    );
  }, [deals, search]);

  return (
    <>
      <div className="space-y-4">
        {/* TITLE + ACTIONS */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-[11px]
                uppercase
                tracking-[0.18em]

                text-zinc-500
              "
            >
              {t("commercialPipeline")}
            </p>

            <h1
              className="
                mt-1.5

                text-2xl
                font-semibold
                tracking-tight
              "
            >
              {t("commercialPipeline")}
            </h1>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            {/* VIEW SWITCHER */}

            <div
              className="
                flex
                items-center
                gap-0.5

                rounded-xl

                border
                border-white/[0.08]

                bg-white/[0.02]

                p-1
              "
            >
              <button
                onClick={() => setView("list")}
                className={cn(
                  `
                  flex
                  h-7
                  items-center
                  gap-1.5

                  rounded-lg

                  px-2.5

                  text-xs
                  font-medium

                  transition-all
                  `,
                  view === "list"
                    ? "bg-white/[0.08] text-white"
                    : "text-white/40 hover:text-white/65"
                )}
              >
                <List size={12} />
                {t("listView")}
              </button>

              <button
                onClick={() => setView("pipeline")}
                className={cn(
                  `
                  flex
                  h-7
                  items-center
                  gap-1.5

                  rounded-lg

                  px-2.5

                  text-xs
                  font-medium

                  transition-all
                  `,
                  view === "pipeline"
                    ? "bg-white/[0.08] text-white"
                    : "text-white/40 hover:text-white/65"
                )}
              >
                <LayoutGrid size={12} />
                {t("pipelineView")}
              </button>
            </div>

            <OrbitButton onClick={() => setOpen(true)}>
              {t("createOpportunity")}
            </OrbitButton>
          </div>
        </div>

        {/* METRIC STRIP */}

        <DealsMetricStrip deals={deals} />

        {/* SEARCH */}

        <div
          className="
            w-full
            max-w-sm
          "
        >
          <OrbitInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchOpportunities")}
          />
        </div>
      </div>

      {/* VIEW CONTENT */}

      <div className="mt-6">
        {view === "list" ? (
          <DealsListCommand deals={filteredDeals} />
        ) : (
          <DealsPipeline
            deals={filteredDeals}
            onRefresh={() => router.refresh()}
          />
        )}
      </div>

      <CreateDealSheet
        open={open}
        onOpenChange={setOpen}
        companies={companies}
        contacts={contacts}
        onCreated={() => router.refresh()}
      />
    </>
  );
}
