import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

const LANG_NAMES: Record<string, string> = {
  sk: "Slovak",
  cs: "Czech",
  en: "English",
};

/**
 * Resolves the language the AI should respond in for a given workspace.
 *
 * Priority:
 * 1. `workspace.preferences.aiLanguage` (explicit AI language override, if not "follow")
 * 2. `workspace.preferences.language`   (display language set in Workspace Settings)
 * 3. `GUNIMI_LOCALE` cookie             (user's browser/switcher choice)
 * 4. "en" fallback
 */
export async function getWorkspaceAILanguage(workspaceId: string): Promise<string> {
  const [{ data }, cookieStore] = await Promise.all([
    supabaseAdmin
      .from("workspaces")
      .select("preferences")
      .eq("id", workspaceId)
      .maybeSingle(),
    cookies(),
  ]);

  const prefs = data?.preferences as { language?: string; aiLanguage?: string } | null;
  const aiLang = prefs?.aiLanguage;

  const effectiveLang =
    aiLang && aiLang !== "follow"
      ? aiLang
      : (prefs?.language ?? cookieStore.get("GUNIMI_LOCALE")?.value ?? "en");

  return LANG_NAMES[effectiveLang.slice(0, 2)] ?? "English";
}
