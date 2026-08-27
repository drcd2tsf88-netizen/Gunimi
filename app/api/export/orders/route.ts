import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { generateCSV } from "@/lib/csv/generator";
import { ratelimit } from "@/lib/ratelimit";

type OrderItem = {
  quantity: number;
  unit_price: number;
  discount: number;
  tax: number;
};

function computeTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => {
    const subtotal = item.quantity * item.unit_price;
    const afterDiscount = subtotal * (1 - (item.discount ?? 0) / 100);
    const withTax = afterDiscount * (1 + (item.tax ?? 0) / 100);
    return sum + Math.round(withTax);
  }, 0);
}

function formatAmount(cents: number, currency: string): string {
  return (cents / 100).toFixed(2) + " " + currency;
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { success } = await ratelimit.limit(user.id);
    if (!success) return new Response("Rate limit exceeded", { status: 429 });

    const workspace = await getCurrentWorkspace();
    if (!workspace) return new Response("Workspace not found", { status: 404 });

    const { data, error } = await supabaseAdmin
      .from("workspace_orders")
      .select(`
        id, number, title, status, communication_state,
        currency, due_date, notes, created_at,
        company:workspace_companies(name),
        contact:workspace_people(name, email),
        items:workspace_order_items(quantity, unit_price, discount, tax)
      `)
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false });

    if (error) return new Response("Failed to fetch orders", { status: 500 });

    const headers = [
      "number",
      "title",
      "status",
      "communication_state",
      "company",
      "contact_name",
      "contact_email",
      "total",
      "currency",
      "due_date",
      "notes",
      "created_at",
    ];

    const rows = (data ?? []).map((order) => {
      const company = Array.isArray(order.company) ? order.company[0] : order.company;
      const contact = Array.isArray(order.contact) ? order.contact[0] : order.contact;
      const items = (Array.isArray(order.items) ? order.items : []) as OrderItem[];
      const totalCents = computeTotal(items);

      return {
        number: order.number,
        title: order.title,
        status: order.status,
        communication_state: order.communication_state,
        company: (company as { name: string } | null)?.name ?? "",
        contact_name: (contact as { name: string } | null)?.name ?? "",
        contact_email: (contact as { email: string } | null)?.email ?? "",
        total: formatAmount(totalCents, order.currency),
        currency: order.currency,
        due_date: order.due_date ?? "",
        notes: order.notes ?? "",
        created_at: order.created_at,
      };
    });

    const csv = generateCSV(headers, rows as Record<string, unknown>[]);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="orders.csv"',
      },
    });
  } catch {
    return new Response("Server error", { status: 500 });
  }
}
