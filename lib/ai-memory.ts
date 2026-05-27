import { supabase }
from "@/lib/supabase";

export async function saveMemory(

  companyId: string,
  memory: string

) {

  const { error } =
    await supabase

      .from("workspace_ai_memory")

      .insert({

        company_id: companyId,

        memory,

      });

  if (error) {

    console.error(
      "Memory save failed:",
      error
    );

  }

}

export async function loadMemory(
  companyId: string
) {

  const { data, error } =
    await supabase

      .from("workspace_ai_memory")

      .select("*")

      .eq(
        "company_id",
        companyId
      )

      .order(
        "created_at",
        { ascending: false }
      )

      .limit(10);

  if (error) {

    console.error(
      "Memory load failed:",
      error
    );

    return [];

  }

  return data;

}