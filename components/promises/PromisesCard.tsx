import { getTranslations } from "next-intl/server";
import { getContactPromises } from "@/server/actions/promises/getContactPromises";
import { CheckCircle2, Circle, HandshakeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  contactId: string;
};

function formatDueDate(dueDate: string | null, overdue: string, noDue: string, due: string): string {
  if (!dueDate) return noDue;
  const date = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (date < now) return overdue;
  return due.replace("{date}", date.toLocaleDateString(undefined, { month: "short", day: "numeric" }));
}

export default async function PromisesCard({ contactId }: Props) {
  const [t, promises] = await Promise.all([
    getTranslations("contacts"),
    getContactPromises(contactId),
  ]);

  if (promises.length === 0) return null;

  const overdueLabel = t("promisesOverdue");
  const noDueLabel = t("promisesNoDue");
  const dueLabel = t("promisesDue");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/[0.18] bg-amber-500/[0.04]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at top left, rgba(245,158,11,0.07), transparent 60%)" }}
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-amber-500/[0.10] px-4 py-3">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-amber-500/20 bg-amber-500/10">
          <HandshakeIcon size={11} className="text-amber-400" aria-hidden />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-400/80">
          {t("promisesBadge")}
        </p>
        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/20 px-1.5 text-[10px] font-bold tabular-nums text-amber-400">
          {promises.length}
        </span>
      </div>

      {/* List */}
      <ul className="divide-y divide-amber-500/[0.06]">
        {promises.map((p) => {
          const done = p.status === "done";
          const dueLine = formatDueDate(p.due_date, overdueLabel, noDueLabel, dueLabel);
          const isOverdue = dueLine === overdueLabel && !done;

          return (
            <li key={p.id} className="flex items-start gap-3 px-4 py-3">
              {done ? (
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
              ) : (
                <Circle size={15} className="mt-0.5 shrink-0 text-amber-400/50" />
              )}
              <div className="min-w-0 flex-1">
                <p className={cn(
                  "text-[13px] leading-snug",
                  done ? "text-zinc-500 line-through" : "text-white/80",
                )}>
                  {p.title}
                </p>
                <p className={cn(
                  "mt-0.5 text-[11px]",
                  isOverdue ? "text-red-400" : "text-zinc-500",
                )}>
                  {dueLine}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
