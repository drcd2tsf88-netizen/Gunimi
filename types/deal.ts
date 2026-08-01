export type Deal = {
  id: string;
  title: string;
  description?: string;
  stage: string;
  value?: number;
  paid_amount?: number;
  currency?: string;
  probability?: number;
  expected_close_date?: string;
  expiry_date?: string;
  lost_reason?: string;
  created_at: string;
  updated_at?: string;
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
