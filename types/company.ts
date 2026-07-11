export type Company = {
  id: string;
  name: string;
  industry?: string;
  country?: string;
  status?: string;
  relationship_stage?: string;
  website?: string;
  company_size?: string;
  annual_value?: number;
  pipeline_value?: number;
  contacts_count?: number;
  deals_count?: number;
  last_activity_at?: string;
  created_at?: string;
  owner?: {
    full_name: string;
  };
};
