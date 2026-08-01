-- Custom automation rules per workspace
create table if not exists workspace_automation_rules (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references workspaces(id) on delete cascade,
  user_id      uuid        not null references auth.users(id) on delete cascade,
  name         text        not null,
  trigger      text        not null,
  conditions   jsonb       not null default '[]',
  action_type  text        not null default 'create_task',
  action_params jsonb      not null default '{}',
  enabled      boolean     not null default true,
  created_at   timestamptz not null default now()
);

alter table workspace_automation_rules enable row level security;

create policy "workspace members read custom rules"
  on workspace_automation_rules for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_automation_rules.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "workspace admins manage custom rules"
  on workspace_automation_rules for all
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_automation_rules.workspace_id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role in ('owner', 'admin')
    )
  );
