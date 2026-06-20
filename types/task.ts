export type WorkspaceMember = {
  user_id: string;
  profiles: {
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  created_at: string;
  updated_at?: string | null;
  due_date?: string | null;
  assigned_to?: string | null;
  assigned_to_name?: string;
};
