export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  created_at: string;
  due_date?: string;
  assigned_to_name?: string;
};
