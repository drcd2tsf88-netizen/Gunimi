"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
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

import { commandRegistry } from "@/lib/commands/registry";
import type { OrbitCommand } from "@/lib/commands/types";

import { searchEngine } from "@/lib/search";
import type { SearchResult } from "@/lib/search";

import { executeOrbitCommand }
from "@/server/actions/ai/executeOrbitCommand";

import { useOrbitCommandStore }
from "@/lib/store/orbit-command-store";

import { useAIStateStore }
from "@/lib/store/ai-state-store";

export default function OrbitCommandPalette() {
  const router = useRouter();
  const t = useTranslations("command");

  const { open, setOpen, toggle } = useOrbitCommandStore();

  // Single source of truth for AI thinking state
  const { thinking, setThinking, setCurrentThought } = useAIStateStore();

  // Captures the element that had focus before the palette opened
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Generation counter — prevents stale async results from overwriting newer ones
  const searchGenRef = useRef(0);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Tracks the query for which searchResults was last populated.
  // Prevents the empty state from flashing during the debounce window or
  // while a search is in-flight — empty state only shows after a search
  // for the current query completes with zero results.
  const lastCompletedQueryRef = useRef<string>("");

  // Store focused element on open
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  // Keyboard shortcut — stable deps only (toggle/setOpen never change reference)
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        toggle();
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen, toggle]);

  // Universal Search — 250 ms debounce reduces Server Action calls during rapid typing.
  // Generation counter ensures only the latest search result is applied.
  // setState is never called synchronously in this effect body — only inside
  // setTimeout and Promise callbacks — preserving react-compiler compatibility.
  useEffect(() => {
    const gen = ++searchGenRef.current;

    if (!query.trim()) {
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
  }, [query]);

  // Group commands for the browse (empty query) state — unchanged from Sprint 2
  const groupedCommands = useMemo(() => commandRegistry.getByGroup(), []);

  // Executes a typed OrbitCommand from the command registry
  async function handleCommand(command: OrbitCommand) {
    if (command.type === "action") {
      setThinking(true);
      setCurrentThought(t("thinkingCurrentThought"));

      try {
        await executeOrbitCommand({ action: command.action });
      } catch (err) {
        console.error("[OrbitCommand] execution failed:", err);
      } finally {
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

    // command.type === "ai" — Sprint 5 streaming extension point
    console.warn("[OrbitCommand] AICommand not yet implemented:", command.id);
    setOpen(false);
  }

  // Dispatches a SearchResult — resolves to the appropriate action by kind
  async function handleSearchResult(result: SearchResult) {
    if (result.kind === "command") {
      const command = commandRegistry.getAll().find((c) => c.id === result.commandId);
      if (command) {
        await handleCommand(command);
      }
      return;
    }

    if (result.kind === "page" || result.kind === "entity") {
      router.push(result.href);
      setOpen(false);
      return;
    }

    // result.kind === "ai" — Sprint 5 streaming extension point
    console.warn("[OrbitCommand] AIResult not yet implemented:", result.id);
    setOpen(false);
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        // Restore focus after exit animation so the focus ring appears on the
        // underlying element only once the palette is fully gone.
        previousFocusRef.current?.focus();
        previousFocusRef.current = null;

        // Reset all search state after close animation so the next open
        // starts with a clean browse view and no stale loading state.
        setQuery("");
        setSearchResults([]);
        setIsSearching(false);
        lastCompletedQueryRef.current = "";
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
            z-[999]

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
          {/* DIALOG — role and aria attributes live on the focusable content shell */}
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

            {/* COMMAND — shouldFilter=false: we own filtering via the search engine */}
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
                  {/* ICON */}
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

                  {/* INFO */}
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

                {/* ESC HINT */}
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

              {/* SEARCH — controlled input: query state drives the search engine */}
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
                  value={query}
                  onValueChange={setQuery}
                  placeholder={t("placeholder")}
                  aria-label={t("placeholder")}
                  className="
                    w-full

                    bg-transparent

                    text-lg
                    text-white

                    outline-none

                    placeholder:text-zinc-500
                  "
                />

                {/* LOADING INDICATOR — thin animated bar overlaying the bottom border.
                    Appears 250 ms after the user stops typing (timer fired).
                    Stays visible until the search engine resolves all providers. */}
                {isSearching && query.trim() && (
                  <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-violet-500/60"
                      initial={{ x: "-100%" }}
                      animate={{ x: "400%" }}
                      transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
                    />
                  </div>
                )}
              </div>

              {/* THINKING — single source of truth: useAIStateStore.thinking */}
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

              {/* COMMANDS */}
              <CommandList
                className="
                  max-h-[520px]

                  overflow-y-auto

                  p-4
                "
              >
                {/* EMPTY STATE — rendered only after a search for the current query
                    completes and returns zero results. Never shown during the debounce
                    window (lastCompletedQueryRef lags behind query) or while a search
                    is still in-flight (isSearching is true). */}
                {query.trim() &&
                  !isSearching &&
                  query === lastCompletedQueryRef.current &&
                  searchResults.length === 0 && (
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
                      <SearchX
                        size={20}
                        className="text-white/25"
                      />
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

                {query.trim() ? (
                  /*
                   * SEARCH MODE — Universal Search Engine drives results.
                   * Stale results remain visible while a new search is in-flight,
                   * preventing empty-list flicker between successive queries.
                   * Future providers plug in via lib/search/providers/index.ts —
                   * zero palette changes required.
                   */
                  searchResults.length > 0 && (
                    <CommandGroup heading={t("searchResultsGroup")}>
                      {searchResults.map((result) => {
                        const entityIcons: Record<EntityResult["entityType"], LucideIcon> = {
                          contact: Users,
                          company: Building2,
                          deal: TrendingUp,
                          task: ClipboardCheck,
                        };

                        const entityBadgeKeys: Record<EntityResult["entityType"], string> = {
                          contact: t("badgeContact"),
                          company: t("badgeCompany"),
                          deal: t("badgeDeal"),
                          task: t("badgeTask"),
                        };

                        const Icon: LucideIcon =
                          result.kind === "command" || result.kind === "page"
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
                            {/* LEFT */}
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

                            {/* RIGHT — badge reflects result kind */}
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
                  )
                ) : (
                  /*
                   * BROWSE MODE — grouped command registry.
                   * Identical to pre-Sprint-4 behavior.
                   */
                  Object.entries(groupedCommands).map(
                    ([group, commands]) => (
                      <CommandGroup
                        key={group}
                        heading={t(`groups.${group}`)}
                      >
                        {commands.map((command) => {
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
                              {/* LEFT */}
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

                              {/* RIGHT — badge reflects command type */}
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
                                  : t("badgeAI")}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )
                  )
                )}
              </CommandList>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
