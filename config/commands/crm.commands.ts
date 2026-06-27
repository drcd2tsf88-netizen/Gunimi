import { Building2, Plus, TrendingUp, UserPlus, Users } from "lucide-react";

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
  {
    id: "createContact",
    type: "action",
    namespace: "crm",
    icon: UserPlus,
    action: "create-contact",
    group: "crm",
    routes: ["/dashboard/crm"],
    keywords: ["new", "add", "contact", "create", "person", "people", "lead"],
  },
  {
    id: "createCompany",
    type: "action",
    namespace: "crm",
    icon: Plus,
    action: "create-company",
    group: "crm",
    routes: ["/dashboard/crm", "/dashboard/companies"],
    keywords: ["new", "add", "company", "create", "organization", "business", "account"],
  },
  {
    id: "createDeal",
    type: "action",
    namespace: "crm",
    icon: TrendingUp,
    action: "create-deal",
    group: "crm",
    routes: ["/dashboard/crm", "/dashboard/deals"],
    keywords: ["new", "add", "deal", "create", "opportunity", "pipeline", "revenue", "sales"],
  },
];

commandRegistry.register("crm", commands);
