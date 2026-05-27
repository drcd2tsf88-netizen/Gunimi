import { createBrowserClient }
from "@supabase/ssr";

// Uses cookie-based session storage so the session is visible
// to both client components AND the server middleware / server actions.

export const supabase =
  createBrowserClient(
    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,

    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
