// ORDER_DOMAIN.md v1.0
// Money: unit_price is INTEGER minor currency units (cents). totals are computed, never stored.
// Two independent state machines: status (lifecycle) + communication_state.
// No owner — responsibility via workspace_assignments (ADR-005).

export type OrderStatus =
  | "draft"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type OrderCommunicationState =
  | "not_sent"
  | "sent"
  | "acknowledged";

export type OrderItem = {
  id: string;
  order_id: string;
  description: string;
  quantity: number;
  unit_price: number;      // INTEGER minor currency units (cents)
  discount_percent: number;
  tax_rate_percent: number;
  position: number;
  created_at: string;
  // line_total is computed by computeLineTotal() — never stored
};

export type Order = {
  id: string;
  workspace_id: string;
  number: string;          // ORD-0001, system-generated
  title: string;
  notes?: string;
  currency: string;
  status: OrderStatus;
  communication_state: OrderCommunicationState;
  due_date?: string;
  created_at: string;
  updated_at?: string;
  // Compatibility bridges (ADR-003)
  company_id?: string;
  contact_id?: string;
  deal_id?: string;
  // Resolved relations (joined on read)
  company?: { id: string; name: string };
  contact?: { id: string; name: string; email?: string };
  deal?: { id: string; title: string };
  items?: OrderItem[];
};

// Computed — never stored in DB
export function computeLineTotal(item: OrderItem): number {
  return (
    item.quantity *
    item.unit_price *
    (1 - item.discount_percent / 100) *
    (1 + item.tax_rate_percent / 100)
  );
}

export function computeOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + computeLineTotal(item), 0);
}

// Display helper: converts minor currency units to decimal string
export function formatOrderAmount(minorUnits: number, currency = "EUR"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(minorUnits / 100);
}
