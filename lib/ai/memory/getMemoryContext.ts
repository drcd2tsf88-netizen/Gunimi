import { supabase }
from "@/lib/supabase";

export async function getMemoryContext() {
  try {
    const { data, error } =
      await supabase
        .from(
          "workspace_memory"
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(10);

    if (error) {
      console.error(error);

      return "";
    }

    if (!data) {
      return "";
    }

    return data
      .map(
        (memory) =>
          `- ${memory.content}`
      )
      .join("\n");
  } catch (error) {
    console.error(error);

    return "";
  }
}