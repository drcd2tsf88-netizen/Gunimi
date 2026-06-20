"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

type OrbitInputProps = {
  loading: boolean;
  onSend: (message: string) => Promise<void>;
};

export default function OrbitInput({ loading, onSend }: OrbitInputProps) {
  const t = useTranslations("aiPanel");
  const [message, setMessage] = useState("");

  async function handleSend() {
    if (!message.trim() || loading) return;
    const value = message;
    setMessage("");
    await onSend(value);
  }

  return (
    <div
      className="
        relative z-10
        border-t border-white/10
        bg-black/20
        p-4
      "
    >
      <div
        className="
          flex items-center gap-2
          rounded-2xl
          border border-white/10
          bg-white/[0.03]
          px-3 py-2
        "
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder={t("inputPlaceholder")}
          className="
            flex-1
            bg-transparent
            px-2 py-2
            text-sm text-white
            outline-none
            placeholder:text-zinc-500
          "
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl
            bg-white
            text-xs font-medium text-black
            transition-all
            hover:scale-[1.02]
            disabled:opacity-50
          "
        >
          {loading ? "..." : t("sendButton")}
        </button>
      </div>
    </div>
  );
}
