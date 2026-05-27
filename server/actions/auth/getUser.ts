"use server";

import { cookies }
from "next/headers";

import { createServerClient }
from "@supabase/ssr";

export async function getUser() {
  // NEXT 15+
  // cookies() is async

  const cookieStore =
    await cookies();

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,

      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      {
        cookies: {
          get(name: string) {
            return cookieStore.get(
              name
            )?.value;
          },

          set(
            name: string,
            value: string,
            options: any
          ) {
            cookieStore.set({
              name,
              value,
              ...options,
            });
          },

          remove(
            name: string,
            options: any
          ) {
            cookieStore.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

  const {
    data: { user },
    error,
  } =
    await supabase.auth.getUser();

  if (error) {
    console.error(
      "Supabase auth error:",
      error.message
    );

    return null;
  }

  return user;
}