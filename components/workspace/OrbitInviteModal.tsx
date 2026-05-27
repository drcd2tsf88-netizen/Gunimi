"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  X,
  Mail,
} from "lucide-react";

import { createPortal }
from "react-dom";

type OrbitInviteModalProps = {
  open: boolean;

  onClose: () => void;
};

export default function OrbitInviteModal({
  open,

  onClose,
}: OrbitInviteModalProps) {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ESC CLOSE

  useEffect(() => {
    function handleKeyDown(
      e: KeyboardEvent
    ) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  async function handleInvite() {
    if (!email) {
      return;
    }

    try {
      setLoading(true);

      console.log(
        "Inviting:",
        email
      );

      // TODO:
      // invite logic

      setEmail("");

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
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
          onClick={onClose}
          className="
            fixed
            inset-0
            z-[999999]

            flex
            items-center
            justify-center

            bg-black/70

            p-6

            backdrop-blur-xl
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              relative

              w-full
              max-w-lg

              overflow-hidden

              rounded-[32px]

              border
              border-white/10

              bg-[#0A0F1F]/95

              shadow-[0_0_80px_rgba(124,58,237,0.18)]

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

                h-[240px]
                w-[240px]

                rounded-full

                bg-violet-500/10

                blur-3xl
              "
            />

            {/* HEADER */}

            <div
              className="
                relative
                z-10

                flex
                items-center
                justify-between

                border-b
                border-white/10

                px-8
                py-6
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    uppercase

                    tracking-[0.22em]

                    text-violet-300
                  "
                >
                  Orbit Workspace
                </p>

                <h2
                  className="
                    mt-2

                    text-2xl
                    font-semibold
                  "
                >
                  Invite Team Member
                </h2>
              </div>

              <button
                onClick={onClose}
                className="
                  flex
                  h-10
                  w-10

                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  text-white/50

                  transition-all

                  hover:border-white/20
                  hover:bg-white/[0.05]
                "
              >
                <X size={16} />
              </button>
            </div>

            {/* CONTENT */}

            <div
              className="
                relative
                z-10

                p-8
              "
            >
              <div
                className="
                  relative
                "
              >
                <Mail
                  size={18}
                  className="
                    absolute
                    left-5
                    top-1/2

                    -translate-y-1/2

                    text-white/30
                  "
                />

                <input
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="
                    teammate@orbitdesk.ai
                  "
                  className="
                    h-16
                    w-full

                    rounded-2xl

                    border
                    border-white/10

                    bg-white/[0.03]

                    pl-14
                    pr-5

                    text-white

                    outline-none

                    transition-all

                    placeholder:text-white/30

                    focus:border-violet-500/30
                    focus:bg-white/[0.05]
                  "
                />
              </div>

              <button
                onClick={
                  handleInvite
                }
                disabled={loading}
                className="
                  mt-6

                  flex
                  h-14
                  w-full

                  items-center
                  justify-center

                  rounded-2xl

                  bg-gradient-to-r
                  from-violet-500
                  to-violet-400

                  text-sm
                  font-medium
                  text-white

                  transition-all

                  hover:scale-[1.01]
                  hover:shadow-[0_0_40px_rgba(124,58,237,0.35)]

                  disabled:opacity-50
                "
              >
                {loading
                  ? "Sending Invite..."
                  : "Send Workspace Invite"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}