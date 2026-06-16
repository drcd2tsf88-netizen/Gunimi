"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  BookOpen,
} from "lucide-react";

import { useTranslations }
from "next-intl";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitCard
from "@/components/ui/OrbitCard";

import { supabase }
from "@/lib/supabase";

import getRelativeTime
from "@/lib/utils/getRelativeTime";

type MemoryItem = {
  id: string;

  type: string;

  content: string;

  created_at: string;
};

export default function WorkspaceMemory() {
  const t =
    useTranslations();

  const [
    memory,

    setMemory,
  ] = useState<
    MemoryItem[]
  >([]);

  async function loadMemory() {
    const {
      data,
    } = await supabase
      .from(
        "workspace_memory"
      )
      .select("*")
      .order(
        "created_at",
        {
          ascending:
            false,
        }
      )
      .limit(6);

    setMemory(
      data ?? []
    );
  }

  useEffect(() => {
    loadMemory();

    const channel =
      supabase
        .channel(
          "workspace-memory-dashboard"
        )
        .on(
          "postgres_changes",
          {
            event: "*",

            schema:
              "public",

            table:
              "workspace_memory",
          },

          loadMemory
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  return (
    <OrbitSection>
      <OrbitHeading
        badge={t(
          "dashboard.knowledgeBase"
        )}
        title={t(
          "dashboard.workspaceMemory"
        )}
        subtitle={t(
          "dashboard.workspaceMemorySubtitle"
        )}
      />

      <div
        className="
          mt-6
          space-y-3
        "
      >
        {memory.length ===
        0 ? (
          <OrbitCard
            className="
              p-6
            "
          >
            <h3
              className="
                text-base
                font-medium
              "
            >
              {t(
                "dashboard.noWorkspaceMemory"
              )}
            </h3>

            <p
              className="
                mt-2

                text-sm
                text-white/50
              "
            >
              {t(
                "dashboard.noWorkspaceMemoryDescription"
              )}
            </p>
          </OrbitCard>
        ) : (
          memory.map(
            (item) => (
              <OrbitCard
                key={
                  item.id
                }
                className="
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-4
                  "
                >
                  {/* ICON */}

                  <div
                    className="
                      flex
                      h-10
                      w-10

                      shrink-0

                      items-center
                      justify-center

                      rounded-2xl

                      bg-violet-500/10

                      text-violet-300
                    "
                  >
                    <BookOpen
                      size={16}
                    />
                  </div>

                  {/* CONTENT */}

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    {/* TYPE */}

                    <div
                      className="
                        inline-flex

                        rounded-full

                        border
                        border-violet-500/20

                        bg-violet-500/10

                        px-2
                        py-1

                        text-[10px]
                        uppercase

                        tracking-wide

                        text-violet-300
                      "
                    >
                      {item.type}
                    </div>

                    {/* MEMORY */}

                    <p
                      className="
                        mt-3

                        text-sm
                        leading-relaxed

                        text-white/70
                      "
                    >
                      {
                        item.content
                      }
                    </p>

                    {/* TIME */}

                    <p
                      className="
                        mt-3

                        text-xs

                        text-white/40
                      "
                    >
                      {getRelativeTime(
                        item.created_at
                      )}
                    </p>
                  </div>
                </div>
              </OrbitCard>
            )
          )
        )}
      </div>
    </OrbitSection>
  );
}