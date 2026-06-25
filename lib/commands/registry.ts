import type { CommandNamespace, CommandGroup, OrbitCommand } from "./types";

// Module-level singleton — zero overhead, deterministic, testable.
// Pattern: modules register on import, palette reads on render.
const _store = new Map<CommandNamespace, OrbitCommand[]>();

function register(namespace: CommandNamespace, commands: OrbitCommand[]): void {
  _store.set(namespace, commands);
}

function unregister(namespace: CommandNamespace): void {
  _store.delete(namespace);
}

function getAll(): OrbitCommand[] {
  return Array.from(_store.values()).flat();
}

function getByGroup(): Partial<Record<CommandGroup, OrbitCommand[]>> {
  return getAll().reduce((acc, command) => {
    if (!acc[command.group]) acc[command.group] = [];
    acc[command.group]!.push(command);
    return acc;
  }, {} as Partial<Record<CommandGroup, OrbitCommand[]>>);
}

// Filters on the optional `routes` field. Commands without `routes` are global.
function getForRoute(pathname: string): OrbitCommand[] {
  return getAll().filter((cmd) => {
    if (!cmd.routes || cmd.routes.length === 0) return true;
    return cmd.routes.some((route) => pathname.startsWith(route));
  });
}

// Filters on the optional `roles` field. Commands without `roles` are shown to all roles.
function getForRole(role: string): OrbitCommand[] {
  return getAll().filter((cmd) => {
    if (!cmd.roles || cmd.roles.length === 0) return true;
    return cmd.roles.includes(role);
  });
}

export const commandRegistry = {
  register,
  unregister,
  getAll,
  getByGroup,
  getForRoute,
  getForRole,
};
