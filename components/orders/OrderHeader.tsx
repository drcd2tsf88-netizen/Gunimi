"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Building2, Calendar, ChevronDown, Pencil, Trash2, User, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import GunimiButton from "@/components/ui/GunimiButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteOrderAndRedirect } from "@/server/actions/orders/deleteOrder";
import {
  transitionOrderStatus,
  transitionCommunicationState,
} from "@/server/actions/orders/updateOrder";
import { setOrderAssignee } from "@/server/actions/orders/setOrderAssignee";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { computeOrderTotal, formatOrderAmount, type Order, type OrderStatus, type OrderCommunicationState } from "@/types/order";
import { ORDER_STATUS_STYLES, ORDER_COMM_BADGE_STYLES } from "@/lib/orders/styles";
import EditOrderSheet from "./EditOrderSheet";
import type { Company } from "@/types/company";
import type { Contact } from "@/types/contact";
import type { Deal } from "@/types/deal";
import type { OrderAssignee } from "@/server/actions/orders/getOrderAssignee";

type WorkspaceMemberFlat = {
  user_id: string;
  full_name: string | null;
  email: string;
};

type Props = {
  order: Order;
  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
  members: WorkspaceMemberFlat[];
  initialAssignee: OrderAssignee | null;
};

export default function OrderHeader({ order, companies, contacts, deals, members, initialAssignee }: Props) {
  const t = useTranslations("orders");
  const tc = useTranslations("common");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const [isTransitioning, startTransition] = useTransition();
  const [assignee, setAssignee] = useState<OrderAssignee | null>(initialAssignee);
  const [isAssigning, startAssigning] = useTransition();

  function handleAssigneeChange(userId: string) {
    const resolved = userId === "unassigned" ? null : userId;
    startAssigning(async () => {
      const ok = await setOrderAssignee(order.id, resolved);
      if (ok) {
        const member = members.find((m) => m.user_id === resolved);
        setAssignee(resolved && member
          ? { assignmentId: "", userId: resolved, name: member.full_name, email: member.email }
          : null
        );
        toast.success(t("assigneeUpdated"), { id: "order-assignee" });
      } else {
        toast.error(t("assigneeUpdateFailed"), { id: "order-assignee" });
      }
    });
  }

  const total = order.items ? computeOrderTotal(order.items) : null;

  const dueDate = order.due_date
    ? new Date(order.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;

  const isOverdue =
    order.due_date &&
    new Date(order.due_date) < new Date() &&
    order.status !== "completed" &&
    order.status !== "cancelled";

  function handleStatusChange(val: string) {
    startTransition(async () => {
      const ok = await transitionOrderStatus(order.id, val as OrderStatus);
      if (ok) toast.success(t("lifecycle.statusUpdated"));
      else toast.error(t("lifecycle.failedToUpdateStatus"));
    });
  }

  function handleCommChange(val: string) {
    startTransition(async () => {
      const ok = await transitionCommunicationState(order.id, val as OrderCommunicationState);
      if (ok) toast.success(t("communication.stateUpdated"));
      else toast.error(t("communication.failedToUpdateState"));
    });
  }

  function handleDelete() {
    startDelete(async () => {
      await deleteOrderAndRedirect(order.id);
    });
  }

  return (
    <>
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
      >
        <ArrowLeft size={12} />
        {t("backToOrders")}
      </Link>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#080C14] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left */}
        <div className="flex items-start gap-4">
          <div className="flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-violet-500/15 px-3 text-[11px] font-bold tracking-wide text-violet-400">
            {order.number}
          </div>

          <div className="min-w-0 space-y-2">
            {/* Title */}
            <h1 className="text-lg font-semibold leading-tight text-white">{order.title}</h1>

            {/* Status chips — two independent dimensions */}
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
                disabled={isTransitioning}
              >
                <SelectTrigger className={cn(
                  "h-auto w-auto rounded-full border px-2.5 py-0.5 text-[10px] font-medium shadow-none ring-0 focus:ring-0",
                  ORDER_STATUS_STYLES[order.status] ?? ORDER_STATUS_STYLES.draft
                )}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["draft", "confirmed", "in_progress", "completed", "cancelled"] as OrderStatus[]).map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {t(`status.${s}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={order.communication_state}
                onValueChange={handleCommChange}
                disabled={isTransitioning}
              >
                <SelectTrigger className={cn(
                  "h-auto w-auto rounded-full border px-2.5 py-0.5 text-[10px] font-medium shadow-none ring-0 focus:ring-0",
                  ORDER_COMM_BADGE_STYLES[order.communication_state] ?? ORDER_COMM_BADGE_STYLES.not_sent
                )}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["not_sent", "sent", "acknowledged"] as OrderCommunicationState[]).map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {t(`communicationState.${s}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500">
              {order.company && (
                <span className="flex items-center gap-1">
                  <Building2 size={10} className="text-zinc-600" />
                  <Link
                    href={`/dashboard/companies/${order.company.id}`}
                    className="transition-colors hover:text-violet-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {order.company.name}
                  </Link>
                </span>
              )}
              {order.contact && (
                <span className="flex items-center gap-1">
                  <User size={10} className="text-zinc-600" />
                  <span>{order.contact.name}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <UserCheck size={10} className="text-zinc-600" />
                {members.length > 0 ? (
                  <Select
                    value={assignee?.userId ?? "unassigned"}
                    onValueChange={handleAssigneeChange}
                    disabled={isAssigning}
                  >
                    <SelectTrigger className={cn(
                      "h-auto w-auto gap-1 border border-dashed border-white/[0.12] bg-transparent px-2 py-0.5 text-[11px] shadow-none ring-0 focus:ring-0 transition-colors",
                      assignee ? "text-white/70 hover:text-white" : "text-zinc-500 hover:border-violet-500/30 hover:text-violet-300"
                    )}>
                      <span>{assignee ? (assignee.name ?? assignee.email) : t("unassigned")}</span>
                      <ChevronDown size={9} className="shrink-0 opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned" className="text-xs text-zinc-500">
                        {t("unassigned")}
                      </SelectItem>
                      {members.map((m) => (
                        <SelectItem key={m.user_id} value={m.user_id} className="text-xs">
                          {m.full_name ?? m.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-[11px] text-zinc-600">
                    {assignee ? (assignee.name ?? assignee.email) : t("unassigned")}
                  </span>
                )}
              </span>
              {dueDate && (
                <span className={cn("flex items-center gap-1", isOverdue ? "text-red-400" : "text-zinc-500")}>
                  <Calendar size={10} />
                  {isOverdue ? `⚠ ${dueDate}` : dueDate}
                </span>
              )}
              {total !== null && (
                <span className="font-medium tabular-nums text-white/60">
                  {formatOrderAmount(total, order.currency)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
          <GunimiButton
            variant="secondary"
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={() => setEditOpen(true)}
          >
            <Pencil size={12} />
            {tc("edit")}
          </GunimiButton>
          <GunimiButton
            variant="danger"
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 size={12} />
            {tc("delete")}
          </GunimiButton>
        </div>
      </div>

      <EditOrderSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        order={order}
        companies={companies}
        contacts={contacts}
        deals={deals}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false} className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteOrder")}</DialogTitle>
            <DialogDescription>{t("confirmDeleteOrder")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <GunimiButton variant="secondary" disabled={isDeleting} onClick={() => setDeleteOpen(false)}>
              {tc("cancel")}
            </GunimiButton>
            <GunimiButton variant="danger" loading={isDeleting} onClick={handleDelete}>
              {tc("delete")}
            </GunimiButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
