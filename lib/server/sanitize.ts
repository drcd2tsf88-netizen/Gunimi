const HTML_TAGS = /<[^>]*>/g;
const JAVASCRIPT_PROTOCOL = /javascript\s*:/gi;
const EVENT_HANDLERS = /on\w+\s*=/gi;
const NULL_BYTES = /\0/g;

export function sanitize(value: string): string {
  if (!value || typeof value !== "string") return "";

  return value
    .replace(NULL_BYTES, "")
    .replace(HTML_TAGS, "")
    .replace(JAVASCRIPT_PROTOCOL, "")
    .replace(EVENT_HANDLERS, "")
    .trim();
}
