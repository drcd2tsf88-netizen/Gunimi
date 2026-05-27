"use client";

import Link
from "next/link";

import {
  useSearchParams,
} from "next/navigation";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function RegisterVerifyPage() {
  const searchParams =
    useSearchParams();

  const email =
    searchParams.get(
      "email"
    ) || "";

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

          text-center

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
          {/* ICON */}

          <motion.div
            animate={{
              boxShadow: [
                "0 0 0px rgba(124,58,237,0)",

                "0 0 40px rgba(124,58,237,0.35)",

                "0 0 0px rgba(124,58,237,0)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="
              relative

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
            <motion.div
              animate={{
                scale: [
                  1,
                  1.5,
                  1,
                ],

                opacity: [
                  0.4,
                  0,
                  0.4,
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
              className="
                absolute

                h-8
                w-8

                rounded-full

                bg-violet-400/40
              "
            />

            <Mail
              className="
                h-8
                w-8

                text-violet-200
              "
            />
          </motion.div>

          {/* BADGE */}

          <div
            className="
              mt-6

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

            Orbit Verification System
          </div>

          {/* HEADER */}

          <h1
            className="
              mt-8

              text-4xl
              font-semibold

              tracking-tight
            "
          >
            Verify Your Identity
          </h1>

          <p
            className="
              mt-5

              text-sm
              leading-relaxed

              text-zinc-400
            "
          >
            Orbit has sent a secure
            activation link to your
            email address.
          </p>

          {/* EMAIL */}

          <div
            className="
              mt-6

              rounded-2xl

              border
              border-cyan-500/10

              bg-cyan-500/5

              p-5
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <ShieldCheck
                size={16}
                className="
                  text-cyan-300
                "
              />

              <p
                className="
                  text-sm

                  text-cyan-100
                "
              >
                Verification destination
              </p>
            </div>

            <p
              className="
                mt-3

                break-all

                text-sm
                font-medium

                text-white
              "
            >
              {email}
            </p>
          </div>

          {/* INFO */}

          <div
            className="
              mt-6

              rounded-2xl

              border
              border-white/[0.06]

              bg-white/[0.03]

              p-5

              text-left
            "
          >
            <p
              className="
                text-sm
                font-medium
              "
            >
              What happens next?
            </p>

            <div
              className="
                mt-4

                space-y-4
              "
            >
              {[
                "Verify your email identity",

                "Initialize Orbit profile systems",

                "Launch AI workspace environment",
              ].map(
                (
                  step,
                  index
                ) => (
                  <div
                    key={step}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-6
                        w-6

                        items-center
                        justify-center

                        rounded-full

                        bg-violet-500/10

                        text-xs

                        text-violet-300
                      "
                    >
                      {index + 1}
                    </div>

                    <p
                      className="
                        text-sm

                        text-zinc-400
                      "
                    >
                      {step}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ACTIONS */}

          <div
            className="
              mt-8

              flex
              flex-col
              gap-4
            "
          >
            <Link
              href="/login"
              className="
                group

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
              "
            >
              Continue to Login

              <ArrowRight
                size={16}
              />
            </Link>

            <p
              className="
                text-xs

                text-zinc-600
              "
            >
              Didn’t receive the email?
              Check spam or promotions
              folder.
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}