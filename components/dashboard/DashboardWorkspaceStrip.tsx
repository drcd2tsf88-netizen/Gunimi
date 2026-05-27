"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  Sparkles,
  Users,
  Brain,
  Activity,
} from "lucide-react";

import { supabase }
from "@/lib/supabase";

import { getWorkspaceMembers }
from "@/server/actions/workspace/getWorkspaceMembers";

import { getWorkspaceAIState }
from "@/server/actions/ai/getWorkspaceAIState";

type AIState = {
  context?: string;
};

export default function DashboardWorkspaceStrip() {
  const [
    members,

    setMembers,
  ] = useState<any[]>([]);

  const [
    aiState,

    setAIState,
  ] =
    useState<AIState | null>(
      null
    );

  async function loadData() {
    const membersData =
      await getWorkspaceMembers();

    const aiData =
      await getWorkspaceAIState();

    setMembers(
      membersData ?? []
    );

    setAIState(aiData);
  }

  useEffect(() => {
    loadData();

    // MEMBERS REALTIME

    const membersChannel =
      supabase
        .channel(
          "workspace-strip-members"
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
          () => {
            loadData();
          }
        )
        .subscribe();

    // AI REALTIME

    const aiChannel =
      supabase
        .channel(
          "workspace-strip-ai"
        )
        .on(
          "postgres_changes",
          {
            event: "*",

            schema:
              "public",

            table:
              "workspace_ai_state",
          },
          () => {
            loadData();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        membersChannel
      );

      supabase.removeChannel(
        aiChannel
      );
    };
  }, []);

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
      {/* MEMBERS */}

      <div
        className="
          inline-flex
          items-center
          gap-2

          rounded-full

          border
          border-white/10

          bg-white/[0.03]

          px-3
          py-2

          text-xs

          backdrop-blur-xl
        "
      >
        <Users
          size={14}
          className="
            text-violet-300
          "
        />

        <span>
          {members.length} Active Members
        </span>
      </div>

      {/* AI STATUS */}

      <div
        className="
          inline-flex
          items-center
          gap-2

          rounded-full

          border
          border-cyan-500/20

          bg-cyan-500/10

          px-3
          py-2

          text-xs

          backdrop-blur-xl
        "
      >
        <Brain
          size={14}
          className="
            text-cyan-300
          "
        />

        <span>
          {
            aiState?.context ||
            "Orbit AI Systems Active"
          }
        </span>
      </div>

      {/* WORKSPACE */}

      <div
        className="
          inline-flex
          items-center
          gap-2

          rounded-full

          border
          border-white/10

          bg-white/[0.03]

          px-3
          py-2

          text-xs

          backdrop-blur-xl
        "
      >
        <Sparkles
          size={14}
          className="
            text-violet-300
          "
        />

        <span>
          Workspace Synced
        </span>
      </div>

      {/* LIVE */}

      <div
        className="
          inline-flex
          items-center
          gap-2

          rounded-full

          border
          border-emerald-500/20

          bg-emerald-500/10

          px-3
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
          Live Systems Operational
        </span>
      </div>

      {/* AI EVENTS */}

      <div
        className="
          inline-flex
          items-center
          gap-2

          rounded-full

          border
          border-violet-500/20

          bg-violet-500/10

          px-3
          py-2

          text-xs

          backdrop-blur-xl
        "
      >
        <Activity
          size={14}
          className="
            text-violet-300
          "
        />

        <span>
          AI Workflow Monitoring
        </span>
      </div>
    </motion.div>
  );
}