-- workspace_notifications
-- Used for deduplication of system-generated emails (daily_digest, task_reminders, etc.)

create table if not exists workspace_notifications (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  type          text not null,
  title         text not null default '',
  href          text,
  created_at    timestamptz not null default now()
);

create index if not exists workspace_notifications_lookup_idx
  on workspace_notifications (workspace_id, user_id, type, created_at desc);

alter table workspace_notifications enable row level security;

create policy "Members see own notifications"
  on workspace_notifications for select
  using (user_id = auth.uid());

create policy "Service role manages notifications"
  on workspace_notifications for all
  using (true)
  with check (true);
