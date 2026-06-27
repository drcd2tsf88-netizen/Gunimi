/**
 * Execution progress primitives.
 *
 * These types define the shape of progress data for long-running and
 * multi-step command execution. They are type-only today — the transport
 * layer will emit CommandExecutionProgress events once streaming is wired.
 *
 * The palette's progress reporting UI should consume these types directly
 * to remain compatible when streaming is introduced.
 */

export type CommandExecutionPhase =
  | "idle"
  | "pending"
  | "running"
  | "complete"
  | "cancelled"
  | "error";

export type CommandExecutionStep = {
  label: string;
  status: "pending" | "running" | "complete" | "error";
};

export type CommandExecutionProgress = {
  phase: CommandExecutionPhase;
  message?: string;
  steps?: CommandExecutionStep[];
  /** 0–1 completion ratio; undefined when progress is indeterminate */
  progress?: number;
};
