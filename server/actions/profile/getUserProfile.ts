"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
};

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await getUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !data) return null;

    return data as UserProfile;
  } catch {
    return null;
  }
}
