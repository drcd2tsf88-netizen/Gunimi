import { supabase }
from "@/lib/supabase";

export async function getTasks() {
  try {
    console.log(
      "LOADING TASKS..."
    );

    const { data, error } =
      await supabase
        .from("workspace_tasks")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    console.log(
      "TASK DATA:",
      data
    );

    console.log(
      "TASK ERROR:",
      error
    );

    if (error) {
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error(
      "GET TASKS FAILED:",
      error
    );

    return [];
  }
}