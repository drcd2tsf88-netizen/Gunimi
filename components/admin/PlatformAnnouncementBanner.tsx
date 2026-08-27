"use client";

import { useEffect, useState } from "react";
import { Info, AlertTriangle, AlertOctagon, X } from "lucide-react";
import { getActiveAnnouncements, type PlatformAnnouncement } from "@/server/actions/admin/platformAnnouncements";

type AnnouncementType = "info" | "warning" | "critical";

const TYPE_CONFIG: Record<AnnouncementType, { icon: React.ElementType; border: string; bg: string; text: string; close: string }> = {
  info:     { icon: Info,          border: "border-sky-500/20",    bg: "bg-sky-500/[0.06]",    text: "text-sky-200",    close: "hover:bg-sky-500/20" },
  warning:  { icon: AlertTriangle, border: "border-amber-500/20",  bg: "bg-amber-500/[0.06]",  text: "text-amber-200",  close: "hover:bg-amber-500/20" },
  critical: { icon: AlertOctagon,  border: "border-red-500/20",    bg: "bg-red-500/[0.06]",    text: "text-red-200",    close: "hover:bg-red-500/20" },
};

const STORAGE_KEY = "gunimi_dismissed_announcements";

function getDismissed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function addDismissed(id: string): void {
  try {
    const current = getDismissed();
    if (!current.includes(id)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, id]));
    }
  } catch { }
}

export default function PlatformAnnouncementBanner() {
  const [visible, setVisible] = useState<PlatformAnnouncement[]>([]);

  useEffect(() => {
    getActiveAnnouncements().then((all) => {
      const dismissed = getDismissed();
      setVisible(all.filter((a) => !dismissed.includes(a.id)));
    }).catch(() => { });
  }, []);

  function dismiss(id: string) {
    addDismissed(id);
    setVisible((prev) => prev.filter((a) => a.id !== id));
  }

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 px-5 pt-2 sm:px-6 lg:px-8">
      {visible.map((ann) => {
        const cfg = TYPE_CONFIG[ann.type] ?? TYPE_CONFIG.info;
        const Icon = cfg.icon;
        return (
          <div
            key={ann.id}
            className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 ${cfg.border} ${cfg.bg}`}
          >
            <Icon size={13} className={`mt-0.5 shrink-0 ${cfg.text}`} />
            <div className="min-w-0 flex-1">
              <span className={`text-sm font-medium ${cfg.text}`}>{ann.title}</span>
              {ann.body && (
                <span className="ml-2 text-xs text-white/40">{ann.body}</span>
              )}
            </div>
            <button
              onClick={() => dismiss(ann.id)}
              className={`ml-2 rounded-lg p-1 text-white/30 transition-colors ${cfg.close}`}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
