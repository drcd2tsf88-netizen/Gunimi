"use client";

import {
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  FileText,
  Plus,
} from "lucide-react";

import toast
from "react-hot-toast";

import DOMPurify
from "dompurify";

import { supabase }
from "@/lib/supabase";

import { ratelimit }
from "@/lib/ratelimit";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitInput
from "@/components/ui/OrbitInput";

import OrbitTextarea
from "@/components/ui/OrbitTextarea";

type Props = {
  notes: any[];

  companyId: string;

  refresh: () => void;

  refreshActivity: () => void;
};

export default function WorkspaceNotes({
  notes,

  companyId,

  refresh,

  refreshActivity,
}: Props) {
  const [
    title,

    setTitle,
  ] = useState("");

  const [
    content,

    setContent,
  ] = useState("");

  const [
    creating,

    setCreating,
  ] = useState(false);

  async function createNote() {
    if (!title) {
      toast.error(
        "Note title required"
      );

      return;
    }

    try {
      setCreating(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        toast.error(
          "Unauthorized"
        );

        return;
      }

      const {
        success,
      } =
        await ratelimit.limit(
          user.id
        );

      if (!success) {
        toast.error(
          "Rate limit exceeded"
        );

        return;
      }

      const cleanTitle =
        DOMPurify.sanitize(
          title
        );

      const cleanContent =
        DOMPurify.sanitize(
          content
        );

      const response =
        await fetch(
          "/api/notes/create",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              companyId,

              title:
                cleanTitle,

              content:
                cleanContent,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        toast.error(
          data.error ||
            "Failed to create note"
        );

        return;
      }

      await supabase
        .from(
          "workspace_activity"
        )
        .insert({
          company_id:
            companyId,

          type:
            "note_created",

          message:
            DOMPurify.sanitize(
              `Created note "${cleanTitle}"`
            ),
        });

      toast.success(
        "Note created"
      );

      setTitle("");

      setContent("");

      refresh();

      refreshActivity();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create note"
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <section
      className="
        space-y-6
      "
    >
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
            Workspace Knowledge
          </p>

          <h2
            className="
              mt-2

              text-2xl
              font-semibold

              tracking-tight
            "
          >
            Workspace Notes
          </h2>

          <p
            className="
              mt-3

              text-sm
              leading-relaxed

              text-zinc-500
            "
          >
            Team notes, meeting
            summaries and operational
            knowledge systems.
          </p>
        </div>

        {/* COUNT */}

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
          <FileText
            size={14}
            className="
              text-violet-300
            "
          />

          <span>
            {notes.length} Notes
          </span>
        </div>
      </div>

      {/* CREATE */}

      <OrbitCard
        className="
          p-5
        "
      >
        <div
          className="
            grid
            gap-4
          "
        >
          <OrbitInput
            type="text"
            placeholder="
              Note title
            "
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          <OrbitTextarea
            placeholder="
              Write workspace note...
            "
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
          />

          <button
            onClick={createNote}
            disabled={creating}
            className="
              inline-flex
              items-center
              justify-center
              gap-2

              rounded-xl

              border
              border-violet-500/20

              bg-violet-500/10

              px-5
              py-3

              text-sm
              font-medium

              text-violet-200

              transition-all
              duration-300

              hover:border-violet-500/30
              hover:bg-violet-500/15

              disabled:opacity-50
            "
          >
            <Plus size={16} />

            {creating
              ? "Creating..."
              : "Create Note"}
          </button>
        </div>
      </OrbitCard>

      {/* NOTES */}

      <div
        className="
          grid
          gap-4

          xl:grid-cols-2
        "
      >
        {notes.map(
          (note, index) => (
            <motion.div
              key={note.id}
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
                      {note.title}
                    </h3>

                    <p
                      className="
                        mt-4

                        text-sm
                        leading-relaxed

                        text-zinc-400
                      "
                    >
                      {note.content}
                    </p>
                  </div>

                  {/* ICON */}

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
                    <FileText
                      size={16}
                      className="
                        text-violet-300
                      "
                    />
                  </div>
                </div>
              </OrbitCard>
            </motion.div>
          )
        )}
      </div>
    </section>
  );
}