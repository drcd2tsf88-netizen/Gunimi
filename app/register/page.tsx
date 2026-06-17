"use client";

import {
  useState,
} from "react";

import Link
from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
  Brain,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import toast
from "react-hot-toast";

import { supabase }
from "@/lib/supabase";

import OrbitInput
from "@/components/ui/OrbitInput";

export default function RegisterPage() {
  const router =
    useRouter();

  const [
    fullName,

    setFullName,
  ] = useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,

    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister() {
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error(
        "Please complete all fields."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      toast.error(
        "Passwords do not match."
      );

      return;
    }

    if (
      password.length < 8
    ) {
      toast.error(
        "Password must be at least 8 characters."
      );

      return;
    }

    try {
      setLoading(true);

      toast.loading(
        "Initializing Orbit identity...",
        {
          id: "orbit-register",
        }
      );

      const {
        error,
      } =
        await supabase.auth.signUp(
          {
            email,

            password,

            options: {
              emailRedirectTo:
                `${window.location.origin}/register/complete`,

              data: {
                full_name:
                  fullName,
              },
            },
          }
        );

      if (error) {
        toast.error(
          error.message,
          {
            id: "orbit-register",
          }
        );

        return;
      }

      toast.success(
        "Verification email sent.",
        {
          id: "orbit-register",
        }
      );

      router.push(
        `/register/verify?email=${encodeURIComponent(
          email
        )}`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Orbit registration failed.",
        {
          id: "orbit-register",
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
      {/* BACKGROUND */}

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

            h-[360px]
            w-[360px]

            rounded-full

            bg-violet-500/15

            blur-[160px]
          "
        />

        <div
          className="
            absolute
            bottom-[-120px]
            right-[-120px]

            h-[360px]
            w-[360px]

            rounded-full

            bg-cyan-500/10

            blur-[180px]
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
          max-w-xl

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
        {/* LIGHT */}

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

            Orbit Identity System
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
              Create Orbit Account
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
              Launch your AI-powered
              workspace operating
              system with enterprise
              collaboration, CRM and
              autonomous workflow
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
              type="text"
              placeholder="
                Full name
              "
              value={fullName}
              disabled={loading}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
            />

            <OrbitInput
              type="email"
              placeholder="
                Email address
              "
              value={email}
              disabled={loading}
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
              disabled={loading}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <OrbitInput
              type="password"
              placeholder="
                Confirm password
              "
              value={
                confirmPassword
              }
              disabled={loading}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  handleRegister();
                }
              }}
            />

            {/* VERIFY */}

            <div
              className="
                flex
                items-start
                gap-3

                rounded-2xl

                border
                border-cyan-500/10

                bg-cyan-500/5

                p-4
              "
            >
              <ShieldCheck
                size={18}
                className="
                  mt-0.5

                  text-cyan-300
                "
              />

              <div>
                <p
                  className="
                    text-sm
                    font-medium

                    text-cyan-200
                  "
                >
                  Email verification required
                </p>

                <p
                  className="
                    mt-1

                    text-xs
                    leading-relaxed

                    text-cyan-100/60
                  "
                >
                  Orbit will send a
                  secure activation link
                  to verify your identity
                  and initialize your
                  workspace systems.
                </p>
              </div>
            </div>

            {/* BUTTON */}

            <button
              onClick={
                handleRegister
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
                  : "Create Orbit Account"}
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

          {/* FOOTER */}

          <div
            className="
              mt-8

              flex
              flex-col
              gap-5

              border-t
              border-white/[0.06]

              pt-6

              md:flex-row
              md:items-center
              md:justify-between
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

              Orbit AI Identity Layer
            </div>

            <div
              className="
                text-sm

                text-zinc-500
              "
            >
              Already have an account?{" "}

              <Link
                href="/login"
                className="
                  text-white

                  transition-opacity

                  hover:opacity-80
                "
              >
                Login
              </Link>
            </div>
          </div>

          {/* TERMS */}

          <p
            className="
              mt-6

              text-center
              text-xs
              leading-relaxed

              text-zinc-600
            "
          >
            By creating an account you agree to our{" "}
            <Link
              href="/terms"
              className="text-zinc-400 underline underline-offset-2 transition hover:text-white"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-zinc-400 underline underline-offset-2 transition hover:text-white"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </motion.div>
    </main>
  );
}