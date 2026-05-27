import { supabaseAdmin }
from "./supabaseAdmin";

export async function getWorkspaceRole(

  companyId: string,

  userId: string

) {

  const { data } =
    await supabaseAdmin
      .from("workspace_members")
      .select("role")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .single();

  return data?.role || null;
}

export async function isWorkspaceAdmin(

  companyId: string,

  userId: string

) {

  const role =
    await getWorkspaceRole(
      companyId,
      userId
    );

  return (
    role === "owner" ||
    role === "admin"
  );
}