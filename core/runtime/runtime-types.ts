export type OrbitRuntimeUser =
{
  id: string;

  email: string;

  full_name?: string;

  avatar_url?: string;

  platform_role?: string;
};

export type OrbitWorkspace =
{
  id: string;

  name: string;

  slug: string;
};

export type OrbitMembership =
{
  id: string;

  role: string;

  workspace_id: string;
};

export type OrbitRuntimeState =
{
  initialized: boolean;

  loading: boolean;

  user:
    | OrbitRuntimeUser
    | null;

  workspace:
    | OrbitWorkspace
    | null;

  membership:
    | OrbitMembership
    | null;
};