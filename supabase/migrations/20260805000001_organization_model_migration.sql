-- Organization Model Migration
-- ADR-005: Operational Responsibility Model
-- Teams form a tree. Organizational semantics are interpretations of that tree.

-- ─────────────────────────────────────────────────────────────
-- workspace_teams
-- ─────────────────────────────────────────────────────────────
create table if not exists workspace_teams (
  id              uuid        primary key default gen_random_uuid(),
  workspace_id    uuid        not null references workspaces(id) on delete cascade,
  parent_team_id  uuid        references workspace_teams(id) on delete set null,
  team_type       text        not null default 'team',
  name            text        not null,
  description     text,
  color           text        not null default '#6D5BFF',
  created_at      timestamptz not null default now()
);

alter table workspace_teams enable row level security;

create policy "workspace members read teams"
  on workspace_teams for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_teams.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "workspace admins manage teams"
  on workspace_teams for all
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_teams.workspace_id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role in ('owner', 'admin')
    )
  );

create index idx_workspace_teams_workspace on workspace_teams(workspace_id);
create index idx_workspace_teams_parent   on workspace_teams(parent_team_id);

-- ─────────────────────────────────────────────────────────────
-- workspace_team_memberships
-- ─────────────────────────────────────────────────────────────
create table if not exists workspace_team_memberships (
  id          uuid        primary key default gen_random_uuid(),
  team_id     uuid        not null references workspace_teams(id) on delete cascade,
  actor_id    uuid        not null references workspace_members(id) on delete cascade,
  role        text        not null default 'member',
  joined_at   timestamptz not null default now(),
  left_at     timestamptz,
  constraint workspace_team_memberships_role_check
    check (role in ('lead', 'member')),
  constraint workspace_team_memberships_unique
    unique (team_id, actor_id)
);

alter table workspace_team_memberships enable row level security;

create policy "workspace members read team memberships"
  on workspace_team_memberships for select
  using (
    exists (
      select 1
      from workspace_teams wt
      join workspace_members wm on wm.workspace_id = wt.workspace_id
      where wt.id = workspace_team_memberships.team_id
        and wm.user_id = auth.uid()
    )
  );

create policy "workspace admins manage team memberships"
  on workspace_team_memberships for all
  using (
    exists (
      select 1
      from workspace_teams wt
      join workspace_members wm on wm.workspace_id = wt.workspace_id
      where wt.id = workspace_team_memberships.team_id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'admin')
    )
  );

create index idx_team_memberships_team   on workspace_team_memberships(team_id);
create index idx_team_memberships_actor  on workspace_team_memberships(actor_id);
create index idx_team_memberships_active on workspace_team_memberships(team_id) where left_at is null;

-- ─────────────────────────────────────────────────────────────
-- workspace_assignments
-- ADR-005: Operational Relationship — entity + actor + responsibility
-- ─────────────────────────────────────────────────────────────
create table if not exists workspace_assignments (
  id                      uuid        primary key default gen_random_uuid(),
  workspace_id            uuid        not null references workspaces(id) on delete cascade,

  -- What this is about
  entity_type             text        not null,
  entity_id               uuid        not null,

  -- Who is responsible (polymorphic Actor)
  actor_type              text        not null default 'team',
  actor_id                uuid        not null,

  -- Nature of the responsibility
  responsibility          text        not null default 'owner',

  -- Context at time of assignment
  decision_context        jsonb,

  -- Lifecycle
  status                  text        not null default 'active',

  -- Temporal
  created_at              timestamptz not null default now(),
  active_from             timestamptz,
  active_until            timestamptz,

  -- Provenance
  created_by_actor_type   text,
  created_by_actor_id     uuid,

  -- Transitions (immutable — append only)
  closed_reason           text,
  transferred_to          uuid        references workspace_assignments(id),

  constraint workspace_assignments_actor_type_check
    check (actor_type in ('person', 'team', 'agent', 'system', 'organization')),
  constraint workspace_assignments_responsibility_check
    check (responsibility in ('owner', 'collaborator', 'reviewer', 'approver', 'observer')),
  constraint workspace_assignments_status_check
    check (status in ('proposed', 'accepted', 'active', 'waiting', 'blocked', 'completed', 'cancelled'))
);

alter table workspace_assignments enable row level security;

create policy "workspace members read assignments"
  on workspace_assignments for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_assignments.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "workspace members create assignments"
  on workspace_assignments for insert
  with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_assignments.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "workspace admins manage assignments"
  on workspace_assignments for update
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_assignments.workspace_id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role in ('owner', 'admin')
    )
  );

create index idx_assignments_workspace    on workspace_assignments(workspace_id);
create index idx_assignments_entity       on workspace_assignments(workspace_id, entity_type, entity_id);
create index idx_assignments_actor        on workspace_assignments(actor_type, actor_id);
create index idx_assignments_active       on workspace_assignments(workspace_id, status) where status not in ('completed', 'cancelled');
