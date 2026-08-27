"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PlusCircle, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import CreateOrderSheet from "./CreateOrderSheet";
import { formatOrderAmount, computeOrderTotal, type Order } from "@/types/order";
import { ORDER_STATUS_STYLES, ORDER_COMM_STYLES } from "@/lib/orders/styles";
import type { Company } from "@/types/company";
import type { Contact } from "@/types/contact";
import type { Deal } from "@/types/deal";

type Props = {
  orders: Order[];
  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
};

export default function OrdersPageView({ orders, companies, contacts, deals }: Props) {
  const t = useTranslations("orders");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.number.toLowerCase().includes(q) ||
        o.company?.name.toLowerCase().includes(q) ||
        o.contact?.name.toLowerCase().includes(q)
    );
  }, [orders, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">{t("pageTitle")}</h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            {orders.length > 0
              ? `${orders.length} ${t("pageTitle").toLowerCase()}`
              : t("noOrdersDescription")}
          </p>
        </div>
        <GunimiButton
          variant="primary"
          className="h-9 gap-2 px-4 text-sm"
          onClick={() => setCreateOpen(true)}
        >
          <PlusCircle size={15} />
          {t("newOrder")}
        </GunimiButton>
      </div>

      {/* Search */}
      {orders.length > 0 && (
        <GunimiInput
          placeholder={`${t("pageTitle")}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <GunimiEmptyState
          icon={ShoppingBag}
          title={t("emptyState.heading")}
          description={t("emptyState.description")}
          action={
            <GunimiButton
              variant="secondary"
              className="h-8 gap-1.5 px-3 text-xs"
              onClick={() => setCreateOpen(true)}
            >
              <PlusCircle size={13} />
              {t("createOrder")}
            </GunimiButton>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#080C14]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  {t("titleLabel")}
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-500 md:table-cell">
                  {t("companyLabel")}
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="hidden px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500 lg:table-cell">
                  {t("items.orderTotal")}
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-500 xl:table-cell">
                  {t("dueDateLabel")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filtered.map((order) => {
                const total = order.items ? computeOrderTotal(order.items) : null;
                const dueDate = order.due_date
                  ? new Date(order.due_date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : null;
                const isOverdue =
                  order.due_date &&
                  new Date(order.due_date) < new Date() &&
                  order.status !== "completed" &&
                  order.status !== "cancelled";

                return (
                  <tr
                    key={order.id}
                    className="group cursor-pointer transition-colors hover:bg-white/[0.02]"
                    onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-white/90 group-hover:text-white">
                          {order.title}
                        </span>
                        <span className="text-[11px] text-zinc-600">{order.number}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-400">{order.company?.name ?? "—"}</span>
                        {order.contact?.name && (
                          <span className="text-[11px] text-zinc-600">{order.contact.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={cn(
                            "inline-flex w-fit rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            ORDER_STATUS_STYLES[order.status] ?? ORDER_STATUS_STYLES.draft
                          )}
                        >
                          {t(`status.${order.status}`)}
                        </span>
                        <span
                          className={cn(
                            "text-[10px]",
                            ORDER_COMM_STYLES[order.communication_state] ?? "text-zinc-500"
                          )}
                        >
                          {t(`communicationState.${order.communication_state}`)}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-right tabular-nums text-white/70 lg:table-cell">
                      {total !== null ? formatOrderAmount(total, order.currency) : "—"}
                    </td>
                    <td className="hidden px-4 py-3 xl:table-cell">
                      {dueDate ? (
                        <span className={cn("text-xs", isOverdue ? "text-red-400" : "text-zinc-500")}>
                          {isOverdue ? `⚠ ${dueDate}` : dueDate}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-700">{t("noDueDate")}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateOrderSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        companies={companies}
        contacts={contacts}
        deals={deals}
      />
    </div>
  );
}
