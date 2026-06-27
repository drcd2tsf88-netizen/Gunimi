"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { commandRegistry } from "@/lib/commands/registry";
import { searchEngine } from "@/lib/search";
import type { SearchResult } from "@/lib/search";
import type { OrbitCommand } from "@/lib/commands/types";
import type { PanelId } from "@/lib/commands/panels";

interface UseCommandSearchOptions {
  userRole: string;
  activePanel: PanelId | null;
}

export function useCommandSearch({ userRole, activePanel }: UseCommandSearchOptions) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const lastCompletedQueryRef = useRef<string>("");
  const searchGenRef = useRef(0);

  // Role-filtered command list — respects the roles field on each command.
  // Since no commands carry roles today, this is a no-op but architecturally
  // ready for admin-only and owner-only commands.
  const allCommands = useMemo(
    () => commandRegistry.getForRole(userRole),
    [userRole]
  );

  // Instant local results — synchronously filter allCommands by query so there
  // is no empty dead zone during the 250 ms debounce or search flight.
  const localFilteredCommands = useMemo<OrbitCommand[]>(() => {
    if (!query.trim() || activePanel) return [];
    const q = query.toLowerCase();
    return allCommands.filter(
      (cmd) =>
        cmd.id.toLowerCase().includes(q) ||
        cmd.namespace.toLowerCase().includes(q) ||
        (cmd.keywords && cmd.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  }, [allCommands, query, activePanel]);

  // Debounced universal search — 250 ms delay reduces Server Action calls.
  // Generation counter ensures only the latest flight's results are applied.
  useEffect(() => {
    const gen = ++searchGenRef.current;

    if (!query.trim() || activePanel) {
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      void searchEngine.search({ query, limit: 20 }).then((results) => {
        if (searchGenRef.current === gen) {
          setSearchResults(results);
          setIsSearching(false);
          lastCompletedQueryRef.current = query;
        }
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [query, activePanel]);

  // Clears search state without touching the query so the entity name draft
  // in the CommandInput is preserved when entering panel mode.
  function clearSearchResults() {
    setSearchResults([]);
    setIsSearching(false);
    lastCompletedQueryRef.current = "";
  }

  return {
    allCommands,
    query,
    setQuery,
    searchResults,
    isSearching,
    lastCompletedQueryRef,
    localFilteredCommands,
    clearSearchResults,
  };
}
