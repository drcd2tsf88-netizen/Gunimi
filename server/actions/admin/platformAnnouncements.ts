"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { logAuditEvent } from "@/lib/admin/logAuditEvent";

export type PlatformAnnouncement = {
  id: string;
  title: string;
  body: string | null;
  type: "info" | "warning" | "critical";
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
};

async function getAdminUser(): Promise<{ id: string } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("platform_role")
    .eq("id", user.id)
    .maybeSingle();
  return profile?.platform_role === "admin" ? { id: user.id } : null;
}

export async function getActiveAnnouncements(): Promise<PlatformAnnouncement[]> {
  const now = new Date().toISOString();
  const { data } = await supabaseAdmin
    .from("platform_announcements")
    .select("id, title, body, type, is_active, created_at, expires_at")
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("created_at", { ascending: false })
    .limit(5);

  return (data ?? []).map((r) => ({
    id: r.id as string,
    title: r.title as string,
    body: (r.body as string | null) ?? null,
    type: (r.type as "info" | "warning" | "critical") ?? "info",
    isActive: (r.is_active as boolean) === true,
    createdAt: r.created_at as string,
    expiresAt: (r.expires_at as string | null) ?? null,
  }));
}

export async function getAllAnnouncements(): Promise<PlatformAnnouncement[]> {
  const { data } = await supabaseAdmin
    .from("platform_announcements")
    .select("id, title, body, type, is_active, created_at, expires_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (data ?? []).map((r) => ({
    id: r.id as string,
    title: r.title as string,
    body: (r.body as string | null) ?? null,
    type: (r.type as "info" | "warning" | "critical") ?? "info",
    isActive: (r.is_active as boolean) === true,
    createdAt: r.created_at as string,
    expiresAt: (r.expires_at as string | null) ?? null,
  }));
}

export async function createAnnouncement(
  title: string,
  body: string | null,
  type: "info" | "warning" | "critical",
  expiresAt: string | null
): Promise<{ success: boolean; error?: string }> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  if (!title.trim()) return { success: false, error: "Title required" };

  const { error } = await supabaseAdmin.from("platform_announcements").insert({
    title: title.trim(),
    body: body?.trim() || null,
    type,
    is_active: true,
    created_by: admin.id,
    expires_at: expiresAt || null,
  });

  if (error) return { success: false, error: error.message };

  void logAuditEvent({ actorId: admin.id, action: "announcement.create", metadata: { title } });
  revalidatePath("/dashboard/admin/broadcast");
  return { success: true };
}

export async function deactivateAnnouncement(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Unauthorized" };

  const { error } = await supabaseAdmin
    .from("platform_announcements")
    .update({ is_active: false })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  void logAuditEvent({ actorId: admin.id, action: "announcement.deactivate", entityId: id });
  revalidatePath("/dashboard/admin/broadcast");
  return { success: true };
}
