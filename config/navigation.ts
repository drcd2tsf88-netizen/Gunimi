import type { LucideIcon } from "lucide-react";

import {
  BarChart3,
  Building2,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Mail,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

export type NavItemId =
  | "dashboard"
  | "crm"
  | "companies"
  | "deals"
  | "tasks"
  | "email"
  | "calendar"
  | "analytics"
  | "settings";

export type NavGroupId =
  | "overview"
  | "relationships"
  | "sales"
  | "work"
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
  /** When true, group header shows a toggle and items can be collapsed */
  collapsible?: boolean;
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
      { id: "crm",       labelKey: "contacts",  href: "/dashboard/contacts",  icon: Users     },
      { id: "companies", labelKey: "companies",  href: "/dashboard/companies", icon: Building2 },
    ],
  },
  {
    id: "sales",
    labelKey: "groupSales",
    items: [
      { id: "deals", labelKey: "deals", href: "/dashboard/deals", icon: TrendingUp },
    ],
  },
  {
    id: "work",
    labelKey: "groupWork",
    items: [
      { id: "tasks",    labelKey: "tasks",    href: "/dashboard/tasks",    icon: CheckSquare  },
      { id: "email",    labelKey: "email",    href: "/dashboard/email",    icon: Mail         },
      { id: "calendar", labelKey: "calendar", href: "/dashboard/calendar", icon: CalendarDays },
    ],
  },
  {
    id: "system",
    labelKey: null,
    separator: true,
    items: [
      { id: "analytics", labelKey: "analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { id: "settings",  labelKey: "settings",  href: "/dashboard/settings",  icon: Settings  },
    ],
  },
];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.exactMatch) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
