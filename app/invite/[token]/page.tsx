"use client";

import {
  useEffect,
  useState,
} from "react";

import Link
from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  motion,
} from "framer-motion";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

import toast
from "react-hot-toast";

import { supabase }
from "@/lib/supabase";

type Invite = {
  id: string;

  email: string;

  role: string;

  status: string;

  expires_at: string;

  workspace_id: string;

  workspaces?: {
    name: string;
  }| null;
};

export default function InvitePage() {
  const params =
    useParams();

  const router =
    useRouter();

  const token =
    params.token as string;

  const [invite, setInvite] =
    useState<Invite | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [accepting, setAccepting] =
    useState(false);

  const [error, setError] =
    useState("");
    const [isAuthenticated, setIsAuthenticated] =
  useState(false);

  async function acceptInvite() {
  if (!invite) {
    return;
  }

  try {
    setAccepting(true);

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session?.user) {
  router.push(
    `/login?invite=${token}`
  );

  return;
}


    const response =
      await fetch(
        "/api/workspace/invite/accept",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            token,
          }),
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      toast.error(
        result.error ||
          "Failed to accept invite."
      );

      return;
    }

    toast.success(
      "Workspace joined successfully."
    );

    router.push(
      "/dashboard"
    );
  } catch {
    toast.error(
      "Failed to accept invitation."
    );
  } finally {
    setAccepting(false);
  }
}

  useEffect(() => {
    if (!token) return;

    async function loadInvite() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);

        const response = await fetch(`/api/workspace/invite/${token}`);
        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Invalid invitation.");
          setLoading(false);
          return;
        }

        const data = result.invite;

        if (data.status !== "pending") {
          setError("This invite is no longer active.");
          setLoading(false);
          return;
        }

        const expired = new Date(data.expires_at) < new Date();
        if (expired) {
          setError("This invitation has expired.");
          setLoading(false);
          return;
        }

        setInvite(data);
        setLoading(false);
      } catch {
        setError("Failed to load invitation.");
        setLoading(false);
      }
    }

    void loadInvite();
  }, [token]);

  // ERROR STATE

  if (
    !loading &&
    error
  ) {
    return (
      <main
        className="
          flex
          min-h-screen

          items-center
          justify-center

          bg-[#050816]

          px-6

          text-white
        "
      >
        <div
          className="
            w-full
            max-w-xl

            rounded-[32px]

            border
            border-red-500/10

            bg-red-500/[0.03]

            p-10

            text-center

            backdrop-blur-3xl
          "
        >
          <div
            className="
              mx-auto

              flex
              h-20
              w-20

              items-center
              justify-center

              rounded-3xl

              bg-red-500/10

              text-red-300
            "
          >
            <AlertTriangle
              size={36}
            />
          </div>

          <h1
            className="
              mt-8

              text-4xl
              font-semibold
            "
          >
            Invitation Error
          </h1>

          <p
            className="
              mt-5

              text-zinc-400
            "
          >
            {error}
          </p>

          <Link
            href="/"
            className="
              mt-10

              inline-flex
              items-center
              gap-2

              rounded-2xl

              border
              border-white/10

              bg-white/[0.03]

              px-6
              py-4

              text-sm
              font-medium

              text-white/70

              transition-all

              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            Back to Gunimi

            <ArrowRight
              size={16}
            />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        relative

        flex
        min-h-screen

        items-center
        justify-center

        overflow-hidden

        bg-[#050816]

        px-6

        text-white
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          absolute
          inset-0

          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-[-160px]
            top-[-160px]

            h-[480px]
            w-[480px]

            rounded-full

            bg-violet-500/15

            blur-[180px]
          "
        />

        <div
          className="
            absolute
            bottom-[-160px]
            right-[-160px]

            h-[480px]
            w-[480px]

            rounded-full

            bg-cyan-500/10

            blur-[180px]
          "
        />
      </div>

      {/* CARD */}

      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="
          relative
          z-10

          w-full
          max-w-2xl

          overflow-hidden

          rounded-[36px]

          border
          border-white/[0.08]

          bg-white/[0.035]

          p-10

          text-center

          backdrop-blur-3xl
        "
      >
        {/* LOADING */}

        {loading && (
          <div>
            <div
              className="
                mx-auto

                flex
                h-20
                w-20

                items-center
                justify-center

                rounded-3xl

                border
                border-violet-500/20

                bg-violet-500/10
              "
            >
              <Loader2
                className="
                  h-8
                  w-8

                  animate-spin

                  text-violet-300
                "
              />
            </div>

            <h1
              className="
                mt-8

                text-4xl
                font-semibold
              "
            >
              Loading Invitation
            </h1>

            <p
              className="
                mt-4

                text-zinc-400
              "
            >
              Verifying invitation...
            </p>
          </div>
        )}

        {/* INVITE */}

        {!loading &&
          invite && (
            <div>
              {/* ICON */}

              <div
                className="
                  mx-auto

                  flex
                  h-24
                  w-24

                  items-center
                  justify-center

                  rounded-[32px]

                  border
                  border-violet-500/20

                  bg-violet-500/10
                "
              >
                <Users
                  className="
                    h-10
                    w-10

                    text-violet-200
                  "
                />
              </div>

              {/* BADGE */}

              <div
                className="
                  mt-8

                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-violet-500/20

                  bg-violet-500/10

                  px-4
                  py-2

                  text-[11px]
                  uppercase

                  tracking-[0.18em]

                  text-violet-300
                "
              >
                <Sparkles
                  size={12}
                />

                Gunimi Workspace Invite
              </div>

              {/* TITLE */}

              <h1
                className="
                  mt-8

                  text-5xl
                  font-semibold

                  tracking-tight
                "
              >
                Join
                <span
                  className="
                    bg-gradient-to-r
                    from-violet-300
                    via-white
                    to-cyan-300

                    bg-clip-text

                    text-transparent
                  "
                >
                  {" "}
                  Workspace
                </span>
              </h1>

              {/* TEXT */}

              <p
                className="
                  mx-auto
                  mt-6

                  max-w-xl

                  text-lg
                  leading-relaxed

                  text-white/60
                "
              >
                You have been invited
                to collaborate inside
                the Gunimi workspace.
              </p>

              {/* INFO */}

              <div
                className="
                  mt-10

                  rounded-[28px]

                  border
                  border-cyan-500/10

                  bg-cyan-500/[0.04]

                  p-6

                  text-left
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <Shield
                    className="
                      h-6
                      w-6

                      text-cyan-300
                    "
                  />

                  <div>
                    <h2
                      className="
                        text-lg
                        font-semibold
                      "
                    >
                      {
                        invite
                          .workspaces
                          ?.name
                      }
                    </h2>

                    <p
                      className="
                        mt-1

                        text-sm
                        text-cyan-100/60
                      "
                    >
                      Workspace Role:
                      {" "}
                      {
                        invite.role
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* BUTTON */}
             {isAuthenticated ? (
  <button
    onClick={
      acceptInvite
    }
    disabled={
      accepting
    }
    className="
      mt-10

      inline-flex
      items-center
      gap-2

      rounded-2xl

      bg-violet-500

      px-7
      py-4

      text-sm
      font-medium

      text-white

      transition-all

      hover:bg-violet-400

      disabled:cursor-not-allowed
      disabled:opacity-50
    "
  >
    {accepting ? (
      <>
        <Loader2
          className="
            h-4
            w-4

            animate-spin
          "
        />

        Joining Workspace...
      </>
    ) : (
      <>
        <CheckCircle2
          size={16}
        />

        Accept Invitation
      </>
    )}
  </button>
) : (
  <div
    className="
      mt-10

      flex
      flex-col

      gap-4
    "
  >
    <Link
      href={`/login?invite=${token}`}
      className="
        inline-flex
        items-center
        justify-center

        rounded-2xl

        bg-violet-500

        px-7
        py-4

        text-sm
        font-medium

        text-white

        transition-all

        hover:bg-violet-400
      "
    >
      Sign In
    </Link>

    <Link
      href={`/register?invite=${token}`}
      className="
        inline-flex
        items-center
        justify-center

        rounded-2xl

        border
        border-white/10

        bg-white/[0.03]

        px-7
        py-4

        text-sm
        font-medium

        text-white/80

        transition-all

        hover:bg-white/[0.05]
        hover:text-white
      "
    >
      Create Account
    </Link>
  </div>
)}
             
            </div>
          )}
      </motion.div>
    </main>
  );
}