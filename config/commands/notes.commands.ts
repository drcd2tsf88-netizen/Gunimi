import { StickyNote } from "lucide-react";

import { commandRegistry } from "@/lib/commands/registry";
import type { OrbitCommand } from "@/lib/commands/types";

const commands: OrbitCommand[] = [
  {
    id: "notes",
    type: "navigate",
    namespace: "notes",
    icon: StickyNote,
    href: "/dashboard/notes",
    group: "workspace",
    keywords: ["notes", "memo", "log", "journal", "write"],
  },
  {
    id: "createNote",
    type: "action",
    namespace: "notes",
    icon: StickyNote,
    action: "create-note",
    group: "workspace",
    routes: ["/dashboard/notes"],
    keywords: ["new", "add", "note", "create", "memo", "write", "log"],
  },
];

commandRegistry.register("notes", commands);
