"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useIsHydrated } from "@/lib/hooks/useIsHydrated";

function formatTime(iso: string, justNowLabel: string): string {
  const created = new Date(iso).getTime();
  const now = new Date().getTime();
  const minutes = Math.floor((now - created) / 60000);
  if (minutes < 1) return justNowLabel;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

type Notification = {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  href?: string | null;
  read_at?: string | null;
  created_at: string;
};

export default function OrbitNotifications() {
  const t = useTranslations("notifications");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const mounted = useIsHydrated();
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.length;

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("workspace_notifications")
        .select("id, type, title, body, href, read_at, created_at")
        .is("read_at", null)
        .order("created_at", { ascending: false })
        .limit(20);
      setNotifications(data ?? []);
    }

    load();

    const channel = supabase
      .channel("orbit-notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workspace_notifications" },
        () => { load(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      const portal = document.getElementById("orbit-notifications-portal");
      if (portal?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  function handleToggle() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const dropdownWidth = Math.min(vw - 32, 420);
      const rawRight = vw - rect.right;
      const maxRight = vw - dropdownWidth - 16;
      const safeRight = Math.max(0, Math.min(rawRight, maxRight));
      setDropdownPos({ top: rect.bottom + 8, right: safeRight });
    }
    setOpen((prev) => !prev);
  }

  async function markRead(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase
      .from("workspace_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);
  }

  async function markAllRead() {
    setNotifications([]);
    await supabase
      .from("workspace_notifications")
      .update({ read_at: new Date().toISOString() })
      .is("read_at", null);
  }

  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          id="orbit-notifications-portal"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "fixed", top: dropdownPos.top, right: dropdownPos.right }}
          className="z-[50] w-[calc(100vw-32px)] max-w-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0A0F1F]/95 backdrop-blur-2xl"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-white/5 p-5">
            <div>
              <h3 className="text-lg font-semibold">{t("title")}</h3>
              {unreadCount > 0 && (
                <p className="mt-1 text-sm text-white/40">
                  {unreadCount} {t("unread")}
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
              >
                <Check size={11} />
                {t("markAllRead")}
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="max-h-[420px] overflow-y-auto space-y-2 p-3">
            {notifications.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                <p className="text-sm text-white/50">{t("emptyDescription")}</p>
              </div>
            ) : (
              notifications.map((item) => {
                const bodyKey = `body_${item.type}`;
                const localizedBody = t.has(bodyKey as Parameters<typeof t>[0])
                  ? t(bodyKey as Parameters<typeof t>[0])
                  : null;
                return (
                  <button
                    key={item.id}
                    onClick={async () => {
                      await markRead(item.id);
                      if (item.href) {
                        setOpen(false);
                        router.push(item.href);
                      }
                    }}
                    className="w-full rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-4 text-left transition-all hover:bg-violet-500/[0.1]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {item.title}
                        </p>
                        {localizedBody && (
                          <p className="mt-1 text-xs leading-relaxed text-white/40">
                            {localizedBody}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[10px] text-white/30">
                          {formatTime(item.created_at, t("justNow"))}
                        </span>
                        <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      <motion.button
        ref={triggerRef}
        whileHover={{ y: -2 }}
        onClick={handleToggle}
        aria-label={t("ariaLabel")}
        aria-haspopup="true"
        aria-expanded={open}
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/70 transition-all hover:border-white/20"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-violet-400" />
        )}
      </motion.button>

      {mounted && createPortal(dropdown, document.body)}
    </div>
  );
}
