// Workspace Engine shared types — used by all entity resolvers and Engine components.
// No entity domain may define these types independently.

export type StoryIconKey =
  | "begin"
  | "meeting"
  | "email"
  | "call"
  | "stage"
  | "group";

export type StoryEvent = {
  id: string;
  iconKey: StoryIconKey;
  badgeKey: string;
  titleRaw?: string;
  titleKey?: string;
  titleParams?: Record<string, string | number>;
  detail?: string;
  who?: string;
  date: string;
};

export type RawContextEntry = {
  id: string;
  labelKey?: string;
  primary: string;
  secondary?: string;
  href?: string;
  metaRaw?: string;
};

export type RawContextSection = {
  id: string;
  titleKey: string;
  iconKey: "relationships" | "notes" | "tasks" | "meeting" | "deals";
  entries: RawContextEntry[];
};
