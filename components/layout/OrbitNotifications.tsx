"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { useIsHydrated } from "@/lib/hooks/useIsHydrated";

type Activity = {
  id: string;
  title: string;
  description?: string;
  type?: string;
};

export default function OrbitNotifications() {
  const t = useTranslations("notifications");
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState<Activity[]>([]);
  const mounted = useIsHydrated();
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function loadActivity() {
      const { data, error } = await supabase
        .from("workspace_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) return;
      setActivity(data || []);
    }

    loadActivity();

    const channel = supabase
      .channel("workspace-activity")
      .on("postgres_changes", { event: "*", schema: "public", table: "workspace_activity" }, () => {
        loadActivity();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Click-outside via document listener
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
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((prev) => !prev);
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
          <div className="border-b border-white/5 p-5">
            <h3 className="text-lg font-semibold">{t("title")}</h3>
            <p className="mt-2 text-sm text-white/40">{t("subtitle")}</p>
          </div>

          {/* CONTENT */}
          <div className="max-h-[420px] overflow-y-auto space-y-3 p-4">
            {activity.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                <p className="text-sm text-white/50">{t("emptyDescription")}</p>
              </div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-white/50">{item.description}</p>
                  )}
                </div>
              ))
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
        {activity.length > 0 && (
          <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-violet-400" />
        )}
      </motion.button>

      {mounted && createPortal(dropdown, document.body)}
    </div>
  );
}
