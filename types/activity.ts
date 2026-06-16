export type WorkspaceActivity = {
  id: string;
  type?: string;
  title?: string;
  description?: string;
  message?: string;
  created_at: string;
  user?: {
    full_name: string;
  };
};
