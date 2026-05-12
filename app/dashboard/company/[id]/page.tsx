"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const stages = [
  "lead",
  "contacted",
  "proposal",
  "won",
];

export default function CompanyPage() {
  const params = useParams();

  const companyId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [company, setCompany] = useState<any>(null);

  // Customers
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Notes
  const [notes, setNotes] = useState<any[]>([]);
  const [noteContent, setNoteContent] = useState("");

  // Tasks
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskTitle, setTaskTitle] = useState("");

  // Activities
  const [activities, setActivities] = useState<any[]>([]);

  // AI
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (companyId) {
      loadCompany();
      loadCustomers();
      loadNotes();
      loadTasks();
      loadActivities();
    }
  }, [companyId]);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  }

  async function loadCompany() {
    const user = await getUser();

    const { data } = await supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .eq("user_id", user?.id)
      .single();

    setCompany(data);
  }

  async function loadCustomers() {
    const user = await getUser();

    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("company_id", companyId)
      .eq("user_id", user?.id)
      .order("created_at", {
        ascending: false,
      });

    setCustomers(data || []);
  }

  async function loadNotes() {
    const user = await getUser();

    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("company_id", companyId)
      .eq("user_id", user?.id)
      .order("created_at", {
        ascending: false,
      });

    setNotes(data || []);
  }

  async function loadTasks() {
    const user = await getUser();

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("company_id", companyId)
      .eq("user_id", user?.id)
      .order("created_at", {
        ascending: false,
      });

    setTasks(data || []);
  }

  async function loadActivities() {
    const user = await getUser();

    const { data } = await supabase
      .from("activities")
      .select("*")
      .eq("company_id", companyId)
      .eq("user_id", user?.id)
      .order("created_at", {
        ascending: false,
      });

    setActivities(data || []);
  }

  async function addActivity(type: string, content: string) {
    const user = await getUser();

    await supabase.from("activities").insert({
      company_id: companyId,
      type,
      content,
      user_id: user?.id,
    });

    loadActivities();
  }

  async function handleAddCustomer() {
    const user = await getUser();

    const { error } = await supabase
      .from("customers")
      .insert({
        company_id: companyId,
        name: customerName,
        email: customerEmail,
        user_id: user?.id,
      });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Customer added");

    await addActivity(
      "customer",
      `Added customer ${customerName}`
    );

    setCustomerName("");
    setCustomerEmail("");

    loadCustomers();
  }

  async function updateCustomerStage(
    customerId: string,
    newStage: string
  ) {
    const user = await getUser();

    const { error } = await supabase
      .from("customers")
      .update({
        status: newStage,
      })
      .eq("id", customerId)
      .eq("user_id", user?.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(`Moved to ${newStage}`);

    await addActivity(
      "crm",
      `Customer moved to ${newStage}`
    );

    loadCustomers();
  }

  async function handleAddNote() {
    const user = await getUser();

    const { error } = await supabase
      .from("notes")
      .insert({
        company_id: companyId,
        content: noteContent,
        user_id: user?.id,
      });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Note added");

    await addActivity(
      "note",
      "Created a company note"
    );

    setNoteContent("");

    loadNotes();
  }

  async function handleAddTask() {
    const user = await getUser();

    const { error } = await supabase
      .from("tasks")
      .insert({
        company_id: companyId,
        title: taskTitle,
        user_id: user?.id,
      });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Task created");

    await addActivity(
      "task",
      `Created task: ${taskTitle}`
    );

    setTaskTitle("");

    loadTasks();
  }

  async function toggleTask(task: any) {
    const user = await getUser();

    const newStatus =
      task.status === "done" ? "todo" : "done";

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

    toast.success(`Task marked as ${newStatus}`);

    await addActivity(
      "task",
      `Task "${task.title}" marked as ${newStatus}`
    );

    loadTasks();
  }

  async function handleSummarizeNote() {
    if (!noteContent) {
      toast.error("Write a note first.");
      return;
    }

    try {
      setLoadingAI(true);

      const res = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note: noteContent,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setAiSummary(data.reply);

        toast.success("AI summary generated");

        await addActivity(
          "ai",
          "Generated AI summary"
        );
      } else {
        toast.error("AI summary failed");
      }

    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setLoadingAI(false);
    }
  }

  if (!company) {
    return (
      <main className="text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="text-white">

      {/* Header */}
      <div>

        <h1 className="text-5xl font-bold">
          {company.name}
        </h1>

        <p className="mt-3 text-xl text-zinc-400">
          {company.industry}
        </p>

      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-500">Customers</p>

          <h2 className="mt-4 text-5xl font-bold">
            {customers.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-500">Notes</p>

          <h2 className="mt-4 text-5xl font-bold">
            {notes.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-500">Tasks</p>

          <h2 className="mt-4 text-5xl font-bold">
            {tasks.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-500">Activities</p>

          <h2 className="mt-4 text-5xl font-bold">
            {activities.length}
          </h2>
        </div>

      </div>

      {/* Add Customer */}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

        <h3 className="text-2xl font-bold">
          Add Customer
        </h3>

        <div className="mt-6 flex flex-col gap-4">

          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white outline-none"
          />

          <input
            type="email"
            placeholder="Customer Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white outline-none"
          />

          <button
            onClick={handleAddCustomer}
            className="rounded-lg bg-white p-3 font-semibold text-black"
          >
            Add Customer
          </button>

        </div>

      </div>

      {/* CRM Pipeline */}
      <div className="mt-10">

        <div className="flex items-center justify-between">

          <h3 className="text-3xl font-bold">
            CRM Pipeline
          </h3>

          <p className="text-zinc-500">
            Manage customer flow
          </p>

        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {stages.map((stage) => {

            const stageCustomers = customers.filter(
              (customer) =>
                customer.status === stage
            );

            return (
              <div
                key={stage}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
              >

                <div className="flex items-center justify-between">

                  <h4 className="text-xl font-bold capitalize">
                    {stage}
                  </h4>

                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-400">
                    {stageCustomers.length}
                  </span>

                </div>

                <div className="mt-5 space-y-4">

                  {stageCustomers.length === 0 ? (

                    <div className="rounded-xl border border-dashed border-zinc-700 bg-black p-5 text-center">

                      <p className="text-zinc-500">
                        No customers yet
                      </p>

                      <p className="mt-2 text-sm text-zinc-600">
                        Add your first lead to start building your pipeline.
                      </p>

                    </div>

                  ) : (

                    stageCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                      >

                        <h5 className="font-semibold">
                          {customer.name}
                        </h5>

                        <p className="mt-1 text-sm text-zinc-400">
                          {customer.email}
                        </p>

                        <select
                          value={customer.status}
                          onChange={(e) =>
                            updateCustomerStage(
                              customer.id,
                              e.target.value
                            )
                          }
                          className="mt-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-sm text-white"
                        >

                          {stages.map((stageOption) => (
                            <option
                              key={stageOption}
                              value={stageOption}
                            >
                              {stageOption}
                            </option>
                          ))}

                        </select>

                      </div>
                    ))

                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Notes */}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

        <h3 className="text-2xl font-bold">
          Notes
        </h3>

        <div className="mt-6 grid gap-4">

          {notes.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black p-10 text-center">

              <p className="text-lg text-zinc-500">
                No notes yet
              </p>

              <p className="mt-2 text-zinc-600">
                Capture meetings, ideas and business insights with Orbit AI.
              </p>

            </div>

          ) : (

            notes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
              >

                <p className="whitespace-pre-wrap text-zinc-300">
                  {note.content}
                </p>

              </div>
            ))

          )}

        </div>

      </div>

      {/* Tasks */}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

        <h3 className="text-2xl font-bold">
          Tasks
        </h3>

        <div className="mt-6 grid gap-4">

          {tasks.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black p-10 text-center">

              <p className="text-lg text-zinc-500">
                No tasks yet
              </p>

              <p className="mt-2 text-zinc-600">
                Create your first task to organize business operations.
              </p>

            </div>

          ) : (

            tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task)}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-left transition hover:border-zinc-600"
              >

                <div className="flex items-center justify-between">

                  <h4 className="text-xl font-semibold">
                    {task.title}
                  </h4>

                  <span
                    className={
                      task.status === "done"
                        ? "rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400"
                        : "rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400"
                    }
                  >
                    {task.status}
                  </span>

                </div>

              </button>
            ))

          )}

        </div>

      </div>

      {/* Activity Timeline */}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h3 className="text-2xl font-bold">
            Activity Timeline
          </h3>

          <p className="text-zinc-500">
            {activities.length} activities
          </p>

        </div>

        <div className="mt-6 space-y-4">

          {activities.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black p-10 text-center">

              <p className="text-lg text-zinc-500">
                No activity yet
              </p>

              <p className="mt-2 text-zinc-600">
                Business actions and AI events will appear here.
              </p>

            </div>

          ) : (

            activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
              >

                <p className="font-semibold text-white">
                  {activity.content}
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  {activity.type}
                </p>

              </div>
            ))

          )}

        </div>

      </div>

    </main>
  );
}