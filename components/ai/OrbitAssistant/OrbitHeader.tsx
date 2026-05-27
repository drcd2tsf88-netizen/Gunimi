"use client";

import { motion }
from "framer-motion";

import {
  Sparkles,
  X,
} from "lucide-react";

export type OrbitHeaderProps = {
  onClose: () => void;
};

export default function OrbitHeader({
  onClose,
}: OrbitHeaderProps) {
  return (
    <div
      className="
        relative
        z-10

        flex
        items-center
        justify-between

        border-b
        border-white/10

        bg-black/20

        px-4
        py-4
      "
    >
      {/* LEFT */}

      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0px rgba(124,58,237,0)",

              "0 0 25px rgba(124,58,237,0.30)",

              "0 0 0px rgba(124,58,237,0)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="
            relative

            flex
            h-11
            w-11

            items-center
            justify-center

            rounded-2xl

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

              h-4
              w-4

              rounded-full

              bg-violet-400/40
            "
          />

          <Sparkles
            className="
              h-4
              w-4

              text-violet-300
            "
          />
        </motion.div>

        <div>
          <h2
            className="
              text-sm
              font-semibold
            "
          >
            Orbit AI
          </h2>

          <div
            className="
              mt-1

              flex
              items-center
              gap-2

              text-[11px]
              text-zinc-500
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

            Workspace synchronized
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <button
        onClick={onClose}
        className="
          flex
          h-9
          w-9

          items-center
          justify-center

          rounded-xl

          border
          border-white/10

          bg-white/[0.03]

          text-zinc-400

          transition-all

          hover:bg-white/[0.06]
          hover:text-white
        "
      >
        <X
          size={16}
        />
      </button>
    </div>
  );
}