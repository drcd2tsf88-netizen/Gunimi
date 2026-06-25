import { Brain } from "lucide-react";

import { commandRegistry } from "@/lib/commands/registry";
import type { OrbitCommand } from "@/lib/commands/types";

const commands: OrbitCommand[] = [
  {
    id: "analyze",
    type: "action",
    namespace: "ai",
    icon: Brain,
    action: "analyze-workspace",
    group: "ai",
    keywords: ["analyze", "review", "performance", "insights", "intelligence", "orbit"],
  },
];

commandRegistry.register("ai", commands);
