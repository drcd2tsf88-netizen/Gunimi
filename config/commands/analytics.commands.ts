import { BarChart3 } from "lucide-react";

import { commandRegistry } from "@/lib/commands/registry";
import type { OrbitCommand } from "@/lib/commands/types";

const commands: OrbitCommand[] = [
  {
    id: "analytics",
    type: "navigate",
    namespace: "analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    group: "analytics",
    keywords: ["reports", "metrics", "data", "insights", "charts"],
  },
];

commandRegistry.register("analytics", commands);
