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
