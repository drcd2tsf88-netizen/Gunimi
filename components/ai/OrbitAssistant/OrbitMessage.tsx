"use client";

import { memo } from "react";

import { motion } from "framer-motion";

import { useTranslations } from "next-intl";

type OrbitMessageProps = {
  msg: {
    role: string;

    content: string;

    metadata?: {
      agent?: string;
    };
  };
};

function OrbitMessage({
  msg,
}: OrbitMessageProps) {
  const t = useTranslations("aiPanel");
  const isAssistant = msg.role === "assistant";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className={`
        flex

        ${
          isAssistant
            ? "justify-start"
            : "justify-end"
        }
      `}
    >
      <div
        className={`
          max-w-[88%]

          rounded-2xl

          px-4
          py-3

          text-sm
          leading-relaxed

          ${
            isAssistant
              ? `
                border
                border-violet-500/20

                bg-violet-500/10

                text-white
              `
              : `
                bg-white

                text-black
              `
          }
        `}
      >
        {/* AGENT */}

        {isAssistant && (
          <div
            className="
              mb-2

              flex
              items-center
              gap-2
            "
          >
            <motion.div
              animate={{
                scale: [
                  1,
                  1.2,
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
                h-1.5
                w-1.5

                rounded-full

                bg-violet-400
              "
            />

            <p
              className="
                text-[10px]
                uppercase

                tracking-[0.18em]

                text-violet-300
              "
            >
              {msg.metadata?.agent ?? t("orbitAi")}
            </p>
          </div>
        )}

        {/* CONTENT */}

        <p
          className="
            whitespace-pre-line

            break-words
          "
        >
          {msg.content}
        </p>
      </div>
    </motion.div>
  );
}

export default memo(
  OrbitMessage
);