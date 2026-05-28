-- ============================================================
-- ORBIT AI OS — COMPLETE RLS SETUP
-- Paste this entire script into:
-- Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- STEP 1 — Enable RLS on every table
-- ────────────────────────────────────────────────────────────

ALTER TABLE IF EXISTS profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspaces            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspace_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspace_invites     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspace_activity    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspace_notes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspace_contacts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspace_tasks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tasks                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs            ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────
-- STEP 2 — Drop all existing policies (clean slate)
-- ────────────────────────────────────────────────────────────

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      r.policyname, r.schemaname, r.tablename
    );
  END LOOP;
END $$;


-- ────────────────────────────────────────────────────────────
-- STEP 3 — profiles
-- ────────────────────────────────────────────────────────────

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT TO authenticated
  USING (id::text = auth.uid()::text);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (id::text = auth.uid()::text);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE TO authenticated
  USING  (id::text = auth.uid()::text)
  WITH CHECK (id::text = auth.uid()::text);


-- ────────────────────────────────────────────────────────────
-- STEP 4 — workspaces
-- ────────────────────────────────────────────────────────────

CREATE POLICY "workspaces_select_member"
  ON workspaces FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = workspaces.id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "workspaces_insert_authenticated"
  ON workspaces FOR INSERT TO authenticated
  WITH CHECK (true);


-- ────────────────────────────────────────────────────────────
-- STEP 5 — workspace_members
-- ────────────────────────────────────────────────────────────

CREATE POLICY "members_select_own"
  ON workspace_members FOR SELECT TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "members_insert_own"
  ON workspace_members FOR INSERT TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);


-- ────────────────────────────────────────────────────────────
-- STEP 6 — workspace_invites
-- ────────────────────────────────────────────────────────────

CREATE POLICY "invites_select_authenticated"
  ON workspace_invites FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "invites_insert_admin"
  ON workspace_invites FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = workspace_invites.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
        AND wm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "invites_update_email_match"
  ON workspace_invites FOR UPDATE TO authenticated
  USING (
    email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 7 — workspace_activity
-- ────────────────────────────────────────────────────────────

CREATE POLICY "activity_select_member"
  ON workspace_activity FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = workspace_activity.company_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 8 — workspace_notes
-- ────────────────────────────────────────────────────────────

CREATE POLICY "notes_select_member"
  ON workspace_notes FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = workspace_notes.company_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 9 — workspace_contacts (CRM)
-- ────────────────────────────────────────────────────────────

CREATE POLICY "contacts_select_member"
  ON workspace_contacts FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = workspace_contacts.company_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 10 — workspace_tasks
-- ────────────────────────────────────────────────────────────

CREATE POLICY "workspace_tasks_select_member"
  ON workspace_tasks FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = workspace_tasks.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 11 — tasks
-- ────────────────────────────────────────────────────────────

CREATE POLICY "tasks_select_member"
  ON tasks FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = tasks.company_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 12 — audit_logs (service role only, no client policies)
-- ────────────────────────────────────────────────────────────
-- intentionally empty


-- ────────────────────────────────────────────────────────────
-- STEP 13 — Make guoth123@gmail.com a platform admin
-- ────────────────────────────────────────────────────────────

UPDATE profiles
SET platform_role = 'admin'
WHERE email = 'guoth123@gmail.com';


-- ============================================================
-- DONE
-- 1. guoth123@gmail.com → log in → go to /orbit-control
-- 2. New registrations → /waitlist
-- 3. Admin clicks "Approve Beta" → user gets /dashboard access
-- ============================================================
