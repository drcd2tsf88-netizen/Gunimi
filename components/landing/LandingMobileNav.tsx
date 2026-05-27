"use client";

import Link
from "next/link";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ArrowRight,
  Orbit,
  X,
} from "lucide-react";

type LandingMobileNavProps = {
  open: boolean;

  onClose: () => void;
};

const links = [
  {
    label:
      "Observatory",

    href:
      "#observatory",
  },

  {
    label:
      "AI Systems",

    href:
      "#systems",
  },

  {
    label:
      "Workflows",

    href:
      "#workflows",
  },

  {
    label:
      "Enterprise",

    href:
      "#enterprise",
  },
];

export default function LandingMobileNav({
  open,
  onClose,
}: LandingMobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="
            fixed
            inset-0
            z-[999]

            bg-black/80

            backdrop-blur-2xl
          "
        >
          <motion.div
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              type: "spring",
              damping: 30,
            }}
            className="
              absolute
              right-0
              top-0

              flex
              h-full
              w-[88%]
              max-w-sm

              flex-col

              border-l
              border-white/10

              bg-[#050816]

              p-6
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
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
                    h-11
                    w-11

                    items-center
                    justify-center

                    rounded-2xl

                    bg-violet-500/10

                    text-violet-300
                  "
                >
                  <Orbit
                    size={20}
                  />
                </div>

                <div>
                  <h2
                    className="
                      font-semibold
                    "
                  >
                    OrbitDesk
                  </h2>

                  <p
                    className="
                      text-xs
                      text-white/40
                    "
                  >
                    AI Workspace OS
                  </p>
                </div>
              </div>

              <button
                onClick={
                  onClose
                }
                className="
                  flex
                  h-11
                  w-11

                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  text-white/60
                "
              >
                <X
                  size={18}
                />
              </button>
            </div>

            {/* LINKS */}

            <div
              className="
                mt-12

                flex
                flex-col
                gap-4
              "
            >
              {links.map(
                (item) => (
                  <a
                    key={
                      item.label
                    }
                    href={
                      item.href
                    }
                    onClick={
                      onClose
                    }
                    className="
                      rounded-2xl

                      border
                      border-white/5

                      bg-white/[0.03]

                      px-5
                      py-4

                      text-sm
                      text-white/70

                      transition-all

                      hover:border-white/10
                      hover:bg-white/[0.05]
                    "
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>

            {/* ACTIONS */}

            <div
              className="
                mt-auto

                space-y-3
              "
            >
              <Link
                href="/login"
                onClick={
                  onClose
                }
                className="
                  flex
                  h-14
                  w-full

                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  text-sm
                  font-medium

                  text-white/70
                "
              >
                Login
              </Link>

              <Link
                href="/dashboard"
                onClick={
                  onClose
                }
                className="
                  flex
                  h-14
                  w-full

                  items-center
                  justify-center
                  gap-2

                  rounded-2xl

                  bg-violet-500

                  text-sm
                  font-medium

                  text-white
                "
              >
                Launch Orbit

                <ArrowRight
                  size={16}
                />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}