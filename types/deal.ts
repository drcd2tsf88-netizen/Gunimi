export type Deal = {
  id: string;
  title: string;
  description?: string;
  stage: string;
  value?: number;
  probability?: number;
  expected_close_date?: string;
  lost_reason?: string;
  created_at: string;
  company?: {
    id: string;
    name: string;
  };
  contact?: {
    id: string;
    name: string;
    email?: string;
  };
  owner?: {
    full_name: string;
  };
};
