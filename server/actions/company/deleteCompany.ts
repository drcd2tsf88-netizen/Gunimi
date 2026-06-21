"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export async function deleteCompany(companyId: string) {
  try {
    if (!companyId) return false;

    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { data: company, error: fetchError } = await supabase
      .from("workspace_companies")
      .select("id, name")
      .eq("workspace_id", workspace.id)
      .eq("id", companyId)
      .single();

    if (fetchError || !company) {
      console.error(fetchError);
      return false;
    }

    // DELETE FIRST — activity never blocks deletion
    const { error: deleteError } = await supabase
      .from("workspace_companies")
      .delete()
      .eq("workspace_id", workspace.id)
      .eq("id", companyId);

    if (deleteError) {
      console.error(deleteError);
      return false;
    }

    // ACTIVITY AFTER — failure is non-fatal
    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      type: "company_deleted",
      title: "Organization Deleted",
      description: `Deleted organization "${company.name}"`,
    });

    revalidatePath("/dashboard/companies");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
