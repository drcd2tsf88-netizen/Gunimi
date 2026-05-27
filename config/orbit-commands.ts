import {
  Activity,
  BarChart3,
  Brain,
  ClipboardList,
  LayoutDashboard,
  Users,
} from "lucide-react";

export const orbitCommands = [
  {
    id: "dashboard",

    title:
      "Open Dashboard",

    description:
      "Navigate to workspace dashboard",

    icon:
      LayoutDashboard,

    href:
      "/dashboard",

    group:
      "Navigation",
  },

  {
    id: "tasks",

    title:
      "Open Tasks",

    description:
      "View active workspace tasks",

    icon:
      ClipboardList,

    href:
      "/dashboard/tasks",

    group:
      "Workspace",
  },

  {
    id: "crm",

    title:
      "Open CRM",

    description:
      "Manage customer workflows",

    icon:
      Users,

    href:
      "/dashboard/crm",

    group:
      "CRM",
  },

  {
    id: "analytics",

    title:
      "Open Analytics",

    description:
      "Review workspace analytics",

    icon:
      BarChart3,

    href:
      "/dashboard/analytics",

    group:
      "Analytics",
  },

  {
    id: "analyze",

    title:
      "Analyze Workspace",

    description:
      "Orbit AI reviews workspace performance",

    icon:
      Brain,

    action:
      "analyze-workspace",

    group:
      "AI Actions",
  },

  {
    id: "activity",

    title:
      "Open Activity",

    description:
      "Review workspace observatory",

    icon:
      Activity,

    href:
      "/dashboard/activity",

    group:
      "Workspace",
  },
];