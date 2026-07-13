-- ============================================================
-- DOGFOOD FEEDBACK TABLE
-- Run manually in Supabase SQL Editor or via migrations CLI.
-- ============================================================

create table if not exists public.dogfood_feedback (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces(id) on delete cascade,
  user_id      uuid        not null references auth.users(id) on delete cascade,
  category     text        not null check (category in ('ux','bug','performance','copy','ai','signal','today','workspace','settings','other')),
  severity     text        not null check (severity in ('low','medium','high','critical')),
  message      text        not null,
  route        text,
  browser      text,
  viewport     text,
  language     text,
  timezone     text,
  status       text        not null default 'open' check (status in ('open','in_progress','resolved')),
  owner        text,
  session_note boolean     not null default false,
  created_at   timestamptz not null default now(),
  resolved_at  timestamptz
);

-- Row-Level Security
alter table public.dogfood_feedback enable row level security;

-- Platform admin + team can read all feedback
create policy "dogfood_platform_read"
  on public.dogfood_feedback for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.platform_role in ('admin', 'team')
    )
  );

-- Workspace members can insert when dogfood mode is enabled for their workspace
create policy "dogfood_workspace_insert"
  on public.dogfood_feedback for insert
  with check (
    workspace_id is not null
    and exists (
      select 1
      from public.workspace_members wm
      join public.workspaces w on w.id = wm.workspace_id
      where wm.user_id = auth.uid()
        and wm.workspace_id = dogfood_feedback.workspace_id
        and (w.preferences->>'dogfoodEnabled')::boolean = true
    )
  );

-- Platform admin + team can update status / owner
create policy "dogfood_platform_update"
  on public.dogfood_feedback for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.platform_role in ('admin', 'team')
    )
  );

-- Query-optimised indexes
create index if not exists dogfood_feedback_workspace_idx  on public.dogfood_feedback (workspace_id);
create index if not exists dogfood_feedback_status_idx     on public.dogfood_feedback (status);
create index if not exists dogfood_feedback_category_idx   on public.dogfood_feedback (category);
create index if not exists dogfood_feedback_created_at_idx on public.dogfood_feedback (created_at desc);
