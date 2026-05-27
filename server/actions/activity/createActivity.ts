"use server";

import { supabase } from "@/lib/supabase";

import { getUser }
from "@/server/actions/auth/getUser";

type CreateActivityProps = {
  type: string;

  title: string;

  description: string;
};

export async function createActivity({
  type,

  title,

  description,
}: CreateActivityProps) {
  try {
    const user =
      await getUser();

    if (!user) {
      return null;
    }

    const { data, error } =
      await supabase
        .from(
          "workspace_activity"
        )
        .insert([
          {
            type,

            title,

            description,

            user_id: user.id,
          },
        ])
        .select()
        .single();

    if (error) {
      console.error(error);

      return null;
    }

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
}