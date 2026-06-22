import type { EmailProvider } from "./types";
import { GmailProvider } from "./gmail";

const providers: Record<string, EmailProvider> = {
  gmail: new GmailProvider(),
};

export function getProvider(name: string): EmailProvider {
  const provider = providers[name];
  if (!provider) throw new Error(`Unknown email provider: ${name}`);
  return provider;
}
