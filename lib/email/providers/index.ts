import type { EmailProvider } from "./types";
import { GmailProvider } from "./gmail";
import { OutlookProvider } from "./outlook";

const providers: Record<string, EmailProvider> = {
  gmail: new GmailProvider(),
  microsoft365: new OutlookProvider(),
};

export function getProvider(name: string): EmailProvider {
  const provider = providers[name];
  if (!provider) throw new Error(`Unknown email provider: ${name}`);
  return provider;
}
