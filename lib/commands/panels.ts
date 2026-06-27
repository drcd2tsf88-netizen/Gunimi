/**
 * Panel domain types — kept in the command layer so panel identity is not
 * coupled to any UI component. Any module that needs to check whether a
 * command action opens a panel imports from here, not from OrbitCommand.
 */

export type PanelId =
  | "create-task"
  | "create-contact"
  | "create-company"
  | "create-deal";

export const PANEL_ACTION_IDS = new Set<string>([
  "create-task",
  "create-contact",
  "create-company",
  "create-deal",
]);

export function isPanelAction(action: string): action is PanelId {
  return PANEL_ACTION_IDS.has(action);
}
