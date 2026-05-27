"use client";

import { useRouter }
from "next/navigation";

import {
  Bot,
  CheckSquare,
  FileText,
  Users,
} from "lucide-react";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitCard
from "@/components/ui/OrbitCard";

type DashboardQuickActionsProps = {
  onOpenAssistant?: () => void;
};

export default function DashboardQuickActions({
  onOpenAssistant,
}: DashboardQuickActionsProps) {
  const router = useRouter();
  

  const actions = [
    {
      title:
        "Open Orbit AI",

      description:
        "Launch AI workspace assistant.",

      icon: Bot,

      action: () =>
        onOpenAssistant?.(),
    },

    {
      title:
        "Create Task",

      description:
        "Create workspace task.",

      icon: CheckSquare,

      action: () =>
        router.push(
          "/dashboard/tasks"
        ),
    },

    {
      title:
        "Add Contact",

      description:
        "Create CRM entry.",

      icon: Users,

      action: () =>
        router.push(
          "/dashboard/crm"
        ),
    },

    {
      title:
        "New Note",

      description:
        "Write workspace note.",

      icon: FileText,

      action: () =>
        router.push(
          "/dashboard/notes"
        ),
    },
  ];

  return (
    <OrbitSection>
      <OrbitHeading
        badge="Workspace Actions"
        title="Quick Actions"
        subtitle="
          Fast access to OrbitDesk
          workspace operations.
        "
      />

      <div
        className="
          mt-6

          grid
          gap-3

          md:grid-cols-2
          lg:grid-cols-4
        "
      >
        {actions.map(
          (action) => {
            const Icon =
              action.icon;

            return (
              <OrbitCard
                key={
                  action.title
                }
                onClick={
                  action.action
                }
                className="
                  cursor-pointer

                  p-4

                  transition-all

                  hover:border-violet-500/30
                  hover:bg-violet-500/[0.04]
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10

                    items-center
                    justify-center

                    rounded-xl

                    bg-violet-500/10

                    text-violet-300
                  "
                >
                  <Icon
                    size={16}
                  />
                </div>

                <h3
                  className="
                    mt-4

                    text-sm
                    font-medium
                  "
                >
                  {action.title}
                </h3>

                <p
                  className="
                    mt-2

                    line-clamp-1

                    text-sm
                    leading-relaxed

                    text-white/40
                  "
                >
                  {
                    action.description
                  }
                </p>
              </OrbitCard>
            );
          }
        )}
      </div>
    </OrbitSection>
  );
}