"use client";

import {
  useEffect,
  useState,
} from "react";

import { motion }
from "framer-motion";

import { supabase }
from "@/lib/supabase";

import { getTasks }
from "@/lib/tasks/getTasks";
import { getWorkspaceTasks }
from "@/server/actions/tasks/getWorkspaceTasks";

import { useTasksStore }
from "@/lib/store/tasks-store";

type Task = {
  id: string;

  title: string;

  status: string;

  priority: string;

  created_at: string;
};

export default function TasksPage() {
  const [loading, setLoading] =
    useState(true);

  const tasks =
    useTasksStore(
      (state) => state.tasks
    );

  const setTasks =
    useTasksStore(
      (state) => state.setTasks
    );

 useEffect(() => {
  async function loadTasks() {
    const data =
      await getWorkspaceTasks();

    setTasks(data);
  }

  // INITIAL LOAD

  loadTasks();

  // REALTIME

  const channel =
    supabase
      .channel(
        "workspace-tasks"
      )
      .on(
        "postgres_changes",
        {
          event: "*",

          schema: "public",

          table:
            "workspace_tasks",
        },
        () => {
          loadTasks();
        }
      )
      .subscribe();

  // CLEANUP

  return () => {
    supabase.removeChannel(
      channel
    );
  };
}, []);

  return (
    <div
      className="
        min-h-screen
        bg-[#060816]
        px-8
        py-8
        text-white
      "
    >
      {/* HEADER */}

      <div
        className="
          mb-8
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-semibold
            "
          >
            Tasks
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-white/50
            "
          >
            Live workspace task
            execution system
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-violet-500/20
            bg-violet-500/10
            px-4
            py-2
            text-sm
            text-violet-300
          "
        >
          {tasks.length} Active Tasks
        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <div
          className="
            flex
            items-center
            justify-center
            py-24
          "
        >
          <div
            className="
              h-12
              w-12
              animate-spin
              rounded-full
              border-2
              border-violet-500/20
              border-t-violet-400
            "
          />
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        tasks.length === 0 && (
          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              p-12
              text-center
            "
          >
            <h2
              className="
                text-xl
                font-medium
              "
            >
              No tasks yet
            </h2>

            <p
              className="
                mt-3
                text-sm
                text-white/50
              "
            >
              Orbit AI will create
              tasks automatically.
            </p>
          </div>
        )}

      {/* TASKS */}

      {!loading &&
        tasks.length > 0 && (
          <div
            className="
              grid
              gap-5
            "
          >
            {tasks.map(
              (
                task: Task,
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
                  className="
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-6
                    backdrop-blur-xl
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                    "
                  >
                    <div>
                      <h3
                        className="
                          text-lg
                          font-medium
                        "
                      >
                        {task.title}
                      </h3>

                      <p
                        className="
                          mt-3
                          text-sm
                          text-white/50
                        "
                      >
                        Created{" "}
                        {new Date(
                          task.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <div
                        className="
                          rounded-xl
                          bg-cyan-500/10
                          px-3
                          py-1
                          text-xs
                          uppercase
                          text-cyan-300
                        "
                      >
                        {task.status}
                      </div>

                      <div
                        className="
                          rounded-xl
                          bg-violet-500/10
                          px-3
                          py-1
                          text-xs
                          uppercase
                          text-violet-300
                        "
                      >
                        {task.priority}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}
    </div>
  );
}