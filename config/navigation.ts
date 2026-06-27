import type { LucideIcon } from "lucide-react";

import {
  Activity,
  BarChart3,
  Building2,
  CalendarDays,
  CheckSquare,
  FileText,
  LayoutDashboard,
  Mail,
  Settings,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";

export type NavItemId =
  | "dashboard"
  | "crm"
  | "companies"
  | "deals"
  | "tasks"
  | "notes"
  | "email"
  | "calendar"
  | "analytics"
  | "ai"
  | "activity"
  | "import"
  | "settings";

export type NavGroupId =
  | "overview"
  | "relationships"
  | "work"
  | "communication"
  | "intelligence"
  | "system";

export type NavItem = {
  id: NavItemId;
  /** Key inside the "nav" i18n namespace */
  labelKey: string;
  href: string;
  icon: LucideIcon;
  /** When true, only marks active on exact pathname match */
  exactMatch?: boolean;
};

export type NavGroup = {
  id: NavGroupId;
  /** Key inside the "nav" i18n namespace, or null to omit the section header */
  labelKey: string | null;
  /** When true, renders a top border before this group */
  separator?: boolean;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "overview",
    labelKey: null,
    items: [
      {
        id: "dashboard",
        labelKey: "dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        exactMatch: true,
      },
    ],
  },
  {
    id: "relationships",
    labelKey: "groupRelationships",
    items: [
      { id: "crm",       labelKey: "crm",       href: "/dashboard/crm",       icon: Users      },
      { id: "companies", labelKey: "companies", href: "/dashboard/companies", icon: Building2  },
      { id: "deals",     labelKey: "deals",     href: "/dashboard/deals",     icon: TrendingUp },
    ],
  },
  {
    id: "work",
    labelKey: "groupWork",
    items: [
      { id: "tasks", labelKey: "tasks", href: "/dashboard/tasks", icon: CheckSquare },
      { id: "notes", labelKey: "notes", href: "/dashboard/notes", icon: FileText    },
    ],
  },
  {
    id: "communication",
    labelKey: "groupCommunication",
    items: [
      { id: "email",    labelKey: "email",    href: "/dashboard/email",    icon: Mail        },
      { id: "calendar", labelKey: "calendar", href: "/dashboard/calendar", icon: CalendarDays },
    ],
  },
  {
    id: "intelligence",
    labelKey: "groupIntelligence",
    items: [
      { id: "analytics", labelKey: "analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { id: "ai",        labelKey: "ai",        href: "/dashboard/ai",        icon: Sparkles  },
      { id: "activity",  labelKey: "activity",  href: "/dashboard/activity",  icon: Activity  },
    ],
  },
  {
    id: "system",
    labelKey: null,
    separator: true,
    items: [
      { id: "import",   labelKey: "import",   href: "/dashboard/import",   icon: Upload   },
      { id: "settings", labelKey: "settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.exactMatch) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
