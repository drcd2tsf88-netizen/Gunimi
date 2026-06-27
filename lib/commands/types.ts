import type { LucideIcon } from "lucide-react";

export type CommandNamespace =
  | "dashboard"
  | "crm"
  | "tasks"
  | "analytics"
  | "settings"
  | "ai"
  | "admin";

export type CommandGroup =
  | "navigation"
  | "workspace"
  | "crm"
  | "analytics"
  | "ai"
  | "settings"
  | "admin";

type BaseCommand = {
  id: string;
  namespace: CommandNamespace;
  icon: LucideIcon;
  group: CommandGroup;
  keywords?: string[];
  /** Keyboard shortcut label displayed in the palette, e.g. "⌘T" */
  shortcut?: string;
  // Optional: restrict to specific routes — used by getForRoute()
  routes?: string[];
  // Optional: restrict to specific platform roles — used by getForRole()
  roles?: string[];
};

export type NavigateCommand = BaseCommand & {
  type: "navigate";
  href: string;
};

export type ActionCommand = BaseCommand & {
  type: "action";
  action: string;
};

// Sprint 3 extension point: direct LLM streaming from the command palette
export type AICommand = BaseCommand & {
  type: "ai";
  prompt: string;
};

export type OrbitCommand = NavigateCommand | ActionCommand | AICommand;
