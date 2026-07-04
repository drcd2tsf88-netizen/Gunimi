import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { DB_CONFIG } from "@/lib/db/config";

let _instance: SupabaseClient | null = null;

function getInstance(): SupabaseClient {
  if (!_instance) {
    const { supabaseUrl, supabaseServiceRoleKey } = DB_CONFIG;
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    _instance = createClient(supabaseUrl, supabaseServiceRoleKey);
  }
  return _instance;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop: string | symbol) {
    return Reflect.get(getInstance(), prop);
  },
});
