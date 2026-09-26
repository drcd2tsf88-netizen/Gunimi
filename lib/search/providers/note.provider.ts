import { searchNotes } from "@/server/actions/search/searchNotes";
import type { NoteRow } from "@/server/actions/search/searchNotes";

import { searchRegistry } from "@/lib/search/registry";
import type { EntityResult, SearchProvider, SearchQuery } from "@/lib/search/types";

function scoreNote(title: string, content: string | null, query: string): number {
  const q = query.toLowerCase();
  const t = title.toLowerCase();

  if (t === q) return 1.0;
  if (t.startsWith(q)) return 0.9;
  if (t.split(" ").some((word) => word.startsWith(q))) return 0.8;
  if (t.includes(q)) return 0.7;
  if (content?.toLowerCase().includes(q)) return 0.5;

  return 0.6;
}

const MAX_DESCRIPTION_LENGTH = 60;

function truncate(text: string | null): string | undefined {
  if (!text) return undefined;
  return text.length > MAX_DESCRIPTION_LENGTH
    ? `${text.slice(0, MAX_DESCRIPTION_LENGTH)}…`
    : text;
}

function mapNote(note: NoteRow, query: string): EntityResult {
  return {
    kind: "entity",
    id: `note:${note.id}`,
    entityType: "note",
    entityId: note.id,
    href: `/dashboard/notes/${note.id}`,
    title: note.title,
    description: truncate(note.content),
    category: "notes",
    score: scoreNote(note.title, note.content, query),
    priority: 35,
    metadata: {},
  };
}

const noteSearchProvider: SearchProvider = {
  id: "workspace-notes",
  name: "Notes",
  priority: 35,

  async search({ query, limit = 20 }: SearchQuery): Promise<EntityResult[]> {
    if (!query.trim()) return [];

    const { notes } = await searchNotes(query);

    return notes
      .map((note) => mapNote(note, query))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
};

searchRegistry.register(noteSearchProvider);
