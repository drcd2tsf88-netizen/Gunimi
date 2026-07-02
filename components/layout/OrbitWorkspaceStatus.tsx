"use client";

import {
  useEffect,
  useState,
} from "react";

import { useTranslations } from "next-intl";

import {
  motion,
} from "framer-motion";

import {
  Sparkles,
} from "lucide-react";

import { getWorkspaceMembers }
from "@/server/actions/workspace/getWorkspaceMembers";

import { getWorkspaceMembership }
from "@/server/actions/workspace/getWorkspaceMembership";

import type { MemberRowData }
from "@/components/settings/members/MemberRow";

type WorkspaceData = {
  workspace: {
    id: string;

    name: string;

    slug: string;
  };

  membership: {
    role: string;
  };
};

export default function OrbitWorkspaceStatus() {
  const tNav = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const [members, setMembers] =
    useState<MemberRowData[]>([]);

  const [workspaceData, setWorkspaceData] =
    useState<WorkspaceData | null>(
      null
    );

  // LOAD MEMBERS

  useEffect(() => {
    async function loadData() {
      // MEMBERS

      const membersData =
        await getWorkspaceMembers();

      setMembers(
        membersData as unknown as MemberRowData[]
      );

      // WORKSPACE

      const workspace =
        await getWorkspaceMembership();

      setWorkspaceData(
        workspace
      );
    }

    loadData();
  }, []);

  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      className="
        hidden
        items-center
        gap-3

        rounded-xl

        border
        border-white/10

        bg-white/[0.03]

        px-3
        py-2
        backdrop-blur-xl
        shadow-[0_0_30px_rgba(124,58,237,0.08)]

        transition-all
        hover:bg-white/[0.05]

        md:flex
      "
    >
      {/* ICON */}

      <div
        className="
          flex
          h-9
          w-9

          items-center
          justify-center

          rounded-xl

          bg-violet-500/15

          text-violet-200
        "
      >
        <Sparkles size={15} />
      </div>

      {/* INFO */}

      <div>
        {/* WORKSPACE NAME */}

        <p
          className="
            text-xs
            font-semihold
            tracking-wide
          "
        >
          {
            workspaceData
              ?.workspace
              ?.name ||
            "Orbit Workspace"
          }
        </p>

        {/* MEMBERS */}

        <div
          className="
            mt-1

            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              h-2
              w-2

              animate-pulse

              rounded-full

              bg-emerald-400
            "
          />

          <p
            className="
              text-[10px]
              text-zinc-500
            "
          >
            {tNav("membersOnline", { count: members.length })}
          </p>
        </div>

        {/* AI STATUS */}

        <p
          className="
            mt-1

            text-[10px]
            uppercase

            tracking-[0.18em]

            text-violet-300
          "
        >
          {tAuth("aiWorkspaceActive")}
        </p>
      </div>
    </motion.div>
  );
}