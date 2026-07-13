import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import en from "@/locales/en.json";
import sk from "@/locales/sk.json";
import cs from "@/locales/cs.json";

const MESSAGES = { en, sk, cs } as const;
const VALID_LOCALES = ["en", "sk", "cs"] as const;
type Locale = (typeof VALID_LOCALES)[number];

function isValidLocale(v: unknown): v is Locale {
  return typeof v === "string" && (VALID_LOCALES as readonly string[]).includes(v);
}

function parseAcceptLanguage(header: string): Locale | null {
  for (const part of header.split(",")) {
    const lang = part.trim().split(";")[0].trim().split("-")[0].toLowerCase();
    if (isValidLocale(lang)) return lang;
  }
  return null;
}

type WorkspaceRow = { workspaces: { preferences?: { language?: string } | null } | null } | null;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // ── 1. Workspace Preference (authenticated users only) ───
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const activeWorkspaceId = cookieStore.get("orbit_workspace_id")?.value;
      let wsLanguage: string | undefined;

      if (activeWorkspaceId) {
        const { data } = await supabase
          .from("workspace_members")
          .select("workspaces(preferences)")
          .eq("user_id", user.id)
          .eq("workspace_id", activeWorkspaceId)
          .maybeSingle();

        wsLanguage = (data as unknown as WorkspaceRow)
          ?.workspaces?.preferences?.language;
      } else {
        const { data } = await supabase
          .from("workspace_members")
          .select("workspaces(preferences)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        wsLanguage = (data as unknown as WorkspaceRow)
          ?.workspaces?.preferences?.language;
      }

      if (isValidLocale(wsLanguage)) {
        return { locale: wsLanguage, messages: MESSAGES[wsLanguage] };
      }
    }
  } catch {
    // Fail open — user is not authenticated or Supabase unavailable.
    // Continue to next resolution step.
  }

  // ── 2. Locale Cookie (explicit user choice, pre-login) ───
  const cookieLang = cookieStore.get("GUNIMI_LOCALE")?.value;
  if (isValidLocale(cookieLang)) {
    return { locale: cookieLang, messages: MESSAGES[cookieLang] };
  }

  // ── 3. Browser Language (Accept-Language header) ─────────
  const browserLang = parseAcceptLanguage(headerStore.get("accept-language") ?? "");
  if (browserLang) {
    return { locale: browserLang, messages: MESSAGES[browserLang] };
  }

  // ── 4. Default: English ───────────────────────────────────
  return { locale: "en", messages: MESSAGES.en };
});
