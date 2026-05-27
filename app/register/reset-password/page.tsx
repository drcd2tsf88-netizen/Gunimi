"use client";

import {
  useEffect,
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
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import toast
from "react-hot-toast";

import { supabase }
from "@/lib/supabase";

import OrbitInput
from "@/components/ui/OrbitInput";

export default function ResetPasswordPage() {
  const router =
    useRouter();

  const [
    password,

    setPassword,
  ] = useState("");

  const [
    confirmPassword,

    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [ready, setReady] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  // VALIDATE SESSION
  // Supabase sends a password-reset
  // link with a PKCE code in the URL.
  // We must wait for the SIGNED_IN
  // event (after code exchange) before
  // the session becomes available —
  // calling getSession() synchronously
  // always returns null on first load.

  useEffect(() => {
    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (event, session) => {
          if (
            event === "SIGNED_IN" ||
            event === "PASSWORD_RECOVERY"
          ) {
            subscription.unsubscribe();
            setReady(true);
            return;
          }

          if (
            event ===
            "INITIAL_SESSION"
          ) {
            if (session) {
              subscription.unsubscribe();
              setReady(true);
            }
            // null initial session →
            // wait for SIGNED_IN /
            // PASSWORD_RECOVERY event
          }
        }
      );

    // Timeout safety: bail after 15 s
    const timeout = setTimeout(
      () => {
        subscription.unsubscribe();

        toast.error(
          "Recovery session expired."
        );

        router.push(
          "/register/forgot-password"
        );
      },
      15_000
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleResetPassword() {
    if (
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
        "Updating Orbit credentials...",
        {
          id: "orbit-password",
        }
      );

      const {
        error,
      } =
        await supabase.auth.updateUser(
          {
            password,
          }
        );

      if (error) {
        toast.error(
          error.message,
          {
            id: "orbit-password",
          }
        );

        return;
      }

      setSuccess(true);

      toast.success(
        "Orbit password updated.",
        {
          id: "orbit-password",
        }
      );

      setTimeout(() => {
        router.push(
          "/login"
        );
      }, 2200);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update password.",
        {
          id: "orbit-password",
        }
      );
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <main
        className="
          flex
          min-h-screen

          items-center
          justify-center

          bg-[#050816]

          text-white
        "
      >
        <motion.div
          animate={{
            opacity: [
              0.5,
              1,
              0.5,
            ],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
          }}
          className="
            text-sm

            text-zinc-400
          "
        >
          Validating recovery session...
        </motion.div>
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
            <Sparkles
              size={12}
            />

            Orbit Security Layer
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
              Reset Orbit Password
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
              Securely restore access
              to your Orbit workspace
              and operational systems.
            </p>
          </div>

          {/* SUCCESS */}

          {success ? (
            <div
              className="
                mt-8

                rounded-2xl

                border
                border-emerald-500/10

                bg-emerald-500/5

                p-6
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-4
                "
              >
                <CheckCircle2
                  size={20}
                  className="
                    mt-0.5

                    text-emerald-300
                  "
                />

                <div>
                  <p
                    className="
                      text-sm
                      font-medium

                      text-emerald-100
                    "
                  >
                    Password updated successfully
                  </p>

                  <p
                    className="
                      mt-2

                      text-sm
                      leading-relaxed

                      text-emerald-100/60
                    "
                  >
                    Orbit credentials updated.
                    Redirecting to login...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* FORM */}

              <div
                className="
                  mt-8

                  space-y-4
                "
              >
                <OrbitInput
                  type="password"
                  placeholder="
                    New password
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
                      handleResetPassword();
                    }
                  }}
                />

                {/* INFO */}

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
                      Secure password update
                    </p>

                    <p
                      className="
                        mt-1

                        text-xs
                        leading-relaxed

                        text-cyan-100/60
                      "
                    >
                      Orbit credentials are
                      encrypted and secured
                      through Supabase
                      authentication systems.
                    </p>
                  </div>
                </div>

                {/* BUTTON */}

                <button
                  onClick={
                    handleResetPassword
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
                      ? "Updating..."
                      : "Update Password"}
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
            </>
          )}

          {/* FOOTER */}

          <div
            className="
              mt-8

              border-t
              border-white/[0.06]

              pt-6

              text-sm

              text-zinc-500
            "
          >
            Return to{" "}

            <Link
              href="/login"
              className="
                text-white

                transition-opacity

                hover:opacity-80
              "
            >
              Orbit Login
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}