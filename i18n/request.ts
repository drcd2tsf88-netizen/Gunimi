import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import en from "@/locales/en.json";
import sk from "@/locales/sk.json";
import cs from "@/locales/cs.json";

const MESSAGES = { en, sk, cs } as const;
const VALID_LOCALES = ["en", "sk", "cs"] as const;
type Locale = (typeof VALID_LOCALES)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("GUNIMI_LOCALE")?.value ?? "en";
  const locale: Locale = (VALID_LOCALES as readonly string[]).includes(raw)
    ? (raw as Locale)
    : "en";

  return {
    locale,
    messages: MESSAGES[locale],
  };
});
