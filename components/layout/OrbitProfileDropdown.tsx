"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image
from "next/image";

import {
  useRouter,
} from "next/navigation";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Check,
  ChevronDown,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  User,
} from "lucide-react";

import { toast }
from "react-hot-toast";

import { useTranslations }
from "next-intl";

import type { User as SupabaseUser } from "@supabase/supabase-js";

import { supabase }
from "@/lib/supabase";

import { getWorkspaceMembership }
from "@/server/actions/workspace/getWorkspaceMembership";

import { getUserWorkspaces }
from "@/server/actions/workspace/getUserWorkspaces";

import { setActiveWorkspace }
from "@/server/actions/workspace/setActiveWorkspace";

import CreateWorkspaceSheet
from "@/components/settings/workspace/CreateWorkspaceSheet";

type Workspace = {
  id: string;

  name: string;

  slug: string;
};

type WorkspaceData = {
  workspace: Workspace;

  membership: {
    role: string;
  };
};

export default function OrbitProfileDropdown() {
  const t = useTranslations("auth");
  const tNav = useTranslations("nav");
  const router =
    useRouter();

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const [open, setOpen] =
    useState(false);

  const [createSheetOpen, setCreateSheetOpen] =
    useState(false);

  const [workspaceData, setWorkspaceData] =
    useState<WorkspaceData | null>(
      null
    );

  const [user, setUser] =
    useState<SupabaseUser | null>(null);

  const [profileName, setProfileName] =
    useState<string>("");

  const [workspaces, setWorkspaces] =
    useState<Workspace[]>([]);

  const [activeWorkspaceId, setActiveWorkspaceId] =
    useState<string>("");

  // LOAD DATA

  useEffect(() => {
    async function loadData() {
      // USER

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        setProfileName(profileRow?.full_name ?? user.email ?? "");
      }

      // WORKSPACE MEMBERSHIP

      const workspace =
        await getWorkspaceMembership();

      if (workspace) {
        setWorkspaceData(workspace);
      }

      // ALL WORKSPACES

      const all =
        await getUserWorkspaces();

      setWorkspaces(all);

      if (workspace) {
        setActiveWorkspaceId(
          workspace.workspace.id
        );
      } else if (all.length > 0) {
        setActiveWorkspaceId(all[0].id);
      }
    }

    loadData();
  }, []);

  // CLICK OUTSIDE

  useEffect(() => {
    function handleOutside(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);

  // LOGOUT

  async function handleLogout() {
    try {
      await supabase.auth.signOut();

      toast.success(t("logoutSuccess"));
      router.push("/login");
    } catch {
      toast.error(t("logoutFailed"));
    }
  }

  // USER INITIAL

  const initial =
    (profileName || user?.email || "O")[0].toUpperCase();

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* TRIGGER */}

      <motion.button
        whileHover={{
          y: -2,
        }}
        onClick={() =>
          setOpen(!open)
        }
        className="
          flex
          items-center
          gap-3

          rounded-2xl

          border
          border-white/10

          bg-white/[0.03]

          px-3
          py-2

          transition-all

          hover:border-white/20
        "
      >
        {/* AVATAR */}

        <div
          className="
            relative

            flex
            h-11
            w-11

            items-center
            justify-center

            overflow-hidden

            rounded-2xl

            border
            border-white/10

            bg-violet-500/20

            text-sm
            font-medium

            text-violet-200
          "
        >
          {user?.user_metadata
            ?.avatar_url ? (
            <Image
              src={
                user.user_metadata
                  .avatar_url
              }
              alt="Avatar"
              fill
              className="
                object-cover
              "
            />
          ) : (
            initial
          )}
        </div>

        {/* USER INFO */}

        <div
          className="
            hidden
            text-left

            md:block
          "
        >
          <p
            className="
              max-w-[180px]

              truncate

              text-sm
              font-medium
            "
          >
            {profileName || user?.email}
          </p>

          <p
            className="
              text-xs
              text-white/40
            "
          >
            {
              workspaces.find(
                (w) => w.id === activeWorkspaceId
              )?.name ?? workspaceData?.workspace?.name ?? ""
            }
          </p>
        </div>

        <ChevronDown
          size={16}
          className="
            hidden
            text-white/40

            md:block
          "
        />
      </motion.button>

      {/* DROPDOWN */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
            }}
            className="
              absolute
              right-0
              top-[68px]
              z-[999]

              w-[340px]

              overflow-hidden

              rounded-[32px]

              border
              border-white/10

              bg-[#0A0F1F]/95

              backdrop-blur-2xl
            "
          >
            {/* HEADER */}

            <div
              className="
                border-b
                border-white/5

                p-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >
                {/* LARGE AVATAR */}

                <div
                  className="
                    relative

                    flex
                    h-16
                    w-16

                    items-center
                    justify-center

                    overflow-hidden

                    rounded-3xl

                    border
                    border-white/10

                    bg-violet-500/20

                    text-lg
                    font-medium

                    text-violet-200
                  "
                >
                  {user
                    ?.user_metadata
                    ?.avatar_url ? (
                    <Image
                      src={
                        user
                          .user_metadata
                          .avatar_url
                      }
                      alt="Avatar"
                      fill
                      className="
                        object-cover
                      "
                    />
                  ) : (
                    initial
                  )}
                </div>

                {/* USER */}

                <div>
                  <p
                    className="
                      max-w-[180px]

                      truncate

                      text-sm
                      font-medium
                    "
                  >
                    {profileName || user?.email}
                  </p>

                  <p
                    className="
                      mt-0.5

                      max-w-[180px]

                      truncate

                      text-xs
                      text-white/40
                    "
                  >
                    {user?.email}
                  </p>

                  <p
                    className="
                      mt-1

                      text-xs
                      text-white/30
                    "
                  >
                    {
                      workspaceData
                        ?.membership
                        ?.role
                    }
                  </p>
                </div>
              </div>

              {/* STATUS */}

              <div
                className="
                  mt-5

                  flex
                  items-center
                  gap-3
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
                    text-sm
                    text-emerald-300
                  "
                >
                  {t("workspaceSynchronized")}
                </p>
              </div>
            </div>

            {/* WORKSPACES */}

            <div
              className="
                border-b
                border-white/5

                p-4
              "
            >
              <p
                className="
                  mb-3

                  text-xs
                  uppercase
                  tracking-wider

                  text-white/30
                "
              >
                {tNav("workspaces")}
              </p>

              <div
                className="
                  space-y-2
                "
              >
                {workspaces.map(
                  (
                    workspace
                  ) => (
                    <button
                      key={
                        workspace.id
                      }
                      onClick={async () => {
                        const ok =
                          await setActiveWorkspace(
                            workspace.id
                          );

                        if (ok) {
                          setActiveWorkspaceId(
                            workspace.id
                          );

                          toast.success(
                            t("switchedToWorkspace", { name: workspace.name })
                          );

                          setOpen(false);

                          window.location.href =
                            "/dashboard";
                        } else {
                          toast.error(
                            t("switchWorkspaceFailed")
                          );
                        }
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between

                        rounded-2xl

                        border
                        border-white/5

                        bg-white/[0.03]

                        px-4
                        py-3

                        text-left

                        transition-all

                        hover:border-white/10
                        hover:bg-white/[0.05]
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >
                        <div
                          className="
                            flex
                            h-10
                            w-10

                            items-center
                            justify-center

                            rounded-2xl

                            bg-violet-500/15

                            text-violet-200
                          "
                        >
                          <Sparkles
                            size={16}
                          />
                        </div>

                        <div>
                          <p
                            className="
                              text-sm
                              font-medium
                            "
                          >
                            {
                              workspace.name
                            }
                          </p>

                          <p
                            className="
                              mt-1

                              text-xs
                              text-white/40
                            "
                          >
                            {
                              workspace.slug
                            }
                          </p>
                        </div>
                      </div>

                      {activeWorkspaceId ===
                        workspace.id && (
                        <Check
                          size={16}
                          className="
                            text-emerald-300
                          "
                        />
                      )}
                    </button>
                  )
                )}
              </div>

              {/* CREATE WORKSPACE */}

              <button
                onClick={() => {
                  setOpen(false);
                  setCreateSheetOpen(true);
                }}
                className="
                  mt-2

                  flex
                  w-full
                  items-center
                  gap-3

                  rounded-2xl

                  border
                  border-dashed
                  border-white/10

                  px-4
                  py-3

                  text-left
                  text-sm
                  text-white/40

                  transition-all

                  hover:border-violet-500/30
                  hover:bg-violet-500/5
                  hover:text-violet-300
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10

                    items-center
                    justify-center

                    rounded-2xl

                    border
                    border-dashed
                    border-white/10

                    transition-all

                    group-hover:border-violet-500/20
                  "
                >
                  <Plus size={14} />
                </div>

                <span className="font-medium">
                  {tNav("createWorkspace")}
                </span>
              </button>
            </div>

            {/* ACTIONS */}

            <div
              className="
                p-3
              "
            >
              <button
                onClick={() => {
                  setOpen(false);

                  router.push(
                    "/dashboard/settings?section=profile"
                  );
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-3

                  rounded-2xl

                  px-4
                  py-4

                  text-sm
                  text-white/70

                  transition-all

                  hover:bg-white/[0.03]
                "
              >
                <User
                  size={16}
                />

                {tNav("profileSettings")}
              </button>

              <button
                onClick={() => {
                  setOpen(false);

                  router.push(
                    "/dashboard/settings"
                  );
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-3

                  rounded-2xl

                  px-4
                  py-4

                  text-sm
                  text-white/70

                  transition-all

                  hover:bg-white/[0.03]
                "
              >
                <Settings
                  size={16}
                />

                {tNav("workspaceSettings")}
              </button>

              <button
                onClick={
                  handleLogout
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-3

                  rounded-2xl

                  px-4
                  py-4

                  text-sm
                  text-red-300

                  transition-all

                  hover:bg-red-500/10
                "
              >
                <LogOut
                  size={16}
                />

                {tNav("logout")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateWorkspaceSheet
        open={createSheetOpen}
        onOpenChange={setCreateSheetOpen}
      />
    </div>
  );
}