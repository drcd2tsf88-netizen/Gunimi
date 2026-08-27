"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { refreshTagAiSummary } from "@/server/actions/tags/refreshTagAiSummary";

type Props = { tagId: string };

export default function RefreshTagInsightButton({ tagId }: Props) {
  const t = useTranslations("tags");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(async () => {
      await refreshTagAiSummary(tagId);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      title={t("aiInsightRefresh")}
      className="rounded-lg p-1.5 text-violet-400/40 transition-colors hover:bg-violet-500/10 hover:text-violet-400 disabled:opacity-40"
    >
      <RefreshCw size={12} className={isPending ? "animate-spin" : ""} />
    </button>
  );
}
