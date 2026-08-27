"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AiCore } from "./AiCore";

const LOCALES = ["en", "sk", "cs"] as const;

function switchLocaleCookie(locale: string) {
  document.cookie = `GUNIMI_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax`;
  window.location.reload();
}

function PublicLocaleSwitcher() {
  const current = useLocale();

  return (
    <div className="flex items-center gap-0.5">
      {LOCALES.map((locale, i) => (
        <span key={locale} className="flex items-center">
          <button
            onClick={() => switchLocaleCookie(locale)}
            className={cn(
              "rounded px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-150",
              current === locale
                ? "text-[#F7F8FC]"
                : "text-[#9AA3B2]/40 hover:text-[#9AA3B2]",
            )}
          >
            {locale}
          </button>
          {i < LOCALES.length - 1 && (
            <span className="text-[10px] text-white/[0.10]">/</span>
          )}
        </span>
      ))}
    </div>
  );
}

type DropdownId = "product" | "company" | null;

function NavDropdown({
  label,
  open,
  onToggle,
  links,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-[13px] font-medium outline-none",
          "transition-colors duration-150",
          "focus-visible:ring-2 focus-visible:ring-[var(--g-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)]",
          open
            ? "text-[#F7F8FC]"
            : "text-[#9AA3B2]/70 hover:text-[#C8CDD8]",
        )}
      >
        {label}
        <ChevronDown
          size={13}
          strokeWidth={2}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-0 top-[calc(100%+8px)] z-[50]",
            "min-w-[180px] rounded-[14px] border border-white/[0.07]",
            "bg-[#080B13]/95 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl",
            "py-2",
          )}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
          {links.map(({ label: linkLabel, href }) => (
            <Link
              key={href}
              href={href}
              className="block px-4 py-2.5 text-[13px] text-[#9AA3B2]/70 transition-colors duration-150 hover:bg-white/[0.04] hover:text-[#C8CDD8]"
            >
              {linkLabel}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function GenesisNavbar() {
  const t = useTranslations("landing.nav");
  const tf = useTranslations("landing.footer");

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<DropdownId>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("mousedown", onOutsideClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const toggle = (id: DropdownId) =>
    setOpenMenu((prev) => (prev === id ? null : id));

  const PRODUCT_LINKS = [
    { label: tf("links.features"), href: "/features" },
    { label: tf("links.ai"), href: "/ai-transparency" },
    { label: tf("links.pricing"), href: "/pricing" },
    { label: tf("links.changelog"), href: "/changelog" },
    { label: tf("links.roadmap"), href: "/roadmap" },
  ];

  const COMPANY_LINKS = [
    { label: tf("links.about"), href: "/about" },
    { label: tf("links.press"), href: "/press" },
    { label: tf("links.contact"), href: "/contact" },
    { label: tf("links.brand"), href: "/brand" },
  ];

  return (
    <header
      role="banner"
      className={cn(
        "fixed left-0 right-0 top-0 z-[20]",
        "border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-[rgba(255,255,255,0.06)] backdrop-blur-md"
          : "border-transparent",
      )}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        ...(scrolled ? { backgroundColor: "rgba(5,6,10,0.82)" } : {}),
      }}
    >
      <nav
        ref={navRef}
        aria-label={t("mainNav")}
        className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-20"
      >
        {/* ── Brand ── */}
        <Link
          href="/"
          aria-label="Gunimi"
          className="group flex items-center gap-2.5 rounded-[8px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)]"
        >
          <AiCore
            size={28}
            showRings={false}
            showParticles={false}
            intensity="strong"
          />
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--g-text)] transition-opacity duration-150 group-hover:opacity-80">
            Gunimi
          </span>
        </Link>

        {/* ── Center: Dropdowns + Locale switcher ── */}
        <div className="hidden items-center gap-1 md:flex">
          <NavDropdown
            label={t("product")}
            open={openMenu === "product"}
            onToggle={() => toggle("product")}
            links={PRODUCT_LINKS}
          />
          <NavDropdown
            label={t("company")}
            open={openMenu === "company"}
            onToggle={() => toggle("company")}
            links={COMPANY_LINKS}
          />
          <div className="mx-2 h-4 w-px bg-white/[0.08]" />
          <PublicLocaleSwitcher />
        </div>

        {/* ── Primary action ── */}
        <Link
          href="/register"
          className={cn(
            "inline-flex min-h-[44px] items-center rounded-[10px] px-4 py-2",
            "bg-[var(--g-primary)] text-[13px] font-medium text-white",
            "transition-colors duration-150 hover:bg-[var(--g-primary-2)]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)]",
          )}
        >
          {t("joinAlpha")}
        </Link>
      </nav>
    </header>
  );
}
