"use client";

import {
  useMemo,
  useState,
} from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useTranslations } from "next-intl";

import {
  LayoutGrid,
  List,
  PlusCircle,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

import GunimiInput from "@/components/ui/GunimiInput";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";

import DealsMetricStrip from "./DealsMetricStrip";
import DealsPipeline from "./DealsPipeline";
import DealsListCommand, { type DealStage } from "./DealsListCommand";
import CreateDealSheet from "./CreateDealSheet";
import EditDealSheet from "./EditDealSheet";

import { Deal } from "@/types/deal";
import { Company } from "@/types/company";
import { Contact } from "@/types/contact";

const VALID_STAGES: DealStage[] = ["lead", "qualified", "proposal", "negotiation", "won", "lost"];

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
  const searchParams = useSearchParams();

  const stageParam = searchParams.get("stage");
  const initialStage: DealStage | undefined = VALID_STAGES.includes(stageParam as DealStage)
    ? (stageParam as DealStage)
    : undefined;

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
      <div className="space-y-6">
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

            <GunimiButton onClick={() => setOpen(true)}>
              {t("createOpportunity")}
            </GunimiButton>
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
          <GunimiInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchOpportunities")}
          />
        </div>
      </div>

      {/* VIEW CONTENT */}

      <div className="mt-6">
        {deals.length === 0 ? (
          <GunimiEmptyState
            icon={TrendingUp}
            title={t("onboardingEmptyTitle")}
            description={t("onboardingEmptyDescription")}
            action={
              <GunimiButton onClick={() => setOpen(true)}>
                <PlusCircle size={14} />
                {t("onboardingCreateDeal")}
              </GunimiButton>
            }
          />
        ) : view === "list" ? (
          <DealsListCommand
            deals={filteredDeals}
            onEdit={setEditingDeal}
            initialStage={initialStage}
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
