"use client";

import {
  useTranslations,
} from "next-intl";

import {
  Plus,
} from "lucide-react";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitButton
from "@/components/ui/OrbitButton";

type Props = {
  onCreate: () => void;
};

export default function DealsHero({
  onCreate,
}: Props) {
  const t =
    useTranslations();

  return (
    <OrbitSection>
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
        <OrbitHeading
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

        <OrbitButton
          onClick={onCreate}
        >
          <Plus size={16} />

          {t(
            "deals.createOpportunity"
          )}
        </OrbitButton>
      </div>
    </OrbitSection>
  );
}