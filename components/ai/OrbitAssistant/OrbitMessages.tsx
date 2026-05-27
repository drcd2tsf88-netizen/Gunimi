"use client";

import { motion }
from "framer-motion";

import OrbitMessage
from "./OrbitMessage";

type OrbitMessagesProps = {
  messages: {
    role: string;

    content: string;

    metadata?: any;
  }[];

  loading: boolean;
};

const suggestions = [
  "Analyze workspace",

  "Create task workflow",

  "Generate CRM insights",

  "Workspace briefing",
];

export default function OrbitMessages({
  messages,

  loading,
}: OrbitMessagesProps) {
  return (
    <div
      className="
        space-y-4
      "
    >
      {/* SUGGESTIONS */}

      {messages.length ===
        0 && (
        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >
          {suggestions.map(
            (item) => (
              <motion.div
                key={item}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="
                  rounded-xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  px-3
                  py-2

                  text-xs
                  text-zinc-400

                  transition-all

                  hover:border-violet-500/20
                  hover:bg-violet-500/10
                  hover:text-white
                "
              >
                ✦ {item}
              </motion.div>
            )
          )}
        </div>
      )}

      {/* MESSAGES */}

      <div
        className="
          space-y-3
        "
      >
        {messages.map(
          (
            msg,
            index
          ) => (
            <OrbitMessage
              key={index}
              msg={msg}
            />
          )
        )}
      </div>

      {/* LOADING */}

      {loading && (
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <p
            className="
              text-xs
              text-violet-300
            "
          >
            Orbit AI processing...
          </p>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="
              flex
              gap-1
            "
          >
            <div
              className="
                h-1.5
                w-1.5

                animate-bounce

                rounded-full

                bg-violet-300
              "
            />

            <div
              className="
                h-1.5
                w-1.5

                animate-bounce

                rounded-full

                bg-violet-300

                [animation-delay:0.2s]
              "
            />

            <div
              className="
                h-1.5
                w-1.5

                animate-bounce

                rounded-full

                bg-violet-300

                [animation-delay:0.4s]
              "
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}