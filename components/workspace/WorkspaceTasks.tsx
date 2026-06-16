"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Layers3,
} from "lucide-react";

import { useTranslations } from "next-intl";

import OrbitCard from "@/components/ui/OrbitCard";
import OrbitEmptyState from "@/components/ui/OrbitEmptyState";

type Props = {
  tasks: any[];
};

function getPriorityStyles(
  priority: string
) {
  switch (priority) {
    case "high":
      return `
        border-red-500/20
        bg-red-500/10
        text-red-300
      `;

    case "medium":
      return `
        border-yellow-500/20
        bg-yellow-500/10
        text-yellow-300
      `;

    default:
      return `
        border-emerald-500/20
        bg-emerald-500/10
        text-emerald-300
      `;
  }
}

function getStatusStyles(
  status: string
) {
  switch (status) {
    case "completed":
      return `
        border-emerald-500/20
        bg-emerald-500/10
        text-emerald-300
      `;

    case "active":
      return `
        border-cyan-500/20
        bg-cyan-500/10
        text-cyan-300
      `;

    case "blocked":
      return `
        border-red-500/20
        bg-red-500/10
        text-red-300
      `;

    default:
      return `
        border-white/[0.08]
        bg-white/[0.03]
        text-zinc-300
      `;
  }
}

export default function WorkspaceTasks({
  tasks,
}: Props) {
  const t =
    useTranslations();

  return (
    <section className="space-y-6">
      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-5

          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        <div>
          <p
            className="
              text-[10px]
              uppercase

              tracking-[0.18em]

              text-violet-300
            "
          >
            {t(
              "tasks.workManagement"
            )}
          </p>

          <h2
            className="
              mt-2

              text-2xl
              font-semibold

              tracking-tight
            "
          >
            {t(
              "tasks.tasksExecution"
            )}
          </h2>

          <p
            className="
              mt-3

              text-sm
              leading-relaxed

              text-zinc-500
            "
          >
            {t(
              "tasks.tasksExecutionSubtitle"
            )}
          </p>
        </div>

        <div
          className="
            inline-flex
            items-center
            gap-2

            rounded-full

            border
            border-white/[0.08]

            bg-white/[0.03]

            px-3
            py-2

            text-xs

            backdrop-blur-xl
          "
        >
          <Layers3
            size={14}
            className="
              text-violet-300
            "
          />

          <span>
            {tasks.length}
            {" "}
            {t(
              "tasks.tasksExecution"
            )}
          </span>
        </div>
      </div>

      {/* EMPTY */}

      {tasks.length === 0 && (
        <OrbitEmptyState
          title={t(
            "tasks.noTasks"
          )}
          description={t(
            "tasks.noTasksDescription"
          )}
          icon={Clock3}
        />
      )}

      {/* TASKS */}

      {tasks.length > 0 && (
        <div
          className="
            grid
            gap-4

            xl:grid-cols-2
          "
        >
          {tasks.map(
            (
              task,
              index
            ) => (
              <motion.div
                key={task.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.05,
                }}
              >
                <OrbitCard
                  className="
                    h-full
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >
                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <h3
                        className="
                          text-lg
                          font-semibold

                          tracking-tight
                        "
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p
                          className="
                            mt-4

                            text-sm
                            leading-relaxed

                            text-zinc-400
                          "
                        >
                          {
                            task.description
                          }
                        </p>
                      )}
                    </div>

                    <div
                      className="
                        flex
                        h-10
                        w-10

                        shrink-0

                        items-center
                        justify-center

                        rounded-xl

                        border
                        border-white/[0.08]

                        bg-white/[0.03]
                      "
                    >
                      <CheckCircle2
                        size={16}
                        className="
                          text-violet-300
                        "
                      />
                    </div>
                  </div>

                  <div
                    className="
                      mt-6

                      flex
                      flex-wrap
                      items-center
                      justify-between

                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        flex-wrap
                        gap-2
                      "
                    >
                      <div
                        className={`
                          inline-flex
                          items-center

                          rounded-full

                          border

                          px-3
                          py-1.5

                          text-[10px]
                          uppercase

                          tracking-[0.16em]

                          ${getPriorityStyles(
                            task.priority
                          )}
                        `}
                      >
                        {
                          task.priority
                        }
                      </div>

                      <div
                        className={`
                          inline-flex
                          items-center

                          rounded-full

                          border

                          px-3
                          py-1.5

                          text-[10px]
                          uppercase

                          tracking-[0.16em]

                          ${getStatusStyles(
                            task.status
                          )}
                        `}
                      >
                        {t(
                          `tasks.${task.status}`
                        )}
                      </div>
                    </div>

                    <p
                      className="
                        text-[11px]
                        text-zinc-500
                      "
                    >
                      {new Date(
                        task.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* ENTERPRISE READY */}

                  <div
                    className="
                      mt-4

                      space-y-1

                      text-xs

                      text-zinc-500
                    "
                  >
                    <p>
                      {t(
                        "tasks.owner"
                      )}
                      :{" "}
                      {task.assigned_to_name ||
                        "-"}
                    </p>

                    <p>
                      {t(
                        "tasks.dueDate"
                      )}
                      :{" "}
                      {task.due_date
                        ? new Date(
                            task.due_date
                          ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </OrbitCard>
              </motion.div>
            )
          )}
        </div>
      )}
    </section>
  );
}