import en from "@/locales/en.json";
import sk from "@/locales/sk.json";
import cs from "@/locales/cs.json";

export const locales = {
  en,
  sk,
  cs,
};

export type Locale =
  keyof typeof locales;