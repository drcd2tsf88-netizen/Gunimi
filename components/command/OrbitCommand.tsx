"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "cmdk";

import {
  Building2,
  ClipboardCheck,
  Search,
  SearchX,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { EntityResult } from "@/lib/search/types";

import { useTranslations } from "next-intl";

import OrbitThinking
from "@/components/command/OrbitThinking";

// Side effects: register command modules and search providers
import "@/config/commands";
import "@/lib/search/providers";

import { recentCommands } from "@/lib/commands/recent";
import { isPanelAction } from "@/lib/commands/panels";
import type { PanelId } from "@/lib/commands/panels";
import type { OrbitCommand } from "@/lib/commands/types";
import type { SearchResult } from "@/lib/search";

import { executeOrbitCommand }
from "@/server/actions/ai/executeOrbitCommand";

import { useOrbitCommandStore }
from "@/lib/store/orbit-command-store";

import { useAIStateStore }
from "@/lib/store/ai-state-store";

import CreateTaskPanel
from "@/components/command/panels/CreateTaskPanel";
import CreateContactPanel
from "@/components/command/panels/CreateContactPanel";
import CreateCompanyPanel
from "@/components/command/panels/CreateCompanyPanel";
import CreateDealPanel
from "@/components/command/panels/CreateDealPanel";

import { useCommandSearch }
from "@/components/command/useCommandSearch";
import { usePanelState }
from "@/components/command/usePanelState";

interface OrbitCommandPaletteProps {
  /** Platform role used to filter role-gated commands. Defaults to "member". */
  userRole?: string;
}

export default function OrbitCommandPalette({
  userRole = "member",
}: OrbitCommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("command");

  const { open, setOpen, toggle } = useOrbitCommandStore();
  const { thinking, setThinking, setCurrentThought } = useAIStateStore();

  const previousFocusRef = useRef<HTMLElement | null>(null);
  // Prepared for future AI command cancellation (Sprint 19 — transport abstraction)
  const activeExecutionRef = useRef<AbortController | null>(null);

  const [recentIds, setRecentIds] = useState<string[]>(
    () => recentCommands.getRecent()
  );
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);

  // ── Extracted hooks ──────────────────────────────────────────────────────────

  const search = useCommandSearch({ userRole, activePanel });

  const panel = usePanelState({
    query: search.query,
    activePanel,
    setActivePanel,
    setOpen,
    clearSearchResults: search.clearSearchResults,
  });

  // ── Browse mode data ─────────────────────────────────────────────────────────

  const groupedCommands = useMemo(() => {
    return search.allCommands.reduce(
      (acc, cmd) => {
        if (!acc[cmd.group]) acc[cmd.group] = [];
        acc[cmd.group]!.push(cmd);
        return acc;
      },
      {} as Record<string, OrbitCommand[]>
    );
  }, [search.allCommands]);

  const contextualCommands = useMemo(
    () =>
      search.allCommands.filter(
        (cmd) =>
          cmd.routes && cmd.routes.some((r) => pathname.startsWith(r))
      ),
    [search.allCommands, pathname]
  );

  const contextualIds = useMemo(
    () => new Set(contextualCommands.map((c) => c.id)),
    [contextualCommands]
  );

  const recentCommandObjects = useMemo(() => {
    const idToCommand = new Map(search.allCommands.map((c) => [c.id, c]));
    return recentIds.flatMap((id) => {
      const cmd = idToCommand.get(id);
      return cmd ? [cmd] : [];
    });
  }, [search.allCommands, recentIds]);

  const recentIdSet = useMemo(
    () => new Set(recentCommandObjects.map((c) => c.id)),
    [recentCommandObjects]
  );

  // Ordered browse groups: Recent → Suggested → remaining (each command once).
  const orderedGroups = useMemo<[string, OrbitCommand[]][]>(() => {
    const excludeIds = new Set([...recentIdSet, ...contextualIds]);
    const groups: [string, OrbitCommand[]][] = [];

    if (recentCommandObjects.length > 0) {
      groups.push(["recent", recentCommandObjects]);
    }
    if (contextualCommands.length > 0) {
      groups.push(["contextual", contextualCommands]);
    }
    for (const [group, cmds] of Object.entries(groupedCommands)) {
      if (!cmds) continue;
      const remaining =
        excludeIds.size > 0 ? cmds.filter((c) => !excludeIds.has(c.id)) : cmds;
      if (remaining.length > 0) groups.push([group, remaining]);
    }
    return groups;
  }, [
    groupedCommands,
    recentCommandObjects,
    recentIdSet,
    contextualCommands,
    contextualIds,
  ]);

  // ── Effects ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        toggle();
      }
      if (event.key === "Escape") {
        if (activePanel) {
          setActivePanel(null);
          panel.setPanelError(null);
          // query is intentionally preserved as the entity name draft
        } else {
          setOpen(false);
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen, toggle, activePanel, panel]);

  // ── Command dispatch ─────────────────────────────────────────────────────────

  async function handleCommand(command: OrbitCommand) {
    recentCommands.record(command.id);
    setRecentIds(recentCommands.getRecent());

    if (command.type === "action" && isPanelAction(command.action)) {
      panel.openPanel(command.action);
      return;
    }

    if (command.type === "action") {
      // Non-panel action → AI execution. AbortController prepared for when
      // executeOrbitCommand gains signal support (transport abstraction sprint).
      const controller = new AbortController();
      activeExecutionRef.current?.abort();
      activeExecutionRef.current = controller;

      setThinking(true);
      setCurrentThought(t("thinkingCurrentThought"));
      try {
        await executeOrbitCommand({ action: command.action });
      } catch {
        // execution errors are surfaced via toast in child components
      } finally {
        activeExecutionRef.current = null;
        setThinking(false);
        setCurrentThought("");
        setOpen(false);
      }
      return;
    }

    if (command.type === "navigate") {
      router.push(command.href);
      setOpen(false);
      return;
    }

    // type: "ai" — CommandTransport abstraction required; streaming not yet available
    setOpen(false);
  }

  async function handleSearchResult(result: SearchResult) {
    if (result.kind === "command") {
      const command = search.allCommands.find((c) => c.id === result.commandId);
      if (command) await handleCommand(command);
      return;
    }

    if (result.kind === "page" || result.kind === "entity") {
      router.push(result.href);
      setOpen(false);
      return;
    }

    // result.kind === "ai" — not yet supported
    setOpen(false);
  }

  // ── Render helpers ───────────────────────────────────────────────────────────

  /** Styled heading for CommandGroup. Special groups (Recent, Suggested) get violet accent. */
  function groupHeading(group: string) {
    const isSpecial = group === "recent" || group === "contextual";
    return (
      <span
        className={`
          flex items-center gap-1.5
          text-[10px] font-semibold uppercase tracking-widest
          ${isSpecial ? "text-violet-400/70" : "text-zinc-600"}
        `}
      >
        {isSpecial && (
          <span className="inline-block h-1 w-1 rounded-full bg-violet-400/60" />
        )}
        {t(`groups.${group}`)}
      </span>
    );
  }

  /** Single CommandItem rendered consistently across browse and local-filter modes. */
  function renderCommandItem(command: OrbitCommand) {
    const Icon = command.icon;
    return (
      <CommandItem
        key={command.id}
        onSelect={() => {
          void handleCommand(command);
        }}
        className="
          group

          mb-2

          flex
          items-center
          justify-between

          rounded-2xl

          border
          border-transparent

          bg-transparent

          px-4
          py-4

          text-white

          transition-all
          duration-300

          hover:border-white/10
          hover:bg-white/[0.04]

          data-[selected=true]:border-violet-500/20
          data-[selected=true]:bg-violet-500/10
        "
      >
        {/* LEFT — icon + title + description */}
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <div
            className="
              flex
              h-12
              w-12

              items-center
              justify-center

              rounded-2xl

              border
              border-white/10

              bg-white/[0.03]

              transition-all
              duration-300

              group-hover:border-violet-500/20
              group-hover:bg-violet-500/10
            "
          >
            <Icon
              className="
                h-5
                w-5

                text-zinc-300
              "
            />
          </div>

          <div>
            <p
              className="
                font-medium

                text-white
              "
            >
              {t(`items.${command.id}.title`)}
            </p>

            <p
              className="
                mt-1

                text-sm
                text-zinc-500
              "
            >
              {t(`items.${command.id}.description`)}
            </p>
          </div>
        </div>

        {/* RIGHT — optional shortcut + type badge */}
        <div className="flex items-center gap-2">
          {command.shortcut && (
            <span
              className="
                rounded-md

                border
                border-white/10

                bg-white/[0.03]

                px-2
                py-1

                text-xs
                text-zinc-600
              "
            >
              {command.shortcut}
            </span>
          )}

          <div
            className="
              rounded-lg

              border
              border-white/10

              bg-white/[0.03]

              px-2
              py-1

              text-xs
              text-zinc-500
            "
          >
            {command.type === "navigate"
              ? t("badgeOpen")
              : command.type === "action"
              ? t("badgeAction")
              : t("badgeAI")}
          </div>
        </div>
      </CommandItem>
    );
  }

  // ── Derived values ───────────────────────────────────────────────────────────

  const activePanelPlaceholder =
    activePanel === "create-task"
      ? t("createTaskPlaceholder")
      : activePanel === "create-contact"
      ? t("createContactPlaceholder")
      : activePanel === "create-company"
      ? t("createCompanyPlaceholder")
      : activePanel === "create-deal"
      ? t("createDealPlaceholder")
      : t("placeholder");

  // Text for the aria-live region — announced after search completes.
  const a11yStatusText =
    search.query.trim() &&
    !search.isSearching &&
    search.lastCompletedQueryRef.current === search.query
      ? search.searchResults.length > 0
        ? t("a11yResultsFound", { count: search.searchResults.length })
        : t("a11yNoResults")
      : "";

  const isSearchDeadZone =
    search.query.trim().length > 0 &&
    !search.isSearching &&
    search.lastCompletedQueryRef.current === search.query &&
    search.searchResults.length === 0 &&
    search.localFilteredCommands.length === 0;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence
      onExitComplete={() => {
        previousFocusRef.current?.focus();
        previousFocusRef.current = null;

        search.setQuery("");
        search.clearSearchResults();
        setActivePanel(null);
        panel.resetPanel();
      }}
    >
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed
            inset-0
            z-command

            flex
            items-start
            justify-center

            bg-black/70

            px-4
            pt-[10vh]

            backdrop-blur-xl
          "
          onClick={() => setOpen(false)}
        >
          {/* DIALOG */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="orbit-command-title"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative

              w-full
              max-w-2xl
            "
          >
            {/* AMBIENT GLOW */}
            <div
              className="
                pointer-events-none

                absolute
                inset-0

                bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_55%)]
              "
            />

            {/* COMMAND — shouldFilter=false: filtering is owned by the search engine + local filter */}
            <Command
              shouldFilter={false}
              className="
                relative

                overflow-hidden

                rounded-[36px]

                border
                border-white/10

                bg-[#0b1020]/95

                backdrop-blur-3xl

                shadow-[0_0_100px_rgba(124,58,237,0.30)]
              "
            >
              {/* HEADER */}
              <div
                className="
                  flex
                  items-center
                  justify-between

                  border-b
                  border-white/10

                  px-6
                  py-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(124,58,237,0)",
                        "0 0 30px rgba(124,58,237,0.4)",
                        "0 0 0px rgba(124,58,237,0)",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="
                      relative

                      flex
                      h-12
                      w-12

                      items-center
                      justify-center

                      rounded-2xl

                      border
                      border-violet-500/20

                      bg-violet-500/10
                    "
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="
                        absolute

                        h-5
                        w-5

                        rounded-full

                        bg-violet-400/40
                      "
                    />
                    <Sparkles className="h-5 w-5 text-violet-300" />
                  </motion.div>

                  <div>
                    <h2
                      id="orbit-command-title"
                      className="
                        text-lg
                        font-semibold

                        text-white
                      "
                    >
                      {t("title")}
                    </h2>
                    <p className="text-sm text-zinc-500">{t("subtitle")}</p>
                  </div>
                </div>

                <div
                  className="
                    rounded-xl

                    border
                    border-white/10

                    bg-white/[0.04]

                    px-3
                    py-2

                    text-xs
                    text-zinc-500
                  "
                >
                  {t("escLabel")}
                </div>
              </div>

              {/* SEARCH INPUT */}
              <div
                className="
                  relative

                  border-b
                  border-white/10

                  px-5
                  py-4
                "
              >
                <CommandInput
                  value={search.query}
                  onValueChange={search.setQuery}
                  placeholder={activePanelPlaceholder}
                  aria-label={activePanelPlaceholder}
                  className="
                    w-full

                    bg-transparent

                    text-lg
                    text-white

                    outline-none

                    placeholder:text-zinc-500
                  "
                />

                {search.isSearching && search.query.trim() && (
                  <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-violet-500/60"
                      initial={{ x: "-100%" }}
                      animate={{ x: "400%" }}
                      transition={{
                        duration: 1.2,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* THINKING */}
              {thinking && (
                <div
                  className="
                    border-b
                    border-white/5

                    p-5
                  "
                >
                  <OrbitThinking />
                </div>
              )}

              {/* SCREEN READER STATUS — announces search result count after each search */}
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              >
                {a11yStatusText}
              </div>

              {/* COMMANDS */}
              <CommandList
                aria-busy={search.isSearching && search.query.trim().length > 0}
                className="
                  max-h-[520px]

                  overflow-y-auto

                  p-4
                "
              >
                {/* PANEL MODE */}
                {activePanel ? (
                  activePanel === "create-task" ? (
                    <CreateTaskPanel
                      query={search.query}
                      isSubmitting={panel.isExecuting}
                      error={panel.panelError}
                      onSubmit={panel.handleCreateTask}
                    />
                  ) : activePanel === "create-contact" ? (
                    <CreateContactPanel
                      query={search.query}
                      isSubmitting={panel.isExecuting}
                      error={panel.panelError}
                      onSubmit={panel.handleCreateContact}
                      defaultValues={panel.panelDraftsRef.current["create-contact"]}
                      onDraftChange={(draft) =>
                        panel.saveDraft("create-contact", draft)
                      }
                    />
                  ) : activePanel === "create-company" ? (
                    <CreateCompanyPanel
                      query={search.query}
                      isSubmitting={panel.isExecuting}
                      error={panel.panelError}
                      onSubmit={panel.handleCreateCompany}
                      defaultValues={panel.panelDraftsRef.current["create-company"]}
                      onDraftChange={(draft) =>
                        panel.saveDraft("create-company", draft)
                      }
                    />
                  ) : (
                    <CreateDealPanel
                      query={search.query}
                      isSubmitting={panel.isExecuting}
                      error={panel.panelError}
                      onSubmit={panel.handleCreateDeal}
                      defaultValues={panel.panelDraftsRef.current["create-deal"]}
                      onDraftChange={(draft) =>
                        panel.saveDraft("create-deal", draft)
                      }
                    />
                  )
                ) : (
                  <>
                    {/* EMPTY STATE — only after search fully resolves with zero results
                        and local filtering also finds nothing */}
                    {isSearchDeadZone && (
                      <div
                        className="
                          flex
                          flex-col
                          items-center
                          gap-3

                          px-4
                          py-10

                          text-center
                        "
                      >
                        <div
                          className="
                            flex
                            h-12
                            w-12

                            items-center
                            justify-center

                            rounded-2xl

                            border
                            border-white/[0.07]

                            bg-white/[0.03]
                          "
                        >
                          <SearchX size={20} className="text-white/25" />
                        </div>

                        <div>
                          <p
                            className="
                              text-sm
                              font-medium
                              text-white/50
                            "
                          >
                            {t("emptyTitle")}
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-white/25
                            "
                          >
                            {t("emptyDescription")}
                          </p>

                          <p
                            className="
                              mt-2
                              text-xs
                              text-violet-400/40
                            "
                          >
                            {t("emptyHint")}
                          </p>
                        </div>
                      </div>
                    )}

                    {search.query.trim() ? (
                      /*
                       * SEARCH MODE
                       *
                       * Server results take priority when available.
                       * Local filtered commands fill the gap during the debounce
                       * window and search flight — eliminating the dead zone.
                       */
                      search.searchResults.length > 0 ? (
                        <CommandGroup heading={t("searchResultsGroup")}>
                          {search.searchResults.map((result) => {
                            const entityIcons: Record<
                              EntityResult["entityType"],
                              LucideIcon
                            > = {
                              contact: Users,
                              company: Building2,
                              deal: TrendingUp,
                              task: ClipboardCheck,
                            };

                            const entityBadgeKeys: Record<
                              EntityResult["entityType"],
                              string
                            > = {
                              contact: t("badgeContact"),
                              company: t("badgeCompany"),
                              deal: t("badgeDeal"),
                              task: t("badgeTask"),
                            };

                            const Icon: LucideIcon =
                              result.kind === "command" ||
                              result.kind === "page"
                                ? (result.icon ?? Search)
                                : result.kind === "entity"
                                ? entityIcons[result.entityType]
                                : Search;

                            const title =
                              result.kind === "command"
                                ? t(`items.${result.commandId}.title`)
                                : result.title;

                            const description =
                              result.kind === "command"
                                ? t(`items.${result.commandId}.description`)
                                : result.description;

                            const badge =
                              result.kind === "command"
                                ? result.metadata?.type === "navigate"
                                  ? t("badgeOpen")
                                  : result.metadata?.type === "action"
                                  ? t("badgeAction")
                                  : t("badgeAI")
                                : result.kind === "entity"
                                ? entityBadgeKeys[result.entityType]
                                : result.kind === "ai"
                                ? t("badgeAI")
                                : t("badgeOpen");

                            return (
                              <CommandItem
                                key={result.id}
                                onSelect={() => {
                                  void handleSearchResult(result);
                                }}
                                className="
                                  group

                                  mb-2

                                  flex
                                  items-center
                                  justify-between

                                  rounded-2xl

                                  border
                                  border-transparent

                                  bg-transparent

                                  px-4
                                  py-4

                                  text-white

                                  transition-all
                                  duration-300

                                  hover:border-white/10
                                  hover:bg-white/[0.04]

                                  data-[selected=true]:border-violet-500/20
                                  data-[selected=true]:bg-violet-500/10
                                "
                              >
                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-4
                                  "
                                >
                                  <div
                                    className="
                                      flex
                                      h-12
                                      w-12

                                      items-center
                                      justify-center

                                      rounded-2xl

                                      border
                                      border-white/10

                                      bg-white/[0.03]

                                      transition-all
                                      duration-300

                                      group-hover:border-violet-500/20
                                      group-hover:bg-violet-500/10
                                    "
                                  >
                                    <Icon
                                      className="
                                        h-5
                                        w-5

                                        text-zinc-300
                                      "
                                    />
                                  </div>

                                  <div>
                                    <p
                                      className="
                                        font-medium

                                        text-white
                                      "
                                    >
                                      {title}
                                    </p>

                                    {description && (
                                      <p
                                        className="
                                          mt-1

                                          text-sm
                                          text-zinc-500
                                        "
                                      >
                                        {description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div
                                  className="
                                    rounded-lg

                                    border
                                    border-white/10

                                    bg-white/[0.03]

                                    px-2
                                    py-1

                                    text-xs
                                    text-zinc-500
                                  "
                                >
                                  {badge}
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      ) : search.localFilteredCommands.length > 0 ? (
                        // Local instant results — no server latency, no dead zone
                        <CommandGroup heading={groupHeading("commands")}>
                          {search.localFilteredCommands.map((command) =>
                            renderCommandItem(command)
                          )}
                        </CommandGroup>
                      ) : null
                    ) : (
                      /*
                       * BROWSE MODE — Recent → Suggested → grouped commands.
                       * Each command appears in exactly one group.
                       */
                      orderedGroups.map(([group, commands]) => (
                        <CommandGroup key={group} heading={groupHeading(group)}>
                          {commands.map((command) => renderCommandItem(command))}
                        </CommandGroup>
                      ))
                    )}
                  </>
                )}
              </CommandList>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
