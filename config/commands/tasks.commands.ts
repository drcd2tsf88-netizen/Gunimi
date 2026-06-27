import { ClipboardList, Plus } from "lucide-react";

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
  {
    id: "createTask",
    type: "action",
    namespace: "tasks",
    icon: Plus,
    action: "create-task",
    group: "workspace",
    routes: ["/dashboard/tasks"],
    keywords: ["new", "add", "task", "create", "todo"],
  },
];

commandRegistry.register("tasks", commands);
