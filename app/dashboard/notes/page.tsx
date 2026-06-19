"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  FileText,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react";

import toast
from "react-hot-toast";

import { useTranslations }
from "next-intl";

import { supabase }
from "@/lib/supabase";

import { getWorkspaceNotes }
from "@/server/actions/notes/getWorkspaceNotes";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitInput
from "@/components/ui/OrbitInput";

import OrbitTextarea
from "@/components/ui/OrbitTextarea";

import OrbitSkeleton
from "@/components/ui/OrbitSkeleton";

import OrbitEmptyState
from "@/components/ui/OrbitEmptyState";

import OrbitSection
from "@/components/layout/OrbitSection";

type Note = {
  id: string;

  title: string;

  content: string;

  created_at: string;

  user_id: string;
};

export default function NotesPage() {
  const t = useTranslations("notes");

  const [notes, setNotes] =
    useState<Note[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  // ─── Load ───────────────────────

  async function loadNotes() {
    try {
      const data =
        await getWorkspaceNotes();

      setNotes(data);
    } catch (err) {
      console.error(err);

      toast.error(
        t("failedToLoad")
      );
    } finally {
      setLoading(false);
    }
  }

  // ─── Create ─────────────────────

  async function handleCreate() {
    if (!title.trim()) {
      toast.error(
        t("titleRequired")
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
        toast.error(t("unauthorized"));

        return;
      }

      const { error } =
        await supabase
          .from("workspace_notes")
          .insert({
            user_id: user.id,
            title: title.trim(),
            content: content.trim(),
          });

      if (error) {
        toast.error(
          error.message ||
            t("failedToCreate")
        );

        return;
      }

      toast.success(t("noteCreated"));

      setTitle("");
      setContent("");

      await loadNotes();
    } catch (err) {
      console.error(err);

      toast.error(
        t("failedToCreate")
      );
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div
      className="
        space-y-8
      "
    >
      {/* HEADER */}

      <OrbitSection>
        <OrbitHeading
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </OrbitSection>

      {/* CREATE */}

      <OrbitSection>
        <OrbitCard
          className="
            p-6
          "
        >
          <div
            className="
              flex
              items-center
              gap-2

              text-xs
              uppercase

              tracking-[0.15em]

              text-violet-300
            "
          >
            <Sparkles size={12} />

            {t("newNote")}
          </div>

          <div
            className="
              mt-5

              space-y-4
            "
          >
            <OrbitInput
              type="text"
              placeholder={t("noteTitlePlaceholder")}
              value={title}
              disabled={creating}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />

            <OrbitTextarea
              placeholder={t("writePlaceholder")}
              value={content}
              disabled={creating}
              onChange={(e) =>
                setContent(
                  e.target.value
                )
              }
            />

            <button
              onClick={handleCreate}
              disabled={creating}
              className="
                inline-flex
                items-center
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
              {creating ? (
                <>
                  <Loader2
                    size={14}
                    className="
                      animate-spin
                    "
                  />

                  {t("creating")}
                </>
              ) : (
                <>
                  <Plus size={14} />

                  {t("createNote")}
                </>
              )}
            </button>
          </div>
        </OrbitCard>
      </OrbitSection>

      {/* NOTES LIST */}

      <OrbitSection>
        {loading ? (
          <div
            className="
              grid
              gap-4

              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {Array.from({
              length: 6,
            }).map((_, i) => (
              <OrbitSkeleton
                key={i}
                className="h-40"
              />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <OrbitEmptyState
            icon={FileText}
            title={t("noNotes")}
            description={t("noNotesDescription")}
          />
        ) : (
          <div
            className="
              grid
              gap-4

              md:grid-cols-2
              xl:grid-cols-3
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
                      index * 0.04,
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
                        gap-3
                      "
                    >
                      <h3
                        className="
                          line-clamp-2

                          text-sm
                          font-semibold

                          leading-snug
                        "
                      >
                        {note.title}
                      </h3>

                      <div
                        className="
                          flex
                          h-8
                          w-8

                          shrink-0

                          items-center
                          justify-center

                          rounded-lg

                          border
                          border-violet-500/10

                          bg-violet-500/5

                          text-violet-300
                        "
                      >
                        <FileText
                          size={14}
                        />
                      </div>
                    </div>

                    {note.content && (
                      <p
                        className="
                          mt-3

                          line-clamp-4

                          text-sm
                          leading-relaxed

                          text-white/50
                        "
                      >
                        {note.content}
                      </p>
                    )}

                    <p
                      className="
                        mt-4

                        text-xs

                        text-white/25
                      "
                    >
                      {new Date(
                        note.created_at
                      ).toLocaleDateString(
                        "en-US",
                        {
                          month:
                            "short",

                          day:
                            "numeric",

                          year:
                            "numeric",
                        }
                      )}
                    </p>
                  </OrbitCard>
                </motion.div>
              )
            )}
          </div>
        )}
      </OrbitSection>
    </div>
  );
}
