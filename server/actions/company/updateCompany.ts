"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type UpdateCompanyProps = {
  companyId: string;
  name: string;
  website?: string;
  industry?: string;
  companySize?: string;
  country?: string;
  annualValue?: number;
  notes?: string;
};

export async function updateCompany({
  companyId,
  name,
  website,
  industry,
  companySize,
  country,
  annualValue,
  notes,
}: UpdateCompanyProps) {
  try {
    if (!companyId || !name.trim()) return null;

    const user = await getUser();
    if (!user) return null;
    if (!await checkWriteRateLimit(user.id)) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_companies")
      .update({
        name: name.trim(),
        website: website?.trim() || null,
        industry: industry?.trim() || null,
        company_size: companySize?.trim() || null,
        country: country?.trim() || null,
        annual_value: annualValue ?? 0,
        notes: notes?.trim() || null,
        last_activity_at: new Date().toISOString(),
      })
      .eq("workspace_id", workspace.id)
      .eq("id", companyId)
      .select()
      .maybeSingle();

    if (error || !data) {
      logger.error(error);
      return null;
    }

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      company_id: companyId,
      type: "company_updated",
      title: "Organization Updated",
      description: `Updated organization "${name.trim()}"`,
    });

    revalidatePath(`/dashboard/companies/${companyId}`);
    revalidatePath("/dashboard/companies");

    return data;
  } catch (error) {
    logger.error(error);
    return null;
  }
}
