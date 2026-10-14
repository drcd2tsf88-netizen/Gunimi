"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

function AiCoreDot({ size = "md" }: { size?: "sm" | "md" }) {
  const d = size === "sm" ? "w-[10px] h-[10px]" : "w-[12px] h-[12px]";
  const ring = size === "sm" ? "inset-0" : "inset-0";
  return (
    <div
      className={cn(
        "relative flex items-center justify-center flex-shrink-0",
        size === "sm" ? "w-[26px] h-[26px]" : "w-[32px] h-[32px]",
      )}
    >
      <div
        className={cn(
          "rounded-full",
          d,
          "bg-[radial-gradient(circle_at_35%_35%,#A998FF,#6D5BFF)] shadow-[0_0_8px_rgba(109,91,255,0.55)]",
        )}
        style={{ animation: "v13-pulse 2.5s ease-in-out infinite" }}
      />
      <div
        className={cn(
          "absolute rounded-full border border-[rgba(109,91,255,0.3)]",
          ring,
        )}
        style={{ animation: "v13-ring 2.5s ease-out infinite" }}
      />
    </div>
  );
}

const NAV_ICONS = {
  overview: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(138,148,168,.5)" strokeWidth="1.75" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  contacts: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8B7DFF" strokeWidth="1.75" strokeLinecap="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  companies: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(138,148,168,.5)" strokeWidth="1.75" strokeLinecap="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  deals: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(138,148,168,.5)" strokeWidth="1.75" strokeLinecap="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  tasks: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(138,148,168,.5)" strokeWidth="1.75" strokeLinecap="round">
      <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  signals: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(239,68,68,.65)" strokeWidth="1.75" strokeLinecap="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  memory: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(138,148,168,.5)" strokeWidth="1.75" strokeLinecap="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04z" />
    </svg>
  ),
  email: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(138,148,168,.5)" strokeWidth="1.75" strokeLinecap="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
};

export function V13Hero() {
  const t = useTranslations("landing.v13.hero");

  return (
    <section
      className="relative min-h-[100dvh] flex flex-col items-center overflow-hidden"
      style={{ paddingTop: "56px" }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-[-60px]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(109,91,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(109,91,255,.035) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
            animation: "v13-grid-drift 24s linear infinite",
            maskImage:
              "radial-gradient(ellipse at 50% 40%,black 20%,transparent 75%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% -10%,rgba(109,91,255,.12) 0%,transparent 50%),radial-gradient(ellipse at 20% 80%,rgba(34,211,238,.05) 0%,transparent 35%),radial-gradient(ellipse at 85% 60%,rgba(109,91,255,.06) 0%,transparent 35%)",
          }}
        />
      </div>

      {/* Scan line */}
      <div
        className="absolute top-0 left-0 right-0 h-[180px] pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(to bottom,transparent,rgba(109,91,255,.025),transparent)",
          animation: "v13-scan 8s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Copy */}
      <div className="relative z-[2] flex flex-col items-center text-center px-6 md:px-10 pt-16 md:pt-20 max-w-[1280px] w-full">
        {/* Problem line */}
        <div className="inline-flex items-center gap-3 mb-8 opacity-35">
          <span className="text-[13px] font-medium text-[#F0F2FA] tracking-[-0.01em]">
            {t("problem1")}
          </span>
          <span className="text-[10px] text-[rgba(109,91,255,.6)]">—</span>
          <span className="text-[13px] font-medium text-[#F0F2FA] tracking-[-0.01em]">
            {t("problem2")}
          </span>
          <span className="text-[10px] text-[rgba(109,91,255,.6)]">—</span>
          <span className="text-[13px] font-medium text-[#F0F2FA] tracking-[-0.01em]">
            {t("problem3")}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-black tracking-[-0.06em] leading-[0.88] mb-7 max-w-[900px]"
          style={{
            fontSize: "clamp(52px,8.5vw,112px)",
            background:
              "linear-gradient(160deg,rgba(240,242,250,.95) 0%,rgba(200,190,255,.9) 40%,rgba(146,232,248,.8) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t("headline")}
        </h1>

        {/* Subtitle */}
        <p
          className="text-[17px] font-normal text-[rgba(138,148,168,.6)] leading-[1.7] max-w-[400px] mb-11 tracking-[-0.01em]"
        >
          {t("subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/register"
            className="px-9 py-[15px] rounded-[12px] bg-[#6D5BFF] text-white text-[15px] font-bold tracking-[-0.025em] transition-all duration-250 hover:bg-[#8B7DFF] hover:-translate-y-0.5"
            style={{
              boxShadow:
                "0 0 0 1px rgba(109,91,255,.4),0 8px 40px rgba(109,91,255,.28),inset 0 1px 0 rgba(255,255,255,.12)",
            }}
          >
            {t("ctaPrimary")}
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[rgba(138,148,168,.7)] tracking-[-0.01em] transition-colors duration-150 hover:text-[rgba(240,242,250,.9)]"
          >
            <span
              className="w-6 h-6 rounded-full border border-[rgba(255,255,255,.2)] flex items-center justify-center text-[8px] text-[rgba(255,255,255,.65)]"
            >
              ▶
            </span>
            {t("ctaGhost")}
          </Link>
        </div>

        <p className="text-[11px] tracking-[0.02em] text-[rgba(138,148,168,.3)] mb-10 md:mb-20">
          {t("finePrint")}
        </p>
      </div>

      {/* Mobile app preview card (sm only) */}
      <div className="block md:hidden relative z-[2] w-full max-w-[480px] px-6 pb-16">
        <div
          className="rounded-[16px] overflow-hidden border border-[rgba(109,91,255,.12)]"
          style={{ background: "#07090F", boxShadow: "0 24px 60px rgba(0,0,0,.6)" }}
        >
          <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-[rgba(255,255,255,.04)]">
            <div className="flex items-center gap-2">
              <AiCoreDot size="sm" />
              <span className="text-[12px] font-semibold text-[#F0F2FA]">Gunimi</span>
            </div>
            <span className="bg-[rgba(245,158,11,.07)] border border-[rgba(245,158,11,.22)] rounded-full px-2 py-px text-[8px] font-bold tracking-[0.1em] text-[#f59e0b]">Demo</span>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2">
            {[
              { initials: "TK", color: "linear-gradient(135deg,#6D5BFF,#A998FF)", name: "Tomáš Kováč", sub: "CEO · Acme", score: "87", scoreClass: "text-[#22c55e]" },
              { initials: "MN", color: "linear-gradient(135deg,#22D3EE,#6D5BFF)", name: "Marta Nováková", sub: "CFO · Beta", score: "54", scoreClass: "text-[#f59e0b]" },
              { initials: "PH", color: "linear-gradient(135deg,#f59e0b,#ef4444)", name: "Peter Horváth", sub: "VP Sales · Delta", score: "21", scoreClass: "text-[#ef4444]" },
            ].map((c) => (
              <div key={c.initials} className="flex items-center gap-3 bg-[#0A0D16] border border-[rgba(255,255,255,.03)] rounded-[10px] px-3 py-2.5">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-extrabold text-white" style={{ background: c.color }}>{c.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-[#F0F2FA] truncate">{c.name}</div>
                  <div className="text-[10px] text-[rgba(138,148,168,.45)]">{c.sub}</div>
                </div>
                <div className={`text-[12px] font-bold ${c.scoreClass}`}>{c.score}</div>
              </div>
            ))}
          </div>
          <div className="mx-4 mb-4 bg-[rgba(109,91,255,.04)] border border-[rgba(109,91,255,.14)] rounded-[12px] px-4 py-3">
            <div className="text-[9px] font-bold tracking-[0.13em] uppercase text-[#8B7DFF] mb-1.5">Gunimi AI</div>
            <div className="text-[12px] text-[rgba(240,242,250,.75)] leading-[1.6]">Peter Horváth — 42 dní bez kontaktu. Odporúčam krátku správu.</div>
          </div>
        </div>
      </div>

      {/* UI Portal (md+) */}
      <div className="hidden md:block relative z-[2] w-full max-w-[1280px] px-0">
        {/* Glow */}
        <div
          className="absolute inset-[-1px] rounded-[20px_20px_0_0] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg,rgba(109,91,255,.12) 0%,transparent 60%)",
            filter: "blur(40px)",
          }}
        />

        {/* Tilted wrap */}
        <div style={{ perspective: "1400px", transformStyle: "preserve-3d" }}>
          <div
            className="rounded-[18px_18px_0_0] overflow-hidden relative"
            style={{
              transform: "rotateX(9deg) scale(.97)",
              transformOrigin: "50% 0%",
              animation: "v13-float-up .9s cubic-bezier(.16,1,.3,1) both",
              animationDelay: ".1s",
              boxShadow:
                "0 0 0 1px rgba(109,91,255,.1),0 0 60px rgba(109,91,255,.08),0 40px 100px rgba(0,0,0,.8)",
            }}
          >
            {/* Overlay play button */}
            <Link
              href="/demo"
              className="absolute inset-0 z-[10] flex items-center justify-center cursor-pointer transition-[background] duration-200 hover:bg-[rgba(2,3,7,.38)]"
            >
              <div
                className="opacity-0 scale-90 transition-all duration-250 group-hover:opacity-100 group-hover:scale-100 flex items-center gap-2.5 bg-[rgba(109,91,255,.92)] border border-[rgba(139,125,255,.5)] rounded-[14px] px-7 py-3.5 text-[14px] font-bold text-white tracking-[-0.02em]"
                style={{
                  boxShadow:
                    "0 8px 36px rgba(109,91,255,.45),inset 0 1px 0 rgba(255,255,255,.12)",
                }}
              >
                <div className="w-0 h-0 border-[6px] border-transparent border-l-[10px] border-l-white border-r-0 ml-0.5" />
                {t("portalCta")}
              </div>
            </Link>

            {/* Bottom fade */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[160px] pointer-events-none z-[11]"
              style={{
                background: "linear-gradient(to top,#020307 0%,transparent 100%)",
              }}
            />

            {/* Demo UI */}
            <div
              className="bg-[#03040B] flex flex-col"
              style={{ height: "540px" }}
            >
              {/* Topbar */}
              <div
                className="h-[46px] flex-shrink-0 flex items-center justify-between px-6 border-b border-[rgba(255,255,255,.04)]"
                style={{
                  background: "rgba(3,4,11,.92)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center gap-[9px] h-8 w-[300px] border border-[rgba(255,255,255,.05)] rounded-[10px] bg-[rgba(255,255,255,.02)] px-3">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(138,148,168,.35)" strokeWidth="1.75" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <span className="text-[12px] text-[rgba(138,148,168,.3)] flex-1">{t("uiSearch")}</span>
                  <span className="border border-[rgba(255,255,255,.06)] bg-[rgba(255,255,255,.02)] rounded-[5px] px-[7px] py-[2px] text-[9px] text-[rgba(138,148,168,.35)] font-[Inter,sans-serif]">⌘K</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="relative w-8 h-8 rounded-[9px] border border-[rgba(255,255,255,.05)] bg-[rgba(255,255,255,.02)] flex items-center justify-center">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(138,148,168,.4)" strokeWidth="1.75" strokeLinecap="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <div className="absolute top-[5px] right-[5px] w-[5px] h-[5px] rounded-full bg-[#ef4444] shadow-[0_0_5px_rgba(239,68,68,.5)]" />
                  </div>
                  <div className="w-8 h-8 rounded-[9px] border border-[rgba(255,255,255,.05)] bg-[rgba(255,255,255,.02)] flex items-center justify-center">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(138,148,168,.4)" strokeWidth="1.75" strokeLinecap="round">
                      <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[linear-gradient(135deg,#6D5BFF,#22D3EE)] flex items-center justify-center text-[10px] font-extrabold text-white">MK</div>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-[228px] flex-shrink-0 border-r border-[rgba(255,255,255,.04)] bg-[#03040B] flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(255,255,255,.04)]">
                    <div className="flex items-center gap-2.5">
                      <AiCoreDot size="md" />
                      <div>
                        <div className="text-[13px] font-semibold tracking-[-0.02em] text-[#F0F2FA]">Gunimi</div>
                        <div className="text-[10px] text-[rgba(138,148,168,.55)] mt-px">Acme s.r.o.</div>
                      </div>
                    </div>
                    <div className="border border-[rgba(245,158,11,.22)] bg-[rgba(245,158,11,.07)] rounded-full px-2 py-px text-[8px] font-bold tracking-[0.1em] text-[#f59e0b]">
                      Demo
                    </div>
                  </div>

                  <div className="flex-1 p-2.5 overflow-hidden">
                    {[
                      { key: "uiNavOverview", icon: NAV_ICONS.overview, active: false },
                      { key: "uiNavContacts", icon: NAV_ICONS.contacts, active: true },
                      { key: "uiNavCompanies", icon: NAV_ICONS.companies, active: false },
                      { key: "uiNavDeals", icon: NAV_ICONS.deals, active: false },
                      { key: "uiNavTasks", icon: NAV_ICONS.tasks, active: false },
                      { key: "uiNavSignals", icon: NAV_ICONS.signals, active: false, badge: "3" },
                      { key: "uiNavMemory", icon: NAV_ICONS.memory, active: false },
                      { key: "uiNavEmail", icon: NAV_ICONS.email, active: false },
                    ].map(({ key, icon, active, badge }) => (
                      <div
                        key={key}
                        className={cn(
                          "flex items-center gap-2.5 px-[11px] py-[8.5px] rounded-[12px] mb-px",
                          active && "bg-[#0C1119] shadow-[inset_2px_0_0_#6D5BFF]",
                        )}
                      >
                        <div className={cn("w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0", active && "bg-[rgba(109,91,255,.1)]")}>
                          {icon}
                        </div>
                        <span className={cn("text-[12.5px] font-medium tracking-[-0.01em]", active ? "text-[#F0F2FA]" : "text-[rgba(138,148,168,.55)]")}>
                          {t(key as "uiNavOverview")}
                        </span>
                        {badge && (
                          <span className="ml-auto bg-[#ef4444] text-white rounded-full text-[9px] font-bold px-1.5 py-px min-w-[18px] text-center">
                            {badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-[10px_12px] border-t border-[rgba(255,255,255,.04)]">
                    <div
                      className="flex items-center justify-center gap-1.5 bg-[#6D5BFF] text-white w-full py-[9px] rounded-[12px] text-[12px] font-semibold"
                      style={{ boxShadow: "0 0 20px rgba(109,91,255,.18)" }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      {t("uiEnterBtn")}
                    </div>
                  </div>
                </div>

                {/* Main */}
                <div className="flex-1 overflow-hidden flex flex-col bg-[#03040B]">
                  <div className="flex-1 p-5 flex flex-col gap-3 overflow-hidden">
                    <div className="flex items-start justify-between flex-shrink-0">
                      <div>
                        <div className="text-[20px] font-semibold tracking-[-0.025em] text-[#F0F2FA]">{t("uiContactsTitle")}</div>
                        <div className="text-[11px] text-[rgba(138,148,168,.5)] mt-[3px]">{t("uiContactsSubtitle")}</div>
                      </div>
                      <div className="bg-[#6D5BFF] text-white px-4 py-[7px] rounded-[9px] text-[12px] font-semibold">{t("uiAdd")}</div>
                    </div>

                    {/* Contact table */}
                    <div className="border border-[rgba(255,255,255,.05)] rounded-[16px] overflow-hidden bg-[#07090F] flex-shrink-0">
                      {[
                        { initials: "TK", color: "linear-gradient(135deg,#6D5BFF,#A998FF)", name: "Tomáš Kováč", role: "CEO · Acme s.r.o.", statusKey: "uiStatusActive", statusClass: "bg-[rgba(34,197,94,.09)] text-[#22c55e]", score: "87", scoreClass: "text-[#22c55e]" },
                        { initials: "MN", color: "linear-gradient(135deg,#22D3EE,#6D5BFF)", name: "Marta Nováková", role: "CFO · Beta Tech", statusKey: "uiStatusStagnating", statusClass: "bg-[rgba(245,158,11,.09)] text-[#f59e0b]", score: "54", scoreClass: "text-[#f59e0b]" },
                        { initials: "PH", color: "linear-gradient(135deg,#f59e0b,#ef4444)", name: "Peter Horváth", role: "VP Sales · Delta Corp", statusKey: "uiStatusCooling", statusClass: "bg-[rgba(239,68,68,.09)] text-[#ef4444]", score: "21", scoreClass: "text-[#ef4444]" },
                      ].map((c, i) => (
                        <div
                          key={i}
                          className="grid items-center gap-4 px-4 py-3 border-b border-[rgba(255,255,255,.03)] last:border-0"
                          style={{ gridTemplateColumns: "1fr 110px 60px" }}
                        >
                          <div className="flex items-center gap-[11px]">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0" style={{ background: c.color }}>
                              {c.initials}
                            </div>
                            <div>
                              <div className="text-[13px] font-medium text-[#F0F2FA] tracking-[-0.01em]">{c.name}</div>
                              <div className="text-[10px] text-[rgba(138,148,168,.45)] mt-[2px]">{c.role}</div>
                            </div>
                          </div>
                          <span className={cn("rounded-full px-2.5 py-[3px] text-[10.5px] font-medium text-center tracking-[-0.01em]", c.statusClass)}>
                            {t(c.statusKey as "uiStatusActive")}
                          </span>
                          <div className={cn("text-[13px] font-bold text-right", c.scoreClass)}>{c.score}</div>
                        </div>
                      ))}
                    </div>

                    {/* AI insight card */}
                    <div
                      className="bg-[rgba(109,91,255,.04)] border border-[rgba(109,91,255,.14)] rounded-[16px] px-[18px] py-4 relative overflow-hidden flex-shrink-0"
                      style={{ animation: "v13-fadein .7s .5s ease both" }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(109,91,255,.2),transparent)]" />
                      <div className="flex items-start gap-3">
                        <AiCoreDot size="sm" />
                        <div>
                          <div className="text-[9.5px] font-bold tracking-[0.13em] uppercase text-[#8B7DFF] mb-1.5">{t("uiAiLabel")}</div>
                          <div className="text-[13px] text-[rgba(240,242,250,.78)] leading-[1.6] tracking-[-0.01em]">{t("uiAiInsight")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right panel — Signals */}
                <div className="w-[216px] flex-shrink-0 border-l border-[rgba(255,255,255,.04)] px-3.5 py-[18px] bg-[rgba(0,0,0,.15)] overflow-hidden">
                  <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[rgba(61,69,88,.9)] mb-3">{t("uiSignalsLabel")}</div>
                  {[
                    { key: "uiSignal1", subKey: "uiSignal1Sub", dot: "bg-[#ef4444] shadow-[0_0_5px_rgba(239,68,68,.5)]", delay: "0s" },
                    { key: "uiSignal2", subKey: "uiSignal2Sub", dot: "bg-[#f59e0b] shadow-[0_0_5px_rgba(245,158,11,.4)]", delay: ".2s" },
                    { key: "uiSignal3", subKey: "uiSignal3Sub", dot: "bg-[#f59e0b] shadow-[0_0_5px_rgba(245,158,11,.4)]", delay: ".4s" },
                    { key: "uiSignal4", subKey: "uiSignal4Sub", dot: "bg-[#22D3EE] shadow-[0_0_5px_rgba(34,211,238,.4)]", delay: ".6s" },
                  ].map(({ key, subKey, dot, delay }) => (
                    <div
                      key={key}
                      className="flex gap-[9px] items-start bg-[#07090F] border border-[rgba(255,255,255,.04)] rounded-[10px] px-3 py-2.5 mb-1.5 opacity-0"
                      style={{ animation: `v13-slin .4s ease forwards`, animationDelay: delay }}
                    >
                      <div className={cn("w-[7px] h-[7px] rounded-full flex-shrink-0 mt-[3px]", dot)} />
                      <div>
                        <div className="text-[11px] font-semibold text-[#F0F2FA] leading-[1.35] tracking-[-0.01em]">{t(key as "uiSignal1")}</div>
                        <div className="text-[9px] text-[rgba(61,69,88,.9)] mt-[2px]">{t(subKey as "uiSignal1Sub")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
