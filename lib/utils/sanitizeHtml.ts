import DOMPurify from "dompurify";

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return html;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4", "ul", "ol", "li", "code", "pre", "blockquote", "a", "span", "mark"],
    ALLOWED_ATTR: ["href", "target", "rel", "style", "class"],
  });
}
