export type Contact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  status?: string;
  notes?: string;
  company_id?: string;
  company_name?: string;
  last_contacted_at?: string;
  created_at?: string;
  owner?: {
    full_name: string;
  };
};
