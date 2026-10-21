-- Push Subscriptions — stores Web Push API subscriptions per user+workspace+device
-- Each row = one browser/device registration.
-- Expired subscriptions are cleaned up automatically by the server after a failed push send.

create table if not exists push_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  endpoint      text not null,
  p256dh        text not null,
  auth_key      text not null,
  created_at    timestamptz not null default now(),

  constraint push_subscriptions_workspace_endpoint_unique unique (workspace_id, endpoint)
);

-- Only the owning user can read/delete their own subscriptions.
-- Server-side sends via supabaseAdmin bypass RLS entirely.
alter table push_subscriptions enable row level security;

create policy "push_subscriptions_select_own"
  on push_subscriptions for select
  using (auth.uid() = user_id);

create policy "push_subscriptions_insert_own"
  on push_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "push_subscriptions_delete_own"
  on push_subscriptions for delete
  using (auth.uid() = user_id);
