"use client";

import {
  useEffect,
  useState,
} from "react";

import { Brain }
from "lucide-react";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitCard
from "@/components/ui/OrbitCard";

import { supabase }
from "@/lib/supabase";

type MemoryItem = {
  id: string;

  type: string;

  content: string;

  created_at: string;
};

export default function DashboardMemory() {
  const [memory, setMemory] =
    useState<MemoryItem[]>(
      []
    );

  async function loadMemory() {
    const { data } =
      await supabase
        .from(
          "workspace_memory"
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(6);

    setMemory(data ?? []);
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

            schema: "public",

            table:
              "workspace_memory",
          },

          async () => {
            await loadMemory();
          }
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
        badge="AI Memory"
        title="AI Memory Stream"
        subtitle="
          Realtime cognition insights and autonomous workspace memory.
        "
      />

      <div
        className="
          mt-6
          space-y-3
        "
      >
        {memory.map(
          (item) => (
            <OrbitCard
              key={item.id}
              className="
                flex
                items-start
                gap-3

                p-4
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9

                  items-center
                  justify-center

                  rounded-2xl

                  bg-violet-500/10

                  text-violet-300
                "
              >
                <Brain
                  size={16}
                />
              </div>

              <div
              className="
              min-w-0
              flex-1
              "
              >
                <p
                  className="
                    text-sm
                    leading-relaxed
                    text-white/70
                    line-clamp-2

                  "
                >
                  {item.content}
                </p>

                <p
                  className="
                    mt-2

                    text-xs
                    text-white/40
                  "
                >
                  {new Date(
                    item.created_at
                  ).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </OrbitCard>
          )
        )}
      </div>
    </OrbitSection>
  );
}