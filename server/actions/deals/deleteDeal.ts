"use server";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { revalidatePath }
from "next/cache";

export async function deleteDeal(
  dealId: string
) {
  try {
    if (!dealId) {
      return false;
    }

    const user =
      await getUser();

    if (!user) {
      return false;
    }

    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return false;
    }

    const supabase =
      await createClient();

    const {
      data: deal,
      error: dealError,
    } = await supabase
      .from("workspace_deals")
      .select("id, title, company_id, workspace_id")
      .eq("workspace_id", workspace.id)
      .eq("id", dealId)
      .single();

    if (dealError || !deal) {
      console.error(dealError);
      return false;
    }

    // DELETE FIRST — activity never blocks deletion
    const { error: deleteError } = await supabase
      .from("workspace_deals")
      .delete()
      .eq("workspace_id", workspace.id)
      .eq("id", deal.id);

    if (deleteError) {
      console.error(deleteError);
      return false;
    }

    // ACTIVITY AFTER — use supabaseAdmin, failure is non-fatal
    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        company_id: deal.company_id,
        deal_id: deal.id,
        type: "deal_deleted",
        title: "Opportunity Deleted",
        description: `Deleted deal "${deal.title}"`,
      });

    revalidatePath("/dashboard/deals");

    return true;

  } catch (error) {
    console.error(error);

    return false;
  }
}