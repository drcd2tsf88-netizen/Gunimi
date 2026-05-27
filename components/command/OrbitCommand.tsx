"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "cmdk";

import {
  Sparkles,
} from "lucide-react";

import OrbitThinking
from "@/components/command/OrbitThinking";

import { orbitCommands } from "@/config/orbit-commands";
import { executeOrbitCommand }
from "@/server/actions/ai/executeOrbitCommand";

import { useOrbitCommandStore }
from "@/lib/store/orbit-command-store";

export default function OrbitCommand() {
  const router =
    useRouter();

  const {
    open,
    setOpen,
  } =
    useOrbitCommandStore();

  const [isThinking, setIsThinking] =
    useState(false);

  // SHORTCUT

  useEffect(() => {
    const down = (
      event: KeyboardEvent
    ) => {
      if (
        (event.metaKey ||
          event.ctrlKey) &&
        event.key === "k"
      ) {
        event.preventDefault();

        setOpen(!open);
      }

      if (
        event.key === "Escape"
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      down
    );

    return () =>
      document.removeEventListener(
        "keydown",
        down
      );
  }, [open, setOpen]);

  // GROUP COMMANDS

  const groupedCommands =
    useMemo(() => {
      return orbitCommands.reduce(
        (
          groups,
          command
        ) => {
          if (
            !groups[
              command.group
            ]
          ) {
            groups[
              command.group
            ] = [];
          }

          groups[
            command.group
          ].push(command);

          return groups;
        },
        {} as Record<
          string,
          typeof orbitCommands
        >
      );
    }, []);

  // HANDLE COMMAND

  async function handleCommand(
    command: any
  ) {
    setIsThinking(true);

    // AI ACTIONS

    if (command.action) {
  const result =
    await executeOrbitCommand({
      action:
        command.action,
    });

  setTimeout(() => {
    setIsThinking(false);

    setOpen(false);
  }, 1800);

  return;
}

    // ROUTING

    setTimeout(() => {
      router.push(
        command.href
      );

      setOpen(false);

      setIsThinking(false);
    }, 1200);
  }

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
            items-start
            justify-center

            bg-black/70

            px-4
            pt-[10vh]

            backdrop-blur-xl
          "
          onClick={() =>
            setOpen(false)
          }
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.98,
            }}
            transition={{
              duration: 0.22,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              relative

              w-full
              max-w-2xl
            "
          >
            {/* AMBIENT GLOW */}

            <div
              className="
                pointer-events-none

                absolute
                inset-0

                bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_55%)]
              "
            />

            {/* COMMAND */}

            <Command
              className="
                relative

                overflow-hidden

                rounded-[36px]

                border
                border-white/10

                bg-[#0b1020]/95

                backdrop-blur-3xl

                shadow-[0_0_100px_rgba(124,58,237,0.30)]
              "
            >
              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between

                  border-b
                  border-white/10

                  px-6
                  py-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  {/* ICON */}

                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(124,58,237,0)",

                        "0 0 30px rgba(124,58,237,0.4)",

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
                      h-12
                      w-12

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
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="
                        absolute

                        h-5
                        w-5

                        rounded-full

                        bg-violet-400/40
                      "
                    />

                    <Sparkles
                      className="
                        h-5
                        w-5

                        text-violet-300
                      "
                    />
                  </motion.div>

                  {/* INFO */}

                  <div>
                    <h2
                      className="
                        text-lg
                        font-semibold

                        text-white
                      "
                    >
                      Orbit Command Center
                    </h2>

                    <p
                      className="
                        text-sm
                        text-zinc-500
                      "
                    >
                      AI-powered workspace control
                    </p>
                  </div>
                </div>

                {/* ESC */}

                <div
                  className="
                    rounded-xl

                    border
                    border-white/10

                    bg-white/[0.04]

                    px-3
                    py-2

                    text-xs
                    text-zinc-500
                  "
                >
                  ESC
                </div>
              </div>

              {/* SEARCH */}

              <div
                className="
                  border-b
                  border-white/10

                  px-5
                  py-4
                "
              >
                <CommandInput
                  placeholder="
                    Search workspace,
                    AI actions or workflows...
                  "
                  className="
                    w-full

                    bg-transparent

                    text-lg
                    text-white

                    outline-none

                    placeholder:text-zinc-500
                  "
                />
              </div>

              {/* THINKING */}

              {isThinking && (
                <div
                  className="
                    border-b
                    border-white/5

                    p-5
                  "
                >
                  <OrbitThinking />
                </div>
              )}

              {/* COMMANDS */}

              <CommandList
                className="
                  max-h-[520px]

                  overflow-y-auto

                  p-4
                "
              >
                {Object.entries(
                  groupedCommands
                ).map(
                  ([
                    group,
                    commands,
                  ]) => (
                    <CommandGroup
                      key={group}
                      heading={group}
                    >
                      {commands.map(
                        (
                          command
                        ) => {
                          const Icon =
                            command.icon;

                          return (
                            <CommandItem
                              key={
                                command.id
                              }
                              onSelect={() =>
                                handleCommand(
                                  command
                                )
                              }
                              className="
                                group

                                mb-2

                                flex
                                items-center
                                justify-between

                                rounded-2xl

                                border
                                border-transparent

                                bg-transparent

                                px-4
                                py-4

                                text-white

                                transition-all
                                duration-300

                                hover:border-white/10
                                hover:bg-white/[0.04]

                                data-[selected=true]:border-violet-500/20
                                data-[selected=true]:bg-violet-500/10
                              "
                            >
                              {/* LEFT */}

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-4
                                "
                              >
                                <div
                                  className="
                                    flex
                                    h-12
                                    w-12

                                    items-center
                                    justify-center

                                    rounded-2xl

                                    border
                                    border-white/10

                                    bg-white/[0.03]

                                    transition-all
                                    duration-300

                                    group-hover:border-violet-500/20
                                    group-hover:bg-violet-500/10
                                  "
                                >
                                  <Icon
                                    className="
                                      h-5
                                      w-5

                                      text-zinc-300
                                    "
                                  />
                                </div>

                                <div>
                                  <p
                                    className="
                                      font-medium

                                      text-white
                                    "
                                  >
                                    {
                                      command.title
                                    }
                                  </p>

                                  <p
                                    className="
                                      mt-1

                                      text-sm
                                      text-zinc-500
                                    "
                                  >
                                    {
                                      command.description
                                    }
                                  </p>
                                </div>
                              </div>

                              {/* RIGHT */}

                              <div
                                className="
                                  rounded-lg

                                  border
                                  border-white/10

                                  bg-white/[0.03]

                                  px-2
                                  py-1

                                  text-xs
                                  text-zinc-500
                                "
                              >
                                {command.action
                                  ? "AI"
                                  : "OPEN"}
                              </div>
                            </CommandItem>
                          );
                        }
                      )}
                    </CommandGroup>
                  )
                )}
              </CommandList>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}