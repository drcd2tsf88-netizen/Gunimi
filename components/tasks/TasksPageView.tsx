"use client";

import {
  CheckSquare,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitEmptyState
from "@/components/ui/OrbitEmptyState";

export default function TasksPageView() {
  const t =
    useTranslations(
      "tasks"
    );

  return (
    <>
      <OrbitHeading
        badge={t(
          "workspace"
        )}
        title={t(
          "tasks"
        )}
        subtitle={t(
          "tasksSubtitle"
        )}
      />

      <OrbitSection>
        <OrbitEmptyState
          icon={CheckSquare}
          title={t(
            "comingSoon"
          )}
          description={t(
            "comingSoonDescription"
          )}
        />
      </OrbitSection>
    </>
  );
}