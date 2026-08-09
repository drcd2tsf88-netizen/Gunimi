const ALLOWED_CHARS = /^[+\d\s\-().]+$/;

export function validatePhone(value: string): boolean {
  if (!value.trim()) return true; // optional field
  if (!ALLOWED_CHARS.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
