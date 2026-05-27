import { createClient }
from "@/lib/supabase/server";

/**
 * Returns the currently authenticated
 * user from the server-side Supabase
 * client, or null if not signed in.
 */
export async function getUser() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  return user;
}
