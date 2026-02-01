import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET = process.env.ENCRYPTION_KEY;
if (!SECRET) throw new Error("ENCRYPTION_KEY env variable is not set");

// Convert any string to 32-byte buffer
const KEY = crypto.createHash("sha256").update(SECRET).digest();

export function encryptSecret(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();

  
  return JSON.stringify({
    content: encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  });
}

export function decryptSecret(encryptedStr) {
  if (!encryptedStr) return "";

  try {
    // Try to parse as JSON (encrypted format)
    const { content, iv, tag } = JSON.parse(encryptedStr);

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      KEY,
      Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(tag, "hex"));

    let decrypted = decipher.update(content, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
   
    return encryptedStr;
  }
}
