import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const ENC_PREFIX = "enc:";

function getKey(): Buffer {
  const hex = process.env.TOKEN_ENCRYPTION_KEY ?? "";
  if (hex.length !== 64) {
    throw new Error(
      "TOKEN_ENCRYPTION_KEY must be a 64-char hex string (32 bytes). Generate with: openssl rand -hex 32"
    );
  }
  return Buffer.from(hex, "hex");
}

// Encrypts a sensitive token for storage in the database.
// Output format: enc:<iv_b64>:<tag_b64>:<ciphertext_b64>
export function encryptToken(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${ENC_PREFIX}${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

// Decrypts a token encrypted by encryptToken().
// Falls back to returning the input unchanged for legacy plaintext tokens
// stored before encryption was introduced — no migration required.
export function decryptToken(stored: string): string {
  if (!stored.startsWith(ENC_PREFIX)) return stored;
  const parts = stored.slice(ENC_PREFIX.length).split(":");
  if (parts.length !== 3) return stored;
  try {
    const key = getKey();
    const iv = Buffer.from(parts[0]!, "base64");
    const tag = Buffer.from(parts[1]!, "base64");
    const encrypted = Buffer.from(parts[2]!, "base64");
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encrypted) + decipher.final("utf8");
  } catch {
    return stored;
  }
}
