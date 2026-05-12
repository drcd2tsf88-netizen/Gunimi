"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AIPage() {

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAskAI() {

    if (!prompt) {
      toast.error("Write a message first");

      return;
    }

    try {

      setLoading(true);

      const res = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note: prompt,
        }),
      });

      const data = await res.json();

      if (data.reply) {

        setReply(data.reply);

        toast.success("Orbit AI responded");

      } else {

        toast.error("AI failed to respond");

      }

    } catch (error) {

      console.error(error);

      toast.error("Something went wrong");

    } finally {

      setLoading(false);

    }
  }

  return (
    <main className="text-white">

      {/* Header */}
      <div>

        <div className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
          Orbit AI Assistant
        </div>

        <h1 className="mt-6 text-5xl font-bold">
          Your AI business workspace.
        </h1>

        <p className="mt-4 max-w-3xl text-xl text-zinc-400">

          Ask Orbit AI to summarize meetings,
          generate ideas, organize workflows
          and help manage your business.

        </p>

      </div>

      {/* AI Chat */}
      <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Orbit AI
          </h2>

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
            AI Powered
          </span>

        </div>

        {/* Prompt */}
        <div className="mt-6">

          <textarea
            placeholder="Ask Orbit AI anything about your business..."
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
            className="min-h-[180px] w-full rounded-2xl border border-zinc-700 bg-black p-5 text-white outline-none"
          />

        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-4">

          <button
            onClick={handleAskAI}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90"
          >
            {loading
              ? "Thinking..."
              : "Ask Orbit AI"}
          </button>

          <button
            onClick={() =>
              setPrompt(
                "Summarize today's business activity"
              )
            }
            className="rounded-xl border border-zinc-700 px-6 py-3 transition hover:bg-zinc-800"
          >
            Activity Summary
          </button>

          <button
            onClick={() =>
              setPrompt(
                "Suggest follow-up tasks for customers"
              )
            }
            className="rounded-xl border border-zinc-700 px-6 py-3 transition hover:bg-zinc-800"
          >
            CRM Suggestions
          </button>

          <button
            onClick={() =>
              setPrompt(
                "Generate productivity improvement ideas"
              )
            }
            className="rounded-xl border border-zinc-700 px-6 py-3 transition hover:bg-zinc-800"
          >
            Productivity Ideas
          </button>

        </div>

      </div>

      {/* AI Response */}
      <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            AI Response
          </h2>

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
            Live Output
          </span>

        </div>

        <div className="mt-6">

          {!reply ? (

            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black p-10 text-center">

              <p className="text-lg text-zinc-500">
                No AI response yet
              </p>

              <p className="mt-2 text-zinc-600">
                Ask Orbit AI to start generating business insights.
              </p>

            </div>

          ) : (

            <div className="rounded-2xl border border-zinc-800 bg-black p-6">

              <p className="whitespace-pre-wrap text-zinc-300 leading-relaxed">
                {reply}
              </p>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}