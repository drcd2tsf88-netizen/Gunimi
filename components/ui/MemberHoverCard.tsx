"use client";

import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useIsHydrated } from "@/lib/hooks/useIsHydrated";

type Props = {
  userId: string;
  name: string;
  email?: string | null;
  children: React.ReactNode;
};

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : name.slice(0, 2);
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-200">
      {initials.toUpperCase()}
    </div>
  );
}

export default function MemberHoverCard({ name, email, children }: Props) {
  const mounted = useIsHydrated();
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const handleEnter = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
      setVisible(true);
    }, 300);
  }, []);

  const handleLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  const popup = visible ? (
    <div
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        transform: "translate(-50%, -100%)",
        zIndex: 300,
        marginBottom: 8,
      }}
      className="w-52 rounded-2xl border border-white/[0.08] bg-[#0A0F1F]/95 p-4 shadow-2xl backdrop-blur-2xl"
    >
      <div className="flex items-center gap-3">
        <Initials name={name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          {email && (
            <p className="mt-0.5 truncate text-[11px] text-white/35">{email}</p>
          )}
        </div>
      </div>

      {/* Arrow caret */}
      <span
        style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)" }}
        className="block h-2.5 w-2.5 border-b border-r border-white/[0.08] bg-[#0A0F1F]"
      />
    </div>
  ) : null;

  return (
    <span
      ref={wrapRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="inline-flex"
    >
      {children}
      {mounted && createPortal(popup, document.body)}
    </span>
  );
}
