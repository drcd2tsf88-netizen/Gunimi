"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function TasksPage() {

  const [tasks, setTasks] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        companies (
          name
        )
      `)
      .eq("user_id", user?.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      toast.error("Failed to load tasks");

      return;
    }

    setTasks(data || []);
  }

  async function toggleTask(task: any) {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const newStatus =
      task.status === "done"
        ? "todo"
        : "done";

    const { error } = await supabase
      .from("tasks")
      .update({
        status: newStatus,
      })
      .eq("id", task.id)
      .eq("user_id", user?.id);

    if (error) {
      toast.error(error.message);

      return;
    }

    toast.success(
      `Task marked as ${newStatus}`
    );

    loadTasks();
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <main className="text-white">

      {/* Header */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Tasks
          </h1>

          <p className="mt-3 text-xl text-zinc-400">
            Organize and track business operations.
          </p>

        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full xl:w-96 rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white outline-none"
        />

      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Total Tasks
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {tasks.length}
          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Todo
          </p>

          <h2 className="mt-4 text-5xl font-bold">

            {
              tasks.filter(
                (task) =>
                  task.status !== "done"
              ).length
            }

          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            Completed
          </p>

          <h2 className="mt-4 text-5xl font-bold">

            {
              tasks.filter(
                (task) =>
                  task.status === "done"
              ).length
            }

          </h2>

        </div>

      </div>

      {/* Tasks */}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h3 className="text-2xl font-bold">
            All Tasks
          </h3>

          <p className="text-zinc-500">
            {filteredTasks.length} results
          </p>

        </div>

        <div className="mt-6 grid gap-4">

          {filteredTasks.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black p-10 text-center">

              <p className="text-lg text-zinc-500">
                No tasks found
              </p>

              <p className="mt-2 text-zinc-600">
                Create tasks inside companies to organize work.
              </p>

            </div>

          ) : (

            filteredTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task)}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-left transition hover:border-zinc-600"
              >

                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                  <div>

                    <h4 className="text-xl font-bold">
                      {task.title}
                    </h4>

                    <p className="mt-3 text-sm text-zinc-500">

                      Company:
                      {" "}
                      {task.companies?.name || "Unknown"}

                    </p>

                  </div>

                  <div>

                    <span
                      className={
                        task.status === "done"
                          ? "rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400"
                          : "rounded-full bg-yellow-500/20 px-4 py-2 text-sm text-yellow-400"
                      }
                    >
                      {task.status}
                    </span>

                  </div>

                </div>

              </button>
            ))

          )}

        </div>

      </div>

    </main>
  );
}