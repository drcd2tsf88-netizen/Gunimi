import { Building2, TrendingUp, Users } from "lucide-react";

import { commandRegistry } from "@/lib/commands/registry";
import type { OrbitCommand } from "@/lib/commands/types";

const commands: OrbitCommand[] = [
  {
    id: "crm",
    type: "navigate",
    namespace: "crm",
    icon: Users,
    href: "/dashboard/crm",
    group: "crm",
    keywords: ["contacts", "leads", "customers", "people", "relationships"],
  },
  {
    id: "companies",
    type: "navigate",
    namespace: "crm",
    icon: Building2,
    href: "/dashboard/companies",
    group: "crm",
    keywords: ["organizations", "accounts", "businesses", "firms"],
  },
  {
    id: "deals",
    type: "navigate",
    namespace: "crm",
    icon: TrendingUp,
    href: "/dashboard/deals",
    group: "crm",
    keywords: ["pipeline", "opportunities", "revenue", "sales", "commercial"],
  },
];

commandRegistry.register("crm", commands);
