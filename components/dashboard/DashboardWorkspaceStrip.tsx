"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  Users,
  CheckSquare,
  FileText,
  Building2,
} from "lucide-react";

import { useTranslations }
from "next-intl";

import { supabase }
from "@/lib/supabase";

import { getWorkspaceMembers }
from "@/server/actions/workspace/getWorkspaceMembers";

type WorkspaceSnapshot = {
  members: number;
  tasks: number;
  relationships: number;
  documents: number;
};

export default function DashboardWorkspaceStrip() {
  const t =
    useTranslations();

  const [
    snapshot,

    setSnapshot,
  ] = useState<WorkspaceSnapshot>({
    members: 0,
    tasks: 0,
    relationships: 0,
    documents: 0,
  });

  async function loadData() {
    const members =
      await getWorkspaceMembers();

    const {
      count: tasks,
    } = await supabase
      .from(
        "workspace_tasks"
      )
      .select("*", {
        count: "exact",
        head: true,
      });

    const {
      count: relationships,
    } = await supabase
      .from(
        "workspace_contacts"
      )
      .select("*", {
        count: "exact",
        head: true,
      });

    const {
      count: documents,
    } = await supabase
      .from(
        "workspace_documents"
      )
      .select("*", {
        count: "exact",
        head: true,
      });

    setSnapshot({
      members:
        members?.length ?? 0,

      tasks:
        tasks ?? 0,

      relationships:
        relationships ?? 0,

      documents:
        documents ?? 0,
    });
  }

  useEffect(() => {
    loadData();

    const membersChannel =
      supabase
        .channel(
          "workspace-members"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema:
              "public",
            table:
              "workspace_members",
          },
          loadData
        )
        .subscribe();

    const tasksChannel =
      supabase
        .channel(
          "workspace-tasks"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema:
              "public",
            table:
              "workspace_tasks",
          },
          loadData
        )
        .subscribe();

    const contactsChannel =
      supabase
        .channel(
          "workspace-contacts"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema:
              "public",
            table:
              "workspace_contacts",
          },
          loadData
        )
        .subscribe();

    const documentsChannel =
      supabase
        .channel(
          "workspace-documents"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema:
              "public",
            table:
              "workspace_documents",
          },
          loadData
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        membersChannel
      );

      supabase.removeChannel(
        tasksChannel
      );

      supabase.removeChannel(
        contactsChannel
      );

      supabase.removeChannel(
        documentsChannel
      );
    };
  }, []);

  const items = [
    {
      icon: Users,
      value:
        snapshot.members,
      label:
        t(
          "dashboard.members"
        ),
    },

    {
      icon: CheckSquare,
      value:
        snapshot.tasks,
      label:
        t(
          "dashboard.tasks"
        ),
    },

    {
      icon: Building2,
      value:
        snapshot.relationships,
      label:
        t(
          "dashboard.relationships"
        ),
    },

    {
      icon: FileText,
      value:
        snapshot.documents,
      label:
        t(
          "dashboard.documents"
        ),
    },
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        mt-6

        flex
        flex-wrap

        gap-3
      "
    >
      {items.map(
        (
          item,
          index
        ) => {
          const Icon =
            item.icon;

          return (
            <div
              key={index}
              className="
                inline-flex
                items-center
                gap-2

                rounded-full

                border
                border-white/10

                bg-white/[0.03]

                px-4
                py-2

                text-xs

                backdrop-blur-xl
              "
            >
              <Icon
                size={14}
                className="
                  text-violet-300
                "
              />

              <span>
                {item.value}
                {" "}
                {item.label}
              </span>
            </div>
          );
        }
      )}

      {/* SYSTEM STATUS */}

      <div
        className="
          inline-flex
          items-center
          gap-2

          rounded-full

          border
          border-emerald-500/20

          bg-emerald-500/10

          px-4
          py-2

          text-xs

          backdrop-blur-xl
        "
      >
        <div
          className="
            relative

            flex
            h-2
            w-2
          "
        >
          <div
            className="
              absolute
              inset-0

              animate-ping

              rounded-full

              bg-emerald-400/40
            "
          />

          <div
            className="
              relative

              h-2
              w-2

              rounded-full

              bg-emerald-400
            "
          />
        </div>

        <span>
          {t(
            "dashboard.systemHealthy"
          )}
        </span>
      </div>
    </motion.div>
  );
}