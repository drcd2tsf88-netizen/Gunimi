import { Activity, LayoutDashboard } from "lucide-react";

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
];

commandRegistry.register("dashboard", commands);
