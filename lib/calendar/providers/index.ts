import { GoogleCalendarProvider } from "./google";
import { MicrosoftCalendarProvider } from "./microsoft";
import type { CalendarProvider } from "./types";

const PROVIDERS: Record<string, CalendarProvider> = {
  google: new GoogleCalendarProvider(),
  microsoft: new MicrosoftCalendarProvider(),
};

export function getProvider(name: string): CalendarProvider {
  const provider = PROVIDERS[name];
  if (!provider) throw new Error(`Unknown calendar provider: ${name}`);
  return provider;
}

export type { CalendarProvider };
export type { TokenSet, ProviderEvent, EventListOptions } from "./types";
