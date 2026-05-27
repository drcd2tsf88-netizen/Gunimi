import { supabase }
from "@/lib/supabase";

export async function getActivity() {
  try {
    const { data, error } =
      await supabase
        .from(
          "workspace_activity"
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(20);

    if (error) {
      console.error(error);

      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error(error);

    return [];
  }
}