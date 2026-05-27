import DOMPurify
from "isomorphic-dompurify";

export function sanitize(
  value: string
) {

  return DOMPurify.sanitize(
    value || ""
  );
}