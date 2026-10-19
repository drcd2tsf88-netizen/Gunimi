import { getEntityBusinessMemories } from "@/server/actions/memory/getEntityBusinessMemories";
import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";

type Props = {
  dealId: string;
};

export default async function DealFirstLookCard({ dealId }: Props) {
  const t = await getTranslations("deals");
  const memories = await getEntityBusinessMemories("deal", dealId, 4);

  const firstLook = memories.find(
    (m) => m.created_by === "ai_core" && m.memory_type === "context",
  );

  if (!firstLook) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/[0.18] bg-violet-500/[0.05] p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at top left, rgba(109,91,255,0.10), transparent 60%)" }}
      />
      <div className="relative flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
          <Sparkles size={12} className="text-violet-400" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-400/70">
            {t("aiFirstLookBadge")}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">
            {firstLook.content}
          </p>
        </div>
      </div>
    </div>
  );
}
