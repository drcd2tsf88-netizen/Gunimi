import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s",
  "h1", "h2", "h3", "h4",
  "ul", "ol", "li",
  "code", "pre", "blockquote",
  "a", "span", "mark",
];

const ALLOWED_ATTR: sanitize.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel"],
  span: ["style", "class"],
  p: ["style"],
};

export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
    allowedSchemes: ["http", "https", "mailto"],
    disallowedTagsMode: "discard",
  });
}
