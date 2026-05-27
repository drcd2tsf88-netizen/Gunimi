"use client";

import { supabase } from "@/lib/supabase";

import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Bell,
} from "lucide-react";

type Activity = {
  id: string;

  title: string;

  description?: string;

  type?: string;
};

export default function OrbitNotifications() {
  const [open, setOpen] =
    useState(false);

  const [activity, setActivity] =
    useState<Activity[]>([]);

  useEffect(() => {
  async function loadActivity() {
   const {
  data,
  error,
} =
  await supabase
    .from(
      "workspace_activity"
    )
    .select("*")
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .limit(10);

if (error) {
  console.error(
    error
  );

  return;
}

setActivity(data || []);
  }

  // INITIAL

  loadActivity();

  // REALTIME

  const channel =
    supabase
      .channel(
        "workspace-activity"
      )
      .on(
        "postgres_changes",
        {
          event: "*",

          schema: "public",

          table:
            "workspace_activity",
        },
        () => {
          loadActivity();
        }
      )
      .subscribe();

  return () => {
    supabase.removeChannel(
      channel
    );
  };
}, []);

  return (
    <div className="relative">
      {/* BUTTON */}

      <motion.button
        whileHover={{
          y: -2,
        }}
        onClick={() =>
          setOpen(!open)
        }
        className="
          relative

          flex
          h-12
          w-12

          items-center
          justify-center

          rounded-2xl

          border
          border-white/10

          bg-white/[0.03]

          text-white/70

          transition-all

          hover:border-white/20
        "
      >
        <Bell size={18} />

        {activity.length > 0 && (
          <div
            className="
              absolute
              right-3
              top-3

              h-2
              w-2

              rounded-full

              bg-violet-400
            "
          />
        )}
      </motion.button>

      {/* DROPDOWN */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
            }}
            className="
              absolute
              right-0
              top-[70px]
              z-[999]

              w-[92vw]
              max-w-[420px]

              overflow-hidden

              rounded-[28px]

              border
              border-white/10

              bg-[#0A0F1F]/95

              backdrop-blur-2xl
            "
          >
            {/* HEADER */}

            <div
              className="
                border-b
                border-white/5

                p-5
              "
            >
              <h3
                className="
                  text-lg
                  font-semibold
                "
              >
                Orbit Signals
              </h3>

              <p
                className="
                  mt-2

                  text-sm
                  text-white/40
                "
              >
                Live workspace observatory
              </p>
            </div>

            {/* CONTENT */}

            <div
              className="
                max-h-[420px]
                overflow-y-auto

                space-y-3

                p-4
              "
            >
              {activity.length === 0 ? (
                <div
                  className="
                    rounded-2xl

                    border
                    border-white/5

                    bg-white/[0.03]

                    p-5
                  "
                >
                  <p
                    className="
                      text-sm
                      text-white/50
                    "
                  >
                    Orbit AI observatory
                    systems are active and
                    monitoring workspace
                    activity.
                  </p>
                </div>
              ) : (
                activity.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="
                        rounded-2xl

                        border
                        border-white/5

                        bg-white/[0.03]

                        p-4
                      "
                    >
                      <p
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        {item.title}
                      </p>

                      {item.description && (
                        <p
                          className="
                            mt-2

                            text-sm
                            leading-relaxed

                            text-white/50
                          "
                        >
                          {
                            item.description
                          }
                        </p>
                      )}
                    </div>
                  )
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}