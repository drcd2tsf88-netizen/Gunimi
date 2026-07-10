import { ServerClient } from "postmark";

let _client: ServerClient | null = null;

export function getEmailClient(): ServerClient {
  if (!_client) {
    const token = process.env.POSTMARK_SERVER_TOKEN;
    if (!token) throw new Error("[email] POSTMARK_SERVER_TOKEN is not configured");
    _client = new ServerClient(token);
  }
  return _client;
}
