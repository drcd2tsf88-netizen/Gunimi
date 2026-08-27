"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { PlusCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";
import { createOrderItem, deleteOrderItem } from "@/server/actions/orders/orderItems";
import {
  computeLineTotal,
  computeOrderTotal,
  formatOrderAmount,
  type Order,
  type OrderItem,
} from "@/types/order";

type Props = {
  order: Order;
};

type NewItemState = {
  description: string;
  quantity: string;
  unit_price: string;    // user enters in major units (e.g. "42.50"), we convert to cents
  discount_percent: string;
  tax_rate_percent: string;
};

const EMPTY: NewItemState = {
  description: "",
  quantity: "1",
  unit_price: "",
  discount_percent: "0",
  tax_rate_percent: "0",
};

function parseCents(value: string): number {
  const n = parseFloat(value.replace(",", "."));
  if (isNaN(n) || n < 0) return 0;
  return Math.round(n * 100);
}

export default function OrderItemsTab({ order }: Props) {
  const t = useTranslations("orders");
  const tc = useTranslations("common");
  const [items, setItems] = useState<OrderItem[]>(order.items ?? []);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState<NewItemState>(EMPTY);
  const [isPending, startTransition] = useTransition();

  const total = computeOrderTotal(items);

  function handleAdd() {
    if (!newItem.description.trim()) return;
    const unit_price = parseCents(newItem.unit_price);
    const quantity = parseFloat(newItem.quantity) || 1;
    const discount_percent = parseFloat(newItem.discount_percent) || 0;
    const tax_rate_percent = parseFloat(newItem.tax_rate_percent) || 0;

    startTransition(async () => {
      const item = await createOrderItem({
        order_id: order.id,
        description: newItem.description.trim(),
        quantity,
        unit_price,
        discount_percent,
        tax_rate_percent,
        position: items.length,
      });

      if (item) {
        setItems((prev) => [...prev, item]);
        setNewItem(EMPTY);
        setAdding(false);
        toast.success(t("items.itemAdded"));
      } else {
        toast.error(t("items.failedToAddItem"));
      }
    });
  }

  function handleDelete(itemId: string) {
    startTransition(async () => {
      const ok = await deleteOrderItem(itemId, order.id);
      if (ok) {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
        toast.success(t("items.itemDeleted"));
      } else {
        toast.error(t("items.failedToDeleteItem"));
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-white/80">{t("items.title")}</h2>
        {!adding && (
          <GunimiButton
            variant="secondary"
            className="h-7 gap-1.5 px-2.5 text-xs"
            onClick={() => setAdding(true)}
          >
            <PlusCircle size={12} />
            {t("items.addItem")}
          </GunimiButton>
        )}
      </div>

      {/* Items table */}
      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#080C14]">
        {items.length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="px-4 py-2.5 text-left font-medium text-zinc-500">{t("items.description")}</th>
                <th className="w-16 px-3 py-2.5 text-right font-medium text-zinc-500">{t("items.quantity")}</th>
                <th className="w-28 px-3 py-2.5 text-right font-medium text-zinc-500">{t("items.unitPrice")}</th>
                <th className="hidden w-20 px-3 py-2.5 text-right font-medium text-zinc-500 sm:table-cell">{t("items.discount")}</th>
                <th className="hidden w-20 px-3 py-2.5 text-right font-medium text-zinc-500 sm:table-cell">{t("items.tax")}</th>
                <th className="w-28 px-3 py-2.5 text-right font-medium text-zinc-500">{t("items.lineTotal")}</th>
                <th className="w-10 px-2 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {items.map((item) => {
                const lineTotal = computeLineTotal(item);
                return (
                  <tr key={item.id} className="group">
                    <td className="px-4 py-2.5 text-white/80">{item.description}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-zinc-400">{item.quantity}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-zinc-400">
                      {formatOrderAmount(item.unit_price, order.currency)}
                    </td>
                    <td className="hidden px-3 py-2.5 text-right tabular-nums text-zinc-500 sm:table-cell">
                      {item.discount_percent > 0 ? `${item.discount_percent}%` : "—"}
                    </td>
                    <td className="hidden px-3 py-2.5 text-right tabular-nums text-zinc-500 sm:table-cell">
                      {item.tax_rate_percent > 0 ? `${item.tax_rate_percent}%` : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-medium text-white/70">
                      {formatOrderAmount(lineTotal, order.currency)}
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isPending}
                        className="[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {items.length === 0 && !adding && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-zinc-600">{t("items.noItems")}</p>
            <p className="mt-1 text-xs text-zinc-700">{t("items.noItemsDescription")}</p>
          </div>
        )}

        {/* Inline add form */}
        {adding && (
          <div className="border-t border-white/[0.06] px-4 py-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_80px_100px_80px_80px]">
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {t("items.description")}
                </label>
                <GunimiInput
                  placeholder={t("items.descriptionPlaceholder")}
                  value={newItem.description}
                  onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))}
                  autoFocus
                  className="text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {t("items.quantity")}
                </label>
                <GunimiInput
                  type="number"
                  min="0.001"
                  step="any"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem((p) => ({ ...p, quantity: e.target.value }))}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {t("items.unitPrice")}
                </label>
                <GunimiInput
                  placeholder={t("items.pricePlaceholder")}
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.unit_price}
                  onChange={(e) => setNewItem((p) => ({ ...p, unit_price: e.target.value }))}
                  className="text-xs"
                />
              </div>
              <div className="hidden sm:block">
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {t("items.discount")}
                </label>
                <GunimiInput
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={newItem.discount_percent}
                  onChange={(e) => setNewItem((p) => ({ ...p, discount_percent: e.target.value }))}
                  className="text-xs"
                />
              </div>
              <div className="hidden sm:block">
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {t("items.tax")}
                </label>
                <GunimiInput
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={newItem.tax_rate_percent}
                  onChange={(e) => setNewItem((p) => ({ ...p, tax_rate_percent: e.target.value }))}
                  className="text-xs"
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <GunimiButton
                variant="secondary"
                className="h-7 px-3 text-xs"
                onClick={() => { setAdding(false); setNewItem(EMPTY); }}
              >
                {tc("cancel")}
              </GunimiButton>
              <GunimiButton
                variant="primary"
                className="h-7 px-3 text-xs"
                loading={isPending}
                disabled={!newItem.description.trim() || !newItem.unit_price}
                onClick={handleAdd}
              >
                {t("items.addItem")}
              </GunimiButton>
            </div>
          </div>
        )}
      </div>

      {/* Total */}
      {items.length > 0 && (
        <div className="flex justify-end">
          <div className="rounded-xl border border-white/[0.06] bg-[#080C14] px-5 py-3">
            <p className="text-[11px] text-zinc-500">{t("items.orderTotal")}</p>
            <p className="text-lg font-semibold tabular-nums text-white">
              {formatOrderAmount(total, order.currency)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
