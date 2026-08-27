"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Building2,
  Users,
  Bot,
  Activity,
  Mail,
  MessageSquareText,
  Megaphone,
  ScrollText,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview",   href: "/dashboard/admin",             icon: LayoutDashboard },
  { id: "workspaces", href: "/dashboard/admin/workspaces",  icon: Building2 },
  { id: "users",      href: "/dashboard/admin/users",       icon: Users },
  { id: "ai",         href: "/dashboard/admin/ai",          icon: Bot },
  { id: "health",     href: "/dashboard/admin/health",      icon: Activity },
  { id: "invites",    href: "/dashboard/admin/invites",     icon: Mail },
  { id: "broadcast",  href: "/dashboard/admin/broadcast",   icon: Megaphone },
  { id: "audit",      href: "/dashboard/admin/audit",       icon: ScrollText },
  { id: "dogfood",    href: "/dashboard/admin/dogfood",     icon: MessageSquareText },
] as const;

export default function AdminNav() {
  const pathname = usePathname();
  const t = useTranslations("admin");

  function isActive(href: string) {
    if (href === "/dashboard/admin") return pathname === "/dashboard/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="mb-4 flex items-center gap-2 px-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
          <Shield size={11} className="text-red-300/70" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-red-300/60">
          {t("badge")}
        </span>
      </div>

      {NAV_ITEMS.map(({ id, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={id}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
              active
                ? "bg-white/[0.07] font-medium text-white/90"
                : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
            }`}
          >
            <Icon size={14} className={active ? "text-white/80" : "text-white/30"} />
            {t(`nav${id.charAt(0).toUpperCase() + id.slice(1)}` as Parameters<typeof t>[0])}
          </Link>
        );
      })}
    </div>
  );
}
