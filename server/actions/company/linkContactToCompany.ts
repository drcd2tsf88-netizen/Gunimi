"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

type Props = {
  contactId: string;
  companyId: string;
  companyName: string;
};

export async function linkContactToCompany({ contactId, companyId, companyName }: Props) {
  try {
    const user = await getUser();
    if (!user) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_contacts")
      .update({
        company_id: companyId,
        company_name: companyName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contactId)
      .eq("workspace_id", workspace.id)
      .select()
      .maybeSingle();

    if (error || !data) {
      logger.error("[linkContactToCompany]", error);
      return null;
    }

    revalidatePath(`/dashboard/companies/${companyId}`);
    revalidatePath(`/dashboard/crm/${contactId}`);

    return data;
  } catch (error) {
    logger.error("[linkContactToCompany]", error);
    return null;
  }
}
