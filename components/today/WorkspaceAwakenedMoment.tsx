"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const FLAG_KEY = "gunimi_awakening_pending";

// Shown once, for ~800ms, when the workspace first transitions
// from "awakening" to "active". Requires no user action.
// If the flag is not present, renders children immediately.
export default function WorkspaceAwakenedMoment({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("awakening");
  const checked = useRef(false);
  const [phase, setPhase] = useState<"moment" | "content">("content");

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    if (!sessionStorage.getItem(FLAG_KEY)) return;
    sessionStorage.removeItem(FLAG_KEY);

    const t1 = setTimeout(() => setPhase("moment"), 0);
    const t2 = setTimeout(() => setPhase("content"), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {phase === "moment" ? (
        <motion.div
          key="awakened-moment"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          className="flex h-[55vh] items-center justify-center"
        >
          <p className="text-[15px] font-medium tracking-[-0.01em] text-[#F7F8FC]/50">
            {t("awakenedMoment")}
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
