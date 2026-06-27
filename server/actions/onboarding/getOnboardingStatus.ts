"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";

export type OnboardingStatus = {
  contactsCount: number;
  companiesCount: number;
  dealsCount: number;
  emailConnected: boolean;
  calendarConnected: boolean;
};

const FALLBACK: OnboardingStatus = {
  contactsCount: 0,
  companiesCount: 0,
  dealsCount: 0,
  emailConnected: false,
  calendarConnected: false,
};

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  try {
    const [workspace, user] = await Promise.all([
      getCurrentWorkspace(),
      getUser(),
    ]);

    if (!workspace) return FALLBACK;

    const userId = user?.id ?? null;

    const [
      { count: contacts },
      { count: companies },
      { count: deals },
      emailResult,
      calendarResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("workspace_contacts")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),

      supabaseAdmin
        .from("workspace_companies")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),

      supabaseAdmin
        .from("workspace_deals")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),

      userId
        ? supabaseAdmin
            .from("email_connections")
            .select("*", { count: "exact", head: true })
            .eq("workspace_id", workspace.id)
            .eq("user_id", userId)
        : Promise.resolve({ count: 0, error: null }),

      userId
        ? supabaseAdmin
            .from("calendar_connections")
            .select("*", { count: "exact", head: true })
            .eq("workspace_id", workspace.id)
            .eq("user_id", userId)
        : Promise.resolve({ count: 0, error: null }),
    ]);

    return {
      contactsCount: contacts ?? 0,
      companiesCount: companies ?? 0,
      dealsCount: deals ?? 0,
      emailConnected: (emailResult.count ?? 0) > 0,
      calendarConnected: (calendarResult.count ?? 0) > 0,
    };
  } catch {
    return FALLBACK;
  }
}
