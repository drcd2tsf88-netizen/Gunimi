"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const FLAG_KEY = "gunimi_first_signal_pending";

// Shown once, after the workspace transitions from awakening to active,
// the first time Today renders with real signals (or without them).
// If signals exist → "Your workspace has found its first opportunity to help."
// If no signals yet → gentle explanation of what will trigger the first insight.
// Fades away on its own. Requires no user action.
export default function FirstSignalMoment({ hasSignals }: { hasSignals: boolean }) {
  const t = useTranslations("today");
  const checked = useRef(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    if (!sessionStorage.getItem(FLAG_KEY)) return;
    sessionStorage.removeItem(FLAG_KEY);

    const t1 = setTimeout(() => {
      setActive(true);
      setVisible(true);
    }, 0);
    const t2 = setTimeout(() => setVisible(false), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!active) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.p
          key="first-signal-moment"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-[12px] leading-relaxed text-white/30"
        >
          {hasSignals ? t("firstSignalMoment") : t("firstSignalEvaluating")}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
