import { Activity, FileUp, LayoutDashboard } from "lucide-react";

import { commandRegistry } from "@/lib/commands/registry";
import type { OrbitCommand } from "@/lib/commands/types";

const commands: OrbitCommand[] = [
  {
    id: "dashboard",
    type: "navigate",
    namespace: "dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    group: "navigation",
    keywords: ["home", "overview", "main"],
  },
  {
    id: "activity",
    type: "navigate",
    namespace: "dashboard",
    icon: Activity,
    href: "/dashboard/activity",
    group: "workspace",
    keywords: ["log", "feed", "history", "events", "observatory"],
  },
  {
    id: "import",
    type: "navigate",
    namespace: "dashboard",
    icon: FileUp,
    href: "/dashboard/import",
    group: "workspace",
    keywords: ["import", "export", "csv", "data", "upload", "contacts", "companies"],
  },
];

commandRegistry.register("dashboard", commands);
