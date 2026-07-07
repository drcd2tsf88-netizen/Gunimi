"use client";

import {
  useTranslations,
} from "next-intl";

import {
  Plus,
} from "lucide-react";

import GunimiSection
from "@/components/layout/GunimiSection";

import GunimiHeading
from "@/components/ui/GunimiHeading";

import GunimiButton
from "@/components/ui/GunimiButton";

type Props = {
  onCreate: () => void;
};

export default function DealsHero({
  onCreate,
}: Props) {
  const t =
    useTranslations();

  return (
    <GunimiSection>
      <div
        className="
          flex
          flex-col
          gap-6

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <GunimiHeading
          badge={t(
            "deals.commercialPipeline"
          )}
          title={t(
            "deals.commercialPipeline"
          )}
          subtitle={t(
            "deals.commercialPipelineSubtitle"
          )}
        />

        <GunimiButton
          onClick={onCreate}
        >
          <Plus size={16} />

          {t(
            "deals.createOpportunity"
          )}
        </GunimiButton>
      </div>
    </GunimiSection>
  );
}