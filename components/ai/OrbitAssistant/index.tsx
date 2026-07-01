"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import OrbitHeader
from "./OrbitHeader";

import OrbitMessages
from "./OrbitMessages";

import OrbitInput
from "./OrbitInput";

import OrbitMemory
from "./OrbitMemory";

import { useOrbitAssistant }
from "./hooks/useOrbitAssistant";

import { useAIStateStore }
from "@/lib/store/ai-state-store";

type OrbitAssistantProps = {
  open: boolean;
  onClose: () => void;
  initialPrompt?: string;
};

export default function OrbitAssistant({
  open,
  onClose,
  initialPrompt,
}: OrbitAssistantProps) {
  const {
    loading,

    sendMessage,
  } =
    useOrbitAssistant();

  const messages =
    useAIStateStore(
      (state) =>
        state.messages
    );

  const aiMemory =
    useAIStateStore(
      (state) =>
        state.memory
    );

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

            flex
            justify-end

            bg-black/50

            backdrop-blur-sm
          "
          onClick={onClose}
        >
          <motion.div
            initial={{
              x: 40,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: 40,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              relative

              flex
              h-full
              w-full
              max-w-lg
              flex-col

              overflow-hidden

              border-l
              border-white/10

              bg-[#060816]/95

              backdrop-blur-3xl
            "
          >
            {/* GLOW */}

            <div
              className="
                pointer-events-none

                absolute
                right-[-120px]
                top-[-120px]

                h-[320px]
                w-[320px]

                rounded-full

                bg-violet-500/10

                blur-3xl
              "
            />

            {/* HEADER */}

            <OrbitHeader
              onClose={onClose}
            />

            {/* CONTENT */}

            <div
              className="
                relative
                z-10

                flex-1

                overflow-y-auto

                px-4
                py-4
              "
            >
              <div
                className="
                  space-y-4
                "
              >
                <OrbitMemory
                  aiMemory={
                    aiMemory
                  }
                />

                <OrbitMessages
                  messages={
                    messages
                  }
                  loading={
                    loading
                  }
                />
              </div>
            </div>

            {/* INPUT */}

            <OrbitInput
              loading={loading}
              onSend={sendMessage}
              initialValue={initialPrompt}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}