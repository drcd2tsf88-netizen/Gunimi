import { ClipboardList } from "lucide-react";

import { commandRegistry } from "@/lib/commands/registry";
import type { OrbitCommand } from "@/lib/commands/types";

const commands: OrbitCommand[] = [
  {
    id: "tasks",
    type: "navigate",
    namespace: "tasks",
    icon: ClipboardList,
    href: "/dashboard/tasks",
    group: "workspace",
    keywords: ["work", "todo", "assignments", "projects"],
  },
];

commandRegistry.register("tasks", commands);
