-- Orders Migration
-- ORDER_DOMAIN.md v1.0 — First entity built under constitutional domain model
-- ADR-005: No owner_id — responsibility via workspace_assignments
-- ADR-003: company_id / contact_id / deal_id are compatibility bridges
-- ADR-002: contact_id → workspace_members.id (workspace_people.id post-migration)
-- Money: INTEGER minor currency units (cents). Total never stored, always computed.
-- Two independent state machines: status (lifecycle) + communication_state

-- ─────────────────────────────────────────────────────────────
-- Order number counter
-- Atomic, collision-free sequential number per workspace.
-- Uses INSERT ... ON CONFLICT DO UPDATE to guarantee single-row atomic increment.
-- ─────────────────────────────────────────────────────────────

create table if not exists workspace_order_counters (
  workspace_id  uuid    primary key references workspaces(id) on delete cascade,
  last_number   integer not null default 0
);

-- No RLS needed — this table is only accessed via the server-side function below.
-- Direct user access is blocked by the absence of policies (default deny).
alter table workspace_order_counters enable row level security;

create or replace function generate_order_number(p_workspace_id uuid)
returns text
language plpgsql
security definer
as $$
declare
  v_next integer;
begin
  insert into workspace_order_counters(workspace_id, last_number)
  values (p_workspace_id, 1)
  on conflict (workspace_id) do update
    set last_number = workspace_order_counters.last_number + 1
  returning last_number into v_next;

  return 'ORD-' || lpad(v_next::text, 4, '0');
end;
$$;

create or replace function trg_set_order_number_fn()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.number is null or new.number = '' then
    new.number := generate_order_number(new.workspace_id);
  end if;
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- workspace_orders
-- ─────────────────────────────────────────────────────────────

create table if not exists workspace_orders (
  id                    uuid        primary key default gen_random_uuid(),
  workspace_id          uuid        not null references workspaces(id) on delete cascade,

  -- Identity — number is set by trigger, never by the user
  number                text        not null default '',
  title                 text        not null,
  notes                 text,

  -- Money
  -- unit prices on items are stored as INTEGER minor currency units (cents).
  -- total_amount is NEVER stored — always computed from workspace_order_items.
  currency              text        not null default 'EUR',

  -- Lifecycle state — Order operational state (independent dimension)
  status                text        not null default 'draft',

  -- Communication state — counterparty acknowledgement (independent dimension)
  -- Must never be merged into status. See ORDER_DOMAIN.md: Two State Machines.
  communication_state   text        not null default 'not_sent',

  -- Temporal
  due_date              date,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- Compatibility bridges (ADR-003: will migrate to workspace_relationships)
  -- company_id: Business Entity counterparty for this Order
  company_id            uuid        references workspace_companies(id) on delete set null,

  -- contact_id: references workspace_people.id (ADR-002 — domain foundation migration completed)
  contact_id            uuid        references workspace_people(id) on delete set null,

  -- deal_id: optional — Order may originate from a Deal
  deal_id               uuid        references workspace_deals(id) on delete set null,

  -- NO owner_id. Responsibility is modeled via workspace_assignments (ADR-005).
  -- Use entity_type = 'order', entity_id = workspace_orders.id.

  constraint workspace_orders_status_check
    check (status in ('draft', 'confirmed', 'in_progress', 'completed', 'cancelled')),

  constraint workspace_orders_communication_state_check
    check (communication_state in ('not_sent', 'sent', 'acknowledged')),

  constraint workspace_orders_currency_check
    check (currency ~ '^[A-Z]{3}$'),

  constraint workspace_orders_number_nonempty
    check (number != '')
);

drop trigger if exists trg_set_order_number on workspace_orders;
create trigger trg_set_order_number
  before insert on workspace_orders
  for each row execute function trg_set_order_number_fn();

-- updated_at is set by the application layer in Server Actions (existing pattern).
-- No DB trigger — consistent with workspace_deals, workspace_contacts, workspace_tasks.

alter table workspace_orders enable row level security;

drop policy if exists "workspace members read orders"   on workspace_orders;
drop policy if exists "workspace members create orders" on workspace_orders;
drop policy if exists "workspace members update orders" on workspace_orders;
drop policy if exists "workspace admins delete orders"  on workspace_orders;

create policy "workspace members read orders"
  on workspace_orders for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_orders.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "workspace members create orders"
  on workspace_orders for insert
  with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_orders.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "workspace members update orders"
  on workspace_orders for update
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_orders.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "workspace admins delete orders"
  on workspace_orders for delete
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_orders.workspace_id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role in ('owner', 'admin')
    )
  );

create index if not exists idx_orders_workspace        on workspace_orders(workspace_id);
create index if not exists idx_orders_workspace_status on workspace_orders(workspace_id, status);
create index if not exists idx_orders_company          on workspace_orders(company_id) where company_id is not null;
create index if not exists idx_orders_contact          on workspace_orders(contact_id) where contact_id is not null;
create index if not exists idx_orders_deal             on workspace_orders(deal_id) where deal_id is not null;
create index if not exists idx_orders_due_date         on workspace_orders(workspace_id, due_date) where due_date is not null;
create unique index if not exists idx_orders_number    on workspace_orders(workspace_id, number);

-- ─────────────────────────────────────────────────────────────
-- workspace_order_items
-- Money model:
--   unit_price: INTEGER, minor currency units (cents). NEVER floating point.
--   discount_percent: NUMERIC(5,2), 0.00–100.00
--   tax_rate_percent: NUMERIC(5,2), 0.00–100.00
--   line_total: COMPUTED, never stored
--     = quantity × unit_price × (1 − discount_percent/100) × (1 + tax_rate_percent/100)
--   order_total: SUM(line_total) — computed by application layer on read
-- ─────────────────────────────────────────────────────────────

create table if not exists workspace_order_items (
  id                uuid           primary key default gen_random_uuid(),
  order_id          uuid           not null references workspace_orders(id) on delete cascade,
  workspace_id      uuid           not null references workspaces(id) on delete cascade,

  description       text           not null,
  quantity          numeric(10, 3) not null default 1,
  unit_price        integer        not null,    -- minor currency units (cents)
  discount_percent  numeric(5, 2)  not null default 0,
  tax_rate_percent  numeric(5, 2)  not null default 0,
  position          integer        not null default 0,
  created_at        timestamptz    not null default now(),

  constraint workspace_order_items_quantity_positive
    check (quantity > 0),

  constraint workspace_order_items_unit_price_nonneg
    check (unit_price >= 0),

  constraint workspace_order_items_discount_range
    check (discount_percent >= 0 and discount_percent <= 100),

  constraint workspace_order_items_tax_range
    check (tax_rate_percent >= 0 and tax_rate_percent <= 100),

  constraint workspace_order_items_description_nonempty
    check (description != '')
);

alter table workspace_order_items enable row level security;

drop policy if exists "workspace members read order items"   on workspace_order_items;
drop policy if exists "workspace members create order items" on workspace_order_items;
drop policy if exists "workspace members update order items" on workspace_order_items;
drop policy if exists "workspace members delete order items" on workspace_order_items;

create policy "workspace members read order items"
  on workspace_order_items for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_order_items.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "workspace members create order items"
  on workspace_order_items for insert
  with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_order_items.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "workspace members update order items"
  on workspace_order_items for update
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_order_items.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "workspace members delete order items"
  on workspace_order_items for delete
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_order_items.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create index if not exists idx_order_items_order     on workspace_order_items(order_id);
create index if not exists idx_order_items_workspace on workspace_order_items(workspace_id);
create index if not exists idx_order_items_position  on workspace_order_items(order_id, position);
