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
  PlusCircle,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

import OrbitInput from "@/components/ui/OrbitInput";
import OrbitButton from "@/components/ui/OrbitButton";

import DealsMetricStrip from "./DealsMetricStrip";
import DealsPipeline from "./DealsPipeline";
import DealsListCommand from "./DealsListCommand";
import CreateDealSheet from "./CreateDealSheet";
import EditDealSheet from "./EditDealSheet";

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

  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

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
        {deals.length === 0 ? (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-8 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <TrendingUp size={22} className="text-violet-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white/90">
                {t("onboardingEmptyTitle")}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/35">
                {t("onboardingEmptyDescription")}
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition-all hover:bg-violet-500/15"
            >
              <PlusCircle size={14} />
              {t("onboardingCreateDeal")}
            </button>
          </div>
        ) : view === "list" ? (
          <DealsListCommand
            deals={filteredDeals}
            onEdit={setEditingDeal}
          />
        ) : (
          <DealsPipeline
            deals={filteredDeals}
            onRefresh={() => router.refresh()}
            onEdit={setEditingDeal}
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

      {editingDeal && (
        <EditDealSheet
          key={editingDeal.id}
          deal={editingDeal}
          open={!!editingDeal}
          onOpenChange={(next) => {
            if (!next) setEditingDeal(null);
          }}
          companies={companies}
          contacts={contacts}
          onUpdated={() => {
            setEditingDeal(null);
            router.refresh();
          }}
          onDeleted={() => {
            setEditingDeal(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
