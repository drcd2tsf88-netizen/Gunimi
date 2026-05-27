"use server";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";

type CreateMemoryProps = {
  type: string;

  content: string;
};

export async function createMemory({
  type,

  content,
}: CreateMemoryProps) {
  try {
    const user =
      await getUser();

    if (!user) {
      return null;
    }
const supabase =
      await createClient();
    const { data, error } =
      await supabase
        .from(
          "workspace_memory"
        )
        .insert([
          {
            type,

            content,

            user_id:
              user.id,
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