"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useTranslations,
} from "next-intl";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitButton
from "@/components/ui/OrbitButton";

import OrbitInput
from "@/components/ui/OrbitInput";

import DealsMetrics
from "./DealsMetrics";

import DealsPipeline
from "./DealsPipeline";

import CreateDealsModal
from "./createDealsModal";

import { Deal } from "@/types/deal";
import { Company } from "@/types/company";
import { Contact } from "@/types/contact";

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
  const t =
    useTranslations(
      "deals"
    );

  const router =
    useRouter();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    open,
    setOpen,
  ] = useState(false);

  const filteredDeals =
    useMemo(() => {
      const query =
        search.toLowerCase();

      return deals.filter(
        (deal) =>
          deal.title
            ?.toLowerCase()
            .includes(query) ||
          deal.company?.name
            ?.toLowerCase()
            .includes(query) ||
          deal.contact?.name
            ?.toLowerCase()
            .includes(query)
      );
    }, [
      deals,
      search,
    ]);

  return (
    <>
      <OrbitHeading
        badge={t(
          "commercialPipeline"
        )}
        title={t(
          "commercialPipeline"
        )}
        subtitle={t(
          "commercialPipelineSubtitle"
        )}
      />

      <DealsMetrics
        deals={deals}
      />

      <OrbitSection>
        <div
          className="
            flex
            flex-col
            gap-4

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div
            className="
              w-full
              max-w-md
            "
          >
            <OrbitInput
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder={t(
                "searchOpportunities"
              )}
            />
          </div>

          <OrbitButton
            onClick={() =>
              setOpen(true)
            }
          >
            {t(
              "createOpportunity"
            )}
          </OrbitButton>
        </div>
      </OrbitSection>

      <DealsPipeline
        deals={
          filteredDeals
        }
        onRefresh={() =>
          router.refresh()
        }
      />

      <CreateDealsModal
        open={open}
        onOpenChange={
          setOpen
        }
        companies={
          companies
        }
        contacts={
          contacts
        }
        onCreated={() =>
          router.refresh()
        }
      />
    </>
  );
}