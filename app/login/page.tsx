"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  motion,
} from "framer-motion";

import Link
from "next/link";

import {
  ArrowRight,
  Brain,
  Sparkles,
} from "lucide-react";

import toast
from "react-hot-toast";

import { supabase }
from "@/lib/supabase";

import OrbitInput
from "@/components/ui/OrbitInput";

export default function LoginPage() {
  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      toast.loading(
        "Initializing Orbit authentication...",
        {
          id: "orbit-login",
        }
      );

      // LOGIN

      const {
        data,
        error,
      } =
        await supabase.auth.signInWithPassword(
          {
            email,

            password,
          }
        );

      if (error) {
        toast.error(
          error.message,
          {
            id: "orbit-login",
          }
        );

        return;
      }

      // SESSION SYNC
      // IMPORTANT FOR SSR

      await supabase.auth.refreshSession();

      const user =
        data.user;

      // SAFETY

      if (!user) {
        toast.error(
          "No authenticated user",
          {
            id: "orbit-login",
          }
        );

        return;
      }

      toast.loading(
        "Synchronizing workspace systems...",
        {
          id: "orbit-login",
        }
      );

      // FORCE APP ROUTER REFRESH

      router.refresh();

      // SMALL DELAY
      // allows cookies/session
      // to fully sync

      setTimeout(() => {
        router.push(
          "/dashboard"
        );
      }, 250);
    } catch (error) {
      console.error(error);

      toast.error(
        "Orbit authentication failed.",
        {
          id: "orbit-login",
        }
      );
    } finally {
      setLoading(false);
    }
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
      {/* ATMOSPHERE */}

      <div
        className="
          absolute
          inset-0

          overflow-hidden
        "
      >
        {/* GLOW */}

        <div
          className="
            absolute
            left-[-120px]
            top-[-120px]

            h-[340px]
            w-[340px]

            rounded-full

            bg-violet-500/15

            blur-[140px]
          "
        />

        <div
          className="
            absolute
            bottom-[-120px]
            right-[-80px]

            h-[340px]
            w-[340px]

            rounded-full

            bg-cyan-500/10

            blur-[160px]
          "
        />

        {/* GRID */}

        <div
          className="
            absolute
            inset-0

            opacity-[0.03]

            [background-image:linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]

            [background-size:80px_80px]
          "
        />
      </div>

      {/* CARD */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="
          relative
          z-10

          w-full
          max-w-lg

          overflow-hidden

          rounded-[32px]

          border
          border-white/[0.08]

          bg-white/[0.035]

          p-8

          backdrop-blur-3xl

          shadow-[0_0_80px_rgba(124,58,237,0.10)]
        "
      >
        {/* TOP LIGHT */}

        <div
          className="
            absolute
            inset-x-0
            top-0

            h-px

            bg-gradient-to-r
            from-transparent
            via-white/20
            to-transparent
          "
        />

        {/* AMBIENT */}

        <div
          className="
            pointer-events-none

            absolute
            right-[-80px]
            top-[-80px]

            h-[220px]
            w-[220px]

            rounded-full

            bg-violet-500/10

            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10
          "
        >
          {/* BADGE */}

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
              py-1.5

              text-[10px]
              uppercase

              tracking-[0.18em]

              text-violet-300
            "
          >
            <motion.div
              animate={{
                scale: [
                  1,
                  1.3,
                  1,
                ],

                opacity: [
                  0.5,
                  1,
                  0.5,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="
                h-2
                w-2

                rounded-full

                bg-violet-400
              "
            />

            Orbit AI Systems
          </div>

          {/* HEADER */}

          <div
            className="
              mt-6
            "
          >
            <h1
              className="
                text-4xl
                font-semibold

                tracking-tight
              "
            >
              Welcome to Orbit
            </h1>

            <p
              className="
                mt-4

                max-w-md

                text-sm
                leading-relaxed

                text-zinc-400
              "
            >
              AI-powered workspace
              operating system for
              modern productivity,
              workflows and customer
              intelligence.
            </p>
          </div>

          {/* FORM */}

          <div
            className="
              mt-8

              space-y-4
            "
          >
            <OrbitInput
              type="email"
              placeholder="
                Email address
              "
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <OrbitInput
              type="password"
              placeholder="
                Password
              "
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  handleLogin();
                }
              }}
            />

            {/* BUTTON */}

            <button
              onClick={
                handleLogin
              }
              disabled={loading}
              className="
                group
                relative

                inline-flex
                h-12
                w-full

                items-center
                justify-center
                gap-2

                overflow-hidden

                rounded-xl

                border
                border-violet-500/20

                bg-violet-500/10

                text-sm
                font-medium

                text-violet-100

                transition-all
                duration-300

                hover:border-violet-500/30
                hover:bg-violet-500/15

                disabled:opacity-50
              "
            >
              <div
                className="
                  pointer-events-none

                  absolute
                  inset-0

                  opacity-0

                  transition-opacity
                  duration-500

                  group-hover:opacity-100

                  bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16),transparent_45%)]
                "
              />

              <span
                className="
                  relative
                  z-10
                "
              >
                {loading
                  ? "Initializing..."
                  : "Enter Orbit"}
              </span>

              {!loading && (
                <ArrowRight
                  size={16}
                  className="
                    relative
                    z-10
                  "
                />
              )}
            </button>
          </div>
          <div className="flex justify-end">

  <Link
    href="/register/forgot-password"
    className="
      text-sm
      text-zinc-500
      transition
      hover:text-white
    "
  >
    Forgot password?
  </Link>

</div>

          {/* FOOTER */}

          <div
            className="
              mt-8

              flex
              items-center
              justify-between

              border-t
              border-white/[0.06]

              pt-6
            "
          >
            <div
              className="
                flex
                items-center
                gap-2

                text-xs

                text-zinc-500
              "
            >
              <Brain
                size={14}
                className="
                  text-cyan-300
                "
              />

              AI Workspace Active
            </div>

            <div
              className="
                flex
                items-center
                gap-2

                text-xs

                text-zinc-500
              "
            >
              <Sparkles
                size={14}
                className="
                  text-violet-300
                "
              />

              Enterprise Systems
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}